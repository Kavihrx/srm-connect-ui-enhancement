"use client"

import * as React from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import {
  announcements,
  events,
  forumPosts,
  groups as allGroups,
  interests,
  opportunities,
  chats as initialChats,
  fresherResources,
} from "@/lib/srm-data"

type User = { username: string; password?: string }

export function AppShell() {
  const [activeTab, setActiveTab] = React.useState("home")
  const [selectedInterest, setSelectedInterest] = React.useState<string>("")
  const [currentUser, setCurrentUser] = React.useState<User | null>(null)
  const [users, setUsers] = React.useState<User[]>([])
  const [joinedGroups, setJoinedGroups] = React.useState<number[]>([])
  const [groups, setGroups] = React.useState(allGroups)
  const [chats, setChats] = React.useState(initialChats)
  const [newMessage, setNewMessage] = React.useState("")

  // dialogs
  const [showSignUp, setShowSignUp] = React.useState(false)
  const [showSignIn, setShowSignIn] = React.useState(false)
  const [signUpData, setSignUpData] = React.useState({ username: "", password: "" })
  const [signInData, setSignInData] = React.useState({ username: "", password: "" })

  const [forumOpen, setForumOpen] = React.useState<null | number>(null)
  const [eventOpen, setEventOpen] = React.useState<null | number>(null)
  const [opportunityOpen, setOpportunityOpen] = React.useState<null | number>(null)
  const [resourceOpen, setResourceOpen] = React.useState<null | number>(null)

  const [eventForm, setEventForm] = React.useState({ name: "", email: "", roll: "" })
  const [opForm, setOpForm] = React.useState({ name: "", email: "", roll: "" })

  const handleJoinGroup = (id: number) => {
    if (!currentUser) {
      setShowSignIn(true)
      return
    }
    if (joinedGroups.includes(id)) return
    setJoinedGroups((prev) => [...prev, id])
    setGroups((prev) => prev.map((g) => (g.id === id ? { ...g, members: g.members + 1 } : g)))
    setActiveTab("chat")
  }

  const handleSend = (groupId: number) => {
    if (!currentUser) {
      setShowSignIn(true)
      return
    }
    if (!newMessage.trim()) return
    setChats((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        groupId,
        user: currentUser.username,
        message: newMessage.trim(),
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ])
    setNewMessage("")
  }

  const handleSignUp = () => {
    const u = signUpData.username.trim()
    const p = signUpData.password.trim()
    if (!u || !p) return
    if (users.find((x) => x.username.toLowerCase() === u.toLowerCase())) return
    setUsers((prev) => [...prev, { username: u, password: p }])
    setCurrentUser({ username: u })
    setSignUpData({ username: "", password: "" })
    setShowSignUp(false)
  }

  const handleSignIn = () => {
    const u = signInData.username.trim()
    const p = signInData.password.trim()
    if (!u || !p) return
    const found = users.find((x) => x.username.toLowerCase() === u.toLowerCase() && x.password === p)
    if (found) {
      setCurrentUser({ username: found.username })
      setSignInData({ username: "", password: "" })
      setShowSignIn(false)
    }
  }

  const handleSignOut = () => {
    setCurrentUser(null)
    setJoinedGroups([])
  }

  return (
    <div className="min-h-screen bg-background">
      <Header
        active={activeTab}
        setActive={(t) => {
          setActiveTab(t)
          setForumOpen(null)
          setResourceOpen(null)
        }}
        currentUser={currentUser}
        onSignIn={() => setShowSignIn(true)}
        onSignUp={() => setShowSignUp(true)}
        onSignOut={handleSignOut}
      />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="flex w-full flex-wrap justify-start gap-2 bg-muted p-1">
            {[
              { id: "home", label: "Home" },
              { id: "groups", label: "Groups" },
              { id: "forum", label: "Forum" },
              { id: "chat", label: "Chat" },
              { id: "announcements", label: "Announcements" },
              { id: "events", label: "Events" },
              { id: "opportunities", label: "Opportunities" },
              { id: "freshers", label: "Resources" },
            ].map((t) => (
              <TabsTrigger key={t.id} value={t.id} className="data-[state=active]:bg-background">
                {t.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* HOME */}
          <TabsContent value="home" className="space-y-10">
            <Hero onGetStarted={() => document.getElementById("interests")?.scrollIntoView({ behavior: "smooth" })} />

            <section id="interests" className="space-y-4">
              <h3 className="text-balance text-2xl font-semibold">Choose your interest</h3>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                {interests.map((i) => (
                  <Button
                    key={i}
                    variant={selectedInterest === i ? "default" : "secondary"}
                    onClick={() => setSelectedInterest(i)}
                    className="justify-center"
                  >
                    {i}
                  </Button>
                ))}
              </div>
            </section>

            <section className="space-y-4">
              <h3 className="text-balance text-2xl font-semibold">
                {selectedInterest ? `Suggested Groups for ${selectedInterest}` : "Popular Groups"}
              </h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {(selectedInterest ? groups.filter((g) => g.interest === selectedInterest) : groups.slice(0, 6)).map(
                  (g) => (
                    <Card key={g.id} className="flex flex-col">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-pretty">{g.name}</CardTitle>
                        <CardDescription className="text-pretty">{g.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="mt-auto flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">Members: {g.members}</div>
                        <Button
                          variant={joinedGroups.includes(g.id) ? "secondary" : "default"}
                          disabled={joinedGroups.includes(g.id)}
                          onClick={() => handleJoinGroup(g.id)}
                        >
                          {joinedGroups.includes(g.id) ? "Joined" : "Join"}
                        </Button>
                      </CardContent>
                    </Card>
                  ),
                )}
              </div>
            </section>
          </TabsContent>

          {/* GROUPS */}
          <TabsContent value="groups" className="space-y-6">
            <h2 className="text-2xl font-semibold">Your Groups</h2>
            {joinedGroups.length ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {groups
                  .filter((g) => joinedGroups.includes(g.id))
                  .map((g) => (
                    <Card key={g.id}>
                      <CardHeader>
                        <CardTitle>{g.name}</CardTitle>
                        <CardDescription>{g.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="flex items-center justify-between">
                        <Badge variant="secondary">{g.interest}</Badge>
                        <Button onClick={() => setActiveTab("chat")}>Open chat</Button>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-6 text-muted-foreground">You haven’t joined any groups yet.</CardContent>
              </Card>
            )}

            <h2 className="mt-8 text-2xl font-semibold">All Groups</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {groups.map((g) => (
                <Card key={g.id}>
                  <CardHeader>
                    <CardTitle>{g.name}</CardTitle>
                    <CardDescription>{g.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">Members: {g.members}</div>
                    <Button
                      variant={joinedGroups.includes(g.id) ? "secondary" : "default"}
                      disabled={joinedGroups.includes(g.id)}
                      onClick={() => handleJoinGroup(g.id)}
                    >
                      {joinedGroups.includes(g.id) ? "Joined" : "Join"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* FORUM */}
          <TabsContent value="forum" className="space-y-6">
            <h2 className="text-2xl font-semibold">Public Forum</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {forumPosts.map((p) => (
                <Card
                  key={p.id}
                  className="cursor-pointer transition hover:shadow-sm"
                  onClick={() => setForumOpen(p.id)}
                >
                  <CardHeader>
                    <CardTitle className="text-pretty">{p.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{p.content}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>
                      By {p.author} • {p.date}
                    </span>
                    <Badge variant="secondary">{p.comments.length} comments</Badge>
                  </CardContent>
                </Card>
              ))}
            </div>

            {forumPosts.map((p) => (
              <Dialog key={p.id} open={forumOpen === p.id} onOpenChange={() => setForumOpen(null)}>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className="text-pretty">{p.title}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-6">
                    <p className="text-muted-foreground">{p.content}</p>
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium">Comments</h4>
                      {p.comments.map((c) => (
                        <div key={c.id} className="rounded-md border p-3">
                          <div className="text-sm">
                            <span className="font-medium">{c.user}</span>{" "}
                            <span className="text-muted-foreground">({c.time})</span>
                          </div>
                          <div className="text-sm text-muted-foreground">{c.content}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            ))}
          </TabsContent>

          {/* CHAT */}
          <TabsContent value="chat" className="space-y-6">
            <h2 className="text-2xl font-semibold">Group Chat</h2>
            {joinedGroups.length ? (
              <div className="space-y-8">
                {groups
                  .filter((g) => joinedGroups.includes(g.id))
                  .map((g) => (
                    <Card key={g.id}>
                      <CardHeader>
                        <CardTitle>{g.name}</CardTitle>
                        <CardDescription>{g.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="mb-3 h-56 overflow-y-auto rounded-md bg-muted p-3">
                          {chats
                            .filter((c) => c.groupId === g.id)
                            .map((c) => (
                              <div key={c.id} className="mb-2 text-sm leading-6">
                                <span className="font-medium text-primary">{c.user}:</span>{" "}
                                <span className="text-foreground">{c.message}</span>{" "}
                                <span className="text-muted-foreground">({c.time})</span>
                              </div>
                            ))}
                        </div>
                        <div className="flex">
                          <Input
                            placeholder="Type a message..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            className="rounded-r-none"
                          />
                          <Button onClick={() => handleSend(g.id)} className="rounded-l-none">
                            Send
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-6 text-center text-muted-foreground">
                  Join a group to start chatting.
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* ANNOUNCEMENTS */}
          <TabsContent value="announcements" className="space-y-6">
            <h2 className="text-2xl font-semibold">Announcements</h2>
            <div className="space-y-4">
              {announcements.map((a) => (
                <Card key={a.id}>
                  <CardHeader>
                    <CardTitle className="text-pretty">{a.title}</CardTitle>
                    <CardDescription>{a.date}</CardDescription>
                  </CardHeader>
                  <CardContent className="text-muted-foreground">{a.content}</CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* EVENTS */}
          <TabsContent value="events" className="space-y-6">
            <h2 className="text-2xl font-semibold">Events</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {events.map((e) => (
                <Card key={e.id}>
                  <CardHeader>
                    <CardTitle>{e.title}</CardTitle>
                    <CardDescription>
                      {e.date} • {e.location}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">{e.description}</p>
                    <Button onClick={() => setEventOpen(e.id)}>Register</Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {events.map((ev) => (
              <Dialog key={ev.id} open={eventOpen === ev.id} onOpenChange={() => setEventOpen(null)}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Register for {ev.title}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-3">
                    <Input
                      placeholder="Full name"
                      value={eventForm.name}
                      onChange={(e) => setEventForm({ ...eventForm, name: e.target.value })}
                    />
                    <Input
                      placeholder="Email"
                      type="email"
                      value={eventForm.email}
                      onChange={(e) => setEventForm({ ...eventForm, email: e.target.value })}
                    />
                    <Input
                      placeholder="Roll number"
                      value={eventForm.roll}
                      onChange={(e) => setEventForm({ ...eventForm, roll: e.target.value })}
                    />
                    <div className="flex justify-end">
                      <Button
                        onClick={() => {
                          if (!currentUser) {
                            setShowSignIn(true)
                            return
                          }
                          if (!eventForm.name || !eventForm.email || !eventForm.roll) return
                          setEventOpen(null)
                          setEventForm({ name: "", email: "", roll: "" })
                        }}
                      >
                        Submit
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            ))}
          </TabsContent>

          {/* OPPORTUNITIES */}
          <TabsContent value="opportunities" className="space-y-6">
            <h2 className="text-2xl font-semibold">Opportunities</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {opportunities.map((o) => (
                <Card key={o.id}>
                  <CardHeader>
                    <CardTitle className="text-pretty">{o.title}</CardTitle>
                    <CardDescription>Deadline: {o.deadline}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">{o.description}</p>
                    <Button onClick={() => setOpportunityOpen(o.id)}>Apply</Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {opportunities.map((op) => (
              <Dialog key={op.id} open={opportunityOpen === op.id} onOpenChange={() => setOpportunityOpen(null)}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Apply for {op.title}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-3">
                    <Input
                      placeholder="Full name"
                      value={opForm.name}
                      onChange={(e) => setOpForm({ ...opForm, name: e.target.value })}
                    />
                    <Input
                      placeholder="Email"
                      type="email"
                      value={opForm.email}
                      onChange={(e) => setOpForm({ ...opForm, email: e.target.value })}
                    />
                    <Textarea
                      placeholder="Roll number and a short note"
                      value={opForm.roll}
                      onChange={(e) => setOpForm({ ...opForm, roll: e.target.value })}
                    />
                    <div className="flex justify-end">
                      <Button
                        onClick={() => {
                          if (!currentUser) {
                            setShowSignIn(true)
                            return
                          }
                          if (!opForm.name || !opForm.email || !opForm.roll) return
                          setOpportunityOpen(null)
                          setOpForm({ name: "", email: "", roll: "" })
                        }}
                      >
                        Submit
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            ))}
          </TabsContent>

          {/* RESOURCES */}
          <TabsContent value="freshers" className="space-y-6">
            <h2 className="text-2xl font-semibold">Fresher Resources</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {fresherResources.map((r) => (
                <Card key={r.id}>
                  <CardHeader>
                    <CardTitle className="text-pretty">{r.title}</CardTitle>
                    <CardDescription>{r.content}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex justify-end">
                    <Button variant="secondary" onClick={() => setResourceOpen(r.id)}>
                      Read more
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {fresherResources.map((r) => (
              <Dialog key={r.id} open={resourceOpen === r.id} onOpenChange={() => setResourceOpen(null)}>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>{r.title}</DialogTitle>
                  </DialogHeader>
                  <div dangerouslySetInnerHTML={{ __html: r.details }} />
                </DialogContent>
              </Dialog>
            ))}
          </TabsContent>
        </Tabs>
      </main>

      {/* Auth dialogs */}
      <Dialog open={showSignUp} onOpenChange={setShowSignUp}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create your account</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Input
              placeholder="Username"
              value={signUpData.username}
              onChange={(e) => setSignUpData({ ...signUpData, username: e.target.value })}
            />
            <Input
              placeholder="Password"
              type="password"
              value={signUpData.password}
              onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
            />
            <div className="flex justify-end">
              <Button onClick={handleSignUp}>Sign up</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showSignIn} onOpenChange={setShowSignIn}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sign in</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Input
              placeholder="Username"
              value={signInData.username}
              onChange={(e) => setSignInData({ ...signInData, username: e.target.value })}
            />
            <Input
              placeholder="Password"
              type="password"
              value={signInData.password}
              onChange={(e) => setSignInData({ ...signInData, password: e.target.value })}
            />
            <div className="flex justify-end">
              <Button onClick={handleSignIn}>Sign in</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  )
}

function Header({
  active,
  setActive,
  currentUser,
  onSignIn,
  onSignUp,
  onSignOut,
}: {
  active: string
  setActive: (v: string) => void
  currentUser: User | null
  onSignIn: () => void
  onSignUp: () => void
  onSignOut: () => void
}) {
  const tabs = ["home", "groups", "forum", "chat", "announcements", "events", "opportunities", "freshers"]
  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <img src="/abstract-logo.png" alt="" className="h-7 w-7 rounded-md" />
          <span className="text-lg font-semibold">SRM CONNECT</span>
        </div>
        <nav className="hidden gap-4 md:flex">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setActive(t)}
              className={cn(
                "text-sm font-medium text-muted-foreground hover:text-foreground",
                active === t && "text-foreground",
              )}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          {currentUser ? (
            <>
              <span className="hidden text-sm text-muted-foreground sm:inline">Hi, {currentUser.username}</span>
              <Button variant="secondary" onClick={onSignOut}>
                Sign out
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" onClick={onSignIn}>
                Log in
              </Button>
              <Button onClick={onSignUp}>Sign up</Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

function Hero({ onGetStarted }: { onGetStarted: () => void }) {
  return (
    <section className="relative overflow-hidden rounded-xl border bg-card p-6 sm:p-10">
      <div className="grid items-center gap-6 md:grid-cols-2">
        <div className="order-2 md:order-1">
          <h1 className="text-balance text-4xl font-semibold leading-tight sm:text-5xl">
            Get to know your campus with communities worth joining
          </h1>
          <p className="mt-4 text-pretty text-muted-foreground">
            Discover groups, events, and opportunities tailored to your interests. Connect, collaborate, and grow.
          </p>
          <div className="mt-6 flex gap-3">
            <Button onClick={onGetStarted}>Get started</Button>
            <Button
              variant="secondary"
              onClick={() => window.scrollTo({ top: document.body.scrollHeight / 3, behavior: "smooth" })}
            >
              Explore groups
            </Button>
          </div>
        </div>
        <div className="order-1 md:order-2">
          <div className="aspect-[4/3] w-full overflow-hidden rounded-lg border">
            <img src="/dashboard-mockup.png" alt="SRM Connect preview" className="h-full w-full object-cover" />
          </div>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="border-t py-10">
      <div className="mx-auto max-w-6xl px-4 text-center text-sm text-muted-foreground">
        © 2025 SRM CONNECT · Connect, Collaborate, Celebrate
      </div>
    </footer>
  )
}
