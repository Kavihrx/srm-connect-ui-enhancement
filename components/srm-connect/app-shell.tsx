"use client"

import * as React from "react"
import { Tabs, TabsContent } from "@/components/ui/tabs"
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
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"
import useSWR from "swr"

type User = { email: string; id: string }

function AppShell() {
  const [activeTab, setActiveTab] = React.useState("home")
  const [selectedInterest, setSelectedInterest] = React.useState<string>("")
  const [currentUser, setCurrentUser] = React.useState<User | null>(null)
  const [joinedGroups, setJoinedGroups] = React.useState<number[]>([])
  const [groups, setGroups] = React.useState(allGroups)
  const [chats, setChats] = React.useState(initialChats)
  const [selectedChatGroupId, setSelectedChatGroupId] = React.useState<number | null>(null)
  const [draftsByGroup, setDraftsByGroup] = React.useState<Record<number, string>>({})
  const [typingByGroup, setTypingByGroup] = React.useState<Record<number, boolean>>({})
  // remove unused newMessage (Supabase path uses draftsByGroup)
  // const [newMessage, setNewMessage] = React.useState("")

  // dialogs
  const [showSignUp, setShowSignUp] = React.useState(false)
  const [showSignIn, setShowSignIn] = React.useState(false)
  const [signUpData, setSignUpData] = React.useState({ email: "", password: "" })
  const [signInData, setSignInData] = React.useState({ email: "", password: "" })

  const [forumOpen, setForumOpen] = React.useState<null | number>(null)
  const [eventOpen, setEventOpen] = React.useState<null | number>(null)
  const [opportunityOpen, setOpportunityOpen] = React.useState<null | number>(null)
  const [resourceOpen, setResourceOpen] = React.useState<null | number>(null)

  const [eventForm, setEventForm] = React.useState({ name: "", email: "", roll: "" })
  const [opForm, setOpForm] = React.useState({ name: "", email: "", roll: "" })

  const [authError, setAuthError] = React.useState<string | null>(null)

  const [forum, setForum] = React.useState(forumPosts)
  const [forumQuery, setForumQuery] = React.useState("")
  const [forumSort, setForumSort] = React.useState<"new" | "comments" | "likes">("new")
  const [newPostOpen, setNewPostOpen] = React.useState(false)
  const [newPost, setNewPost] = React.useState({ title: "", content: "" })
  const [commentDrafts, setCommentDrafts] = React.useState<Record<number, string>>({})
  const [reactions, setReactions] = React.useState<Record<number, number>>({})
  const [likedPosts, setLikedPosts] = React.useState<Record<number, boolean>>({})

  const { toast } = useToast()

  React.useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      if (data.user?.email && data.user?.id) setCurrentUser({ email: data.user.email, id: data.user.id })
    })
    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user?.email && session.user.id) {
        setCurrentUser({ email: session.user.email, id: session.user.id })
      } else {
        setCurrentUser(null)
        // keep local joinedGroups if any; Supabase hooks below will null out when user logs out
      }
    })
    return () => {
      subscription?.subscription?.unsubscribe?.()
    }
  }, [])

  const membershipsKey = currentUser ? ["memberships", currentUser.id] : null
  const membershipsFetcher = React.useCallback(async () => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from("memberships")
      .select("group_id")
      .order("joined_at", { ascending: true })
    if (error) throw error
    return (data ?? []).map((r: { group_id: number }) => r.group_id)
  }, [])
  const { data: membershipGroups, mutate: mutateMemberships } = useSWR(membershipsKey, membershipsFetcher)

  React.useEffect(() => {
    if (currentUser && membershipGroups) {
      setJoinedGroups(membershipGroups)
    }
    if (!currentUser) {
      // leave joinedGroups as local (fallback) when logged out
    }
  }, [currentUser, membershipGroups])

  type DbMessage = { id: number; group_id: number; user_id: string; content: string; created_at: string }
  const messagesKey = currentUser && selectedChatGroupId ? (["messages", selectedChatGroupId] as const) : null
  const messagesFetcher = React.useCallback(async () => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from("messages")
      .select("id, group_id, user_id, content, created_at")
      .eq("group_id", selectedChatGroupId)
      .order("created_at", { ascending: true })
    if (error) throw error
    return (data ?? []) as DbMessage[]
  }, [selectedChatGroupId])
  const { data: dbMessages, mutate: mutateMessages } = useSWR(messagesKey, messagesFetcher)

  React.useEffect(() => {
    if (!currentUser || !selectedChatGroupId) return
    const supabase = createClient()
    const channel = supabase
      .channel(`messages:g${selectedChatGroupId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `group_id=eq.${selectedChatGroupId}`,
        },
        (payload) => {
          const row = payload.new as DbMessage
          mutateMessages((prev) => (prev ? [...prev, row] : [row]), { revalidate: false })
        },
      )
      .subscribe()
    return () => {
      supabase.removeChannel(channel)
    }
  }, [currentUser, selectedChatGroupId, mutateMessages])

  const handleJoinGroup = async (id: number) => {
    if (!currentUser) {
      setShowSignIn(true)
      return
    }
    if (joinedGroups.includes(id)) return
    // optimistic UI
    setJoinedGroups((prev) => [...prev, id])
    setGroups((prev) => prev.map((g) => (g.id === id ? { ...g, members: g.members + 1 } : g)))
    setActiveTab("chat")
    setSelectedChatGroupId((prev) => prev ?? id)
    // persist to Supabase
    try {
      const supabase = createClient()
      // user_id inferred from auth; but we must pass it for policy check
      await supabase.from("memberships").insert({ user_id: currentUser.id, group_id: id })
      mutateMemberships && mutateMemberships()
    } catch (e) {
      // ignore for now; SWR will reconcile
    }
  }

  const handleSend = async (groupId: number) => {
    if (!currentUser) {
      setShowSignIn(true)
      return
    }
    const text = (draftsByGroup[groupId] || "").trim()
    if (!text) return
    // clear composer immediately
    setDraftsByGroup((d) => ({ ...d, [groupId]: "" }))
    setTypingByGroup((t) => ({ ...t, [groupId]: false }))
    // persist
    const supabase = createClient()
    const { error } = await supabase.from("messages").insert({
      group_id: groupId,
      user_id: currentUser.id,
      content: text,
    })
    if (error) {
      // optional: restore draft on failure
      setDraftsByGroup((d) => ({ ...d, [groupId]: text }))
    }
  }

  const handleSignIn = async () => {
    setAuthError(null)
    const email = signInData.email.trim()
    const password = signInData.password.trim()
    if (!email || !password) return
    const supabase = createClient()
    const { error } = await supabase.signInWithPassword({
      email,
      password,
      options: {
        emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/protected`,
      },
    })
    if (error) {
      setAuthError(error.message)
      return
    }
    setShowSignIn(false)
    setSignInData({ email: "", password: "" })
  }

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    setCurrentUser(null)
    setJoinedGroups([]) // Clear local joined groups on sign out
  }

  const handleSignUp = async () => {
    setAuthError(null)
    const email = signUpData.email.trim()
    const password = signUpData.password.trim()
    if (!email || !password) return
    const supabase = createClient()
    const { error } = await supabase.signUp({
      email,
      password,
      options: {
        emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/protected`,
      },
    })
    if (error) {
      setAuthError(error.message)
      return
    }
    setShowSignUp(false)
    setSignUpData({ email: "", password: "" })
  }

  const messagesToShow = React.useMemo(() => {
    if (currentUser && dbMessages && selectedChatGroupId) {
      return dbMessages.map((m) => ({
        id: m.id,
        groupId: m.group_id,
        user: m.user_id === currentUser.id ? currentUser.email : "Member",
        message: m.content,
        time: new Date(m.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }))
    }
    // fallback to local in-memory messages
    return chats.filter((m) => m.groupId === selectedChatGroupId).map((m) => ({ ...m }))
  }, [currentUser, dbMessages, selectedChatGroupId, chats])

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
        onSignIn={() => {
          setAuthError(null)
          setShowSignIn(true)
        }}
        onSignUp={() => {
          setAuthError(null)
          setShowSignUp(true)
        }}
        onSignOut={handleSignOut}
      />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
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

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex w-full gap-2 sm:max-w-md">
                <Input
                  placeholder="Search posts..."
                  value={forumQuery}
                  onChange={(e) => setForumQuery(e.target.value)}
                />
                <div className="flex gap-1">
                  <Button variant={forumSort === "new" ? "default" : "secondary"} onClick={() => setForumSort("new")}>
                    Newest
                  </Button>
                  <Button
                    variant={forumSort === "comments" ? "default" : "secondary"}
                    onClick={() => setForumSort("comments")}
                  >
                    Most commented
                  </Button>
                  <Button
                    variant={forumSort === "likes" ? "default" : "secondary"}
                    onClick={() => setForumSort("likes")}
                  >
                    Top liked
                  </Button>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    if (!currentUser) {
                      setShowSignIn(true)
                      return
                    }
                    setNewPostOpen(true)
                  }}
                >
                  New post
                </Button>
              </div>
            </div>

            {(() => {
              const normalized = forumQuery.trim().toLowerCase()
              const filtered = forum.filter(
                (p) =>
                  p.title.toLowerCase().includes(normalized) ||
                  p.content.toLowerCase().includes(normalized) ||
                  p.author.toLowerCase().includes(normalized),
              )
              const sorted =
                forumSort === "new"
                  ? [...filtered].sort((a, b) => (a.date < b.date ? 1 : -1))
                  : forumSort === "comments"
                    ? [...filtered].sort((a, b) => b.comments.length - a.comments.length)
                    : [...filtered].sort((a, b) => (reactions[b.id] || 0) - (reactions[a.id] || 0))

              return (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {sorted.map((p) => (
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
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">{p.comments.length} comments</Badge>
                          <Button
                            variant={likedPosts[p.id] ? "default" : "secondary"}
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              setLikedPosts((prev) => {
                                const next = !prev[p.id]
                                setReactions((r) => {
                                  const current = r[p.id] || 0
                                  return {
                                    ...r,
                                    [p.id]: Math.max(0, current + (next ? 1 : -1)),
                                  }
                                })
                                return { ...prev, [p.id]: next }
                              })
                            }}
                            aria-pressed={likedPosts[p.id] ? true : false}
                            aria-label="Like post"
                          >
                            ❤️ {reactions[p.id] || 0}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )
            })()}

            {forum.map((p) => (
              <Dialog key={p.id} open={forumOpen === p.id} onOpenChange={() => setForumOpen(null)}>
                <DialogContent className="max-w-2xl">
                  <DialogHeader className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <DialogTitle className="text-pretty">{p.title}</DialogTitle>
                    </div>
                    <Button
                      variant={likedPosts[p.id] ? "default" : "secondary"}
                      size="sm"
                      onClick={() => {
                        setLikedPosts((prev) => {
                          const next = !prev[p.id]
                          setReactions((r) => {
                            const current = r[p.id] || 0
                            return {
                              ...r,
                              [p.id]: Math.max(0, current + (next ? 1 : -1)),
                            }
                          })
                          return { ...prev, [p.id]: next }
                        })
                      }}
                      aria-pressed={likedPosts[p.id] ? true : false}
                      aria-label="Like post"
                    >
                      ❤️ {reactions[p.id] || 0}
                    </Button>
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
                      <div className="mt-2 flex flex-col gap-2">
                        <Textarea
                          placeholder={currentUser ? "Write a comment..." : "Sign in to comment"}
                          value={commentDrafts[p.id] || ""}
                          onChange={(e) => setCommentDrafts((d) => ({ ...d, [p.id]: e.target.value }))}
                        />
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="secondary"
                            onClick={() => {
                              setCommentDrafts((d) => ({ ...d, [p.id]: "" }))
                            }}
                          >
                            Clear
                          </Button>
                          <Button
                            onClick={() => {
                              if (!currentUser) {
                                setShowSignIn(true)
                                return
                              }
                              const text = (commentDrafts[p.id] || "").trim()
                              if (!text) return
                              setForum((prev) =>
                                prev.map((fp) =>
                                  fp.id === p.id
                                    ? {
                                        ...fp,
                                        comments: [
                                          ...fp.comments,
                                          {
                                            id: fp.comments.length + 1,
                                            user: currentUser.email,
                                            content: text,
                                            time: new Date().toLocaleTimeString([], {
                                              hour: "2-digit",
                                              minute: "2-digit",
                                            }),
                                          },
                                        ],
                                      }
                                    : fp,
                                ),
                              )
                              setCommentDrafts((d) => ({ ...d, [p.id]: "" }))
                            }}
                          >
                            Add comment
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            ))}

            <Dialog open={newPostOpen} onOpenChange={setNewPostOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>New post</DialogTitle>
                </DialogHeader>
                <div className="space-y-3">
                  <Input
                    placeholder="Title"
                    value={newPost.title}
                    onChange={(e) => setNewPost((p) => ({ ...p, title: e.target.value }))}
                  />
                  <Textarea
                    placeholder="What would you like to discuss?"
                    value={newPost.content}
                    onChange={(e) => setNewPost((p) => ({ ...p, content: e.target.value }))}
                  />
                  <div className="flex justify-end gap-2">
                    <Button variant="secondary" onClick={() => setNewPostOpen(false)}>
                      Cancel
                    </Button>
                    <Button
                      onClick={() => {
                        if (!currentUser) {
                          setShowSignIn(true)
                          return
                        }
                        const title = newPost.title.trim()
                        const content = newPost.content.trim()
                        if (!title || !content) return
                        setForum((prev) => [
                          {
                            id: prev.length ? Math.max(...prev.map((x) => x.id)) + 1 : 1,
                            title,
                            content,
                            author: currentUser.email,
                            date: new Date().toISOString().slice(0, 10),
                            comments: [],
                          },
                          ...prev,
                        ])
                        setNewPost({ title: "", content: "" })
                        setNewPostOpen(false)
                      }}
                    >
                      Post
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </TabsContent>

          {/* ANNOUNCEMENTS */}
          <TabsContent value="announcements" className="space-y-6">
            <h2 className="text-2xl font-semibold">Announcements</h2>
            <div className="space-y-4">
              {[...announcements]
                .sort((a, b) => (a.date < b.date ? 1 : -1))
                .map((a) => (
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
                          toast({
                            title: "Registration successful",
                            description: `You're registered for ${ev.title} on ${ev.date}.`,
                          })
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

          {/* CHAT */}
          <TabsContent value="chat" className="space-y-6">
            <h2 className="text-2xl font-semibold">Group Chat</h2>
            {joinedGroups.length === 0 ? (
              <Card>
                <CardContent className="py-6 text-muted-foreground">
                  You haven’t joined any groups yet. Join a group from Home or Groups to start chatting.
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-[260px_1fr]">
                {/* Sidebar: joined groups */}
                <Card className="h-full md:sticky md:top-24">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Your Groups</CardTitle>
                    <CardDescription>Select a group to open the chat</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {groups
                      .filter((g) => joinedGroups.includes(g.id))
                      .map((g) => (
                        <button
                          key={g.id}
                          onClick={() => setSelectedChatGroupId(g.id)}
                          className={cn(
                            "w-full rounded-md border px-3 py-2 text-left text-sm transition hover:bg-accent",
                            selectedChatGroupId === g.id && "bg-accent",
                          )}
                        >
                          <div className="font-medium">{g.name}</div>
                          <div className="text-xs text-muted-foreground">{g.interest}</div>
                        </button>
                      ))}
                  </CardContent>
                </Card>

                {/* Main chat window */}
                <Card className="flex h-[520px] flex-col">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">
                      {groups.find((g) => g.id === selectedChatGroupId)?.name || "Select a group"}
                    </CardTitle>
                    <CardDescription className="line-clamp-2">
                      {groups.find((g) => g.id === selectedChatGroupId)?.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex min-h-0 flex-1 flex-col gap-3">
                    <div id="message-scroll" className="min-h-0 flex-1 space-y-2 overflow-y-auto rounded-md border p-3">
                      {/* messages */}
                      {/* replace the messages map in the chat window to use messagesToShow */}
                      {messagesToShow.map((m) => {
                        const isSelf = currentUser?.email === m.user
                        return (
                          <div key={m.id} className={cn("flex", isSelf ? "justify-end" : "justify-start")}>
                            <div
                              className={cn(
                                "max-w-[80%] rounded-lg px-3 py-2 text-sm shadow-sm",
                                isSelf ? "bg-primary text-primary-foreground" : "bg-muted",
                              )}
                            >
                              <div className="flex items-center gap-2">
                                <span className={cn("font-medium", isSelf && "opacity-90")}>{m.user}</span>
                                <span className="text-xs opacity-70">{m.time}</span>
                              </div>
                              <div className={cn("mt-1", isSelf && "opacity-95")}>{m.message}</div>
                            </div>
                          </div>
                        )
                      })}

                      {/* typing indicator */}
                      {selectedChatGroupId && typingByGroup[selectedChatGroupId] ? (
                        <div className="text-xs text-muted-foreground">Someone is typing…</div>
                      ) : null}
                    </div>

                    {/* composer */}
                    <div className="flex items-end gap-2">
                      <Textarea
                        placeholder={currentUser ? "Type a message. Press Enter to send" : "Sign in to send messages"}
                        value={selectedChatGroupId ? draftsByGroup[selectedChatGroupId] || "" : ""}
                        onChange={(e) => {
                          if (!selectedChatGroupId) return
                          const text = e.target.value
                          setDraftsByGroup((d) => ({ ...d, [selectedChatGroupId]: text }))
                          // show typing for 1.5s after last keypress
                          setTypingByGroup((t) => ({ ...t, [selectedChatGroupId]: true }))
                          const gid = selectedChatGroupId
                          window.clearTimeout((window as any).__typingTimer)
                          ;(window as any).__typingTimer = window.setTimeout(() => {
                            setTypingByGroup((t) => ({ ...t, [gid]: false }))
                          }, 1500)
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault()
                            if (selectedChatGroupId) handleSend(selectedChatGroupId)
                          }
                        }}
                        className="min-h-[44px]"
                      />
                      <Button
                        onClick={() => {
                          if (selectedChatGroupId) handleSend(selectedChatGroupId)
                        }}
                      >
                        Send
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
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
              placeholder="Email"
              type="email"
              value={signUpData.email}
              onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
            />
            <Input
              placeholder="Password"
              type="password"
              value={signUpData.password}
              onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
            />
            {authError ? <p className="text-sm text-red-500">{authError}</p> : null}
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
              placeholder="Email"
              type="email"
              value={signInData.email}
              onChange={(e) => setSignInData({ ...signInData, email: e.target.value })}
            />
            <Input
              placeholder="Password"
              type="password"
              value={signInData.password}
              onChange={(e) => setSignInData({ ...signInData, password: e.target.value })}
            />
            {authError ? <p className="text-sm text-red-500">{authError}</p> : null}
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
              <span className="hidden text-sm text-muted-foreground sm:inline">Hi, {currentUser.email}</span>
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

export { AppShell }
