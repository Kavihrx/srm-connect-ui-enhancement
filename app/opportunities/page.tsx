import PageLayout from "@/components/page-layout"

export const metadata = {
  title: "Opportunities - SRM CONNECT",
  description: "Career and internship opportunities",
}

export default function OpportunitiesPage() {
  return (
    <PageLayout title="Opportunities">
      <div className="space-y-6 text-foreground/80">
        <p className="text-xl font-medium">
          Explore career opportunities, internships, and professional development programs.
        </p>
        <div className="space-y-4 mt-12">
          {[
            { title: "Software Engineer Internship - Tech Corp", type: "Internship", salary: "4000/month" },
            { title: "UI/UX Designer - Startup Inc", type: "Full-time", salary: "8 LPA" },
            { title: "Data Analyst - Analytics Hub", type: "Internship", salary: "3500/month" },
            { title: "Product Manager - SaaS Company", type: "Full-time", salary: "12 LPA" },
            { title: "Marketing Coordinator - Digital Agency", type: "Internship", salary: "3000/month" },
          ].map((opportunity) => (
            <div
              key={opportunity.title}
              className="p-6 bg-card border border-border rounded-lg hover:shadow-md hover:border-accent/50 transition-all duration-200 cursor-pointer"
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-semibold text-foreground">{opportunity.title}</h3>
                <span className="px-3 py-1 bg-accent/10 text-accent text-sm font-medium rounded-full">
                  {opportunity.type}
                </span>
              </div>
              <p className="text-foreground/60 font-medium">{opportunity.salary}</p>
            </div>
          ))}
        </div>
      </div>
    </PageLayout>
  )
}
