export async function POST(request: NextRequest) {
  // const ip = request.headers.get("x-forwarded-for") || "unknown"
  // const limiter = await rateLimit(ip, "security-check", 10, 60)
  // if (!limiter.ok) { return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 }) }

  try {
    const body = await request.json()
    const validation = schema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      )
    }

    // Temporär: ohne validateUrl
    const { target } = validation.data
    return NextResponse.json({ message: "Security check bypassed for testing", target })

    // Später wieder aktivieren:
    // const result = await validateUrl(target)
    // if (!result.ok) { return NextResponse.json({ error: result.error }, { status: result.status }) }
    // return NextResponse.json(result.data)
  } catch (error) {
    console.error("Security check error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}