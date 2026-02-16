

# Fix: Project Popup Blocked by Navbar

## Problem
The project detail popup/modal appears behind the navbar even though it has `z-[200]` (higher than the navbar's `z-50`). This happens because framer-motion applies CSS `transform` to animated elements inside the `<section>`, which creates a new **stacking context**. Any `z-index` inside that context is relative to the parent, not the viewport -- so the modal can never appear above the navbar.

## Solution
Use a **React Portal** to render the modal directly into `document.body`, escaping the stacking context entirely. This guarantees the modal with `z-[200]` is compared against the navbar's `z-50` at the same DOM level.

## Technical Details

### File: `src/components/ProjectsSection.tsx`

1. Import `createPortal` from `react-dom`
2. Wrap the modal overlay (the `{selected && (...)}` block) in `createPortal(..., document.body)` so it renders outside the section's stacking context
3. Keep all existing modal content, z-index, backdrop, and functionality unchanged

This is a single-line structural change -- no visual or functional differences, just ensures the popup always renders on top of everything.
