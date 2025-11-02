import PageLayout from "@/components/page-layout"

export const metadata = {
  title: "Freshers - SRM CONNECT",
  description: "Welcome freshers to campus",
}

export default function FreshersPage() {
  return (
    <PageLayout title="Freshers">
      <div className="space-y-6 text-foreground/80">
        <p className="text-xl font-medium">
          Welcome to campus! Here are resources to help you get started and connect with fellow freshers.
        </p>
        <div className="space-y-6 mt-12">
          <div className="p-8 bg-gradient-to-r from-accent/10 to-accent/5 border border-accent/30 rounded-lg">
            <h3 className="text-2xl font-semibold text-foreground mb-4">Orientation Schedule</h3>
            <ul className="space-y-3 text-foreground/70">
              <li>✓ Campus Tour: March 2, 2025</li>
              <li>✓ Welcome Assembly: March 3, 2025</li>
              <li>✓ Club Introductions: March 4-5, 2025</li>
              <li>✓ IT Setup & Registration: March 6, 2025</li>
            </ul>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { title: "Freshers Lounge", description: "Connect with fellow freshers" },
              { title: "Mentor Program", description: "Get guidance from seniors" },
              { title: "Campus Essentials", description: "Everything you need to know" },
              { title: "Social Events", description: "Fun activities and networking" },
            ].map((item) => (
              <div
                key={item.title}
                className="p-6 bg-card border border-border rounded-lg hover:shadow-md hover:border-accent/50 transition-all duration-200 cursor-pointer"
              >
                <h3 className="text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-foreground/60">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
