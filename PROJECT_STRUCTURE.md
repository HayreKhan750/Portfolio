# 📁 Project Structure

```
portfolio-operating-system/
├── public/
│   └── favicon.svg                    # Dynamic HM logo favicon
├── src/
│   ├── components/
│   │   ├── admin/                     # Admin Dashboard Components
│   │   │   ├── DashboardStats.tsx     # Stats cards (counts)
│   │   │   ├── ProjectsTab.tsx        # Projects management
│   │   │   ├── ProjectFormDialog.tsx  # Project add/edit form
│   │   │   ├── SkillsTab.tsx          # Skills management (NEW!)
│   │   │   ├── SkillFormDialog.tsx    # Skill add/edit form (NEW!)
│   │   │   ├── ExperienceTab.tsx      # Experience management
│   │   │   ├── ExperienceFormDialog.tsx
│   │   │   ├── CertificatesTab.tsx    # Certificates management
│   │   │   ├── CertificateFormDialog.tsx
│   │   │   ├── MessagesTab.tsx        # Inbox for messages
│   │   │   ├── ProfileTab.tsx         # Profile settings
│   │   │   ├── SocialLinksTab.tsx     # Social links management
│   │   │   └── SocialLinkFormDialog.tsx
│   │   ├── sections/                  # Public Page Sections
│   │   │   ├── HeroSection.tsx        # Animated hero with orb
│   │   │   ├── ProjectsSection.tsx    # Projects showcase
│   │   │   ├── SkillsSection.tsx      # Technical Arsenal (NEW!)
│   │   │   ├── ExperienceSection.tsx  # Timeline + Certs
│   │   │   └── ContactSection.tsx     # Contact form
│   │   ├── ui/                        # Reusable UI Components
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── textarea.tsx
│   │   │   ├── label.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── select.tsx
│   │   │   └── tabs.tsx
│   │   ├── Navbar.tsx                 # Sticky navigation
│   │   ├── Footer.tsx                 # Footer component
│   │   └── HeroOrb.tsx                # 3D glowing orb
│   ├── lib/
│   │   ├── supabase.ts                # Supabase client + types
│   │   └── utils.ts                   # Utility functions
│   ├── pages/
│   │   ├── HomePage.tsx               # Public portfolio page
│   │   └── AdminDashboard.tsx         # Admin panel
│   ├── App.tsx                        # Main app component
│   ├── main.tsx                       # Entry point
│   └── index.css                      # Global styles + Premium theme
├── supabase/
│   ├── migrations/
│   │   ├── 001_initial_schema.sql     # Database schema + RLS
│   │   └── 002_seed_data.sql          # Sample data
│   └── README.md                      # Supabase setup guide
├── index.html                         # HTML entry point
├── package.json                       # Dependencies
├── vite.config.ts                     # Vite configuration
├── tailwind.config.js                 # Tailwind + theme config
├── tsconfig.json                      # TypeScript config
├── .env.example                       # Environment template
├── README.md                          # Full documentation
├── QUICKSTART.md                      # Quick setup guide
└── .gitignore                         # Git ignore rules
```

## Key Features by Section

### 🎨 Premium Neural UI Theme
- Glassmorphic cards with backdrop blur
- Cyan (#22d3ee) and Violet (#a855f7) gradient accents
- Custom scrollbar with neon glow
- Smooth animations and transitions
- Proper z-index hierarchy (modals at z-[100])
- Dark backdrop overlays for modals

### 🎯 Public Portfolio
1. **Hero Section**
   - Animated 3D glowing orb with profile picture
   - Name + Headline display
   - CTA buttons with gradient effects
   
2. **Projects Section**
   - Glass cards with hover effects
   - Tech stack badges
   - External links and GitHub

3. **Skills Section** (NEW!)
   - Grouped by category
   - Tech pills with neon glow
   - Progress bars for proficiency
   
4. **Experience Section**
   - Timeline with gradient connector
   - Work history cards
   - Certificates grid

5. **Contact Section**
   - Icon-only social links
   - Contact info display
   - Working contact form

### 🛠️ Admin Dashboard
- **Dashboard**: Overview stats cards
- **Profile**: Edit name, headline, bio, contact
- **Projects**: CRUD with image URLs
- **Skills**: Category-based management (NEW!)
- **Experience**: Timeline entries
- **Certificates**: With proof uploads
- **Social Links**: Icon selector
- **Messages**: Inbox with read status

### 🗄️ Database Schema
8 tables with full RLS:
- `profile` - Personal information
- `projects` - Portfolio projects
- `skills` - Technical skills (NEW!)
- `experience` - Work history
- `certificates` - Credentials
- `social_links` - Social media
- `messages` - Contact submissions
- `user_roles` - Admin access

### 🎨 UI Components
- All Shadcn UI components styled for dark theme
- Select dropdowns with solid bg (z-[102])
- Dialogs with backdrop blur
- Forms with validation (zod + react-hook-form)
- Toast notifications (Sonner)

## Component Hierarchy

```
App
├── HomePage
│   ├── Navbar
│   ├── HeroSection
│   │   └── HeroOrb
│   ├── ProjectsSection
│   ├── SkillsSection (NEW!)
│   ├── ExperienceSection
│   ├── ContactSection
│   └── Footer
│
└── AdminDashboard
    ├── Navbar
    └── Tabs
        ├── DashboardStats
        ├── ProfileTab
        ├── ProjectsTab → ProjectFormDialog
        ├── SkillsTab → SkillFormDialog (NEW!)
        ├── ExperienceTab → ExperienceFormDialog
        ├── CertificatesTab → CertificateFormDialog
        ├── SocialLinksTab → SocialLinkFormDialog
        └── MessagesTab
```

## Tech Stack Summary

| Category | Technology |
|----------|-----------|
| Framework | React 18 + TypeScript |
| Build Tool | Vite 5 |
| Styling | Tailwind CSS 3 |
| UI Library | Shadcn UI + Radix UI |
| Backend | Supabase (PostgreSQL) |
| State | TanStack Query (React Query) |
| Forms | React Hook Form + Zod |
| Icons | Lucide React |
| Animations | Framer Motion + CSS |
| Notifications | Sonner |

