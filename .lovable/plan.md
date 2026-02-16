

# Premium UI Polish + Fixes

## Overview
Apply targeted fixes and polish across the public site and admin dashboard based on user feedback and reference images. No database changes needed -- the `skills` table and all other tables already exist.

---

## 1. Hero Section Fix

**Problem:** The headline text ("AI / ML Engineer") is showing both above the name AND as a duplicate line below it. The user wants:
- Small sub-headline above the main name (e.g., "AI / ML Engineer") -- this should be editable from admin Profile tab
- The main name stays as "Hayredin Mohammed"
- Remove the duplicate `profile.headline` line below the name (line 33 currently repeats it)
- Avatar must appear inside the glowing orb with smooth float animation matching the sphere layers

**Changes to `HeroSection.tsx`:**
- Remove line 33 (duplicate headline)
- Ensure the avatar container shares the same `animate-float` class as the orb layers so they move in sync
- Keep the feathered radial mask on the avatar

---

## 2. Navbar -- Always Show "HM" Logo

**Problem:** The navbar replaces the "HM" text with the avatar image. User wants "HM" logo always visible.

**Changes to `Navbar.tsx`:**
- Always render the "HM" gradient text logo (remove the conditional that swaps it for avatar)
- Keep the CV download button

---

## 3. Admin Dashboard -- UI Matching Reference Images

### A. Projects Tab (`ProjectsTab.tsx`)
Match the reference image layout:
- Header: "Projects (N)" with button text "New Project" (not just "Add")
- Card rows: Increase padding, show title + featured star + tags as small pills
- Edit/Delete buttons: Icon-only with subtle glow hover backgrounds
- Edit form displayed as a modal/overlay (matching reference image with dark background, clean form fields)

### B. Certificates Tab (`CertificatesTab.tsx`)
Match the reference image:
- Header: "Certificates (N)" with "Add Certificate" button
- Card rows: Show name, issuer, and date on the subtitle line
- Action buttons: External link icon (for proof_url) + Edit + Delete
- Edit form: Add proof URL text input field alongside the upload button, add date picker-style input

### C. Experience Tab (`ExperienceTab.tsx`)
- Fix dropdown visibility: The `<select>` already has `bg-zinc-900` but needs explicit `text-foreground` styling
- Remove the sort_order number input from the visible form (keep it internal or move to advanced)
- Clean layout matching the glassmorphic style

### D. Contacts Tab (`ContactsTab.tsx`)
Match the reference image:
- Simplified inline add form: Platform name + URL + Icon dropdown in a single row with "+" button
- List items show icon + platform name + URL with just a delete button
- Remove sort_order from the visible form
- Remove the separate form layout, use the inline approach from the reference

### E. Messages Tab (`MessagesTab.tsx`)
- Already has "Inbox Card" layout -- polish the styling to be more premium
- Ensure proper spacing and glass effects

### F. Skills Tab (`SkillsTab.tsx`)
- Already working well, no major changes needed

### G. Profile Tab (`ProfileTab.tsx`)
- Already has headline editing -- ensure label clearly says "Headline (displayed above your name on Hero section)"

---

## 4. Contact Section (Public) -- Icon-Only Socials

Already implemented correctly. Social links show as icon-only, direct contacts (Email, Phone) show with text. No changes needed.

---

## 5. Experience Section Subtitle

Already says "My academic journey and credentials." -- no change needed.

---

## 6. Links Must Work

Ensure all links function properly:
- Download CV button uses `profile.resume_url` (already implemented with `target="_blank"`)
- Certificate "View Proof" links use `cert.proof_url` (already implemented)
- Contact links use the stored URLs (already implemented)
- Project GitHub/Live Demo links in modal (already implemented)

---

## Technical Changes Summary

### Files to Modify

| File | Changes |
|------|---------|
| `src/components/HeroSection.tsx` | Remove duplicate headline line; sync avatar float animation with orb |
| `src/components/Navbar.tsx` | Always show "HM" logo text, never replace with avatar |
| `src/components/admin/ProjectsTab.tsx` | Button text "New Project"; premium card rows with tags as pills; icon buttons with glow hover |
| `src/components/admin/CertificatesTab.tsx` | Button text "Add Certificate"; add proof_url text input; external link button in action row; date input type |
| `src/components/admin/ExperienceTab.tsx` | Fix select dropdown styling; remove sort_order from visible form |
| `src/components/admin/ContactsTab.tsx` | Inline add form (platform + URL + icon in one row); simplified list with icon + delete only |
| `src/components/admin/MessagesTab.tsx` | Enhanced inbox card styling with better spacing |
| `src/components/admin/ProfileTab.tsx` | Update headline label text for clarity |

### No Files to Create or Delete

### No Database Changes Required

