import { NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const roastId = searchParams.get("id") || "demo"
  const score = parseInt(searchParams.get("score") || "45", 10)
  const stack = searchParams.get("stack") || "My Stack"
  
  const isGood = score >= 80
  const isMedium = score >= 50 && score < 80
  const accentColor = isGood ? "#22c55e" : isMedium ? "#f59e0b" : "#ef4444"
  const scoreLabel = isGood ? "PROTECTED" : isMedium ? "NEEDS WORK" : "ROASTED"

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Roast Embed</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: system-ui, -apple-system, sans-serif;
      background: #0a0a0a;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
    }
    .embed-container {
      width: 100%;
      max-width: 400px;
      background: linear-gradient(135deg, #1a1a2e 0%, #0a0a0a 100%);
      border: 3px solid ${accentColor};
      border-radius: 16px;
      padding: 24px;
      text-align: center;
      box-shadow: 0 20px 40px rgba(0,0,0,0.5);
    }
    .header {
      font-size: 14px;
      color: #888;
      margin-bottom: 16px;
      text-transform: uppercase;
      letter-spacing: 2px;
    }
    .score {
      font-size: 72px;
      font-weight: 900;
      color: ${accentColor};
      line-height: 1;
      margin-bottom: 8px;
    }
    .label {
      font-size: 18px;
      font-weight: 700;
      color: #fff;
      margin-bottom: 16px;
    }
    .stack {
      font-size: 14px;
      color: #666;
      margin-bottom: 24px;
      word-break: break-word;
    }
    .cta {
      display: inline-block;
      background: ${accentColor};
      color: #000;
      text-decoration: none;
      padding: 12px 24px;
      border-radius: 8px;
      font-weight: 700;
      font-size: 14px;
      transition: transform 0.2s;
    }
    .cta:hover {
      transform: scale(1.05);
    }
    .footer {
      margin-top: 16px;
      font-size: 12px;
      color: #444;
    }
    @media (max-width: 480px) {
      .embed-container { margin: 16px; }
    }
  </style>
</head>
<body>
  <div class="embed-container">
    <div class="header">ROAST MY MOLTBOT</div>
    <div class="score">${score}</div>
    <div class="label">${scoreLabel}</div>
    <div class="stack">${stack}</div>
    <a href="https://clawguru.org/roast-my-moltbot" target="_blank" class="cta">
      Roast Your Stack →
    </a>
    <div class="footer">clawguru.org</div>
  </div>
  <script>
    // Auto-resize for iframe
    function sendHeight() {
      const height = document.body.scrollHeight;
      if (window.parent !== window) {
        window.parent.postMessage({ type: 'roast-embed-height', height }, '*');
      }
    }
    window.addEventListener('load', sendHeight);
    window.addEventListener('resize', sendHeight);
  </script>
</body>
</html>
  `

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=60",
      "X-Frame-Options": "ALLOWALL",
    },
  })
}
