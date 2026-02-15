

# Portfolio Operating System — Hayredin Mohammed

## Overview
A production-grade, dark-mode portfolio website with a "Neural Glassmorphism" design system, Supabase backend for project management and contact messages, and a protected admin dashboard.

---

## Phase 1: Design System & Layout Foundation

### Visual Design System ("Neural Glassmorphism")
- Dark-mode only theme with `#0a0a0a` background
- Custom CSS variables for Electric Cyan (`#00f3ff`) and Neon Violet (`#bc13fe`) accents
- Google Fonts: **Space Grotesk** (headings) + **Inter** (body)
- Glassmorphic card component: `backdrop-blur-[24px]`, `bg-white/5`, `border-white/10`, `rounded-2xl`
- Subtle tilt effect on card hover with neon glow border
- Animated particle mesh network background (canvas-based nodes + connecting lines)

### Global Layout
- Sticky glassmorphic navbar with "HM" circuit-style monogram logo
- Navigation links: Work, Skills, Experience, Contact
- Smooth scroll navigation between sections
- Mobile-responsive hamburger menu
- Hidden admin login icon (lock icon in footer)

---

## Phase 2: Frontend Sections

### Hero Section
- Bold heading: "Architecting Intelligence."
- Subtitle introducing Hayredin as an AI/ML Engineer
- Animated glowing sphere/abstract shape on the right side
- Two CTAs: "View Work" (gradient button) and "Download CV" (outline button)
- Framer Motion entrance animations

### Projects Section (Bento Grid)
- Bento-style grid layout with varying column spans
- Hardcoded fallback seed projects (Twitter Sentiment Analyzer, Sales Data Analysis, Student Attendance System, Banking App)
- Fetches from Supabase `projects` table when available; falls back to seed data if empty
- Click-to-open modal with full project details, links to GitHub/demo
- Tags displayed as styled badges
- Lazy-loaded project images

### Skills Section
- Visual display of technical skills: Python, NLP, Scikit-learn, TensorFlow, Java, MySQL, Pandas, etc.
- Categorized by domain (AI/ML, Data Science, Software Engineering)
- Animated skill indicators

### Experience & Education Section
- Timeline or card layout
- Addis Ababa University — BS Computer Science (Expected 2027, Top 10%)
- Kibur College Scholarship
- Certifications: DeepLearning.AI, Udacity (Android Dev, Data Analysis)

### Contact Section
- Form with Name, Email, Message fields
- React Hook Form + Zod validation (valid email, non-empty fields, length limits)
- Submits to Supabase `messages` table
- Sonner toast notification on success
- Contact info displayed: email and phone number

---

## Phase 3: Supabase Backend

### Database Tables
- **`projects`** — id, title, description, tags (text array), image_url, github_url, demo_url, featured, created_at
- **`profile`** — id, headline, bio, resume_url
- **`messages`** — id, name, email, content, created_at

### Row-Level Security (RLS)
- Public SELECT on `projects` and `profile` for all visitors
- Public INSERT on `messages` (for contact form submissions)
- Full CRUD on all tables restricted to authenticated admin users

### Storage
- `project-images` bucket with public read access
- RLS policy: authenticated users can upload/delete; public can read

---

## Phase 4: Admin Dashboard

### Login Page (`/login`)
- Simple email/password auth form using Supabase Auth
- Redirect to `/admin` on success

### Admin Dashboard (`/admin`) — Protected Route
- Redirects to `/login` if not authenticated
- **Projects Management:** List all projects, add/edit/delete with form
- **Image Upload:** Upload project images to `project-images` storage bucket
- **Messages Inbox:** View all contact form submissions with timestamps
- **Profile Editor:** Update headline, bio, resume URL

---

## Phase 5: Polish & Quality

### SEO
- Meta tags (title, description, Open Graph) for the portfolio
- Semantic HTML structure

### Performance
- Lazy-loaded images
- Framer Motion for smooth section entry animations
- Code-split admin routes

### Responsiveness
- Mobile-first design across all sections
- Responsive bento grid (stacks on mobile)
- Touch-friendly interactions

