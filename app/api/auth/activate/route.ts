import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { signAccessToken } from "@/lib/access-token";

export const runtime = "nodejs";

function mapPlan(product: string): "daypass" | "pro" | "team" {
  if (product === "daypass") return "daypass";
  if (product === "team") return "team";
  return "pro";
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const sessionId = url.searchParams.get("session_id");

    if (!sessionId) {
      return NextResponse.redirect(new URL("/success?error=missing_session", req.url));
    }

    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    const isPaid =
      session.payment_status === "paid" ||
      session.status === "complete";

    if (!isPaid) {
      return NextResponse.redirect(new URL(`/success?session_id=${sessionId}&error=not_paid`, req.url));
    }

    const product = String(session.metadata?.product || "pro");
    const plan = mapPlan(product);

    // Für localhost darf das Cookie NICHT secure sein
    const isProduction = process.env.NODE_ENV === "production";

    const token = await signAccessToken({
      plan,
      email: session.customer_details?.email ?? undefined,
      stripeCustomerId:
        typeof session.customer === "string" ? session.customer : undefined,
      checkoutSessionId: session.id,
    });

    const res = NextResponse.redirect(new URL("/dashboard", req.url));

    res.cookies.set("claw_access", token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 Tage
    });

    return res;
  } catch (error) {
    console.error("Activate route failed:", error);
    return NextResponse.redirect(new URL("/success?error=activation_failed", req.url));
  }
}