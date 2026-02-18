# 🚀 Quick Start Guide

## Prerequisites
- Node.js 18+
- A Supabase account (free)

## 5-Minute Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Supabase

**Create a Supabase project:**
- Go to https://supabase.com/dashboard
- Create a new project
- Wait for the database to initialize

**Run the SQL migrations:**
- Go to SQL Editor in Supabase Dashboard
- Copy and run `supabase/migrations/001_initial_schema.sql`
- Then run `supabase/migrations/002_seed_data.sql` (for sample data)

**Create storage buckets:**
- Go to Storage
- Create 3 public buckets: `profile`, `projects`, `certificates`

### 3. Add Environment Variables

```bash
cp .env.example .env
```

Edit `.env` with your Supabase credentials:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Start Development Server

```bash
npm run dev
```

Open http://localhost:8080 🎉

## First Steps

1. **View the public site** at `http://localhost:8080/`
2. **Access admin panel** at `http://localhost:8080/admin`
3. **Edit your profile** in the Profile tab
4. **Add your skills** in the Skills tab
5. **Customize the content** to match your portfolio

## Features Overview

### Public Portfolio (`/`)
- ✨ Animated hero with glowing orb
- 🎯 Skills organized by category
- 💼 Project showcase
- 📜 Experience timeline
- 🎓 Certifications
- 📧 Contact form

### Admin Dashboard (`/admin`)
- 👤 Profile management
- 💼 Projects CRUD
- 🛠️ Skills management (NEW!)
- 📋 Experience entries
- 🏆 Certificates
- 🔗 Social links
- 📬 Message inbox

## Customization Tips

### Change Colors
Edit `src/index.css` - look for cyan (#22d3ee) and violet (#a855f7)

### Update Logo
Replace `public/favicon.svg` with your own logo

### Modify Hero Text
Use the Profile tab in admin to update name, headline, and bio

## Need Help?

- 📖 See `README.md` for full documentation
- 🗄️ Check `supabase/README.md` for database setup
- 🐛 Open an issue on GitHub

---

**Enjoy building your portfolio! 🎨**
