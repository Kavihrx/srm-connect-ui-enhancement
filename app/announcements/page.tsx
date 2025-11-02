import PageLayout from "@/components/page-layout"

export const metadata = {
  title: "Announcements - SRM CONNECT",
  description: "Stay updated with campus announcements",
}

export default function AnnouncementsPage() {
  const announcements = [
    { title: "Spring Festival Registration Now Open", date: "March 15, 2025", category: "Events" },
    { title: "New Library Wing Opening Ceremony", date: "March 10, 2025", category: "Campus" },
    { title: "Internship Fair Next Month", date: "March 5, 2025", category: "Opportunities" },
    { title: "Campus WiFi Maintenance Schedule", date: "March 1, 2025", category: "Admin" },
    { title: "Scholarship Opportunities Available", date: "February 28, 2025", category: "Opportunities" },
  ]

  return (
    <PageLayout title="Announcements">
      <div className="space-y-6 text-foreground/80">
        <p className="text-xl font-medium">Stay informed with the latest campus announcements and updates.</p>
        <div className="space-y-4 mt-12">
          {announcements.map((announcement) => (
            <div
              key={announcement.title}
              className="p-6 bg-card border-l-4 border-l-accent border border-border/50 rounded-lg hover:shadow-lg hover:border-accent/50 transition-all duration-300 cursor-pointer group backdrop-blur-sm bg-white/40 dark:bg-slate-950/40"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-lg">🔔</span>
                    <span className="text-xs font-semibold text-accent bg-accent/10 px-3 py-1 rounded-full">
                      {announcement.category}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-accent transition-colors">
                    {announcement.title}
                  </h3>
                  <p className="text-foreground/60 text-sm">{announcement.date}</p>
                </div>
                <span className="text-accent opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1 flex-shrink-0 mt-1 text-xl">
                  →
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageLayout>
  )
}
