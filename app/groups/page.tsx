import PageLayout from "@/components/page-layout"
import { Users, ArrowRight } from "lucide-react"

export const metadata = {
  title: "Groups - SRM CONNECT",
  description: "Explore and join campus groups",
}

export default function GroupsPage() {
  const groups = [
    { name: "Tech Enthusiasts", members: 342, description: "Learn and build with cutting-edge technology" },
    { name: "Photography Club", members: 156, description: "Capture moments, share perspectives" },
    { name: "Debate Society", members: 89, description: "Engage in thoughtful discussions" },
    { name: "Gaming Community", members: 421, description: "Connect with gamers across campus" },
    { name: "Book Club", members: 67, description: "Explore literary worlds together" },
    { name: "Sports League", members: 234, description: "Stay active and competitive" },
  ]

  return (
    <PageLayout title="Groups">
      <div className="space-y-6 text-foreground/80">
        <p className="text-xl font-medium">
          Discover and join groups based on your interests. Connect with students who share your passions.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {groups.map((group) => (
            <div
              key={group.name}
              className="p-6 bg-card border border-border/50 rounded-lg hover:shadow-lg hover:border-accent/50 hover:scale-105 transition-all duration-300 cursor-pointer group backdrop-blur-sm bg-white/40 dark:bg-slate-950/40"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="p-2 bg-accent/10 rounded-lg group-hover:bg-accent/20 transition-colors">
                  <Users className="w-5 h-5 text-accent" />
                </div>
                <ArrowRight className="w-4 h-4 text-accent opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{group.name}</h3>
              <p className="text-foreground/60 text-sm mb-3">{group.description}</p>
              <p className="text-foreground/60 text-sm font-medium">{group.members} members</p>
            </div>
          ))}
        </div>
      </div>
    </PageLayout>
  )
}
