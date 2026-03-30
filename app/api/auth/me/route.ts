import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAccessToken } from "@/lib/access-token";
import { verifySessionToken, USER_SESSION_COOKIE } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const jar = await cookies();

  const accessToken = jar.get("claw_access")?.value;
  const sessionToken = jar.get(USER_SESSION_COOKIE)?.value;

  const access = accessToken ? verifyAccessToken(accessToken) : null;
  const session = sessionToken ? verifySessionToken(sessionToken) : null;

  if (!access && !session) {
    return NextResponse.json({ ok: false, user: null }, { status: 401 });
  }

  const user = {
    email: session?.email ?? null,
    plan: access?.plan ?? null,
    customerId: access?.customerId ?? null,
  };

  return NextResponse.json({ ok: true, user });
}
