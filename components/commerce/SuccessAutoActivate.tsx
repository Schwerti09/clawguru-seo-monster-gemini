'use client'

/**
 * Shown on the success page when payment is confirmed but activation
 * previously encountered an error.  Provides a manual retry link.
 */
export default function SuccessAutoActivate({ href }: { href: string }) {
  return (
    <div className="mt-6 text-center">
      <div className="mb-4 text-sm text-gray-400">
        Die automatische Aktivierung hat nicht funktioniert. Bitte versuche es manuell:
      </div>
      <a
        className="inline-block px-6 py-4 rounded-2xl font-black bg-gradient-to-r from-brand-cyan to-brand-violet hover:opacity-90 text-center text-white"
        href={href}
      >
        Zugriff aktivieren → Dashboard öffnen
      </a>
    </div>
  )
}
