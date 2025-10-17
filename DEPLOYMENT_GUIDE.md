# 🚀 Deployment Guide - lunoSpaces

Complete guide to deploy your lunoSpaces app to production.

---

## 📋 Pre-Deployment Checklist

### 1. **Database Setup** ✅
- [ ] Run `database/schema.sql` in Supabase SQL Editor
- [ ] Verify `user_profiles` table exists
- [ ] Test Row Level Security (RLS) policies
- [ ] Create test user to verify data flow

### 2. **Environment Variables** ✅
```bash
# Required for production
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Optional but recommended
NEXT_PUBLIC_API_BASE_URL=https://your-api.com
NEXT_PUBLIC_VAPI_PUBLIC_KEY=your-vapi-key
```

### 3. **OAuth Configuration** (if using)
- [ ] Enable Google OAuth in Supabase
- [ ] Enable GitHub OAuth in Supabase
- [ ] Add production redirect URLs:
  - `https://yourdomain.com/auth/callback`
- [ ] Test OAuth flow in staging

### 4. **Build Test** ✅
```bash
npm run build
# Note: Build warning for Three.js is expected and non-critical
```

---

## 🌐 Deployment Options

### Option 1: Vercel (Recommended)

**Why Vercel?**
- Built for Next.js (zero-config)
- Automatic deployments from Git
- Edge functions
- Free SSL certificates
- Global CDN

**Steps:**

1. **Push to GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/lunospaces.git
git push -u origin main
```

2. **Deploy to Vercel**
- Go to [vercel.com](https://vercel.com)
- Click "New Project"
- Import your GitHub repository
- Configure:
  - Framework: Next.js (auto-detected)
  - Root Directory: `./`
  - Build Command: `npm run build`
  - Output Directory: `.next`

3. **Add Environment Variables**
In Vercel dashboard → Settings → Environment Variables:
```
NEXT_PUBLIC_SUPABASE_URL=your-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key
```

4. **Deploy**
- Click "Deploy"
- Wait ~2 minutes
- Get your production URL: `https://lunospaces.vercel.app`

5. **Update Supabase**
- Add production URL to allowed origins
- Update OAuth redirect URLs

---

### Option 2: Netlify

**Steps:**

1. **Build Settings**
```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = ".next"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

2. **Deploy**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod
```

3. **Environment Variables**
Add in Netlify dashboard → Site settings → Environment variables

---

### Option 3: Docker + Any Cloud

**Dockerfile:**
```dockerfile
FROM node:18-alpine AS base

# Dependencies
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Builder
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Runner
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
```

**Build & Run:**
```bash
docker build -t lunospaces .
docker run -p 3000:3000 -e NEXT_PUBLIC_SUPABASE_URL=your-url lunospaces
```

---

### Option 4: VPS (DigitalOcean, AWS, etc.)

**Setup:**

1. **Install Node.js**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

2. **Clone & Setup**
```bash
git clone your-repo
cd lunospaces
npm install
npm run build
```

3. **Use PM2 for Process Management**
```bash
npm install -g pm2
pm2 start npm --name "lunospaces" -- start
pm2 startup
pm2 save
```

4. **Setup Nginx Reverse Proxy**
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

5. **SSL with Let's Encrypt**
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

---

## 🔒 Security Checklist

### Before Going Live:

- [ ] **Environment Variables**
  - Never commit `.env.local` to Git
  - Use production keys (not test keys)
  - Rotate keys if exposed

- [ ] **Supabase Security**
  - RLS policies enabled on all tables
  - Test unauthorized access
  - Enable email verification
  - Configure password requirements

- [ ] **CORS & CSP**
  - Add your domain to Supabase allowed origins
  - Configure Content Security Policy

- [ ] **Rate Limiting**
  - Enable Supabase rate limiting
  - Add API rate limits if using custom backend

- [ ] **Monitoring**
  - Set up error tracking (Sentry recommended)
  - Enable Vercel/platform analytics
  - Monitor Supabase usage

---

## 🧪 Production Testing

### After Deployment, Test:

1. **Homepage**
   - [ ] Loads without errors
   - [ ] 3D animations work
   - [ ] All links functional

2. **Auth Flow**
   - [ ] New user signup (full 8 steps)
   - [ ] Existing user login
   - [ ] OAuth (Google/GitHub)
   - [ ] Password reset (if implemented)
   - [ ] Data saves to Supabase

3. **Dashboard**
   - [ ] Redirects work
   - [ ] User data loads
   - [ ] Protected from non-authenticated users

4. **Performance**
   - [ ] Lighthouse score > 90
   - [ ] Fast page loads
   - [ ] No console errors

5. **Mobile**
   - [ ] Test on real devices
   - [ ] Responsive design works
   - [ ] Touch interactions smooth

---

## 📊 Monitoring & Analytics

### Recommended Tools:

**1. Vercel Analytics** (if using Vercel)
- Already integrated
- Real-time performance metrics
- No setup needed

**2. Google Analytics**
```tsx
// src/app/layout.tsx
<Script
  src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
  strategy="afterInteractive"
/>
```

**3. Sentry (Error Tracking)**
```bash
npm install @sentry/nextjs
npx @sentry/wizard -i nextjs
```

**4. PostHog (Product Analytics)**
```bash
npm install posthog-js
# Already in .env.example
```

---

## 🔄 CI/CD Pipeline

### GitHub Actions Example:

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npm run build
      - run: npm test
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID}}
          vercel-project-id: ${{ secrets.PROJECT_ID}}
```

---

## 🐛 Troubleshooting

### Build Fails

**"Cannot read properties of undefined (reading 'S')"**
- This is expected with Three.js
- Build still succeeds (check `.next/` folder)
- Non-critical for production

**"Module not found"**
```bash
rm -rf node_modules .next
npm install
npm run build
```

### Runtime Errors

**"Supabase client error"**
- Check environment variables are set
- Verify Supabase URL is correct
- Check API keys are valid

**"OAuth not working"**
- Add production URL to Supabase OAuth settings
- Verify redirect URLs match exactly
- Test in incognito mode (clear cookies)

### Performance Issues

**Slow page loads**
- Enable caching headers
- Optimize images with Next.js Image
- Use ISR (Incremental Static Regeneration)

**3D scene laggy**
- Reduce particle count in hero-section.tsx
- Add loading skeleton
- Consider lazy loading

---

## 📈 Post-Launch

### Week 1:
- [ ] Monitor error rates
- [ ] Check user signup conversion
- [ ] Review performance metrics
- [ ] Collect user feedback

### Month 1:
- [ ] Analyze user behavior
- [ ] Optimize conversion funnel
- [ ] Add missing features
- [ ] Scale infrastructure if needed

### Ongoing:
- [ ] Regular security updates
- [ ] Dependency updates
- [ ] Performance optimization
- [ ] Feature development

---

## 🎯 Launch Checklist

Final checks before announcing:

- [ ] All tests pass
- [ ] Production environment variables set
- [ ] Database populated and tested
- [ ] OAuth providers configured
- [ ] SSL certificate active
- [ ] Custom domain configured
- [ ] Analytics tracking
- [ ] Error monitoring active
- [ ] Backup strategy in place
- [ ] Support email set up

---

## 🆘 Support

If you encounter issues:

1. Check `STATUS_REPORT.md` for known issues
2. Review Vercel/Netlify build logs
3. Check Supabase logs in dashboard
4. Enable development mode: `npm run dev`
5. Check browser console for errors

---

**Ready to deploy?** Start with Vercel for the easiest experience! 🚀

**Estimated time**: 15-30 minutes for first deployment
