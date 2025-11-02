import PageLayout from "@/components/page-layout"

export const metadata = {
  title: "Events - SRM CONNECT",
  description: "Discover upcoming campus events",
}

export default function EventsPage() {
  const events = [
    { name: "Tech Talk: AI & ML", date: "March 20, 2025", attending: 156, category: "Workshop" },
    { name: "Music Festival", date: "March 25, 2025", attending: 892, category: "Entertainment" },
    { name: "Sports Tournament", date: "April 1, 2025", attending: 234, category: "Sports" },
    { name: "Career Fair", date: "April 5, 2025", attending: 543, category: "Career" },
    { name: "Art Exhibition", date: "April 10, 2025", attending: 178, category: "Culture" },
    { name: "Community Cleanup", date: "April 15, 2025", attending: 89, category: "Community" },
  ]

  return (
    <PageLayout title="Events">
      <div className="space-y-6 text-foreground/80">
        <p className="text-xl font-medium">Find and register for exciting campus events and activities.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {events.map((event) => (
            <div
              key={event.name}
              className="p-6 bg-card border border-border/50 rounded-lg hover:shadow-lg hover:border-accent/50 hover:scale-105 transition-all duration-300 cursor-pointer group backdrop-blur-sm bg-white/40 dark:bg-slate-950/40"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="p-2 bg-accent/10 rounded-lg group-hover:bg-accent/20 transition-colors text-xl">📅</div>
                <span className="text-accent opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1">
                  →
                </span>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{event.name}</h3>
              <p className="text-xs font-semibold text-accent bg-accent/10 px-3 py-1 rounded-full inline-block mb-3">
                {event.category}
              </p>
              <div className="space-y-2">
                <p className="text-foreground/60 text-sm">{event.date}</p>
                <div className="flex items-center gap-2 text-accent font-medium text-sm">
                  👥 {event.attending} attending
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageLayout>
  )
}
