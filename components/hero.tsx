import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Hero() {
  return (
    <section className="w-full px-4 py-16 lg:py-32 bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-accent/5 via-transparent to-transparent pointer-events-none"></div>
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-accent/5 rounded-full blur-3xl animate-pulse"></div>
      <div
        className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent-secondary/3 rounded-full blur-3xl animate-pulse"
        style={{ animationDelay: "1s" }}
      ></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Text Content */}
          <div className="flex flex-col gap-8">
            <div className="space-y-6">
              <h1 className="text-balance text-5xl lg:text-7xl font-bold leading-tight tracking-tight">
                <span className="text-foreground">Get to know your campus with</span>
                <span className="block bg-gradient-to-r from-accent via-accent to-accent/70 bg-clip-text text-transparent">
                  communities worth joining
                </span>
              </h1>
              <p className="text-lg text-foreground/70 leading-relaxed max-w-lg font-medium">
                Discover clubs, groups, and events that match your interests. Connect with like-minded students and
                build meaningful relationships across campus.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Link href="/signup">
                <Button className="bg-gradient-to-r from-accent to-accent/80 hover:from-accent/95 hover:to-accent text-accent-foreground font-semibold px-8 py-6 text-base flex items-center gap-2 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 transform">
                  Get started
                  <span>→</span>
                </Button>
              </Link>
              <Link href="/groups">
                <Button className="border-2 border-accent-secondary hover:bg-accent-secondary/15 px-8 py-6 text-base font-semibold text-accent-secondary bg-transparent transition-all duration-300 hover:scale-105 transform hover:shadow-md">
                  Explore groups
                </Button>
              </Link>
            </div>
          </div>

          {/* Right: Visual with Advanced Animation */}
          <div className="hidden lg:flex items-center justify-center">
            <div className="relative w-full aspect-square">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/25 via-accent/10 to-transparent rounded-3xl blur-3xl animate-pulse"></div>
              <div
                className="absolute inset-4 bg-gradient-to-tr from-accent-secondary/5 via-transparent to-accent/5 rounded-2xl blur-2xl"
                style={{ animation: "pulse 3s ease-in-out infinite", animationDelay: "0.5s" }}
              ></div>

              <div className="absolute inset-0 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-sm bg-white/5 border border-white/10">
                <svg viewBox="0 0 400 400" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  {/* Background circles with enhanced opacity */}
                  <circle cx="200" cy="200" r="180" fill="currentColor" opacity="0.08" className="text-accent" />
                  <circle cx="200" cy="200" r="140" fill="currentColor" opacity="0.12" className="text-accent" />
                  <circle cx="200" cy="200" r="100" fill="currentColor" opacity="0.15" className="text-accent" />

                  {/* Connected people nodes with pulsing animation */}
                  <g className="text-accent">
                    <style>{`
                      @keyframes orbital { 0%, 100% { r: 16; opacity: 0.85; } 50% { r: 17; opacity: 0.95; } }
                      @keyframes centerPulse { 0%, 100% { r: 20; opacity: 0.95; } 50% { r: 22; opacity: 0.85; } }
                      .orbit-node { animation: orbital 3s ease-in-out infinite; }
                      .center-node { animation: centerPulse 2.5s ease-in-out infinite; }
                    `}</style>

                    {/* Top nodes */}
                    <circle
                      cx="120"
                      cy="80"
                      r="16"
                      fill="currentColor"
                      opacity="0.85"
                      className="orbit-node"
                      style={{ animationDelay: "0s" }}
                    />
                    <circle
                      cx="200"
                      cy="60"
                      r="16"
                      fill="currentColor"
                      opacity="0.85"
                      className="orbit-node"
                      style={{ animationDelay: "0.3s" }}
                    />
                    <circle
                      cx="280"
                      cy="80"
                      r="16"
                      fill="currentColor"
                      opacity="0.85"
                      className="orbit-node"
                      style={{ animationDelay: "0.6s" }}
                    />

                    {/* Middle nodes */}
                    <circle
                      cx="80"
                      cy="200"
                      r="16"
                      fill="currentColor"
                      opacity="0.85"
                      className="orbit-node"
                      style={{ animationDelay: "0.9s" }}
                    />
                    <circle cx="200" cy="200" r="20" fill="currentColor" opacity="0.95" className="center-node" />
                    <circle
                      cx="320"
                      cy="200"
                      r="16"
                      fill="currentColor"
                      opacity="0.85"
                      className="orbit-node"
                      style={{ animationDelay: "1.2s" }}
                    />

                    {/* Bottom nodes */}
                    <circle
                      cx="120"
                      cy="320"
                      r="16"
                      fill="currentColor"
                      opacity="0.85"
                      className="orbit-node"
                      style={{ animationDelay: "1.5s" }}
                    />
                    <circle
                      cx="200"
                      cy="340"
                      r="16"
                      fill="currentColor"
                      opacity="0.85"
                      className="orbit-node"
                      style={{ animationDelay: "1.8s" }}
                    />
                    <circle
                      cx="280"
                      cy="320"
                      r="16"
                      fill="currentColor"
                      opacity="0.85"
                      className="orbit-node"
                      style={{ animationDelay: "2.1s" }}
                    />
                  </g>

                  {/* Animated connecting lines */}
                  <g stroke="currentColor" strokeWidth="2" opacity="0.3" className="text-accent">
                    <style>{`
                      @keyframes lineFlow { 0%, 100% { stroke-opacity: 0.3; } 50% { stroke-opacity: 0.6; } }
                      .flow-line { animation: lineFlow 4s ease-in-out infinite; }
                    `}</style>
                    <line x1="120" y1="80" x2="200" y2="200" className="flow-line" style={{ animationDelay: "0s" }} />
                    <line x1="200" y1="60" x2="200" y2="200" className="flow-line" style={{ animationDelay: "0.2s" }} />
                    <line x1="280" y1="80" x2="200" y2="200" className="flow-line" style={{ animationDelay: "0.4s" }} />
                    <line x1="80" y1="200" x2="200" y2="200" className="flow-line" style={{ animationDelay: "0.6s" }} />
                    <line
                      x1="320"
                      y1="200"
                      x2="200"
                      y2="200"
                      className="flow-line"
                      style={{ animationDelay: "0.8s" }}
                    />
                    <line x1="120" y1="320" x2="200" y2="200" className="flow-line" style={{ animationDelay: "1s" }} />
                    <line
                      x1="200"
                      y1="340"
                      x2="200"
                      y2="200"
                      className="flow-line"
                      style={{ animationDelay: "1.2s" }}
                    />
                    <line
                      x1="280"
                      y1="320"
                      x2="200"
                      y2="200"
                      className="flow-line"
                      style={{ animationDelay: "1.4s" }}
                    />
                  </g>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
