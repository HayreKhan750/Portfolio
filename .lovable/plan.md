

# Portfolio Operating System v2 — Full CMS Architecture

## Overview
Transform the current partially-hardcoded portfolio into a fully dynamic "Headless CMS" where all public content is fetched from the database and managed through an enhanced admin dashboard. The existing Neural Glassmorphism styling remains untouched.

---

## Phase 1: Database Schema Changes

### New Tables

**`experience`** — Education, work, awards
- `id` (uuid, PK, default gen_random_uuid())
- `title` (text, not null)
- `organization` (text, not null)
- `date_range` (text, not null)
- `description` (text, default '')
- `type` (text, not null — 'education', 'work', 'award')
- `sort_order` (int, default 0)
- `created_at` (timestamptz, default now())

**`certificates`** — Certs with proof uploads
- `id` (uuid, PK)
- `name` (text, not null)
- `issuer` (text, not null)
- `date` (text)
- `proof_url` (text)
- `created_at` (timestamptz, default now())

**`contact_methods`** — Social/contact links
- `id` (uuid, PK)
- `platform` (text, not null) — e.g. "Email", "Phone", "GitHub", "LinkedIn"
- `url` (text, not null)
- `icon` (text) — Lucide icon name
- `sort_order` (int, default 0)

**`project_media`** — Multi-media per project
- `id` (uuid, PK)
- `project_id` (uuid, FK to projects, on delete cascade)
- `type` (text, not null — 'image', 'video')
- `url` (text, not null)
- `caption` (text)
- `sort_order` (int, default 0)

### Modify Existing Tables

**`profile`** — Add `avatar_url` (text, nullable)

**`projects`** — Rename `demo_url` to `live_url`, drop `image_url` (replaced by `project_media`)

### RLS Policies (all new tables)
- Public: SELECT only (using expression `true`)
- Admin: INSERT, UPDATE, DELETE (using `has_role(auth.uid(), 'admin')`)

### New Storage Buckets
- `avatars` (public read)
- `cv-docs` (public read)
- `project-media` (public read)
- `cert-proofs` (public read)

Each bucket: authenticated users can upload/delete, public can read.

---

## Phase 2: Public Site — Fully Dynamic

**Rule: Zero hardcoded content. Every section fetches from the database.**

### Navbar
- Fetch `profile` for avatar bubble display
- "Download CV" button uses `profile.resume_url`

### Hero Section
- Fetch `profile.headline` and `profile.bio`
- Display `profile.avatar_url` if present
- "Download CV" links to `profile.resume_url`
- Remove hardcoded "Architecting Intelligence" text

### Projects Section
- Keep existing bento grid styling
- Remove seed fallback data — show empty state or skeleton if no projects
- Thumbnail = first media from `project_media` (sort_order = lowest)
- Click opens modal with media carousel (all `project_media` for that project)
- Use `live_url` instead of `demo_url`

### Experience/Timeline Section
- Fetch from `experience` table ordered by `sort_order`
- Group by `type` (education, work, award) with appropriate icons
- Remove all hardcoded items

### Certificates Section (NEW)
- New component replacing the Skills section
- Grid of certificate cards from `certificates` table
- Each card shows name, issuer, date, and "View Proof" button linking to `proof_url`

### Contact Section
- Fetch `contact_methods` to display contact info dynamically
- Remove hardcoded email/phone
- Keep the existing contact form (inserts into `messages`)

### Footer
- Keep the hidden admin lock icon as-is

---

## Phase 3: Admin Dashboard — Full CMS

Replace the current simple two-tab admin with a comprehensive sidebar-based dashboard.

### Layout
- Left sidebar with navigation tabs (using existing glassmorphic styling)
- Main content area on the right
- Tabs: Profile, Experience, Projects, Certificates, Contacts, Messages

### Profile Tab
- Edit headline, bio
- Upload avatar (to `avatars` bucket)
- Upload CV (to `cv-docs` bucket)
- Save updates to `profile` table

### Experience Tab
- List all experience entries grouped by type
- Add/Edit/Delete with inline form
- Fields: title, organization, date_range, description, type (dropdown), sort_order

### Projects Tab
- List all projects
- Add/Edit/Delete form with: title, description, tags, live_url, github_url, featured
- Multi-file upload for project media (to `project-media` bucket)
- Set sort_order on media items
- Media preview with delete capability

### Certificates Tab
- List all certificates
- Add/Edit/Delete form: name, issuer, date, proof upload (to `cert-proofs` bucket)

### Contacts Tab
- CRUD for contact methods (platform, url, icon)
- Reorder with sort_order

### Messages Tab
- Read-only inbox (existing functionality)
- Delete capability (existing)

---

## Phase 4: Code Changes Summary

### Files to Create
- `src/components/CertificatesSection.tsx` — Public certificates grid
- `src/components/admin/AdminSidebar.tsx` — Admin sidebar navigation
- `src/components/admin/ProfileTab.tsx` — Profile management
- `src/components/admin/ExperienceTab.tsx` — Experience CRUD
- `src/components/admin/ProjectsTab.tsx` — Projects + media CRUD
- `src/components/admin/CertificatesTab.tsx` — Certificates CRUD
- `src/components/admin/ContactsTab.tsx` — Contact methods CRUD
- `src/components/admin/MessagesTab.tsx` — Messages inbox

### Files to Modify
- `src/components/Navbar.tsx` — Fetch profile for avatar + CV link
- `src/components/HeroSection.tsx` — Fetch profile data dynamically
- `src/components/ProjectsSection.tsx` — Remove seed data, add media carousel, use live_url
- `src/components/ExperienceSection.tsx` — Fetch from experience table
- `src/components/ContactSection.tsx` — Fetch contact_methods dynamically
- `src/pages/Index.tsx` — Replace SkillsSection with CertificatesSection
- `src/pages/Admin.tsx` — Complete rewrite with sidebar layout and all tabs

### Files to Remove
- `src/components/SkillsSection.tsx` — Replaced by CertificatesSection

---

## Technical Notes

- All public queries use TanStack Query with appropriate cache keys
- Admin mutations invalidate relevant query caches
- Image uploads follow the existing pattern (upload to storage, save public URL)
- The `projects.image_url` column data will be migrated: if any existing projects have an `image_url`, a corresponding `project_media` row will be created before the column is dropped
- RLS policies use the existing `has_role()` security definer function
- Existing styling (glass-card, btn-gradient, gradient-text, etc.) is preserved throughout

