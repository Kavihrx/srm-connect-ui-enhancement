import Header from "@/components/header"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export const metadata = {
  title: "Sign Up - SRM CONNECT",
  description: "Create your SRM CONNECT account",
}

export default function SignUpPage() {
  return (
    <main className="w-full min-h-screen bg-background flex flex-col">
      <Header />
      <div className="flex-1 w-full px-4 py-16 lg:py-24 flex items-center justify-center">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">Join SRM CONNECT</h1>
            <p className="text-foreground/60">Create your account to get started</p>
          </div>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Full Name</label>
              <input
                type="text"
                placeholder="John Doe"
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent bg-background text-foreground"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Email</label>
              <input
                type="email"
                placeholder="your@email.com"
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent bg-background text-foreground"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent bg-background text-foreground"
              />
            </div>
            <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold py-3 rounded-lg">
              Sign Up
            </Button>
          </form>
          <p className="text-center text-sm text-foreground/60 mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-accent hover:text-accent/90 font-medium">
              Log in
            </Link>
          </p>
        </div>
      </div>
      <Footer />
    </main>
  )
}
