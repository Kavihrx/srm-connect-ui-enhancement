"use client"

import { useState } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"

const interests = [
  { id: 1, label: "Technology", symbol: "💻", color: "from-blue-500/20 to-cyan-500/20", accentColor: "text-blue-500" },
  { id: 2, label: "Music", symbol: "🎵", color: "from-purple-500/20 to-pink-500/20", accentColor: "text-purple-500" },
  { id: 3, label: "Sports", symbol: "🏆", color: "from-orange-500/20 to-red-500/20", accentColor: "text-orange-500" },
  {
    id: 4,
    label: "Academics",
    symbol: "📚",
    color: "from-emerald-500/20 to-teal-500/20",
    accentColor: "text-emerald-500",
  },
  {
    id: 5,
    label: "Arts & Culture",
    symbol: "🎨",
    color: "from-rose-500/20 to-orange-500/20",
    accentColor: "text-rose-500",
  },
  {
    id: 6,
    label: "Innovation",
    symbol: "🚀",
    color: "from-violet-500/20 to-purple-500/20",
    accentColor: "text-violet-500",
  },
  { id: 7, label: "Community", symbol: "👥", color: "from-cyan-500/20 to-blue-500/20", accentColor: "text-cyan-500" },
  {
    id: 8,
    label: "Entrepreneurship",
    symbol: "💡",
    color: "from-yellow-500/20 to-orange-500/20",
    accentColor: "text-yellow-500",
  },
]

export default function InterestsSection() {
  const [selectedInterests, setSelectedInterests] = useState<number[]>([])

  const toggleInterest = (id: number) => {
    setSelectedInterests((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  return (
    <section className="w-full px-4 py-20 lg:py-32 bg-gradient-to-b from-secondary/10 to-background relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-0 left-1/4 w-96 h-96 bg-accent/3 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="mb-16 text-center space-y-4">
          <h2 className="text-balance text-4xl lg:text-6xl font-bold text-foreground tracking-tight">
            Choose Your Interests
          </h2>
          <p className="text-lg text-foreground/60 max-w-2xl mx-auto font-medium">
            Select the communities and activities that resonate with you to get started
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {interests.map((interest) => {
            const isSelected = selectedInterests.includes(interest.id)

            return (
              <button
                key={interest.id}
                onClick={() => toggleInterest(interest.id)}
                className="group relative overflow-hidden w-full transition-all duration-300"
              >
                <Card
                  className={`
                    relative p-6 lg:p-8 h-full transition-all duration-300 cursor-pointer
                    border-2 backdrop-blur-sm
                    ${
                      isSelected
                        ? "border-accent bg-accent/15 shadow-lg shadow-accent/30 scale-105 transform dark:bg-accent/20"
                        : "border-border/50 bg-card/50 hover:border-accent/50 hover:shadow-md hover:shadow-accent/15 hover:scale-102 dark:bg-slate-900/50"
                    }
                  `}
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${interest.color} opacity-0 group-hover:opacity-40 transition-opacity duration-300`}
                  ></div>

                  <div className="relative z-10 flex flex-col items-start gap-4">
                    <div
                      className={`
                        p-3 rounded-xl transition-all duration-300 shadow-sm font-medium text-2xl flex items-center justify-center w-12 h-12
                        ${
                          isSelected
                            ? "bg-gradient-to-br from-accent to-accent/80 text-accent-foreground shadow-lg scale-110"
                            : "bg-secondary/70 text-foreground group-hover:bg-accent/40 group-hover:shadow-md"
                        }
                      `}
                    >
                      {interest.symbol}
                    </div>

                    <h3 className="text-lg font-semibold text-foreground text-left">{interest.label}</h3>
                  </div>

                  {isSelected && (
                    <div className="absolute top-3 right-3 w-5 h-5 bg-accent rounded-full flex items-center justify-center shadow-md animate-scale-in">
                      <svg className="w-3 h-3 text-accent-foreground" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                </Card>
              </button>
            )
          })}
        </div>

        <div className="mt-16 text-center">
          <Link href={`/interests?selected=${selectedInterests.join(",")}`}>
            <button className="px-8 py-4 bg-gradient-to-r from-accent to-accent/80 hover:from-accent/95 hover:to-accent text-accent-foreground font-semibold rounded-xl transition-all duration-300 inline-block shadow-lg hover:shadow-xl hover:scale-105 transform">
              Continue with Selected Interests
            </button>
          </Link>
        </div>
      </div>
    </section>
  )
}
