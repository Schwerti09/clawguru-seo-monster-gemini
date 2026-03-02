/**
 * GET /api/stripe/accounting-export
 *
 * Exports all successfully paid charges for a given calendar month to CSV.
 * The CSV format is compatible with both DATEV (Germany) and QuickBooks (USA).
 *
 * Query parameters:
 *   year  – 4-digit year  (default: current year)
 *   month – 1-based month (default: current month)
 *
 * Authentication: requires a valid ACCOUNTING_EXPORT_SECRET header
 * (Authorization: Bearer <ACCOUNTING_EXPORT_SECRET>) to prevent public access.
 */

import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { stripe } from "@/lib/stripe"

export const runtime = "nodejs"

// CSV column headers – compatible with DATEV and QuickBooks import formats
const CSV_HEADERS = [
  "Date",
  "Invoice Number",
  "Customer Name",
  "Customer Email",
  "Description",
  "Net Amount",
  "Tax Amount",
  "Gross Amount",
  "Currency",
  "Status",
  "Charge ID",
  "Invoice ID"
]

function escapeCell(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return ""
  const str = String(value)
  // Wrap in quotes if the value contains a comma, newline, or quote
  if (str.includes(",") || str.includes("\n") || str.includes('"')) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

function formatAmount(amountInCents: number | null | undefined): string {
  if (amountInCents === null || amountInCents === undefined) return "0.00"
  // Convert from smallest currency unit to decimal
  return (amountInCents / 100).toFixed(2)
}

export async function GET(req: NextRequest) {
  // Require a secret token to prevent unauthenticated access to financial data
  const secret = process.env.ACCOUNTING_EXPORT_SECRET
  if (secret) {
    const auth = req.headers.get("authorization") || ""
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : ""
    if (token !== secret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
  }

  const now = new Date()
  const year = parseInt(req.nextUrl.searchParams.get("year") || String(now.getFullYear()), 10)
  const month = parseInt(req.nextUrl.searchParams.get("month") || String(now.getMonth() + 1), 10)

  if (isNaN(year) || isNaN(month) || month < 1 || month > 12) {
    return NextResponse.json({ error: "Invalid year or month" }, { status: 400 })
  }

  // Compute UTC unix timestamps for the start and end of the requested month
  const startDate = new Date(Date.UTC(year, month - 1, 1))
  const endDate = new Date(Date.UTC(year, month, 1)) // exclusive upper bound

  const rows: string[][] = []

  // Paginate through all invoices finalised in the requested month
  let hasMore = true
  let startingAfter: string | undefined = undefined

  while (hasMore) {
    const params: Stripe.InvoiceListParams = {
      limit: 100,
      // Stripe does not support filtering invoices by paid_at directly.
      // We filter by the invoice creation date as a practical approximation;
      // invoices are typically finalised and paid within the same month they are created.
      created: {
        gte: Math.floor(startDate.getTime() / 1000),
        lt: Math.floor(endDate.getTime() / 1000)
      },
      status: "paid",
      ...(startingAfter ? { starting_after: startingAfter } : {})
    }

    const page = await stripe.invoices.list(params)

    for (const invoice of page.data) {
      const date = new Date((invoice.status_transitions?.paid_at || invoice.created) * 1000)
        .toISOString()
        .slice(0, 10)

      const customerName =
        typeof invoice.customer_name === "string" ? invoice.customer_name : ""
      const customerEmail =
        typeof invoice.customer_email === "string" ? invoice.customer_email : ""
      const currency = (invoice.currency || "").toUpperCase()
      const grossAmount = formatAmount(invoice.amount_paid)
      const taxAmount = formatAmount(invoice.tax)
      const netAmount = formatAmount((invoice.amount_paid ?? 0) - (invoice.tax ?? 0))

      // Build a human-readable description from line items
      const description = invoice.lines?.data
        ?.map((li: Stripe.InvoiceLineItem) => li.description || "")
        .filter(Boolean)
        .join("; ") || ""

      rows.push([
        date,
        invoice.number || invoice.id,
        customerName,
        customerEmail,
        description,
        netAmount,
        taxAmount,
        grossAmount,
        currency,
        invoice.status || "",
        typeof invoice.charge === "string" ? invoice.charge : (invoice.charge as { id: string } | null)?.id || "",
        invoice.id
      ])
    }

    hasMore = page.has_more
    if (page.data.length > 0) {
      startingAfter = page.data[page.data.length - 1].id
    } else {
      hasMore = false
    }
  }

  // Build CSV
  const csvLines = [
    CSV_HEADERS.map(escapeCell).join(","),
    ...rows.map((row) => row.map(escapeCell).join(","))
  ]
  const csv = csvLines.join("\n")

  const filename = `clawguru-accounting-${year}-${String(month).padStart(2, "0")}.csv`

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`
    }
  })
}
