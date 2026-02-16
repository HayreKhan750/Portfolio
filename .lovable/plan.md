

# Skills System + Premium UI Overhaul

## Overview
Add a full Skills Management System (database to admin to public display) and apply premium UI polish across the entire application -- custom favicon, z-index fixes, custom scrollbar, breathable spacing, hero orb with avatar, and admin dashboard stats.

---

## Phase 1: Database — `skills` Table

Create a new `skills` table with RLS policies:

```text
skills
  id          uuid PK (gen_random_uuid())
  category    text NOT NULL
  name        text NOT NULL
  proficiency int  DEFAULT 0
  sort_order  int  DEFAULT 0
  created_at  timestamptz DEFAULT now()
```

RLS:
- Public SELECT (true)
- Admin INSERT/UPDATE/DELETE via `has_role(auth.uid(), 'admin')`

---

## Phase 2: Global UI Fixes

### Favicon
- Replace the `<link rel="icon">` in `index.html` with an inline SVG data URI featuring the "HM" monogram in cyan/violet gradient

### Custom Scrollbar (in `src/index.css`)
- Thin scrollbar with cyan accent thumb and dark track
- WebKit + Firefox scrollbar styling

### Z-Index Hierarchy
- Navbar stays at `z-50`
- All modals/dialogs get `z-[100]` with `bg-black/80 backdrop-blur-sm` backdrop
- Fix the project modal in `ProjectsSection.tsx` (currently `z-50`, bump to `z-[100]`)

### Breathable Spacing
- Increase section padding from `py-24` to `py-32` across all public sections
- Increase `mb-12` headers to `mb-16`

---

## Phase 3: Public Frontend Changes

### Hero Section (`HeroSection.tsx`)
- Fetch `profile.avatar_url`
- Place the avatar image centered inside the glowing sphere with a circular mask and feathered edges
- Show the `headline` as a sub-headline under the main name text
- Keep existing gradient text and CTA buttons

### New "Technical Arsenal" Section (`SkillsSection.tsx`)
- Insert between Projects and Experience in `Index.tsx`
- Fetch from `skills` table via TanStack Query
- Group by `category` with category labels
- Display as glassmorphic "tech pills" with neon glow on hover and scale animation
- Show thin progress bar below each skill if `proficiency > 0`

### Navbar
- Add "Skills" link pointing to `#skills`

### Experience Section
- Change subtitle from "My journey and credentials." to "My academic journey and credentials."
- Increase vertical padding between items

### Contact Section
- For social platforms (GitHub, LinkedIn, X/Twitter), show icon-only buttons (no text labels)
- For Email and Phone, keep readable text
- Keep existing contact form unchanged

### Certificates Section
- Increase spacing to match breathable layout

---

## Phase 4: Admin Dashboard Overhaul

### Dashboard Home with Stats (`Admin.tsx`)
- Default tab becomes "dashboard" showing 4 summary stat cards:
  - Total Projects, Total Certificates, Total Skills, Total Experience
- Each card: glassmorphic, large number, small label, gradient icon

### Sidebar (`AdminSidebar.tsx`)
- Add "Skills" tab with `Code2` icon
- Add "Dashboard" tab with `LayoutDashboard` icon at the top

### New Skills Tab (`SkillsTab.tsx`)
- List all skills grouped by category with colored category badges
- Edit/Delete icon buttons per skill
- Add/Edit modal form with:
  - Category (text input or select from existing categories)
  - Name (text input)
  - Proficiency (slider 0-100)
  - Sort Order (number input)
- Validated with `react-hook-form` + `zod`

### List View Headers (all tabs)
- Update headers to show counts: "Projects (4)", "Skills (8)", etc.
- Increase row padding for premium feel
- Style Edit/Delete as icon-only buttons with subtle glow backgrounds

### Certificates Tab
- Add external link icon button in action row when `proof_url` exists

### Messages Tab — Inbox Cards
- Redesign to card layout: top row with Name + Email + faded timestamp, body in lighter glass container, delete button on right

### Dropdown Fix
- All `<select>` elements get `bg-zinc-900` background for readability

### Profile Tab
- Ensure headline input is clearly labeled and editable

---

## Phase 5: Files Summary

### New Files
- `src/components/SkillsSection.tsx` — Public skills display
- `src/components/admin/SkillsTab.tsx` — Admin skills CRUD
- `src/components/admin/DashboardTab.tsx` — Stats overview

### Modified Files
- `index.html` — New SVG favicon
- `src/index.css` — Custom scrollbar styles
- `src/pages/Index.tsx` — Add SkillsSection, increase spacing
- `src/components/Navbar.tsx` — Add Skills nav link
- `src/components/HeroSection.tsx` — Avatar in orb, headline display
- `src/components/ExperienceSection.tsx` — Updated subtitle, increased padding
- `src/components/ContactSection.tsx` — Icon-only socials for certain platforms
- `src/components/CertificatesSection.tsx` — Breathable spacing
- `src/components/ProjectsSection.tsx` — Modal z-index fix, spacing
- `src/pages/Admin.tsx` — Add dashboard + skills tabs
- `src/components/admin/AdminSidebar.tsx` — Add Dashboard + Skills entries
- `src/components/admin/ProjectsTab.tsx` — Header count, premium rows
- `src/components/admin/ExperienceTab.tsx` — Header count, premium rows, dropdown fix
- `src/components/admin/CertificatesTab.tsx` — Header count, link button, premium rows
- `src/components/admin/ContactsTab.tsx` — Header count, premium rows, dropdown fix
- `src/components/admin/MessagesTab.tsx` — Inbox card redesign
- `src/components/admin/ProfileTab.tsx` — Headline label clarity

### Database Migration
- Create `skills` table with RLS policies

