export default function MaintenancePage() {
  return (
    <main className="min-h-screen bg-gray-950 text-white flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center space-y-8">
        {/* Logo / Icon */}
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-10 h-10 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l5.653-4.655m5.8-8.31a3 3 0 1 1-4.243-4.243 3 3 0 0 1 4.243 4.243Z"
              />
            </svg>
          </div>
        </div>

        {/* Heading */}
        <div className="space-y-3">
          <h1 className="text-3xl font-bold tracking-tight text-white">
            ClawGuru wird gerade gewartet.
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed">
            Wir optimieren die Security-Engine für dich.
            <br />
            <span className="text-cyan-400 font-medium">In Kürze wieder da.</span>
          </p>
        </div>

        {/* Animated progress bar */}
        <div className="w-full bg-gray-800 rounded-full h-1.5 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full animate-pulse w-2/3" />
        </div>

        {/* Status badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-800 border border-gray-700 text-sm text-gray-300">
          <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
          Maintenance in progress
        </div>

        {/* Footer */}
        <p className="text-gray-600 text-sm">
          © {new Date().getFullYear()} ClawGuru &mdash; Security &amp; DevOps Platform
        </p>
      </div>
    </main>
  )
}
