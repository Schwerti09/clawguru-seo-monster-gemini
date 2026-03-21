import Link from "next/link"

const exampleRunbooks = [
  { slug: "aws-ssh-hardening-2026", title: "SSH Hardening AWS" },
  { slug: "nginx-csp-2026", title: "Nginx CSP" },
  { slug: "kubernetes-rbac-2026", title: "Kubernetes RBAC" },
]

export default function ExampleNodes({ prefix = "" }: { prefix?: string }) {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {exampleRunbooks.map((rb) => (
        <Link
          key={rb.slug}
          href={`${prefix}/runbook/${rb.slug}`}
          className="px-3 py-1 bg-white/10 rounded-full text-sm text-gray-300 hover:bg-cyan-500/20 hover:text-cyan-300 transition border border-white/10"
        >
          {rb.title}
        </Link>
      ))}
    </div>
  )
}
