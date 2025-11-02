import PageLayout from "@/components/page-layout"

export const metadata = {
  title: "Forum - SRM CONNECT",
  description: "Join discussions and share your thoughts",
}

export default function ForumPage() {
  const threads = [
    { title: "Best resources for learning web development?", posts: 24, views: 482 },
    { title: "Campus events coming up this month", posts: 12, views: 356 },
    { title: "Tips for time management as a student", posts: 18, views: 521 },
    { title: "Career opportunities in tech", posts: 31, views: 784 },
    { title: "How to stay motivated during exams", posts: 15, views: 409 },
  ]

  return (
    <PageLayout title="Forum">
      <div className="space-y-6 text-foreground/80">
        <p className="text-xl font-medium">
          Participate in discussions, ask questions, and share knowledge with the campus community.
        </p>
        <div className="space-y-4 mt-12">
          {threads.map((thread) => (
            <div
              key={thread.title}
              className="p-6 bg-card border border-border/50 rounded-lg hover:shadow-lg hover:border-accent/50 hover:scale-102 transition-all duration-300 cursor-pointer group backdrop-blur-sm bg-white/40 dark:bg-slate-950/40"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-accent transition-colors">
                    {thread.title}
                  </h3>
                  <div className="flex gap-6 text-sm text-foreground/60">
                    <span className="flex items-center gap-2">💬 {thread.posts} posts</span>
                    <span>👁 {thread.views} views</span>
                  </div>
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
