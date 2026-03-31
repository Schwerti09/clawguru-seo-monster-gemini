import Container from "@/components/shared/Container"
import SectionTitle from "@/components/shared/SectionTitle"
import SuccessAutoActivate from "@/components/commerce/SuccessAutoActivate"
import { redirect } from "next/navigation"
import { getStripe } from "@/lib/stripe"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export default async function SuccessPage(
  props: {
    searchParams?: Promise<Record<string, string | string[] | undefined>>
  }
) {
  const searchParams = await props.searchParams;
  const session_id = typeof searchParams?.session_id === "string" ? searchParams?.session_id : ""
  const errorParam = typeof searchParams?.error === "string" ? searchParams?.error : ""

  if (!session_id) {
    console.warn("[success] missing session_id")
    return (
      <Container>
        <div className="py-16 max-w-3xl mx-auto">
          <SectionTitle
            kicker="Checkout"
            title="Zahlung bestätigen"
            subtitle="Es fehlt eine session_id. Nutze den Link aus Stripe."
          />
          <div className="mt-8 p-6 rounded-3xl border border-gray-800 bg-black/30 text-gray-300">
            Kein <code className="text-gray-200">session_id</code> gefunden.
          </div>
        </div>
      </Container>
    )
  }

  let ok = false
  let email: string | null = null
  let product: string | null = null
  let mode: string | null = null

  // E2E test mode: treat specific session IDs as paid without calling Stripe
  const testPaidIds = process.env.E2E_PAID_SESSION_IDS?.split(",").map((s) => s.trim()) ?? []
  if (testPaidIds.includes(session_id)) {
    ok = true
    email = "test@playwright.dev"
    product = "pro"
    mode = "subscription"
  } else {
    try {
      const stripe = getStripe()
      const session = await stripe.checkout.sessions.retrieve(session_id)
      ok = session.payment_status === "paid" || session.status === "complete"
      email = session.customer_details?.email || null
      product = (session.metadata?.product as string) || null
      mode = session.mode || null
    } catch (err) {
      console.error("[success] stripe checkout.sessions.retrieve failed", {
        sessionId: session_id,
        err: err instanceof Error ? err.message : String(err),
      })
      ok = false
    }
  }

  const activateHref = `/api/auth/activate?session_id=${encodeURIComponent(session_id)}`

  // Auto-redirect to activation when payment is confirmed and there is no
  // prior activation error (prevents redirect loops).
  if (ok && !errorParam) {
    redirect(activateHref)
  }

  return (
    <Container>
      <div className="py-16 max-w-3xl mx-auto">
        <SectionTitle
          kicker="Checkout"
          title={ok ? "Zugang freigeschaltet" : "Noch nicht bestätigt"}
          subtitle={ok
            ? "Aktivierung wird erneut versucht – oder klicke den Button unten."
            : "Zahlung wurde noch nicht bestätigt."}
        />

        {ok ? (
          <>
            <div className="mt-8 p-6 rounded-3xl border border-gray-800 bg-black/30">
              <div className="text-sm text-gray-400">Receipt</div>
              <div className="mt-1 text-lg font-black text-white">{email || "—"}</div>
              <div className="mt-2 text-sm text-gray-400">
                Plan: <span className="text-gray-200 font-bold">{product || "—"}</span> · Mode:{" "}
                <span className="text-gray-200 font-bold">{mode || "—"}</span>
              </div>
            </div>

            {/* Auto-activate with JS, fallback link for no-JS */}
            <SuccessAutoActivate href={activateHref} />

            <div className="mt-6 grid gap-4">
              <div className="grid sm:grid-cols-2 gap-3">
                <a
                  className="px-6 py-4 rounded-2xl border border-gray-700 hover:border-gray-500 font-bold text-gray-200 text-center"
                  href={`/api/download?key=sprint-pack&session_id=${encodeURIComponent(session_id)}`}
                >
                  Direkt-Download Sprint Pack (Fallback)
                </a>
                <a
                  className="px-6 py-4 rounded-2xl border border-gray-700 hover:border-gray-500 font-bold text-gray-200 text-center"
                  href={`/api/download?key=incident-kit&session_id=${encodeURIComponent(session_id)}`}
                >
                  Direkt-Download Incident Kit (Fallback)
                </a>
              </div>
            </div>

            <div className="mt-8 p-6 rounded-3xl border border-gray-800 bg-black/25 text-gray-300">
              <div className="font-black">Mini-Loop (macht süchtig)</div>
              <ol className="mt-3 list-decimal pl-6 space-y-2 text-sm">
                <li>Score checken</li>
                <li>Copilot: Runbook erzeugen</li>
                <li>Fix anwenden</li>
                <li>Re-Check + Badge teilen</li>
              </ol>
            </div>
          </>
        ) : (
          <div className="mt-8 p-6 rounded-3xl border border-gray-800 bg-black/30 text-gray-300">
            Zahlung nicht bestätigt oder Session ungültig. Wenn du gerade bezahlt hast, warte kurz und lade neu.
          </div>
        )}
      </div>
    </Container>
  )
}
