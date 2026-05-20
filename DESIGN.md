# Taskyy — Complete UI/UX & Architecture Design Plan

> Social productivity app where users manage tasks, share progress, and do activities together with friends.

---

## Table of Contents

1. [App Concept & Vision](#1-app-concept--vision)
2. [Tech Stack](#2-tech-stack)
3. [Design System](#3-design-system)
4. [Feature Priority — MVP vs Advanced](#4-feature-priority)
5. [Database Schema](#5-database-schema)
6. [Main User Flows](#6-main-user-flows)
7. [Page-by-Page Layout](#7-page-by-page-layout)
8. [Component Library](#8-component-library)
9. [API Structure](#9-api-structure)
10. [Real-time Events (Socket.IO)](#10-real-time-events)
11. [Folder Structure](#11-folder-structure)
12. [Development Roadmap](#12-development-roadmap)

---

## 1. App Concept & Vision

**Taskyy** is a social productivity platform. It blends personal task management with social features — users see what friends are working on, do activities together in shared rooms, and track their daily progress over time.

**Core pillars:**
- **Personal** — Manage today's tasks and future plans privately
- **Social** — See friends' statuses, tasks, and share progress
- **Together** — Shared rooms where friends do activities and tasks collaboratively
- **Progress** — History, streaks, and daily completion stats

**Feel:** Notion's clean structure + Discord's social presence + Todoist's task simplicity — but warmer and more personal.

---

## 2. Tech Stack

### Frontend
| Tool | Purpose |
|------|---------|
| **Next.js 14+** (App Router) | Framework, SSR/SSG, routing |
| **TypeScript** | Type safety everywhere |
| **Tailwind CSS** | Utility-first styling |
| **Framer Motion** | Smooth animations and transitions |
| **Zustand** | Global client state (auth, UI state) |
| **TanStack Query v5** | Server state, caching, background refetch |
| **Socket.IO Client** | Real-time chat, status, room updates |
| **React Hook Form + Zod** | Forms and validation |
| **next-themes** | Light/dark mode |
| **Lucide React** | Icon set |
| **date-fns** | Date formatting and manipulation |
| **react-dropzone** | Image/file upload UI |
| **clsx + tailwind-merge** | Conditional classnames |

### Backend
| Tool | Purpose |
|------|---------|
| **NestJS** | Backend framework (modular, TypeScript-first) |
| **PostgreSQL** | Primary database |
| **Prisma ORM** | Type-safe database client + migrations |
| **Socket.IO** | Real-time events (chat, status, rooms) |
| **JWT + Refresh Tokens** | Authentication |
| **Passport.js** | Auth strategies (local, JWT) |
| **Bcrypt** | Password hashing |
| **Class-validator** | DTO validation |
| **Multer + Cloudinary** | Image upload and storage |
| **Bull + Redis** | Background jobs (notifications, cleanup) |

### Infrastructure
| Tool | Purpose |
|------|---------|
| **Cloudinary** | Image CDN (avatars, task photos, chat images) |
| **Redis** | Session cache, Bull queues, Socket.IO adapter |
| **PostgreSQL** (Neon or Supabase) | Managed database |
| **Vercel** | Frontend deployment |
| **Railway or Render** | Backend + Redis deployment |
| **GitHub Actions** | CI/CD pipeline |

---

## 3. Design System

### 3.1 Color Palette

```
PRIMARY BRAND
--color-primary-50:   #EEF2FF   (very light indigo background)
--color-primary-100:  #E0E7FF
--color-primary-200:  #C7D2FE
--color-primary-400:  #818CF8
--color-primary-500:  #6366F1   ← Main brand color
--color-primary-600:  #4F46E5   ← Hover/active
--color-primary-700:  #4338CA

ACCENT (warm pop)
--color-accent-400:   #F472B6
--color-accent-500:   #EC4899   ← Likes, highlights, fun elements
--color-accent-600:   #DB2777

SUCCESS
--color-success-400:  #34D399
--color-success-500:  #10B981   ← Completed tasks, online status

WARNING
--color-warning-400:  #FBBF24
--color-warning-500:  #F59E0B   ← Upcoming deadlines

ERROR
--color-error-400:    #F87171
--color-error-500:    #EF4444   ← Errors, overdue tasks

NEUTRALS (Light mode)
--color-bg:           #F8FAFC   ← Page background
--color-surface:      #FFFFFF   ← Cards, modals
--color-surface-2:    #F1F5F9   ← Secondary cards, inputs
--color-border:       #E2E8F0
--color-text-primary: #0F172A
--color-text-secondary: #64748B
--color-text-muted:   #94A3B8

NEUTRALS (Dark mode)
--color-bg:           #0B0F1A   ← Deep dark background
--color-surface:      #131929   ← Cards
--color-surface-2:    #1E2740   ← Inputs, secondary cards
--color-border:       #2D3748
--color-text-primary: #F1F5F9
--color-text-secondary: #94A3B8
--color-text-muted:   #64748B

STATUS COLORS
--status-playing:     #7C3AED   (purple)
--status-cooking:     #F97316   (orange)
--status-walking:     #10B981   (green)
--status-studying:    #3B82F6   (blue)
--status-reading:     #8B5CF6   (violet)
--status-working:     #6366F1   (indigo)
--status-custom:      #EC4899   (pink)
--status-offline:     #94A3B8   (gray)
```

### 3.2 Typography

```
Font Family: "Inter", "Geist", system-ui, sans-serif

Scale:
--text-xs:    12px / 16px   (labels, timestamps, badges)
--text-sm:    14px / 20px   (secondary text, descriptions)
--text-base:  16px / 24px   (body text)
--text-lg:    18px / 28px   (card titles, section headers)
--text-xl:    20px / 28px   (page sub-headings)
--text-2xl:   24px / 32px   (page headings)
--text-3xl:   30px / 36px   (hero headings)
--text-4xl:   36px / 40px   (landing page hero)

Weights:
--font-regular:   400
--font-medium:    500
--font-semibold:  600
--font-bold:      700
```

### 3.3 Spacing & Layout

```
Spacing scale (8px base):
4px, 8px, 12px, 16px, 20px, 24px, 32px, 40px, 48px, 64px, 80px, 96px

Border Radius:
--radius-sm:    6px    (badges, tags, small buttons)
--radius-md:    10px   (inputs, small cards)
--radius-lg:    14px   (cards, dropdowns)
--radius-xl:    20px   (modals, large cards)
--radius-2xl:   28px   (panels)
--radius-full:  9999px (avatars, pills, toggles)

Shadows (light mode):
--shadow-sm:  0 1px 3px rgba(0,0,0,0.07), 0 1px 2px rgba(0,0,0,0.04)
--shadow-md:  0 4px 12px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.04)
--shadow-lg:  0 10px 30px rgba(0,0,0,0.10), 0 4px 8px rgba(0,0,0,0.04)
--shadow-xl:  0 20px 50px rgba(0,0,0,0.14)

Shadows (dark mode): use rgba(0,0,0,0.4–0.6) with slight color tint
```

### 3.4 Component Tokens

```
Sidebar width:       260px (desktop), 0 (mobile — drawer)
Top navbar height:   60px
Card padding:        20px–24px
Input height:        44px
Button height sm:    34px
Button height md:    42px
Button height lg:    50px
Avatar sm:           32px
Avatar md:           40px
Avatar lg:           56px
Avatar xl:           80px
Avatar 2xl:          120px
Status dot size:     10px (on avatar)
```

### 3.5 Animation Tokens

```
All powered by Framer Motion:

--duration-fast:    150ms   (hover effects)
--duration-base:    200ms   (state changes)
--duration-slow:    300ms   (panel open/close)
--duration-slower:  400ms   (page transitions)

--ease-default:   [0.4, 0, 0.2, 1]  (cubic-bezier)
--ease-spring:    spring(stiffness: 400, damping: 30)
--ease-bounce:    spring(stiffness: 300, damping: 20, bounce: 0.2)

Key animations:
- Page in: fade + slide up 12px, 300ms
- Modal in: scale 0.95→1 + fade, 200ms spring
- Card hover: translateY(-2px) + shadow increase
- Sidebar items: slide in from left, stagger 40ms
- Task check: spring scale + checkmark draw
- Status badge: scale pop on change
- Toast: slide in from top-right
```

---

## 4. Feature Priority

### MVP (Phase 1 — Ship First)

- [ ] Auth — register, login, JWT sessions
- [ ] User profile — name, avatar, bio
- [ ] Status system — set current activity
- [ ] Task management — create, edit, delete, complete (today + future)
- [ ] Task categories and priority
- [ ] Home dashboard — today's tasks + upcoming
- [ ] Friends — send/accept/decline requests
- [ ] Friends list — see their status
- [ ] Basic direct chat (text only)
- [ ] Admin panel — user list, basic stats
- [ ] Light/dark mode
- [ ] Mobile responsive

### Phase 2 — Social & Rooms

- [ ] Task photos (Cloudinary upload)
- [ ] Shared rooms — create, invite, task checklist
- [ ] Room chat
- [ ] Friends' public tasks visible on their profile
- [ ] Friend profile page
- [ ] Daily progress / task history
- [ ] Notifications (in-app)
- [ ] Admin — block/delete users

### Phase 3 — Polish & Power Features

- [ ] Push notifications (web push)
- [ ] Task streaks and stats
- [ ] Activity feed on dashboard
- [ ] Task reminders
- [ ] Image messages in chat
- [ ] Admin — content moderation tools
- [ ] Search (users, tasks, rooms)
- [ ] Public room discovery

---

## 5. Database Schema

### Users
```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  username      String    @unique
  displayName   String
  passwordHash  String
  avatarUrl     String?
  bio           String?
  role          Role      @default(USER)
  isBlocked     Boolean   @default(false)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  status        UserStatus?
  tasks         Task[]
  sentRequests  Friend[]   @relation("Requester")
  receivedRequests Friend[] @relation("Recipient")
  sentMessages  Message[]
  roomMembers   RoomMember[]
  notifications Notification[]
}

enum Role { USER ADMIN }
```

### UserStatus
```prisma
model UserStatus {
  id        String      @id @default(cuid())
  userId    String      @unique
  user      User        @relation(fields: [userId], references: [id])
  type      StatusType
  customText String?
  emoji     String?
  updatedAt DateTime    @updatedAt
}

enum StatusType {
  PLAYING COOKING WALKING STUDYING READING WORKING CUSTOM OFFLINE
}
```

### Tasks
```prisma
model Task {
  id          String      @id @default(cuid())
  userId      String
  user        User        @relation(fields: [userId], references: [id])
  title       String
  description String?
  date        DateTime?
  time        String?
  category    String?
  priority    Priority    @default(MEDIUM)
  isCompleted Boolean     @default(false)
  isPublic    Boolean     @default(false)
  imageUrl    String?
  completedAt DateTime?
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt

  roomTask    RoomTask?
}

enum Priority { LOW MEDIUM HIGH URGENT }
```

### Friends
```prisma
model Friend {
  id          String        @id @default(cuid())
  requesterId String
  recipientId String
  status      FriendStatus  @default(PENDING)
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt

  requester   User @relation("Requester", fields: [requesterId], references: [id])
  recipient   User @relation("Recipient", fields: [recipientId], references: [id])

  @@unique([requesterId, recipientId])
}

enum FriendStatus { PENDING ACCEPTED DECLINED BLOCKED }
```

### Rooms
```prisma
model Room {
  id          String       @id @default(cuid())
  name        String
  description String?
  activityType StatusType?
  createdById String
  isPublic    Boolean      @default(false)
  createdAt   DateTime     @default(now())

  members     RoomMember[]
  tasks       RoomTask[]
  messages    Message[]
}

model RoomMember {
  id        String   @id @default(cuid())
  roomId    String
  userId    String
  role      RoomRole @default(MEMBER)
  joinedAt  DateTime @default(now())

  room      Room @relation(fields: [roomId], references: [id])
  user      User @relation(fields: [userId], references: [id])

  @@unique([roomId, userId])
}

enum RoomRole { OWNER ADMIN MEMBER }
```

### RoomTasks
```prisma
model RoomTask {
  id           String   @id @default(cuid())
  roomId       String
  taskId       String   @unique
  completedBy  String[] // array of userIds who completed this
  createdAt    DateTime @default(now())

  room         Room @relation(fields: [roomId], references: [id])
  task         Task @relation(fields: [taskId], references: [id])
}
```

### Messages
```prisma
model Message {
  id          String      @id @default(cuid())
  senderId    String
  content     String?
  imageUrl    String?
  type        MessageType @default(TEXT)
  roomId      String?
  recipientId String?     // for DMs
  createdAt   DateTime    @default(now())
  isDeleted   Boolean     @default(false)

  sender      User  @relation(fields: [senderId], references: [id])
  room        Room? @relation(fields: [roomId], references: [id])
}

enum MessageType { TEXT IMAGE SYSTEM }
```

### Notifications
```prisma
model Notification {
  id        String           @id @default(cuid())
  userId    String
  type      NotificationType
  fromId    String?
  referenceId String?
  isRead    Boolean          @default(false)
  createdAt DateTime         @default(now())

  user      User @relation(fields: [userId], references: [id])
}

enum NotificationType {
  FRIEND_REQUEST FRIEND_ACCEPTED ROOM_INVITE TASK_REMINDER MENTION
}
```

---

## 6. Main User Flows

### 6.1 Onboarding Flow
```
Landing Page
  → Register (email, username, password)
    → Email verification (optional MVP skip)
      → Profile setup (avatar, bio, status)
        → Home Dashboard
  → Login
    → Home Dashboard
```

### 6.2 Task Flow
```
Dashboard
  → + New Task button
    → Create Task Modal
      → title, description, date/time, category, priority
      → optional: add photo
      → public/private toggle
        → Task saved → appears on Today or Future Plans list
          → Click task → Task Detail page
            → Edit / Delete / Mark Complete
              → Completed → moves to History
```

### 6.3 Friends Flow
```
Friends Page
  → Search users by username
    → View mini profile
      → Send Friend Request
        → Recipient gets notification
          → Accept → both become friends
          → Decline → request dismissed

Friends List
  → See friend's avatar + status
  → Click friend → Friend Profile Page
    → See their public tasks, status, bio
    → Message button → opens DM chat
```

### 6.4 Room Flow
```
Dashboard / Rooms Tab
  → Create Room
    → name, activity type, description
    → invite friends
      → Room Page opens
        → Add tasks to room checklist
        → Members check off their own completion
        → Chat panel on the right
        → Progress bar shows % completion across members
```

### 6.5 Admin Flow
```
Admin Login (separate route /admin or admin role flag)
  → Admin Dashboard
    → Stats overview
    → User Management page
      → Search, view, block, delete users
    → Content monitoring (flagged messages/images)
```

---

## 7. Page-by-Page Layout

---

### 7.1 Landing Page (`/`)

**Purpose:** Convert visitors to sign up.

**Layout:**
```
┌─────────────────────────────────────────┐
│  NAVBAR: Logo | Features | Login | Sign Up │
├─────────────────────────────────────────┤
│                                         │
│         HERO SECTION                    │
│   "Your tasks. Your friends. Together." │
│   Subtitle text                         │
│   [Get Started Free] [See how it works] │
│                                         │
│   App screenshot / animated mockup      │
│                                         │
├─────────────────────────────────────────┤
│   FEATURES GRID (3 columns)             │
│   🗂 Manage Tasks | 👥 Connect Friends  │
│   🏠 Do it Together                     │
├─────────────────────────────────────────┤
│   HOW IT WORKS (numbered steps)         │
├─────────────────────────────────────────┤
│   SOCIAL PROOF / TESTIMONIALS           │
├─────────────────────────────────────────┤
│   CTA SECTION: Join thousands...        │
│   [Sign Up Free]                        │
├─────────────────────────────────────────┤
│   FOOTER                                │
└─────────────────────────────────────────┘
```

---

### 7.2 Login Page (`/login`)

**Layout:**
```
┌─────────────────────────────────────────┐
│  Left panel (60%): Illustration/brand   │
│  "Welcome back to Taskyy"               │
│  Floating friend status cards animation │
├─────────────────────────────────────────┤
│  Right panel (40%): Form                │
│                                         │
│  Logo                                   │
│  "Sign in to your account"              │
│                                         │
│  [Email input]                          │
│  [Password input]    [Forgot password?] │
│  [Sign In button — full width]          │
│                                         │
│  ─────── or continue with ───────       │
│  [Google] [GitHub]                      │
│                                         │
│  Don't have an account? Sign up         │
└─────────────────────────────────────────┘
```

---

### 7.3 Register Page (`/register`)

**Layout:** Same split as login
```
  Logo
  "Create your account"

  [Display Name input]
  [Username input]         ← @handle, shown to friends
  [Email input]
  [Password input]
  [Confirm Password]
  [Sign Up button]

  Already have an account? Login
```

---

### 7.4 Home Dashboard (`/dashboard`)

**Layout (Desktop — sidebar layout):**
```
┌──────────┬──────────────────────────────┬──────────────┐
│          │   TOP BAR: Search | Notif | Avatar          │
│ SIDEBAR  ├──────────────────────────────┬──────────────┤
│          │   MAIN CONTENT               │ RIGHT PANEL  │
│ Logo     │                              │              │
│          │  "Good morning, [name]! 👋"  │ FRIENDS      │
│ ● Home   │  Date + task summary chip    │ ONLINE NOW   │
│ ○ Today  │                              │              │
│ ○ Plans  │  ┌─────────────────────────┐ │ [Avatar] Ana │
│ ○ Friends│  │ TODAY'S TASKS           │ │  🎮 Gaming   │
│ ○ Rooms  │  │ Progress bar 4/7        │ │              │
│ ○ Chat   │  │ ─────────────────────── │ │ [Avatar] Joe │
│ ○ Profile│  │ ☐ Morning workout       │ │  📚 Reading  │
│          │  │ ☐ Read 20 pages         │ │              │
│ ─────    │  │ ☑ Drink water           │ │ [Avatar] May │
│ Admin    │  │ + Add task              │ │  ● Online    │
│          │  └─────────────────────────┘ │              │
│ Theme    │                              │ ACTIVE ROOMS │
│ toggle   │  ┌─────────────────────────┐ │              │
│          │  │ UPCOMING PLANS          │ │ 📖 Book Club │
│          │  │ Tomorrow · Next week    │ │ 3 members    │
│          │  └─────────────────────────┘ │              │
│          │                              │ 🎮 Gaming    │
│          │  ┌─────────────────────────┐ │ 2 members    │
│          │  │ DAILY PROGRESS          │ │              │
│          │  │ Streak 🔥 5 days        │ │              │
│          │  │ Completed: 12 this week │ │              │
│          │  └─────────────────────────┘ │              │
└──────────┴──────────────────────────────┴──────────────┘
```

**Mobile (bottom nav + stacked):**
```
┌─────────────────────────┐
│ Top: Hello [name] + bell│
├─────────────────────────┤
│ Friends status carousel │
│ ← [Ana 🎮] [Joe 📚] →  │
├─────────────────────────┤
│ Today's Tasks card      │
│ Progress: 4/7           │
│ Task list items         │
│ [+ New Task]            │
├─────────────────────────┤
│ Active Rooms            │
├─────────────────────────┤
│ Upcoming                │
├─────────────────────────┤
│ [🏠][✓][👥][💬][👤]   │
│ Bottom nav              │
└─────────────────────────┘
```

---

### 7.5 Today's Tasks Page (`/tasks/today`)

```
┌──────────┬──────────────────────────────────────────────┐
│ SIDEBAR  │  Today — Wednesday, May 21                   │
│          │  Progress: 3 of 8 completed    [+ New Task]  │
│          │                                              │
│          │  ┌─────────────── Progress Bar ─────────────┐│
│          │  │ ████░░░░░░░░░░░░░░  37%                  ││
│          │  └────────────────────────────────────────── ┘│
│          │                                              │
│          │  FILTERS: [All] [Pending] [Done] | Sort ▾   │
│          │                                              │
│          │  ┌───────────────────────────────────────┐  │
│          │  │ ☐  [🔴 HIGH] Morning workout           │  │
│          │  │    No description · 7:00 AM · Health   │  │
│          │  │                           [Edit][⋮]    │  │
│          │  ├───────────────────────────────────────┤  │
│          │  │ ☑  [🟡 MED] Read 20 pages              │  │
│          │  │    Completed at 9:14 AM · Personal     │  │
│          │  ├───────────────────────────────────────┤  │
│          │  │ ☐  [🟢 LOW] Call mom                   │  │
│          │  │    Reminder: 3:00 PM · Personal        │  │
│          │  └───────────────────────────────────────┘  │
└──────────┴──────────────────────────────────────────────┘
```

**Task Card States:**
- Pending: white card, checkbox empty, title normal weight
- Completed: slightly muted background, checkbox filled with primary color, title strikethrough
- Overdue: left border red, timestamp shows "overdue"
- Has image: small thumbnail on right

---

### 7.6 Future Plans Page (`/tasks/plans`)

```
View toggle: [List] [Board] [Calendar]

LIST VIEW:
─── This Week ───────────────────
  May 22 · Tomorrow
  [Task cards]

  May 24 · Friday
  [Task cards]

─── Next Week ───────────────────
  [Task cards grouped by date]

─── No Date ──────────────────────
  [Tasks with no assigned date]

CALENDAR VIEW:
  Standard month grid with task dots per day
  Click day → side panel shows tasks for that day
```

---

### 7.7 Friends Page (`/friends`)

```
┌─────────────┬────────────────────────────────────────────┐
│ SIDEBAR     │  Friends                                   │
│             │  [Search users...]          [+ Find Friends]│
│             ├─────────────────┬──────────────────────────┤
│             │  TABS:          │                          │
│             │  [My Friends 12]│[Requests 3][Suggestions] │
│             ├─────────────────┴──────────────────────────┤
│             │                                            │
│             │  ┌──────────────────────────────────────┐  │
│             │  │  [Avatar] Ana Smith              [Chat]│  │
│             │  │  @anasmith · 📚 Reading              │  │
│             │  │  "Study session today"               │  │
│             │  └──────────────────────────────────────┘  │
│             │                                            │
│             │  ┌──────────────────────────────────────┐  │
│             │  │  [Avatar] Joe K.              [Chat]  │  │
│             │  │  @joek · 🎮 Gaming                   │  │
│             │  │  ● Online now                        │  │
│             │  └──────────────────────────────────────┘  │
│             │                                            │
│             │  FRIEND REQUESTS TAB:                      │
│             │  ┌──────────────────────────────────────┐  │
│             │  │  [Avatar] Maya · @mayaX               │  │
│             │  │  "3 mutual friends"                   │  │
│             │  │  [Accept ✓] [Decline ✗]              │  │
│             │  └──────────────────────────────────────┘  │
└─────────────┴────────────────────────────────────────────┘
```

---

### 7.8 Friend Profile Page (`/users/[username]`)

```
┌─────────────────────────────────────────────────────────┐
│  COVER BANNER (gradient or uploaded photo)              │
│                                                         │
│  [Avatar XL]  Ana Smith                                 │
│               @anasmith                                 │
│               📚 Currently reading "Atomic Habits"      │
│                                                         │
│  [Message] [Unfriend / Add Friend]                      │
├─────────────────────────────────────────────────────────┤
│  Bio: "Student · Coffee lover · Always learning 🌱"    │
│  Joined: March 2024 · 24 friends · 142 tasks done      │
├─────────────────────────────────────────────────────────┤
│  TABS: [Public Tasks] [Activity] [Shared Rooms]         │
├─────────────────────────────────────────────────────────┤
│  Public task cards listed below                         │
└─────────────────────────────────────────────────────────┘
```

---

### 7.9 Profile Edit Page (`/profile/edit`)

```
┌────────────────────────────────────────────────────────┐
│  Edit Profile                                          │
│                                                        │
│  [Avatar 2XL with upload button overlay]               │
│                                                        │
│  Display Name  [________________]                      │
│  Username      [@_______________]                      │
│  Email         [________________]                      │
│  Bio           [________________] (max 160 chars)      │
│                                                        │
│  ─── Current Status ───                                │
│  [🎮 Playing][🍳 Cooking][🚶 Walking]                  │
│  [📚 Reading][💼 Working][📖 Studying]                 │
│  [✏️ Custom...]                                        │
│                                                        │
│  ─── Password ───                                      │
│  Current password  [________________]                  │
│  New password      [________________]                  │
│  Confirm new       [________________]                  │
│                                                        │
│  [Save Changes]         [Cancel]                       │
└────────────────────────────────────────────────────────┘
```

---

### 7.10 Status Update Modal

```
┌─────────────────────────────────┐
│  What are you up to?       [×]  │
│                                 │
│  ┌───────┐ ┌───────┐ ┌───────┐ │
│  │  🎮   │ │  🍳   │ │  🚶  │ │
│  │Gaming │ │Cooking│ │Walking│ │
│  └───────┘ └───────┘ └───────┘ │
│  ┌───────┐ ┌───────┐ ┌───────┐ │
│  │  📚   │ │  💼   │ │  📖  │ │
│  │Reading│ │Working│ │Studying│ │
│  └───────┘ └───────┘ └───────┘ │
│  ┌─────────────────────────────┐│
│  │ ✏️ Custom status...        ││
│  └─────────────────────────────┘│
│                                 │
│  [Clear Status]   [Set Status]  │
└─────────────────────────────────┘
```

---

### 7.11 Create Task Modal

```
┌──────────────────────────────────────────┐
│  New Task                           [×]  │
│                                          │
│  Title *                                 │
│  [Task title...                      ]   │
│                                          │
│  Description                             │
│  [Add more details...                ]   │
│                                          │
│  Date         Time                       │
│  [📅 Today ▾] [⏰ No time ▾]            │
│                                          │
│  Category             Priority           │
│  [🏷️ Select... ▾]    [🔴 High ▾]        │
│                                          │
│  Photo (optional)                        │
│  [  Drop image here or click to upload ] │
│  [thumbnail if uploaded]                 │
│                                          │
│  [🔒 Private] ←toggle→ [🌍 Public]      │
│                                          │
│  [Cancel]              [Create Task]     │
└──────────────────────────────────────────┘
```

---

### 7.12 Task Detail Page (`/tasks/[id]`)

```
┌────────────────────────────────────────────────────────┐
│  ← Back                          [Edit] [Delete] [⋮]  │
│                                                        │
│  ☐  Morning workout                                    │
│  🔴 HIGH · Health · Today · 7:00 AM                    │
│                                                        │
│  [Task photo if exists — wide banner]                  │
│                                                        │
│  Description:                                          │
│  30 min cardio + 10 min stretching. Don't skip this.  │
│                                                        │
│  Created: May 21, 2026 at 6:00 AM                     │
│  Status: Pending                                       │
│                                                        │
│  [Mark as Complete]                                    │
└────────────────────────────────────────────────────────┘
```

---

### 7.13 Shared Room Page (`/rooms/[id]`)

```
┌────────────────────────────────────────────────────────────┐
│  📖 Book Club Room                [Invite] [Leave] [⚙️]   │
│  4 members · Reading activity                              │
├──────────────────────────────┬─────────────────────────────┤
│  LEFT: TASKS PANEL           │  RIGHT: CHAT PANEL          │
│                              │                             │
│  Room Checklist              │  [Joe]: Let's start!        │
│  ─────────────────           │  [Ana]: Ready 📚            │
│  ☐ Read Chapter 1            │  [You]: On it!              │
│    Joe ✓  Ana ✗  You ✗      │                             │
│                              │  ─────────────────────────  │
│  ☐ Write summary             │  [Type a message...    ] ▶  │
│    Joe ✗  Ana ✗  You ✗      │                             │
│                              │                             │
│  ☑ Gather resources          │                             │
│    All members completed ✓   │                             │
│                              │                             │
│  [+ Add task]                │                             │
│                              │                             │
│  MEMBERS PROGRESS            │                             │
│  ──────────────              │                             │
│  Joe   ██░░  50%             │                             │
│  Ana   █░░░  25%             │                             │
│  You   █░░░  25%             │                             │
└──────────────────────────────┴─────────────────────────────┘
```

---

### 7.14 Chat Page (`/chat`)

```
┌────────┬────────────────────────────────────────────────┐
│        │  DM with Ana Smith · @anasmith                 │
│ CHAT   │  📚 Reading "Atomic Habits"                    │
│ LIST   ├────────────────────────────────────────────────┤
│        │                                                │
│ [Ana] ●│       Wednesday, May 21                        │
│ Hey..  │                                                │
│        │  [Ana]  Hey! Are you joining the book club? ●  │
│ [Joe]  │         10:32 AM                              │
│ Gaming │                                                │
│        │  [You]  Yes! Just added the tasks.            │
│ [Room] │         10:35 AM ✓✓                           │
│ Book.. │                                                │
│        │  [Ana]  Great! See you at 7 PM 😊              │
│        │         10:36 AM                              │
│        │                                                │
│        │  ────────────────────────────────────────────  │
│        │  📎  [Message Ana...                      ] ▶  │
└────────┴────────────────────────────────────────────────┘
```

---

### 7.15 Admin Dashboard (`/admin`)

```
┌──────────────┬─────────────────────────────────────────────┐
│ ADMIN SIDEBAR│  Admin Dashboard                            │
│              │  Welcome, Admin                             │
│ 📊 Dashboard │                                             │
│ 👥 Users     │  ┌───────┐ ┌───────┐ ┌───────┐ ┌────────┐  │
│ 🚩 Reports   │  │ 1,240 │ │  847  │ │ 8,431 │ │  6,201 │  │
│ ⚙️ Settings  │  │ Users │ │Active │ │ Tasks │ │  Done  │  │
│              │  └───────┘ └───────┘ └───────┘ └────────┘  │
│              │                                             │
│              │  ┌──────────────────────┐ ┌──────────────┐  │
│              │  │ New Users (30 days)  │ │ Room Stats   │  │
│              │  │ [Line chart]         │ │ 124 rooms    │  │
│              │  └──────────────────────┘ │ 512 members  │  │
│              │                           └──────────────┘  │
│              │                                             │
│              │  Recent Signups                             │
│              │  [Table: avatar, name, email, date, status] │
└──────────────┴─────────────────────────────────────────────┘
```

---

### 7.16 Admin Users Page (`/admin/users`)

```
┌──────────────┬────────────────────────────────────────────┐
│ ADMIN SIDEBAR│  User Management                           │
│              │  [Search users...]    [Filter ▾] [Export]  │
│              ├────────────────────────────────────────────┤
│              │  Avatar  Name / Email  Joined  Status  Actions│
│              │  ─────────────────────────────────────────  │
│              │  [🖼]   Ana Smith       May 1   ● Active [⋮]│
│              │         ana@email.com                      │
│              │  ─────────────────────────────────────────  │
│              │  [🖼]   Joe K.          Apr 20  ● Active [⋮]│
│              │         joe@email.com                      │
│              │  ─────────────────────────────────────────  │
│              │  [🖼]   Blocked User    Mar 5   🔴 Blocked [⋮]│
│              │                                            │
│              │  [⋮] Dropdown: View Profile / Block / Delete│
└──────────────┴────────────────────────────────────────────┘
```

---

## 8. Component Library

### Core Components

```
<Button>
  variants: primary | secondary | ghost | danger | success
  sizes: sm | md | lg
  states: default | loading | disabled
  props: leftIcon, rightIcon, fullWidth

<Input>
  variants: default | error | success
  props: label, placeholder, helperText, leftIcon, rightIcon, type

<Textarea>
  auto-resize, char counter

<Avatar>
  sizes: sm(32) | md(40) | lg(56) | xl(80) | 2xl(120)
  with StatusDot overlay
  fallback: initials

<StatusDot>
  colors mapped to StatusType enum
  pulse animation for active statuses

<StatusBadge>
  pill with icon + label
  animated on status change

<Card>
  variants: default | elevated | bordered | glass
  padding: sm | md | lg

<Modal>
  overlay, focus trap, close on escape/backdrop
  header + body + footer slots

<TaskCard>
  checkbox, title, priority badge, date, category tag
  completed state (strikethrough + muted)
  hover actions (edit, delete)
  image thumbnail if task has photo

<PriorityBadge>
  🔴 Urgent | 🔴 High | 🟡 Medium | 🟢 Low

<ProgressBar>
  animated fill, percentage label, color variants

<FriendCard>
  avatar + name + username + status + action buttons

<ChatBubble>
  mine vs theirs variant
  image support
  timestamp + read receipt

<RoomCard>
  activity icon, name, member count, progress

<NotificationBell>
  badge count, dropdown list of notifications

<SearchInput>
  with debounce, clear button, loading spinner

<DropdownMenu>
  trigger + items, keyboard navigation

<Toast / Snackbar>
  success | error | warning | info
  auto-dismiss, slide animation

<Skeleton>
  matches shape of loading content

<EmptyState>
  illustration + heading + description + CTA button

<ConfirmDialog>
  title + description + confirm/cancel buttons

<ImageUpload>
  drag-and-drop zone, preview, remove button
  progress indicator during upload

<ThemeToggle>
  animated sun/moon icon switch

<Sidebar>
  collapsible, mobile drawer variant
  NavItem with icon + label + active state
```

---

## 9. API Structure

### NestJS Modules

```
AuthModule      → POST /auth/register, /auth/login, /auth/refresh, /auth/logout
UsersModule     → GET/PATCH /users/me, GET /users/:username, GET /users/search
StatusModule    → PUT /users/me/status, DELETE /users/me/status
TasksModule     → CRUD /tasks, GET /tasks/today, /tasks/plans, /tasks/history
FriendsModule   → GET/POST/PATCH/DELETE /friends, /friends/requests
RoomsModule     → CRUD /rooms, POST /rooms/:id/invite, PATCH /rooms/:id/tasks
MessagesModule  → GET/POST /messages/dm/:userId, /messages/room/:roomId
NotificationsModule → GET /notifications, PATCH /notifications/:id/read
AdminModule     → GET /admin/stats, /admin/users, PATCH/DELETE /admin/users/:id
UploadModule    → POST /upload/image (Cloudinary)
```

### Auth Headers
All protected routes require:
```
Authorization: Bearer <access_token>
```

---

## 10. Real-time Events

### Socket.IO Namespaces

```
/ (default namespace)
  → authenticate with JWT on connect

EMIT (client → server):
  join:room          { roomId }
  leave:room         { roomId }
  send:message       { roomId?, recipientId?, content, type }
  status:update      { type, customText? }
  task:complete      { taskId, roomId? }
  typing:start       { chatId }
  typing:stop        { chatId }

ON (server → client):
  message:new        { message object }
  status:changed     { userId, status }
  friend:request     { from user object }
  friend:accepted    { by user object }
  notification:new   { notification object }
  room:task:updated  { taskId, completedBy[] }
  room:member:joined { roomId, user }
  typing:indicator   { userId, chatId, isTyping }
  user:online        { userId }
  user:offline       { userId }
```

---

## 11. Folder Structure

### Frontend (Next.js)
```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (app)/
│   │   ├── layout.tsx          ← sidebar + navbar wrapper
│   │   ├── dashboard/page.tsx
│   │   ├── tasks/
│   │   │   ├── today/page.tsx
│   │   │   ├── plans/page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── friends/page.tsx
│   │   ├── users/[username]/page.tsx
│   │   ├── rooms/
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── chat/
│   │   │   ├── page.tsx
│   │   │   └── [userId]/page.tsx
│   │   └── profile/edit/page.tsx
│   ├── admin/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── users/page.tsx
│   └── page.tsx                ← landing page
├── components/
│   ├── ui/                     ← base design system components
│   ├── tasks/                  ← TaskCard, CreateTaskModal, etc.
│   ├── friends/
│   ├── rooms/
│   ├── chat/
│   ├── layout/                 ← Sidebar, Navbar, etc.
│   └── admin/
├── hooks/
│   ├── useSocket.ts
│   ├── useAuth.ts
│   └── useTasks.ts
├── lib/
│   ├── api.ts                  ← axios instance + interceptors
│   ├── socket.ts               ← socket.io client setup
│   └── utils.ts
├── stores/
│   ├── authStore.ts            ← Zustand
│   ├── socketStore.ts
│   └── uiStore.ts
├── types/
│   └── index.ts
└── styles/
    └── globals.css
```

### Backend (NestJS)
```
src/
├── auth/
├── users/
├── status/
├── tasks/
├── friends/
├── rooms/
├── messages/
├── notifications/
├── admin/
├── upload/
├── common/
│   ├── guards/
│   ├── decorators/
│   ├── filters/
│   └── interceptors/
├── prisma/
│   └── prisma.service.ts
└── main.ts
```

---

## 12. Development Roadmap

### Sprint 1 — Foundation (Week 1-2)
- Project setup: Next.js + NestJS + PostgreSQL + Prisma
- Design system setup: Tailwind config, color tokens, base components
- Auth: register, login, JWT, refresh tokens
- User profile: view and edit
- Database migrations

### Sprint 2 — Core Tasks (Week 3-4)
- Task CRUD (today + future plans)
- Task categories, priority, dates
- Task completion + history
- Home dashboard (basic)
- Image upload to Cloudinary

### Sprint 3 — Social Layer (Week 5-6)
- Friends: search, request, accept/decline
- Friend profile page
- Status system (set and display)
- Real-time status via Socket.IO
- Notifications (friend requests)

### Sprint 4 — Rooms & Chat (Week 7-8)
- Direct chat (text)
- Room creation and invites
- Room task checklist with per-member tracking
- Room chat
- Real-time via Socket.IO for chat + room updates

### Sprint 5 — Admin & Polish (Week 9-10)
- Admin dashboard with stats
- Admin user management (view, block, delete)
- Light/dark mode polish
- Mobile responsive fixes
- Performance optimization
- Error handling, empty states, loading states

### Sprint 6 — Launch Prep (Week 11-12)
- End-to-end testing
- Security audit (auth, rate limiting, input validation)
- CI/CD pipeline (GitHub Actions → Vercel + Railway)
- Environment configuration
- Seed data and demo accounts
- Final UI polish and animations

---

## Quick Reference

**Primary color:** `#6366F1`
**Font:** Inter
**Border radius:** 14px (cards), 10px (inputs)
**Animation:** Framer Motion, 200-300ms ease
**Icons:** Lucide React
**Mobile breakpoints:** sm 640, md 768, lg 1024, xl 1280

**Core pages order to build:**
1. Auth (login/register)
2. Dashboard
3. Tasks (today + plans)
4. Friends
5. Profile
6. Rooms + Chat
7. Admin

---

*Taskyy Design Plan — Ready for frontend development.*
