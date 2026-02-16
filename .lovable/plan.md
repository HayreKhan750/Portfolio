

# Comprehensive UI/UX Polish + Functional Fixes

## Overview
Address all remaining issues: avatar-orb motion sync, skills batch add, editable hero name, link fixes, button styling matching reference images, project link button, email mailto fix, favicon fix, modal z-index, and skills section container styling.

---

## 1. Database Migration -- Add `name` column to `profile`

The hero section currently hardcodes "Hayredin Mohammed". To make it editable from admin, add a `name` column:

```text
ALTER TABLE public.profile ADD COLUMN name text DEFAULT 'Hayredin Mohammed';
```

No RLS changes needed (existing policies cover it).

---

## 2. Hero Section (`HeroSection.tsx`)

**Avatar-Orb Motion Sync:**
- Wrap the entire orb container (all layers + avatar) in a single parent with `animate-float` so everything moves as one unit
- Remove individual `animate-float` from child layers -- instead use CSS keyframe offsets on children for subtle relative breathing, but the main float is shared
- This prevents the avatar from drifting separately from the orb

**Editable Name:**
- Fetch `profile.name` and display it instead of hardcoded "Hayredin Mohammed"
- Headline stays as the small sub-headline above the name

---

## 3. Profile Tab (`ProfileTab.tsx`)

Add two new input fields:
- **"Display Name"** -- maps to `profile.name`, labeled "Full name displayed on the Hero section"
- **"Sub-headline"** stays as the existing headline field (already labeled correctly)

Add state for `name`, include in fetch and save payload.

---

## 4. Skills Tab -- Batch Add (`SkillsTab.tsx`)

**Remove sort_order** from the form.

**Add "Batch Add" mode:**
- A text input where user enters comma-separated skill names (e.g., "React, Vue, Angular")
- Category selector (reuse existing datalist)
- Proficiency slider (applies to all batch items)
- On submit, split by comma, trim, insert all at once
- Keep single-add mode alongside it

---

## 5. Skills Section -- Container Cards (`SkillsSection.tsx`)

Based on the reference image, wrap each category group in a glass-card container:
- Each category gets its own `glass-card` container with padding
- Category title inside the card in cyan
- Skill pills displayed inside the card
- Grid layout: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`

---

## 6. Project Modal Z-Index Fix (`ProjectsSection.tsx`)

The modal is already at `z-[100]` but the Navbar is at `z-50`. The issue from the screenshot shows the navbar overlapping. Fix:
- Add `z-[200]` to the project modal overlay (higher than everything)
- Or set navbar to `z-40` and keep modal at `z-[100]`

Best approach: bump the modal to `z-[200]` to guarantee it is above everything.

---

## 7. Link Fixes

**Problem:** Links like LinkedIn are stored as `www.linkedin.com/in/...` without `https://` prefix, causing them to be treated as relative paths.

**Contact Section (`ContactSection.tsx`):**
- Before rendering `href`, ensure URLs have a protocol prefix. If a URL doesn't start with `http://` or `https://` or `mailto:` or `tel:`, prepend `https://`
- For Email contacts: use `mailto:` prefix so clicking opens email client (Gmail or default)
- For Phone contacts: use `tel:` prefix
- Remove the wrapping `<a>` from phone/email that goes to an external URL -- instead use proper `mailto:` / `tel:` hrefs

**Certificates Section (`CertificatesSection.tsx`):**
- Same URL normalization for `proof_url`

**Navbar CV link:**
- Same URL normalization for `resume_url`

**Admin ContactsTab:**
- Add a helper note or auto-prepend `https://` when saving if URL doesn't have a protocol

---

## 8. Admin Button Styling (All Tabs)

Based on reference images, edit/delete/link buttons should have:
- **Edit button:** `p-2 rounded-lg bg-white/5 hover:bg-cyan/20 text-muted-foreground hover:text-cyan transition-all`
- **Delete button:** `p-2 rounded-lg bg-white/5 hover:bg-red-500/20 text-muted-foreground hover:text-red-400 transition-all`
- **Link/External button:** `p-2 rounded-lg bg-white/5 hover:bg-cyan/20 text-muted-foreground hover:text-cyan transition-all`

Apply across: `ProjectsTab`, `CertificatesTab`, `ExperienceTab`, `SkillsTab`, `ContactsTab`, `MessagesTab`.

**Project cards** should also have a link button (ExternalLink icon) when `github_url` or `live_url` exists, similar to certificates.

---

## 9. Favicon Fix

The current `index.html` already has the HM SVG favicon. Verify the browser is caching the old one. The SVG data URI is correct. No code change needed -- the favicon is already set. If still showing old, it's a browser cache issue.

Actually, re-checking: the favicon link is present and correct in `index.html` line 12. This is a cache issue, not a code issue. No changes needed.

---

## 10. Contact Section -- Email Direct Link

For email contacts, use `mailto:email@example.com` as the href so it opens the user's email client directly. For phone, use `tel:+number`. Do NOT open in new tab for these.

---

## Technical Changes Summary

### Database Migration
- Add `name` column to `profile` table (text, default 'Hayredin Mohammed')

### Files to Modify

| File | Key Changes |
|------|-------------|
| `src/components/HeroSection.tsx` | Use `profile.name` for display name; unify orb float animation so avatar moves with orb as one unit |
| `src/components/SkillsSection.tsx` | Wrap each category in a glass-card container; use grid layout for categories |
| `src/components/ProjectsSection.tsx` | Modal z-index to `z-[200]`; add link button in admin list |
| `src/components/ContactSection.tsx` | URL normalization (auto-prepend https://); mailto: for email, tel: for phone; no new tab for email/phone |
| `src/components/CertificatesSection.tsx` | URL normalization for proof_url |
| `src/components/Navbar.tsx` | URL normalization for resume_url |
| `src/components/admin/ProfileTab.tsx` | Add "Display Name" input field; fetch/save `name` column |
| `src/components/admin/SkillsTab.tsx` | Remove sort_order from form; add batch-add mode (comma-separated names) |
| `src/components/admin/ProjectsTab.tsx` | Button styling (bg-white/5 with colored hover); add link icon button for github/live |
| `src/components/admin/CertificatesTab.tsx` | Button styling update |
| `src/components/admin/ExperienceTab.tsx` | Button styling update |
| `src/components/admin/ContactsTab.tsx` | Button styling update; auto-prepend https:// on save |
| `src/components/admin/MessagesTab.tsx` | Button styling update |
| `src/components/admin/SkillsTab.tsx` | Button styling update |

### No Files to Create or Delete

