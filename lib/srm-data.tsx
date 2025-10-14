export const interests = [
  "Technology",
  "Music",
  "Sports",
  "Art",
  "Gaming",
  "Photography",
  "Literature",
  "Entrepreneurship",
]

export const groups = [
  { id: 1, name: "Tech Enthusiasts", interest: "Technology", members: 120, description: "For coders and tech lovers" },
  { id: 2, name: "AI Innovators", interest: "Technology", members: 80, description: "Explore AI and ML advancements" },
  { id: 4, name: "Music Lovers", interest: "Music", members: 85, description: "Share your favorite tunes" },
  { id: 7, name: "Football Fanatics", interest: "Sports", members: 95, description: "Discuss matches and play!" },
  { id: 10, name: "Art Creators", interest: "Art", members: 60, description: "Showcase your artwork" },
  { id: 13, name: "Gamers Guild", interest: "Gaming", members: 110, description: "Join epic gaming sessions" },
]

export const forumPosts = [
  {
    id: 1,
    title: "Best Programming Language for Beginners?",
    content:
      "What do you think is the best programming language for beginners? I’m torn between Python and JavaScript. Python seems easier, but JS is everywhere on the web.",
    author: "Aarav Sharma",
    date: "2025-04-27",
    comments: [
      { id: 1, user: "Priya Patel", content: "Python is great for beginners! Its syntax is simple.", time: "12:30" },
      { id: 2, user: "Rohan Kumar", content: "JS is more versatile for web development.", time: "13:00" },
    ],
  },
  {
    id: 2,
    title: "Photography Tips for Low Light",
    content:
      "How do you get better shots in low light? I struggle with noise and blurry images during evening campus events.",
    author: "Karthik Menon",
    date: "2025-04-25",
    comments: [
      { id: 1, user: "Lakshmi Iyer", content: "Use a tripod and increase ISO, but not too high.", time: "16:00" },
    ],
  },
  {
    id: 3,
    title: "Preparing for Aaruush 2025",
    content: "Aaruush 2025 is coming up! Any tips for first-time participants? What events should I prioritize?",
    author: "Siddharth Rao",
    date: "2025-04-27",
    comments: [{ id: 1, user: "Nisha Gupta", content: "Don’t miss the hackathon and robotics events!", time: "09:00" }],
  },
  {
    id: 4,
    title: "Best Study Spots on Campus",
    content: "Where do you study on campus? The library is great, but it’s crowded sometimes.",
    author: "Divya Balaji",
    date: "2025-04-26",
    comments: [{ id: 1, user: "Rahul Pillai", content: "Try the CSE lounge; it’s quiet.", time: "11:00" }],
  },
]

export const announcements = [
  {
    id: 1,
    title: "Prime Minister’s Visit to SRMIST",
    content:
      "PM Shri Narendra Modi will visit SRMIST, Kattankulathur, on May 3, 2025 to inaugurate the new 5G Lab and address students.",
    date: "2025-04-27",
  },
  {
    id: 2,
    title: "Aaruush 2025 Announced",
    content: "SRM’s annual tech fest is scheduled for Sep 10–13, 2025. Register now!",
    date: "2025-04-26",
  },
  {
    id: 3,
    title: "Semester Exams Schedule",
    content: "End Term Examinations begin May 15. Check the student portal.",
    date: "2025-04-25",
  },
  {
    id: 4,
    title: "Innovation Grant",
    content: "Applications open for SRM Innovation Grant 2025. Deadline: June 1.",
    date: "2025-04-24",
  },
]

export const events = [
  {
    id: 1,
    title: "Tech Hackathon",
    date: "2025-05-10",
    location: "SRM Main Campus",
    description: "Code your way to glory!",
  },
  { id: 2, title: "Music Fest", date: "2025-05-15", location: "Open Amphitheatre", description: "Live bands and DJs." },
  {
    id: 3,
    title: "Career Fair 2025",
    date: "2025-06-20",
    location: "TP Ganesan Auditorium",
    description: "Meet top recruiters.",
  },
  { id: 4, title: "Sports Day 2025", date: "2025-08-15", location: "Sports Complex", description: "Compete and win!" },
]

export const opportunities = [
  { id: 1, title: "Internship at Tech Corp", description: "Work on cutting-edge AI projects.", deadline: "2025-05-15" },
  {
    id: 2,
    title: "Art Exhibition Volunteer",
    description: "Help organize SRM’s annual art show.",
    deadline: "2025-05-20",
  },
  { id: 3, title: "Research Assistant", description: "Assist in 5G and IoT research.", deadline: "2025-06-10" },
  {
    id: 4,
    title: "Startup Incubation",
    description: "Funding and mentorship for your startup idea.",
    deadline: "2025-07-01",
  },
]

export const chats = [
  { id: 1, groupId: 1, user: "Aarav Sharma", message: "Anyone up for coding this weekend?", time: "10:30" },
  { id: 2, groupId: 1, user: "Priya Patel", message: "Count me in—React?", time: "10:45" },
  { id: 3, groupId: 4, user: "Ananya Singh", message: "New Arijit album is fire!", time: "11:00" },
]

export const fresherResources = [
  {
    id: 1,
    title: "Guide to Campus Life",
    content: "Tips for new students to thrive at SRM",
    details: `
      <h2 class="text-2xl font-bold mb-4">Campus Life</h2>
      <p class="mb-4">SRMIST offers a vibrant campus with state-of-the-art facilities.</p>
      <ul class="list-disc pl-6 mb-2">
        <li><strong>Accommodation</strong>: On-campus hostels with Wi‑Fi.</li>
        <li><strong>Clubs</strong>: 50+ clubs including Robotics, Music, Drama.</li>
        <li><strong>Events</strong>: Aaruush (tech) and Milan (cultural).</li>
      </ul>
    `,
  },
  {
    id: 2,
    title: "Clubs and Societies",
    content: "How to join student organizations",
    details: `
      <h2 class="text-2xl font-bold mb-4">Joining Clubs</h2>
      <p class="mb-4">Attend the Club Fair or sign up via SRM Connect.</p>
    `,
  },
  {
    id: 3,
    title: "Accessing Library",
    content: "Guide to using SRM’s library resources",
    details: `
      <h2 class="text-2xl font-bold mb-4">Library Access</h2>
      <p class="mb-4">Register with your SRM ID and use the online portal.</p>
    `,
  },
]
