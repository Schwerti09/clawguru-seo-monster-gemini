import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ ok: false, user: null }, { status: 401 });
}
