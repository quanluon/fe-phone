# Vercel Deployment Guide

This guide will help you deploy your Next.js application to Vercel with proper routing support.

## ✅ **Fixed Issues**

### **Routing Problems Resolved:**
1. **Removed static export** (`output: 'export'`) - Vercel handles Next.js routing automatically
2. **Updated vercel.json** - Proper Next.js configuration for Vercel
3. **Fixed i18n configuration** - Restored server-side rendering support
4. **Updated image domains** - Added your API domain for image optimization
5. **Enabled ISR** - Incremental Static Regeneration for better performance

## 🚀 **Deploy to Vercel**

### **Method 1: Vercel CLI (Recommended)**
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from your project directory
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? (your account)
# - Link to existing project? No
# - Project name: fe-phone (or your preferred name)
# - Directory: ./
# - Override settings? No
```

### **Method 2: GitHub Integration**
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"New Project"**
3. Import your GitHub repository: `quanluon/fe-phone`
4. Vercel will auto-detect Next.js settings
5. Click **"Deploy"**

## ⚙️ **Environment Variables**

Set these in your Vercel project settings:

| Variable | Value | Description |
|----------|-------|-------------|
| `NEXT_PUBLIC_API_URL` | `https://oh8kpjl5uf.execute-api.ap-southeast-1.amazonaws.com/dev` | Your backend API URL |
| `NEXT_PUBLIC_APP_URL` | `https://your-app.vercel.app` | Your Vercel app URL |

### **How to Set Environment Variables:**
1. Go to your project in Vercel Dashboard
2. Click **"Settings"** tab
3. Click **"Environment Variables"**
4. Add each variable with the values above
5. Click **"Save"**

## 🔧 **Configuration Details**

### **vercel.json**
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "functions": {
    "app/**/*.tsx": {
      "runtime": "nodejs18.x"
    }
  }
}
```

### **next.config.js**
- ✅ **Removed** `output: 'export'`
- ✅ **Added** your API domain to image domains
- ✅ **Enabled** rewrites and headers
- ✅ **Configured** for server-side rendering

### **Routing Features**
- ✅ **Dynamic Routes**: `/products/[slug]` with ISR
- ✅ **API Routes**: Proxied to your backend
- ✅ **Middleware**: Internationalization support
- ✅ **Image Optimization**: Automatic with Vercel

## 📊 **Build Output**
```
Route (app)                                 Size  First Load JS    
┌ ƒ /                                    2.35 kB         177 kB
├ ƒ /_not-found                            991 B         103 kB
├ ƒ /cart                                4.98 kB         138 kB
├ ƒ /products                            2.83 kB         177 kB
└ ● /products/[slug]                     4.43 kB         173 kB
    ├ /products/iphone-15-pro-max
    ├ /products/iphone-15-pro
    ├ /products/iphone-15
    └ [+4 more paths]
```

## 🎯 **Key Features**

### **Server-Side Rendering (SSR)**
- Dynamic routes work properly
- SEO-friendly pages
- Fast initial page loads

### **Incremental Static Regeneration (ISR)**
- Product pages are pre-generated
- Automatic revalidation every hour
- Best of both worlds: speed + freshness

### **API Proxying**
- `/api/*` routes are proxied to your backend
- Seamless integration with your existing API

### **Image Optimization**
- Automatic image optimization
- WebP conversion
- Responsive images

## 🔍 **Testing Your Deployment**

### **1. Check All Routes**
- ✅ Home page: `/`
- ✅ Products page: `/products`
- ✅ Product detail: `/products/iphone-15-pro-max`
- ✅ Cart page: `/cart`

### **2. Test API Integration**
- ✅ Product data loads correctly
- ✅ Images display properly
- ✅ Search and filtering work

### **3. Test Performance**
- ✅ Fast page loads
- ✅ Proper caching
- ✅ Image optimization

## 🛠️ **Troubleshooting**

### **Common Issues:**

1. **404 on Refresh**
   - ✅ **Fixed**: Removed static export, using proper Next.js routing

2. **API Calls Failing**
   - ✅ **Fixed**: Added proper environment variables
   - ✅ **Fixed**: Configured API proxying

3. **Images Not Loading**
   - ✅ **Fixed**: Added API domain to image domains
   - ✅ **Fixed**: Configured remote patterns

4. **Build Failures**
   - ✅ **Fixed**: Removed conflicting static export config
   - ✅ **Fixed**: Updated i18n for server-side rendering

### **Debug Commands:**
```bash
# Test build locally
npm run build

# Test production build
npm run start

# Check Vercel deployment logs
vercel logs
```

## 📈 **Performance Optimizations**

### **Automatic Optimizations:**
- ✅ **Code Splitting**: Automatic per-page splitting
- ✅ **Tree Shaking**: Unused code removal
- ✅ **Image Optimization**: WebP conversion, lazy loading
- ✅ **Caching**: Edge caching for static assets
- ✅ **CDN**: Global content delivery

### **Manual Optimizations:**
- ✅ **ISR**: Product pages revalidate every hour
- ✅ **Static Generation**: Common pages pre-built
- ✅ **Bundle Analysis**: Optimized bundle sizes

## 🔒 **Security Features**

### **Headers Configuration:**
- ✅ **X-Frame-Options**: DENY
- ✅ **X-Content-Type-Options**: nosniff
- ✅ **Referrer-Policy**: origin-when-cross-origin

### **Environment Variables:**
- ✅ **Secure**: Server-side only variables
- ✅ **Public**: Client-side variables prefixed with `NEXT_PUBLIC_`

## 🎉 **Success!**

Your Next.js application is now properly configured for Vercel deployment with:
- ✅ **Working routing** for all pages
- ✅ **Dynamic routes** with ISR
- ✅ **API integration** with your backend
- ✅ **Image optimization** and CDN
- ✅ **Performance optimizations**
- ✅ **Security headers**

Deploy to Vercel and enjoy fast, reliable hosting! 🚀
