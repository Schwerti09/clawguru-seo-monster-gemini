exports.handler = async function handler() {
  const siteUrl =
    process.env.URL ||
    process.env.DEPLOY_PRIME_URL ||
    process.env.SITE_URL ||
    "https://clawguru.org"

  const cronSecret = process.env.CRON_SECRET || ""
  const endpoint = new URL("/api/consult-health/cron", siteUrl)

  const headers = {}
  if (cronSecret) headers.Authorization = `Bearer ${cronSecret}`

  try {
    const res = await fetch(endpoint.toString(), {
      method: "GET",
      headers,
    })
    const body = await res.text()
    return {
      statusCode: res.ok ? 200 : res.status,
      body,
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        ok: false,
        error: error instanceof Error ? error.message : String(error),
      }),
    }
  }
}
