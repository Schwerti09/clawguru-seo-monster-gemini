import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { signAccessToken, type AccessPlan } from "@/lib/access-token";

export const runtime = "nodejs";

function mapPlan(productRaw: string): AccessPlan {
  const product = productRaw.toLowerCase()
  if (product === "daypass") return "daypass"
  if (product === "team") return "team"
  if (product === "msp") return "team"
  if (product === "enterprise") return "team"
  return "pro"
}

function tokenExp(plan: AccessPlan, now: number) {
  // daypass: 24h, subscriptions: 30d rolling token (subscription status is checked server-side)
  if (plan === "daypass") return now + 60 * 60 * 24
  return now + 60 * 60 * 24 * 30
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const sessionId = url.searchParams.get("session_id");

    if (!sessionId) {
      console.warn("[auth/activate] missing session_id")
      return NextResponse.redirect(new URL("/success?error=missing_session", req.url));
    }

    const stripe = getStripe();
    let session
    try {
      session = await stripe.checkout.sessions.retrieve(sessionId)
    } catch (err) {
      console.error("[auth/activate] stripe checkout.sessions.retrieve failed", {
        sessionId,
        err: err instanceof Error ? err.message : String(err),
      })
      return NextResponse.redirect(new URL(`/success?session_id=${encodeURIComponent(sessionId)}&error=invalid_session`, req.url));
    }

    const isPaid =
      session.payment_status === "paid" ||
      session.status === "complete";

    if (!isPaid) {
      console.warn("[auth/activate] session not paid/complete", {
        sessionId,
        payment_status: session.payment_status,
        status: session.status,
      })
      return NextResponse.redirect(new URL(`/success?session_id=${sessionId}&error=not_paid`, req.url));
    }

    const product = String(session.metadata?.product || "pro");
    const plan = mapPlan(product);

    const customerId = typeof session.customer === "string" ? session.customer : undefined
    if (!customerId) {
      console.error("[auth/activate] missing customer id on session", { sessionId })
      return NextResponse.redirect(new URL(`/success?session_id=${encodeURIComponent(sessionId)}&error=missing_customer`, req.url));
    }

    const subscriptionId =
      plan === "daypass"
        ? undefined
        : typeof session.subscription === "string"
          ? session.subscription
          : undefined

    // Für localhost darf das Cookie NICHT secure sein
    const isProduction = process.env.NODE_ENV === "production";

    const now = Math.floor(Date.now() / 1000)
    const token = signAccessToken({
      v: 1,
      plan,
      customerId,
      ...(subscriptionId ? { subscriptionId } : {}),
      iat: now,
      exp: tokenExp(plan, now),
    });

    const res = NextResponse.redirect(new URL("/dashboard", req.url));

    res.cookies.set("claw_access", token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 Tage
    });

    console.info("[auth/activate] set claw_access cookie", {
      sessionId,
      plan,
      secure: isProduction,
    })

    return res;
  } catch (error) {
    console.error("Activate route failed:", error);
    return NextResponse.redirect(new URL("/success?error=activation_failed", req.url));
  }
}