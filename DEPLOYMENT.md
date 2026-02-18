# 🚀 Deployment Guide

## Option 1: Vercel (Recommended)

### Prerequisites
- Vercel account (free tier available)
- GitHub repository with your code

### Steps

1. **Push to GitHub**
```bash
git init
git add .
git commit -m "Initial commit - Portfolio OS"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

2. **Deploy to Vercel**
- Go to [vercel.com](https://vercel.com)
- Click "New Project"
- Import your GitHub repository
- Configure:
  - Framework Preset: Vite
  - Build Command: `npm run build`
  - Output Directory: `dist`
  
3. **Add Environment Variables**
In Vercel project settings → Environment Variables:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

4. **Deploy!**
- Click "Deploy"
- Your site will be live in ~2 minutes

## Option 2: Netlify

### Steps

1. **Build Locally**
```bash
npm run build
```

2. **Deploy**
- Install Netlify CLI: `npm install -g netlify-cli`
- Run: `netlify deploy --prod`
- Follow prompts

Or use Netlify UI:
- Go to [netlify.com](https://netlify.com)
- Drag and drop the `dist` folder

3. **Configure Environment Variables**
In Netlify dashboard → Site settings → Environment variables

## Option 3: Self-Hosted (VPS)

### Using Nginx

1. **Build the project**
```bash
npm run build
```

2. **Upload dist folder to your server**
```bash
scp -r dist/* user@your-server:/var/www/portfolio
```

3. **Configure Nginx**
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/portfolio;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

4. **Restart Nginx**
```bash
sudo systemctl restart nginx
```

## Post-Deployment Checklist

- [ ] Test public portfolio page loads correctly
- [ ] Test admin dashboard access
- [ ] Verify all images load (if using URLs)
- [ ] Test contact form submission
- [ ] Check responsive design on mobile
- [ ] Set up custom domain (optional)
- [ ] Enable HTTPS/SSL
- [ ] Add to Google Search Console (SEO)

## Performance Tips

1. **Optimize Images**
   - Use WebP format for better compression
   - Compress images before uploading
   - Use CDN for image hosting

2. **Enable Caching**
   - Vercel/Netlify handle this automatically
   - For self-hosted: configure nginx caching

3. **Monitor Performance**
   - Use Lighthouse in Chrome DevTools
   - Aim for 90+ scores

## Troubleshooting

### Build Fails
- Check Node.js version (18+ required)
- Verify all dependencies installed
- Check for TypeScript errors

### Environment Variables Not Working
- Ensure they start with `VITE_`
- Rebuild after adding variables
- Check they're set in deployment platform

### 404 on Page Refresh
- Configure SPA fallback in your hosting
- Vercel/Netlify: Add `vercel.json` or `_redirects` file

### Supabase Connection Issues
- Verify environment variables are correct
- Check Supabase project is active
- Verify RLS policies are set up

## Production Optimizations

### Add vercel.json
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        }
      ]
    }
  ]
}
```

### Add _redirects (Netlify)
```
/*    /index.html   200
```

## Custom Domain Setup

### Vercel
1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed

### Netlify
1. Go to Domain Settings
2. Add custom domain
3. Configure DNS (automatic with Netlify DNS)

## Analytics (Optional)

### Google Analytics
Add to `index.html` before `</head>`:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### Vercel Analytics
- Enable in Vercel dashboard
- Automatic tracking, no code changes needed

---

**Your portfolio is now live! 🎉**

Share it with the world and start showcasing your work!
