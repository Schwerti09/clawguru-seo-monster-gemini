import Container from "@/components/shared/Container"
import AdminLogin from "@/components/admin/AdminLogin"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export const metadata = {
  title: "Admin Login | ClawGuru",
  description: "Secure admin login for ClawGuru control center.",
}

export default function AdminLoginPage() {
  return (
    <Container>
      <div className="py-16 max-w-xl mx-auto">
        <AdminLogin />
      </div>
    </Container>
  )
}
