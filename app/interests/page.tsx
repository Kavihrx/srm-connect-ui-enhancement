import PageLayout from "@/components/page-layout"

export const metadata = {
  title: "Your Interests - SRM CONNECT",
  description: "Manage your interests",
}

export default function InterestsPage() {
  return (
    <PageLayout title="Your Selected Interests">
      <div className="space-y-6 text-foreground/80">
        <p className="text-xl font-medium">
          Based on your interests, here are communities and resources tailored for you.
        </p>
        <div className="mt-12">
          <p className="text-foreground/70 mb-6">
            Select interests from the home page to see personalized community recommendations.
          </p>
        </div>
      </div>
    </PageLayout>
  )
}
