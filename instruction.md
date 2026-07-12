Gladiator Project – Project 1 Upgrade
Gladiator
Upgrade your existing project into a feature-rich, secure, scalable, and production-ready
web application.
Applicable to:
Event, E-commerce, Travel, Social, Real Estate, Food, AI, SaaS, or similar platforms.
No dummy, placeholder, or lorem ipsum content is allowed.
1. Global UI & Design Rules
Design System Rules
● Maximum 3 primary colors (+ optional neutral color)
● Must support Light Mode and Dark Mode
● Proper contrast ratio in dark mode
● Consistent spacing system (4px or 8px grid)
● Unified border-radius across all components (e.g., rounded-xl)
● Consistent typography scale (headings, subheadings, body text)
● Reusable UI components:
○ Button
○ Input
○ Card
○ Badge
○ Modal
○ Table
○ Dropdown
Responsiveness
The application must be fully responsive for:
● Mobile
● Tablet
● Desktop
Requirements:
● No layout breaking
● No horizontal overflow
● Proper alignment and spacing
● Responsive grid system
● Navigation must work properly on small screens (hamburger menu)
Forms Standard
All forms must include:
● Client-side validation (required fields, format validation)
● Server-side validation
● Error messages
● Success messages
● Loading state (spinner or disabled button)
● Proper label usage
● Accessible inputs (label connected with input)
Forms required:
● Login
● Registration
● Contact
● Create item
● Edit item
● Profile update
2. Home / Landing Page
Navbar
● Full-width layout
● Sticky or fixed position
● Minimum 4 routes (logged out)
● Minimum 6 routes (logged in)
● At least 1 advanced dropdown (Profile menu or Mega menu)
● Fully responsive
Example (Logged Out):
● Home
● Explore
● About
● Login
Example (Logged In):
● Home
● Explore
● Dashboard
● Blog
● Profile (Dropdown)
● Logout
Hero Section
● Height limited to 60–70% of viewport
● Clear heading and subheading
● Strong call-to-action button
● At least one interactive element:
○ Slider
○ Image carousel
○ Animation
○ Dynamic statistics
● Clear visual hierarchy
Minimum 8 Meaningful Sections
Sections must be relevant to the project type. Examples:
● Features
● Categories
● Services
● Statistics (dynamic data from backend)
● Testimonials
● Featured Items
● Blog Preview
● FAQ
● Newsletter
● Partners
● How It Works
● Call to Action
Sections must not be decorative only. They must reflect real data or real project
purpose.
Footer
● Fully functional links
● Contact information
● Social links
● Copyright notice
● No broken links
3. Core Listing / Card Section
Each Card Must Include:
● Image
● Title
● Short description
● Meta information (price, date, rating, location, etc.)
● “View Details” button
Card Rules:
● Same height and width
● Same border radius
● Same layout structure
● Desktop view: 4 cards per row
● Responsive grid layout
● Skeleton loader while loading
● Data must come from backend (no hardcoded data)
4. Details Page
Must be publicly accessible.
Media Section
● Multiple images
● Image gallery or slider
Content Sections
● Description / Overview
● Key Specifications / Information
● Reviews / Ratings (if applicable)
● Related items section (if applicable)
5. Listing / Explore Page
Must include:
● Search bar
● Minimum 2 filtering fields (e.g., category, price, rating, location, date)
● Sorting options
● Pagination
● Fully functional backend filtering
6. Authentication System (Simple Version)
Required Features:
● Login page
● Registration page
● Password validation
● Proper error handling
● JWT-based authentication
● Protected routes
● Role-based middleware
Roles:
● User
● Admin
Additional Requirements:
● Demo login button (auto-fill credentials)
● Password hashing using bcrypt
● Token expiration handling
Social Login (Optional Bonus):
● Google login
7. Role-Based Dashboard
Required Roles:
● User
● Admin
User Sidebar (Minimum 4 Menu Items)
Example:
● Overview
● My Items
● Profile
● Settings
Admin Sidebar (Minimum 6 Menu Items)
Example:
● Overview
● Manage Users
● Manage Items
● Reports
● Categories
● Settings
Dashboard Must Include:
Overview Cards (Dynamic Data)
Examples:
● Total items
● Total users
● Revenue (if applicable)
● Orders / Activity
Data must be dynamic (fetched from backend).
Charts
● Bar chart
● Line chart
● Pie chart
Must use real dynamic data.
Can use:
● Chart.js
● Recharts
Data Tables Must include:
● Pagination
● Filtering
● Sorting
● Action buttons (Edit, Delete, View)
Profile Page
● Editable user information
● Profile image upload
● Password update option
8. Additional Pages (Minimum 3 Required)
Examples:
● About
● Contact
● Blog
● Help / Support
● Privacy Policy
● Terms & Conditions
Contact Page Requirements:
● Working form
● Data stored in database
● Validation and success message
9. Backend Requirements
● Express
● MongoDB
server/
index.js
routes/
controllers/
middleware/
config/
Architecture:
● Basic modular structure
● API route separation
● Centralized error handling
● Proper status code usage
Database:
● Proper schema planning
● Basic relationships if needed
Security:
● Password hashing (bcrypt)
● Input validation
● CORS configuration
● Role-based access control
10. Performance Optimization
● Image optimization
● Lazy loading
● Code splitting (React or Next.js)
● Avoid unnecessary re-renders
● Production-ready build
11. Code Quality Rules
● Clean and organized folder structure
● Reusable components
● Custom hooks (if React-based)
● Proper environment variable usage
● No console logs in production
● Meaningful commit messages
12. Deployment Requirements
Frontend deployed (e.g., Vercel or Netlify)
Backend deployed (e.g., Render, Railway, or VPS)
Requirements:
● Proper production environment variables
● Working live link
● No localhost API references in production
13. Final Submission Requirements
Must provide:
● Live Website URL
● GitHub Repository Link
● Frontend source code
● Backend source code
● Demo Credentials
User:
Email:
Password:
Admin:
Email:
Password:
● Short project documentation (README)




