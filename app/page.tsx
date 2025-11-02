import Header from "@/components/header"
import Hero from "@/components/hero"
import InterestsSection from "@/components/interests-section"
import Footer from "@/components/footer"

export default function Home() {
  return (
    <main className="w-full min-h-screen bg-background">
      <Header />
      <Hero />
      <InterestsSection />
      <Footer />
    </main>
  )
}
