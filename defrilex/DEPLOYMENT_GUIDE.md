# Defrilex Platform Deployment Guide

## 🚀 Production Deployment

This guide will help you deploy the Defrilex freelancing platform to production using Vercel and a PostgreSQL database.

## 📋 Prerequisites

Before deploying, ensure you have:

- [ ] Vercel account (free tier available)
- [ ] PostgreSQL database (Supabase, PlanetScale, or Railway recommended)
- [ ] Google OAuth app credentials
- [ ] GitHub OAuth app credentials
- [ ] Domain name (optional, Vercel provides free subdomain)

## 🗄️ Database Setup

### Option 1: Supabase (Recommended)

1. **Create Supabase Project**
   ```bash
   # Visit https://supabase.com
   # Create new project
   # Copy the database URL from Settings > Database
   ```

2. **Get Database URL**
   ```
   postgresql://postgres:[password]@[host]:5432/postgres
   ```

### Option 2: PlanetScale

1. **Create PlanetScale Database**
   ```bash
   # Visit https://planetscale.com
   # Create new database
   # Get connection string
   ```

### Option 3: Railway

1. **Create Railway Database**
   ```bash
   # Visit https://railway.app
   # Create PostgreSQL service
   # Copy database URL
   ```

## 🔐 OAuth Setup

### Google OAuth

1. **Google Cloud Console**
   ```bash
   # Visit https://console.cloud.google.com
   # Create new project or select existing
   # Enable Google+ API
   # Create OAuth 2.0 credentials
   ```

2. **Configure OAuth**
   ```
   Authorized JavaScript origins: https://your-domain.vercel.app
   Authorized redirect URIs: https://your-domain.vercel.app/api/auth/callback/google
   ```

### GitHub OAuth

1. **GitHub Developer Settings**
   ```bash
   # Visit https://github.com/settings/developers
   # Create new OAuth App
   ```

2. **Configure OAuth**
   ```
   Homepage URL: https://your-domain.vercel.app
   Authorization callback URL: https://your-domain.vercel.app/api/auth/callback/github
   ```

## 🌐 Vercel Deployment

### Step 1: Connect Repository

1. **Import Project**
   ```bash
   # Visit https://vercel.com/new
   # Import your GitHub repository
   # Select the defrilex folder as root directory
   ```

2. **Configure Build Settings**
   ```
   Framework Preset: Next.js
   Root Directory: ./
   Build Command: cd apps/web && npm run build
   Output Directory: apps/web/.next
   Install Command: npm install
   ```

### Step 2: Environment Variables

Add these environment variables in Vercel dashboard:

```bash
# NextAuth Configuration
NEXTAUTH_URL=https://your-project.vercel.app
NEXTAUTH_SECRET=your-super-secret-key-min-32-chars

# Database
DATABASE_URL=your-postgresql-connection-string

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# GitHub OAuth
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

### Step 3: Deploy

1. **Initial Deployment**
   ```bash
   # Vercel will automatically deploy on push to main branch
   # Monitor deployment in Vercel dashboard
   ```

2. **Database Migration**
   ```bash
   # After first deployment, run database migration
   # In Vercel dashboard, go to Functions tab
   # Or use Vercel CLI locally:
   
   npx vercel env pull .env.local
   cd apps/web
   npx prisma db push
   ```

## 🔧 Post-Deployment Setup

### Database Migration

```bash
# Option 1: Using Vercel CLI
npx vercel env pull .env.local
cd apps/web
npx prisma generate
npx prisma db push

# Option 2: Using database client
# Connect to your database and run the schema manually
```

### Verify Deployment

1. **Check Application**
   - Visit your deployed URL
   - Test user registration
   - Test OAuth login
   - Verify all features work

2. **Monitor Performance**
   - Check Vercel Analytics
   - Monitor database connections
   - Test API endpoints

## 🛠️ Build Commands

### Local Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Production Build
```bash
# In apps/web directory
npm run build
npm start
```

## 📊 Monitoring & Analytics

### Vercel Analytics
```bash
# Enable in Vercel dashboard
# Monitor page views, performance, and errors
```

### Database Monitoring
```bash
# Monitor connection pool usage
# Track query performance
# Set up alerts for high usage
```

## 🔒 Security Checklist

- [ ] **Environment Variables**: All secrets properly configured
- [ ] **HTTPS**: Enabled by default on Vercel
- [ ] **OAuth**: Proper redirect URIs configured
- [ ] **Database**: Connection string secured
- [ ] **CORS**: Properly configured for your domain
- [ ] **Rate Limiting**: Consider implementing for API routes

## 🚨 Troubleshooting

### Common Issues

1. **Build Failures**
   ```bash
   # Check build logs in Vercel dashboard
   # Verify all dependencies are installed
   # Check TypeScript errors
   ```

2. **Database Connection Issues**
   ```bash
   # Verify DATABASE_URL format
   # Check database server status
   # Verify connection limits
   ```

3. **OAuth Issues**
   ```bash
   # Verify redirect URIs match exactly
   # Check client ID and secret
   # Ensure OAuth apps are active
   ```

4. **Environment Variables**
   ```bash
   # Verify all required variables are set
   # Check for typos in variable names
   # Ensure NEXTAUTH_SECRET is at least 32 characters
   ```

## 📈 Performance Optimization

### Database Optimization
```bash
# Use connection pooling
# Implement proper indexing
# Monitor query performance
```

### Frontend Optimization
```bash
# Images are optimized with Next.js Image component
# Static assets are cached
# Code splitting is automatic with Next.js
```

### API Optimization
```bash
# Implement caching where appropriate
# Use pagination for large datasets
# Monitor API response times
```

## 🔄 Continuous Deployment

### Automatic Deployments
```bash
# Vercel automatically deploys on:
# - Push to main branch (production)
# - Push to other branches (preview deployments)
```

### Preview Deployments
```bash
# Every pull request gets a preview URL
# Test changes before merging
# Share with team for review
```

## 📱 Custom Domain (Optional)

### Add Custom Domain
```bash
# In Vercel dashboard:
# 1. Go to project settings
# 2. Click "Domains"
# 3. Add your custom domain
# 4. Configure DNS records as instructed
```

### SSL Certificate
```bash
# Vercel automatically provisions SSL certificates
# No additional configuration needed
```

## 🎯 Success Metrics

After deployment, monitor:

- [ ] **Uptime**: 99.9% availability target
- [ ] **Performance**: Page load times under 2 seconds
- [ ] **User Registration**: Successful OAuth flows
- [ ] **Database**: Connection stability
- [ ] **API**: Response times under 500ms

## 📞 Support

### Resources
- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [NextAuth.js Documentation](https://next-auth.js.org)

### Community
- [Vercel Discord](https://vercel.com/discord)
- [Next.js GitHub Discussions](https://github.com/vercel/next.js/discussions)

---

## 🎉 Deployment Complete!

Once deployed, your Defrilex platform will be live at:
- **Production URL**: `https://your-project.vercel.app`
- **Custom Domain**: `https://your-domain.com` (if configured)

The platform includes:
- ✅ User authentication and profiles
- ✅ Service provider search and discovery
- ✅ Project management system
- ✅ Real-time messaging
- ✅ Payment processing
- ✅ Responsive design
- ✅ Production-ready architecture

**Your freelancing platform is now live and ready for users!** 🚀