# SkillBridge – Implementation Roadmap & Guidelines

> Based on `instruction.md` analysis. Your stack: **Next.js** (frontend) · **Express + Prisma + PostgreSQL** (backend).
> Goal: upgrade to a feature-rich, secure, production-ready application — **without drastic changes** to the existing codebase.

---

## 🗺️ What Already Exists

| Area | Status |
|---|---|
| Auth (better-auth, JWT sessions) | ✅ Done |
| Role system (STUDENT / TUTOR / ADMIN) | ✅ Done |
| Prisma schema (User, Tutor, Booking, Payment, Review, Category) | ✅ Done |
| Home page with Hero + Stats + FeaturedTutors + HowItWorks + CTA | ✅ Done |
| `/tutors` listing page | ✅ Exists |
| `/tutors/[id]` detail page | ✅ Exists |
| `/login`, `/register` pages | ✅ Exists |
| Dashboard (student, tutor, admin) route groups | ✅ Exists |
| Payment module (SSLCommerz) | ✅ Exists |
| Review module | ✅ Exists |
| Splash/skeleton loader | ✅ Done (just added) |
| Navbar (responsive, sticky) | ✅ Done |
| Footer | ✅ Exists |

---

## ⚠️ Key Constraints

> [!IMPORTANT]
> - Use **Prisma + PostgreSQL** for all new backend data — do NOT introduce MongoDB.
> - Do **NOT** rewrite existing pages; extend/polish them.
> - The instruction mentions Express + MongoDB as a suggested stack, but you're already using **Express + Prisma + PostgreSQL** — this is a **better** choice and fully acceptable.
> - All statistics on the home page must come from **real backend API calls**.

---

## 📋 FRONTEND TASKS

---

### 🟢 EASY (Quick wins — 1–2 hours each)

