import { NextResponse } from 'next/server';

export const runtime = "nodejs";
export const dynamic = "force-static";

export async function GET() {
  const js = `/*! ClawLink v3.0 - Mycelial Singularity Engine */
console.log("%c🚀 ClawLink connected to Mycelium", "color:#00ff9d; font-weight:bold");

window.ClawLink = {
  version: "3.0",
  connected: true,
  send: function(data) { console.log("ClawLink → Mycelium:", data); }
};

console.log("✅ ClawLink ready");`;

  return new NextResponse(js, {
    status: 200,
    headers: {
      "Content-Type": "application/javascript; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
      "X-ClawLink-Version": "3.0"
    }
  });
}
