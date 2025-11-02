import PageLayout from "@/components/page-layout"

export const metadata = {
  title: "Interest - SRM CONNECT",
  description: "Explore communities for this interest",
}

export default function InterestPage({ params }: { params: { name: string } }) {
  const interestName = params.name.replace(/-/g, " ").replace("_", " & ").toUpperCase()

  return (
    <PageLayout title={`${interestName} Communities`}>
      <div className="space-y-6 text-foreground/80">
        <p className="text-xl font-medium">
          Explore all communities and groups related to {interestName.toLowerCase()}.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {[
            { name: `${interestName} Beginners`, members: 234 },
            { name: `${interestName} Advanced`, members: 156 },
            { name: `${interestName} Enthusiasts`, members: 412 },
            { name: `${interestName} Projects`, members: 89 },
            { name: `${interestName} Discussion`, members: 267 },
            { name: `${interestName} Events`, members: 145 },
          ].map((community) => (
            <div
              key={community.name}
              className="p-6 bg-card border border-border rounded-lg hover:shadow-md hover:border-accent/50 transition-all duration-200 cursor-pointer"
            >
              <h3 className="text-lg font-semibold text-foreground mb-2">{community.name}</h3>
              <p className="text-foreground/60">{community.members} members</p>
            </div>
          ))}
        </div>
      </div>
    </PageLayout>
  )
}
