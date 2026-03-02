// lib/netlify-api.ts
// Netlify API helpers for admin operations.
// Uses NETLIFY_API_KEY (personal access token), NETLIFY_SITE_ID, and
// NETLIFY_ACCOUNT_ID ('rolf-schwertfechter') to toggle the MAINTENANCE_MODE
// environment variable and trigger a rebuild.

const NETLIFY_API = "https://api.netlify.com/api/v1"

/** The Netlify account slug / team ID – scopes all account-level API calls. */
function accountId() {
  const id = process.env.NETLIFY_ACCOUNT_ID
  if (!id) {
    console.warn(
      "[netlify-api] NETLIFY_ACCOUNT_ID is not set – falling back to 'rolf-schwertfechter'. " +
        "Set this env var in Netlify to avoid misconfiguration."
    )
    return "rolf-schwertfechter"
  }
  return id
}

function headers() {
  const token = process.env.NETLIFY_API_KEY
  if (!token) throw new Error("NETLIFY_API_KEY environment variable is not set")
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  }
}

function siteId() {
  const id = process.env.NETLIFY_SITE_ID
  if (!id) throw new Error("NETLIFY_SITE_ID environment variable is not set")
  return id
}

/** Returns the current value of MAINTENANCE_MODE env var from Netlify. */
export async function getMaintenanceMode(): Promise<boolean> {
  const res = await fetch(`${NETLIFY_API}/sites/${siteId()}/env/MAINTENANCE_MODE`, {
    headers: headers(),
  })
  if (res.status === 404) return false
  if (!res.ok) throw new Error(`Netlify API error ${res.status}: ${await res.text()}`)
  const data = (await res.json()) as { values?: Array<{ value: string }> }
  const val = data.values?.[0]?.value ?? ""
  return val === "true" || val === "1"
}

/** Sets MAINTENANCE_MODE to `enabled` and triggers a new Netlify build. */
export async function setMaintenanceMode(enabled: boolean): Promise<void> {
  const site = siteId()
  const h = headers()
  const value = enabled ? "true" : "false"

  // Check if the env var already exists (PUT vs POST)
  const check = await fetch(`${NETLIFY_API}/sites/${site}/env/MAINTENANCE_MODE`, { headers: h })

  const envPayload = [
    { key: "MAINTENANCE_MODE", scopes: ["builds", "runtime"], values: [{ value, context: "all" }] },
  ]

  if (check.status === 404) {
    // Create the env var
    const createRes = await fetch(`${NETLIFY_API}/sites/${site}/env`, {
      method: "POST",
      headers: h,
      body: JSON.stringify(envPayload),
    })
    if (!createRes.ok) {
      throw new Error(`Netlify env create failed ${createRes.status}: ${await createRes.text()}`)
    }
  } else {
    // Update existing env var (same shape as create, single-item patch)
    const updateRes = await fetch(`${NETLIFY_API}/sites/${site}/env/MAINTENANCE_MODE`, {
      method: "PUT",
      headers: h,
      body: JSON.stringify({ key: "MAINTENANCE_MODE", scopes: ["builds", "runtime"], values: [{ value, context: "all" }] }),
    })
    if (!updateRes.ok) {
      throw new Error(`Netlify env update failed ${updateRes.status}: ${await updateRes.text()}`)
    }
  }

  // Trigger a new build (scoped to account for team plans)
  const buildRes = await fetch(
    `${NETLIFY_API}/sites/${site}/builds?account_id=${encodeURIComponent(accountId())}`,
    {
      method: "POST",
      headers: h,
      body: JSON.stringify({}),
    }
  )
  if (!buildRes.ok) {
    throw new Error(`Netlify build trigger failed ${buildRes.status}: ${await buildRes.text()}`)
  }
}
