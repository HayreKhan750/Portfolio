# Deployment Checklist

## ✅ Pre-Deployment Steps

### 1. Environment Setup
- [ ] Copy `.env.example` to `.env`
- [ ] Add your Supabase project URL to `VITE_SUPABASE_URL`
- [ ] Add your Supabase anon key to `VITE_SUPABASE_ANON_KEY`

### 2. Database Migration
- [ ] Go to your Supabase project dashboard
- [ ] Navigate to SQL Editor
- [ ] Run the consolidation migration: `supabase/migrations/20260218000000_consolidate_schema.sql`
- [ ] Verify all tables and indexes were created successfully

### 3. Admin User Setup
- [ ] Create an admin user in Supabase Auth
- [ ] Add user to `user_roles` table with role 'admin'
  ```sql
  INSERT INTO user_roles (user_id, role) 
  VALUES ('your-user-uuid', 'admin'::app_role);
  ```

### 4. Install Dependencies
```bash
npm install
```

### 5. Build and Test Locally
```bash
# Run development server
npm run dev

# Run tests
npm run test

# Build for production
npm run build

# Preview production build
npm run preview
```

### 6. Verify Functionality
- [ ] Can access homepage at `http://localhost:8080`
- [ ] Can login to admin panel at `/login`
- [ ] Can create/edit profile information
- [ ] Can add/edit projects
- [ ] Can add/edit skills
- [ ] Can add/edit experience
- [ ] Can add/edit certificates
- [ ] Can view/delete messages from contact form
- [ ] All images upload successfully
- [ ] CV/Resume upload works
- [ ] Contact form submissions work

## 🚀 Deployment

### Option 1: Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables in Vercel dashboard
# - VITE_SUPABASE_URL
# - VITE_SUPABASE_ANON_KEY
```

### Option 2: Deploy to Netlify
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Build
npm run build

# Deploy
netlify deploy --prod --dir=dist

# Add environment variables in Netlify dashboard
```

### Option 3: Deploy to GitHub Pages
1. Update `vite.config.ts` base path to your repo name
2. Push to GitHub
3. Enable GitHub Pages in repository settings
4. Set environment variables in repository secrets

## 📊 Post-Deployment Verification

### Performance Checks
- [ ] Lighthouse score > 90
- [ ] First Contentful Paint < 2s
- [ ] Time to Interactive < 3s
- [ ] Bundle size optimized (check network tab)

### Functionality Checks
- [ ] All pages load without errors
- [ ] Admin authentication works
- [ ] Database queries execute successfully
- [ ] File uploads work
- [ ] Contact form sends messages
- [ ] Mobile responsive design works
- [ ] Accessibility audit passes

### SEO Checks
- [ ] Meta tags are present
- [ ] Open Graph tags configured
- [ ] Sitemap generated
- [ ] robots.txt configured

## 🔧 Troubleshooting

### Common Issues

**Database Connection Errors:**
- Verify environment variables are set correctly
- Check Supabase project is not paused
- Verify RLS policies are correct

**Build Failures:**
- Clear node_modules and reinstall: `rm -rf node_modules package-lock.json && npm install`
- Check for TypeScript errors: `npm run lint`
- Verify all dependencies are compatible

**Authentication Issues:**
- Verify admin user exists in user_roles table
- Check JWT secret is configured in Supabase
- Clear browser localStorage and try again

**Upload Issues:**
- Verify storage buckets exist in Supabase
- Check storage policies allow authenticated users
- Verify file size limits

## 📝 Maintenance

### Regular Tasks
- Update dependencies monthly: `npm update`
- Review and clear old messages
- Backup database regularly
- Monitor error logs
- Update content regularly

### Security
- Rotate Supabase keys annually
- Review RLS policies quarterly
- Update Node.js version
- Security audit: `npm audit`

## 📞 Support

For issues related to:
- **Supabase**: https://supabase.com/docs
- **React**: https://react.dev/
- **Vite**: https://vitejs.dev/
- **Tailwind CSS**: https://tailwindcss.com/docs
