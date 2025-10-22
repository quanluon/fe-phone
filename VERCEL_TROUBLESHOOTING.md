# Vercel Deployment Troubleshooting Guide

## Issue: 500 Internal Server Error After Deployment

### Root Cause Analysis
The 500 error was caused by server-side data fetching failures in the SEO implementation. Here are the main issues that were fixed:

1. **No timeout handling** - Server-side fetch requests could hang indefinitely
2. **No retry mechanism** - Single API failures caused complete page failures
3. **No graceful fallbacks** - Missing API responses crashed the entire page
4. **Build-time API calls** - Static generation tried to call API during build
5. **Missing error boundaries** - Unhandled errors propagated to the client

## ✅ Fixes Applied

### 1. **Safe Server-Side Fetching** (`fe/src/lib/utils/server-fetch.ts`)
```typescript
// New utility with:
// - 5 second timeout by default
// - Automatic retries with exponential backoff
// - Proper error handling and logging
// - TypeScript safety
```

### 2. **Enhanced Error Handling**
- Added timeout controls (5s for product pages, 8s for sitemap)
- Implemented retry logic with exponential backoff
- Added graceful fallbacks when API is unavailable
- Proper error logging without crashing

### 3. **Disabled Build-Time API Calls**
```typescript
// generateStaticParams now returns [] to avoid build failures
export async function generateStaticParams() {
  return []; // Prevents build-time API calls
}
```

### 4. **Improved Product Page** (`fe/src/app/products/[slug]/page.tsx`)
- Uses `safeServerFetch` utility
- Validates API responses
- Handles missing product data gracefully
- Strips HTML from descriptions for SEO

### 5. **Enhanced Sitemap** (`fe/src/app/sitemap.ts`)
- Safe API calls with timeout and retries
- Fallback to static routes if API fails
- Proper error handling

## 🔧 Environment Variables Required

Make sure these are set in your Vercel project settings:

### Required Variables:
```env
NEXT_PUBLIC_API_URL=https://your-api-domain.com
NEXT_PUBLIC_APP_URL=https://your-app-domain.vercel.app
```

### Optional Variables:
```env
NODE_ENV=production
```

## 🧪 Testing Locally

### 1. Test Production Build
```bash
cd fe
npm run build
npm run start
```

### 2. Test with Missing API
```bash
# Temporarily set wrong API URL
NEXT_PUBLIC_API_URL=http://localhost:9999 npm run build
npm run start
```

### 3. Check Error Handling
- Visit product pages with invalid IDs
- Check browser console for proper error messages
- Verify pages still load (with error states)

## 🚀 Deployment Checklist

### Before Deploying:
- [ ] Environment variables set in Vercel
- [ ] API is accessible from Vercel's servers
- [ ] Build completes successfully locally
- [ ] No TypeScript errors

### After Deploying:
- [ ] Check Vercel function logs
- [ ] Test product pages manually
- [ ] Verify sitemap.xml loads
- [ ] Check robots.txt loads
- [ ] Test with invalid product IDs

## 🔍 Debugging Steps

### 1. Check Vercel Function Logs
```bash
# In Vercel dashboard:
# 1. Go to your project
# 2. Click "Functions" tab
# 3. Check recent function invocations
# 4. Look for error logs
```

### 2. Test API Connectivity
```bash
# Test if your API is accessible from Vercel
curl -I https://your-api-domain.com/api/products
```

### 3. Check Environment Variables
```bash
# In Vercel dashboard:
# 1. Go to Settings > Environment Variables
# 2. Verify NEXT_PUBLIC_API_URL is set
# 3. Verify NEXT_PUBLIC_APP_URL is set
```

### 4. Test Specific Endpoints
```bash
# Test product endpoint
curl https://your-api-domain.com/api/products/PRODUCT_ID

# Test categories endpoint  
curl https://your-api-domain.com/api/categories
```

## 🐛 Common Issues & Solutions

### Issue: "API responded with status: 404"
**Solution:** Check if the API endpoint exists and product ID is valid

### Issue: "Request timeout after 5000ms"
**Solution:** 
- Check API server performance
- Verify API is accessible from Vercel's servers
- Consider increasing timeout in `server-fetch.ts`

### Issue: "Invalid API response structure"
**Solution:** 
- Verify API returns `{ data: { ... } }` structure
- Check API documentation for response format

### Issue: Build fails with "fetch failed"
**Solution:**
- Ensure `generateStaticParams` returns empty array
- Don't call API during build time

## 📊 Monitoring & Alerts

### Set up monitoring for:
1. **API response times** - Should be < 2 seconds
2. **Error rates** - Should be < 5%
3. **Page load times** - Should be < 3 seconds
4. **Vercel function timeouts** - Monitor function logs

### Recommended tools:
- Vercel Analytics (built-in)
- Sentry for error tracking
- Uptime monitoring for API

## 🔄 Fallback Strategy

If API is completely unavailable:
1. **Product pages** - Show "Product not found" with proper SEO
2. **Sitemap** - Returns static routes only
3. **Metadata** - Uses fallback titles and descriptions
4. **Client-side** - Still works with client-side API calls

## 📝 Additional Recommendations

### 1. **API Health Check**
Create a simple health endpoint:
```typescript
// In your API
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
```

### 2. **Caching Strategy**
- API responses cached for 1 hour (ISR)
- Static assets cached by Vercel CDN
- Consider Redis for API response caching

### 3. **Error Boundaries**
Add React error boundaries for client-side error handling:
```typescript
// Wrap components in error boundaries
<ErrorBoundary fallback={<ErrorPage />}>
  <ProductDetail />
</ErrorBoundary>
```

### 4. **Performance Monitoring**
- Monitor Core Web Vitals
- Track API response times
- Set up alerts for high error rates

## 🆘 Emergency Rollback

If deployment fails:
1. **Revert to previous deployment** in Vercel dashboard
2. **Disable server-side fetching** temporarily:
   ```typescript
   // In page.tsx, comment out getProduct call
   // const product = await getProduct(slug);
   const product = null; // Temporary fallback
   ```
3. **Deploy hotfix** with client-side only rendering

## 📞 Support

If issues persist:
1. Check Vercel function logs
2. Test API endpoints manually
3. Verify environment variables
4. Check network connectivity from Vercel
5. Contact Vercel support if needed

## 🎯 Success Metrics

After fixes, you should see:
- ✅ No 500 errors in Vercel logs
- ✅ Product pages load successfully
- ✅ SEO metadata works properly
- ✅ Sitemap.xml accessible
- ✅ Graceful error handling
- ✅ Fast page loads (< 3 seconds)
