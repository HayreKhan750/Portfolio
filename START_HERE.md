# 🚀 How to Run on Localhost - Step by Step

## Quick Start (Choose Your Path)

### Option 1: Quick Preview (Without Database) - 2 Minutes ⚡
Run the app immediately with mock data to see the design.

### Option 2: Full Setup (With Supabase) - 10 Minutes 🎯
Complete setup with real database functionality.

---

## Option 1: Quick Preview Mode ⚡

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Create Mock Environment File
```bash
# Create a .env file with dummy values
echo "VITE_SUPABASE_URL=https://mock.supabase.co" > .env
echo "VITE_SUPABASE_ANON_KEY=mock-key-for-preview" >> .env
```

### Step 3: Start Development Server
```bash
npm run dev
```

### Step 4: Open Browser
- Open: http://localhost:8080
- You'll see the UI design (some features won't work without real DB)

**Note:** In preview mode, you'll see the design but data won't load. For full functionality, use Option 2.

---

## Option 2: Full Setup with Supabase 🎯

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Create Supabase Project (5 minutes)

1. **Go to Supabase:**
   - Visit: https://supabase.com/dashboard
   - Click "New Project"
   - Fill in:
     - Name: "portfolio-os"
     - Database Password: (save this!)
     - Region: Choose closest to you
   - Click "Create new project"
   - Wait 2-3 minutes for setup

2. **Get Your Credentials:**
   - In your project dashboard
   - Go to Settings → API
   - Copy:
     - Project URL
     - anon/public key

### Step 3: Set Up Database (2 minutes)

1. **In Supabase Dashboard:**
   - Click "SQL Editor" in left sidebar
   - Click "New Query"

2. **Run Migration 1:**
   - Copy entire contents of `supabase/migrations/001_initial_schema.sql`
   - Paste into SQL Editor
   - Click "Run" (bottom right)
   - Should see "Success. No rows returned"

3. **Run Migration 2 (Sample Data):**
   - Click "New Query" again
   - Copy entire contents of `supabase/migrations/002_seed_data.sql`
   - Paste into SQL Editor
   - Click "Run"
   - Should see "Success"

4. **Create Storage Buckets:**
   - Click "Storage" in left sidebar
   - Click "Create a new bucket"
   - Create 3 public buckets:
     - Name: `profile` → Check "Public bucket" → Create
     - Name: `projects` → Check "Public bucket" → Create
     - Name: `certificates` → Check "Public bucket" → Create

### Step 4: Add Environment Variables (1 minute)

```bash
# Create .env file
cp .env.example .env
```

Edit `.env` file and add your Supabase credentials:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### Step 5: Start Development Server
```bash
npm run dev
```

### Step 6: Open Your Browser
```
http://localhost:8080
```

You should see:
- ✅ Public portfolio with sample data
- ✅ Animated hero orb
- ✅ Sample projects, skills, experience
- ✅ Working contact form

### Step 7: Access Admin Panel
```
http://localhost:8080/admin
```

Now you can:
- Edit your profile
- Add/edit projects
- Manage skills
- Update experience
- Upload certificates

---

## Troubleshooting

### "npm: command not found"
**Solution:** Install Node.js
```bash
# Download from: https://nodejs.org/
# Or use package manager:
# macOS: brew install node
# Ubuntu: sudo apt install nodejs npm
# Windows: Download installer from nodejs.org
```

### Port 8080 Already in Use
**Solution:** Kill the process or use different port
```bash
# Kill process on port 8080
# macOS/Linux:
lsof -ti:8080 | xargs kill -9

# Or change port in vite.config.ts:
# Change port: 8080 to port: 3000
```

### Blank Page / No Data Showing
**Check:**
1. Console errors (F12 → Console tab)
2. Environment variables are correct
3. Supabase migrations ran successfully
4. Network tab shows 200 responses

### Supabase Connection Error
**Check:**
1. `.env` file exists and has correct values
2. Environment variables start with `VITE_`
3. Restart dev server after changing `.env`
4. Supabase project is active (not paused)

---

## What You'll See

### Public Page (http://localhost:8080)
1. **Hero Section** - Animated orb with "Hayredin Mohammed"
2. **Projects** - 3 sample projects
3. **Skills** - 15 skills grouped by category
4. **Experience** - 2 work entries + timeline
5. **Certificates** - 3 sample certificates
6. **Contact Form** - Working form

### Admin Panel (http://localhost:8080/admin)
1. **Dashboard** - Stats cards
2. **Profile** - Edit personal info
3. **Projects** - Manage projects
4. **Skills** - Add/edit skills
5. **Experience** - Work history
6. **Certificates** - Credentials
7. **Social Links** - Social media
8. **Messages** - Contact form inbox

---

## Next Steps After Running Locally

1. **Customize Content:**
   - Go to Admin → Profile
   - Update your name, headline, bio
   - Add your avatar URL

2. **Add Your Projects:**
   - Go to Admin → Projects
   - Click "Add Project"
   - Fill in details

3. **Add Your Skills:**
   - Go to Admin → Skills
   - Click "Add Skill"
   - Choose category, name, proficiency

4. **Customize Theme:**
   - Edit `src/index.css`
   - Change cyan/violet colors
   - Update gradient values

---

## Quick Command Reference

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint
```

---

## Still Need Help?

If you get stuck:
1. Check the browser console (F12)
2. Check terminal for error messages
3. Verify all steps completed
4. Check Supabase dashboard for table data

**Common Issue:** Forgot to run migrations → No data shows
**Fix:** Run both SQL migrations in Supabase SQL Editor

---

**Ready to see your portfolio? Run `npm install` then `npm run dev`!** 🚀
