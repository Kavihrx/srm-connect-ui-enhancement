import Link from "next/link"

export default function Footer() {
  return (
    <footer className="w-full bg-primary text-primary-foreground px-4 py-16 lg:py-24 mt-auto">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-4 hover:opacity-80 transition-opacity group">
              <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center group-hover:shadow-lg transition-shadow">
                <span className="text-accent-foreground font-bold text-lg">S</span>
              </div>
              <span className="font-bold text-lg">SRM CONNECT</span>
            </Link>
            <p className="text-primary-foreground/70 text-sm">
              Campus community platform connecting students through shared interests.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-semibold mb-4">Platform</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li>
                <Link href="/" className="hover:text-primary-foreground transition-colors duration-200">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/groups" className="hover:text-primary-foreground transition-colors duration-200">
                  Groups
                </Link>
              </li>
              <li>
                <Link href="/forum" className="hover:text-primary-foreground transition-colors duration-200">
                  Forum
                </Link>
              </li>
              <li>
                <Link href="/events" className="hover:text-primary-foreground transition-colors duration-200">
                  Events
                </Link>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h4 className="font-semibold mb-4">Community</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li>
                <Link href="/chat" className="hover:text-primary-foreground transition-colors duration-200">
                  Chat
                </Link>
              </li>
              <li>
                <Link href="/announcements" className="hover:text-primary-foreground transition-colors duration-200">
                  Announcements
                </Link>
              </li>
              <li>
                <Link href="/opportunities" className="hover:text-primary-foreground transition-colors duration-200">
                  Opportunities
                </Link>
              </li>
              <li>
                <Link href="/freshers" className="hover:text-primary-foreground transition-colors duration-200">
                  Freshers
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li>
                <a href="#" className="hover:text-primary-foreground transition-colors duration-200">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary-foreground transition-colors duration-200">
                  Contact
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary-foreground transition-colors duration-200">
                  Privacy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary-foreground transition-colors duration-200">
                  Terms
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-semibold mb-4">Connect</h4>
            <div className="space-y-2 text-sm text-primary-foreground/70">
              <p>
                <a href="#" className="hover:text-primary-foreground transition-colors duration-200">
                  Twitter
                </a>
              </p>
              <p>
                <a href="#" className="hover:text-primary-foreground transition-colors duration-200">
                  LinkedIn
                </a>
              </p>
              <p>
                <a href="#" className="hover:text-primary-foreground transition-colors duration-200">
                  Instagram
                </a>
              </p>
              <p>
                <a href="#" className="hover:text-primary-foreground transition-colors duration-200">
                  Discord
                </a>
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 pt-8 text-center text-sm text-primary-foreground/60">
          <p>&copy; 2025 SRM CONNECT. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