#### FE-E1 · Dark Mode Toggle
- Add a theme toggle button in the Navbar
- Use `next-themes` (already compatible with your `dark` class variant in `globals.css`)
- Store preference in `localStorage`
- **Files:** [`navbar.tsx`](file:///c:/Level2B6/assignment4/skillbridge-client/components/navbar.tsx), [`layout.tsx`](file:///c:/Level2B6/assignment4/skillbridge-client/src/app/layout.tsx)

#### FE-E2 · Navbar: Add Missing Routes
- **Logged out:** Home, Tutors (Explore), About, Login — need to verify all 4 exist
- **Logged in:** Home, Tutors, Dashboard, Blog, Profile (Dropdown), Logout — add Blog link, ensure profile dropdown is styled as an "advanced dropdown"
- **Files:** [`nav-menu.tsx`](file:///c:/Level2B6/assignment4/skillbridge-client/components/nav-menu.tsx), [`user-menu.tsx`](file:///c:/Level2B6/assignment4/skillbridge-client/components/user-menu.tsx)

#### FE-E3 · Demo Login Button on Login Page
- Add two "Demo Login" buttons on `/login` — one for User, one for Admin
- Auto-fill email + password fields and submit
- **File:** `/src/app/(commonLayout)/login/page.tsx`

#### FE-E4 · About Page
- Create `/about` page with real SkillBridge content (mission, team, stats)
- **File:** `/src/app/(commonLayout)/about/page.tsx` — already exists, needs content

#### FE-E5 · Contact Page Form Polish
- Ensure the contact form stores data to DB via API call
- Add proper success/error toast messages
- **File:** `/src/app/(commonLayout)/contact/page.tsx`

#### FE-E6 · Footer Link Audit
- Ensure all footer links are real routes (no `#` or broken links)
- Add social media links (LinkedIn, GitHub, Twitter)
- **File:** [`footer.tsx`](file:///c:/Level2B6/assignment4/skillbridge-client/components/footer.tsx)

#### FE-E7 · Card Skeleton Loaders on Tutors Page
- Add shimmer skeleton cards while `/tutors` data is loading (instruction §3 requirement)
- Use same pattern as the global splash loader already built
- **File:** `/src/app/(commonLayout)/tutors/page.tsx`

---

### 🟡 MEDIUM (2–4 hours each)

#### FE-M1 · Home Page: Replace Hardcoded Stats with Live Data
- Stats section (`500+`, `12,000+`, `4.8 ★`) must come from backend
- Create a `/api/stats` endpoint and `fetch` on the server component
- **File:** [`page.tsx`](file:///c:/Level2B6/assignment4/skillbridge-client/src/app/(commonLayout)/page.tsx)

#### FE-M2 · Home Page: Add 5 More Sections (need 8 total)
Currently have: Hero, Stats, FeaturedTutors, HowItWorks, CTA = **5 sections**.
Need 3 more:
- **Categories section** — grid of skill categories from DB (Language, Math, Music, etc.)
- **Testimonials section** — top-rated reviews from DB
- **FAQ section** — static or DB-backed accordion
- **File:** [`page.tsx`](file:///c:/Level2B6/assignment4/skillbridge-client/src/app/(commonLayout)/page.tsx)

#### FE-M3 · Tutors Explore Page: Search + Filter + Sort + Pagination
- Add search bar (by name/subject)
- Filter by: category, price range, rating
- Sort by: price (asc/desc), rating
- Pagination (page-based or infinite scroll)
- All filters must hit backend API with query params
- **File:** `/src/app/(commonLayout)/tutors/page.tsx`

#### FE-M4 · Tutor Detail Page Improvements
- Add image gallery/slider (multiple images or avatar + banner)
- Show reviews section with star ratings
- Show related tutors (same subject)
- **File:** `/src/app/(commonLayout)/tutors/[id]/page.tsx`

#### FE-M5 · Profile Update Page
- Editable form: name, bio, avatar upload
- Password change section (current → new → confirm)
- Avatar upload to backend (store URL in DB)
- **Files:** `/src/app/(dashboardLayout)/dashboard/profile/`, `/src/app/(dashboardLayout)/tutor/profile/`

#### FE-M6 · Admin Dashboard: Charts
- Install `recharts`
- Add Bar chart (bookings per month), Line chart (revenue over time), Pie chart (users by role)
- Data fetched from backend aggregate endpoints
- **File:** `/src/app/(dashboardLayout)/admin/page.tsx`

#### FE-M7 · Admin: Manage Users Table
- Table with pagination, sort, filter, action buttons (Block/Unblock, Delete, View)
- **File:** `/src/app/(dashboardLayout)/admin/users/page.tsx`

#### FE-M8 · Admin: Manage Tutors Table
- Approve/reject tutor profiles, view details, delete
- **File:** `/src/app/(dashboardLayout)/admin/` — new `tutors/` route

#### FE-M9 · Student Dashboard: Overview Cards
- Total bookings, upcoming sessions, total spent, avg rating received
- Real data from API
- **File:** `/src/app/(dashboardLayout)/dashboard/page.tsx`

#### FE-M10 · Blog Page (Stub)
- Create `/blog` route with 3–5 static or DB-backed articles
- Required by navbar (logged in) — instruction §2
- **File:** `/src/app/(commonLayout)/blog/page.tsx` — new file

---

### 🔴 CHALLENGING (4–8+ hours each)

#### FE-C1 · Dark Mode — Full System Consistency
- Ensure ALL pages (dashboard, tutor, admin) respect dark/light mode
- Audit all hardcoded `bg-slate-950` / `text-white` — replace with CSS variables or Tailwind `dark:` variants
- **Scope:** entire `src/app/` and `components/`

#### FE-C2 · Reusable Design System Components
- Extract & document reusable components: `Button`, `Input`, `Card`, `Badge`, `Modal`, `Table`, `Dropdown`
- Ensure shadcn/ui components are customized to match design tokens (max 3 primary colors)
- **Files:** `components/ui/`

#### FE-C3 · Real-Time Booking Flow with Payment
- Booking form with date/time picker against tutor availability slots
- Integrate existing SSLCommerz payment flow end-to-end
- Handle payment callback and booking status update
- **Files:** `/src/app/(commonLayout)/payment/`, tutor detail page

#### FE-C4 · Review & Rating System UI
- After booking is COMPLETED, allow student to submit a review
- Star rating widget + comment form
- Display avg rating on tutor cards + detail page
- **Files:** `/src/app/(dashboardLayout)/dashboard/bookings/`, tutor detail page

#### FE-C5 · Tutor Dashboard: Manage Availability
- Weekly schedule grid (Day × TimeSlot)
- Add/remove availability slots
- **File:** `/src/app/(dashboardLayout)/tutor/availability/`

#### FE-C6 · Performance Optimization
- Convert all data-fetching pages to **React Server Components** (remove unnecessary `'use client'`)
- Add `next/image` with proper `width`/`height` for all images
- Add `loading="lazy"` and `Suspense` boundaries with skeleton fallbacks
- Code split heavy components (charts, gallery)

---

## 📋 BACKEND TASKS

---

### 🟢 EASY (Quick wins — 1–2 hours each)

#### BE-E1 · Stats Endpoint
- `GET /api/stats` → returns `{ totalTutors, totalStudents, totalBookings, avgRating }`
- Use Prisma `count()` and `aggregate()` calls
- **File:** new `src/modules/Stats/stats.controller.ts` + route

#### BE-E2 · Contact Form Endpoint
- `POST /api/contact` → save message to DB
- Add `Contact` model to Prisma schema: `{ id, name, email, subject, message, createdAt }`
- **Files:** `schema.prisma`, new `Contact` module

#### BE-E3 · Categories CRUD
- `GET /api/categories` — already exists, ensure it's public
- `POST /api/categories` — admin only (already guarded?)
- `DELETE /api/categories/:id` — admin only
- **File:** `src/modules/Category/`

#### BE-E4 · Centralized Error Handling Audit
- Ensure all routes return proper HTTP status codes (400, 401, 403, 404, 422, 500)
- All errors go through the central error handler in `src/errors/`
- No unhandled promise rejections

#### BE-E5 · Environment Variable Validation
- Add `zod` schema to validate all required env vars at startup (fail fast if missing)
- **File:** `src/config/env.ts`

---

### 🟡 MEDIUM (2–4 hours each)

#### BE-M1 · Tutors List API: Search + Filter + Sort + Pagination
- `GET /api/tutors?search=&category=&minPrice=&maxPrice=&minRating=&sort=&page=&limit=`
- Use Prisma `where`, `orderBy`, `skip`, `take`
- Return `{ data: Tutor[], total, page, totalPages }`
- **File:** `src/modules/tutor/tutor.controller.ts`

#### BE-M2 · Avatar / Image Upload
- Add `multer` + upload to local disk or cloud (Cloudinary/UploadThing)
- `POST /api/users/avatar` → update `image` field in User table
- **Files:** new `src/middlewares/upload.ts`, `src/modules/User/`

#### BE-M3 · Dashboard Stats for Admin
- `GET /api/admin/stats` → bookings per month (last 12), revenue per month, users by role
- Use Prisma `groupBy()` with `_count` and `_sum`
- **File:** new `src/modules/Admin/admin.controller.ts`

#### BE-M4 · Blog Model & CRUD (Optional but recommended)
- Add `Blog` model: `{ id, title, slug, content, authorId, coverImage, createdAt }`
- `GET /api/blog` (public), `POST /api/blog` (admin), `GET /api/blog/:slug` (public)
- **Files:** `schema.prisma`, new `Blog` module

#### BE-M5 · Password Change Endpoint
- `PATCH /api/users/password` — verify current password, hash new password with bcrypt
- **File:** `src/modules/User/user.controller.ts`

#### BE-M6 · Related Tutors Endpoint
- `GET /api/tutors/:id/related` → find tutors with overlapping subjects/categories, exclude self
- **File:** `src/modules/tutor/tutor.controller.ts`

#### BE-M7 · Tutor Profile Approval Flow
- Add `isApproved Boolean @default(false)` field to `TutorProfiles`
- `PATCH /api/admin/tutors/:id/approve` — admin only
- Only approved tutors show up in public listing
- **Files:** `schema.prisma`, admin routes

---

### 🔴 CHALLENGING (4–8+ hours each)

#### BE-C1 · Review System: Enforce One Review per Completed Booking
- `POST /api/reviews` — only allowed if booking status is `COMPLETED` and no review exists yet
- Update `TutorProfiles.rating` as a computed average on every new review
- Handle the `@@unique([studentId, tutorId])` constraint gracefully
- **File:** `src/modules/Review/`

#### BE-C2 · Payment Flow — Full End-to-End
- Ensure SSLCommerz IPN callback correctly updates `Payment.status` and `Booking.status`
- Handle failure/cancellation redirects
- Prevent double-payment on the same booking
- **File:** `src/modules/Payment/`

#### BE-C3 · Role-Based Middleware — Full Audit
- Ensure every protected endpoint has the correct role guard (`STUDENT`, `TUTOR`, `ADMIN`)
- Add a `TUTOR`-only guard for tutor profile/availability routes
- **File:** `src/middlewares/auth.ts`

#### BE-C4 · Token Expiration & Refresh Handling
- Ensure expired sessions return `401` (not 500 or silent failure)
- Frontend should catch `401` globally and redirect to `/login`
- **Files:** `src/middlewares/auth.ts`, frontend `lib/auth-client.ts`

#### BE-C5 · Production Readiness
- Remove all `console.log` statements from production builds
- Add `helmet` for security headers
- Add `express-rate-limit` on auth and contact endpoints
- Ensure `CORS` only allows production frontend URL
- Add `compression` middleware
- **File:** `src/app.ts`

---

## 🗓️ Suggested Implementation Order

```
Week 1 — Foundation & Quick Wins
  BE-E1 (Stats) → FE-M1 (Live stats on home)
  BE-E2 (Contact) → FE-E5 (Contact form)
  FE-E2 (Navbar routes) → FE-E3 (Demo login)
  FE-M2 (3 new home sections: Categories, Testimonials, FAQ)
  FE-E7 (Tutor card skeletons)

Week 2 — Core Features
  BE-M1 (Tutors filter API) → FE-M3 (Explore page filters)
  FE-M4 (Tutor detail improvements)
  FE-M5 + BE-M5 (Profile update + password change)
  FE-E1 (Dark mode toggle)

Week 3 — Dashboards
  BE-M3 (Admin stats) → FE-M6 (Charts)
  FE-M7 (Manage users table)
  FE-M9 (Student overview cards)
  FE-C5 (Tutor availability manager)

Week 4 — Polish & Deploy
  BE-C1 (Review system) → FE-C4 (Review UI)
  BE-C2 (Payment audit)
  FE-C6 (Performance optimization)
  BE-C5 (Production hardening)
  FE-E6 (Footer audit)
  Deployment (Vercel + Railway)
```

---

## 🗃️ Prisma Schema Additions Needed

```prisma
// Add to schema.prisma

model Contact {
  id        String   @id @default(uuid())
  name      String
  email     String
  subject   String
  message   String   @db.Text
  createdAt DateTime @default(now())
  @@map("contact")
}

model Blog {
  id          String   @id @default(uuid())
  title       String
  slug        String   @unique
  content     String   @db.Text
  coverImage  String?
  authorId    String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  @@map("blog")
}

// Add to TutorProfiles model:
// isApproved  Boolean  @default(false)
// profileImage String?
// experience   Int?
// languages    String[]
```

---

## 🎨 Design System Rules Summary

| Rule | Target |
|---|---|
| Primary colors | Indigo (#6366f1), Emerald (#10b981), Pink (#ec4899) |
| Neutral | Slate scale |
| Border radius | `rounded-xl` (consistent) |
| Typography | Geist Sans (already configured) |
| Spacing | 4px/8px grid (Tailwind default) |
| Responsive breakpoints | sm (640), md (768), lg (1024), xl (1280) |
| Dark mode | Class-based `.dark` (already in globals.css) |

---

## 📦 New Packages Needed

### Frontend
```bash
npm install recharts           # Charts (admin dashboard)
npm install next-themes        # Dark mode toggle
npm install @uploadthing/react # OR use backend multer for image upload
```

### Backend
```bash
npm install helmet             # Security headers
npm install express-rate-limit # Rate limiting
npm install compression        # Response compression
npm install multer             # File upload (if not using cloud)
```

---

> [!TIP]
> Start with **BE-E1** (Stats API) + **FE-M1** (Live home stats) as your very first task — it gives you the pattern for all future API integration work and immediately makes the homepage production-ready.



remaining for night 
🟢 Easy Tasks (Quick Wins)
[FE-E5 / BE-E2] Contact Page & API Integration: The frontend contact/page.tsx has a beautiful UI, but its handleSubmit is currently a mock that just shows a success toast.
Remaining: Create the Contact model in Prisma, build the POST /api/contact backend endpoint, and connect the frontend form to it.
[BE-E5] Environment Variable Validation:
Remaining: Add zod schema validation in the backend src/config/index.ts to fail fast if required environment variables are missing at startup.
🟡 Medium Tasks
[FE-M5 / BE-M2] Avatar / Image Upload (True Upload): While we successfully added the ability to save an image URL to the profile today, the instruction specifies a true file upload requirement.
Remaining: Add multer (or Cloudinary/UploadThing) on the backend to accept physical image files (POST /api/users/avatar) instead of just string URLs.
[FE-M4 (Partial)] Tutor Detail Page:
Remaining: The instruction mentions adding an image gallery/slider or a banner, and integrating the related tutors section (the backend API BE-M6 for related tutors exists, but needs to be hooked up on the frontend).
🔴 Challenging Tasks (Core Business Logic)
[FE-C3 / BE-C2] End-to-End Booking & Payment Flow:
Remaining: Ensure the booking form uses a date/time picker that respects the tutor's actual availability slots. The SSLCommerz IPN callback on the backend needs an audit to guarantee it robustly updates both Payment.status and Booking.status without allowing double payments.
[FE-C4 / BE-C1] Review & Rating System:
Remaining: The backend needs logic in POST /api/reviews to enforce that a student can only leave a review if their booking status is COMPLETED, and ensure they can only leave one review per booking. The frontend needs a UI to submit this star rating and comment after a session.
[FE-C5] Tutor Dashboard - Manage Availability:
Remaining: The /tutor/availability/ route needs a weekly schedule grid (Day × TimeSlot) UI so tutors can easily add/remove the times they are available to teach.
[FE-C1] Dark Mode Consistency:
Remaining: While you have a theme toggle, many components (like the new carousel and about page) currently use hardcoded dark colors (e.g., bg-slate-950, text-white). These need a pass to use CSS variables or Tailwind's dark: modifier so they look good in Light Mode.
[FE-C6 / BE-C5] Production Readiness & Optimization:
Remaining:
Frontend: Add next/image tags, lazy loading, and remove unnecessary 'use client' directives to leverage React Server Components.
Backend: Install and configure helmet (security headers), express-rate-limit (brute-force protection), and compression middleware in app.ts