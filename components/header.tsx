"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Groups", href: "/groups" },
    { label: "Forum", href: "/forum" },
    { label: "Chat", href: "/chat" },
    { label: "Announcements", href: "/announcements" },
    { label: "Events", href: "/events" },
    { label: "Opportunities", href: "/opportunities" },
    { label: "Freshers", href: "/freshers" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-xl border-b border-border/40 shadow-sm">
      <div className="w-full px-4 py-4 lg:px-12">
        <div className="flex items-center justify-between gap-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 flex-shrink-0 group">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent to-accent/70 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
              <span className="text-accent-foreground font-bold text-lg">S</span>
            </div>
            <span className="font-bold text-lg text-foreground hidden sm:inline">SRM CONNECT</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="relative px-4 py-2 text-sm font-medium text-foreground group overflow-hidden rounded-lg"
              >
                <span className="relative z-10 transition-colors duration-200 group-hover:text-accent">
                  {item.label}
                </span>
                <div className="absolute inset-0 bg-accent/10 rounded-lg scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-300"></div>
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3 flex-shrink-0">
            <Link href="/login">
              <Button
                variant="ghost"
                className="hidden sm:inline-flex text-foreground hover:text-accent-secondary hover:bg-accent-secondary/10 font-medium transition-all duration-200"
              >
                Log in
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-gradient-to-r from-accent to-accent/90 hover:from-accent/90 hover:to-accent text-accent-foreground font-semibold px-6 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 transform">
                Sign up
              </Button>
            </Link>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 hover:bg-secondary rounded-lg transition-all duration-200 hover:scale-110 text-xl"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="lg:hidden flex flex-col gap-2 mt-4 pt-4 border-t border-border/50 animate-in fade-in slide-in-from-top-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-4 py-3 text-sm font-medium text-foreground hover:bg-accent/10 hover:text-accent rounded-lg transition-all duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-border/50">
              <Link href="/login" className="w-full">
                <Button variant="outline" className="w-full text-foreground hover:text-accent-secondary bg-transparent">
                  Log in
                </Button>
              </Link>
              <Link href="/signup" className="w-full">
                <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">Sign up</Button>
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
