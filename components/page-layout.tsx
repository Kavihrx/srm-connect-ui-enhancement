import type React from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"

export default function PageLayout({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <main className="w-full min-h-screen bg-background flex flex-col">
      <Header />
      <div className="flex-1 w-full px-4 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <h1 className="text-5xl lg:text-6xl font-bold text-foreground tracking-tight mb-4">{title}</h1>
            <div className="w-16 h-1 bg-accent rounded-full"></div>
          </div>
          <div className="prose prose-lg max-w-none">{children}</div>
        </div>
      </div>
      <Footer />
    </main>
  )
}
