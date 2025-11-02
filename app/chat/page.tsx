import PageLayout from "@/components/page-layout"

export const metadata = {
  title: "Chat - SRM CONNECT",
  description: "Real-time messaging with campus community",
}

export default function ChatPage() {
  const channels = [
    { name: "General Chat", active: 45, description: "Main discussion channel for all" },
    { name: "Tech Beginners", active: 12, description: "Perfect for tech newcomers" },
    { name: "Study Group", active: 8, description: "Collaborative learning space" },
    { name: "Event Planning", active: 23, description: "Organize campus events" },
    { name: "Freshers Lounge", active: 56, description: "Welcome new students" },
    { name: "Social Events", active: 19, description: "Connect and have fun" },
  ]

  return (
    <PageLayout title="Chat">
      <div className="space-y-6 text-foreground/80">
        <p className="text-xl font-medium">Connect with friends and groups through real-time messaging.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {channels.map((channel) => (
            <div
              key={channel.name}
              className="p-6 bg-card border border-border/50 rounded-lg hover:shadow-lg hover:border-accent/50 hover:scale-105 transition-all duration-300 cursor-pointer group backdrop-blur-sm bg-white/40 dark:bg-slate-950/40"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="p-2 bg-accent/10 rounded-lg group-hover:bg-accent/20 transition-colors text-xl">💬</div>
                <span className="text-accent opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1">
                  →
                </span>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{channel.name}</h3>
              <p className="text-foreground/60 text-sm mb-3">{channel.description}</p>
              <div className="flex items-center gap-2 text-sm text-accent font-medium">
                <div className="w-2 h-2 bg-accent rounded-full"></div>
                {channel.active} active now
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageLayout>
  )
}
