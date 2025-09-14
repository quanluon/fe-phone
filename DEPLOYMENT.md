# AWS Amplify Deployment Guide

This guide will help you deploy your Next.js application to AWS Amplify.

## Prerequisites

1. **AWS Account**: You need an active AWS account
2. **Git Repository**: Your code should be in a Git repository (GitHub, GitLab, or Bitbucket)
3. **Backend API**: Your backend should be deployed (we'll use the API Gateway URL)

## Step 1: Prepare Your Repository

### 1.1 Commit Your Changes
```bash
git add .
git commit -m "Prepare for Amplify deployment"
git push origin main
```

### 1.2 Environment Variables
Create a `.env.production` file (don't commit this):
```bash
# API Configuration
NEXT_PUBLIC_API_URL=https://your-api-gateway-url.amazonaws.com/dev

# Environment
NODE_ENV=production
```

## Step 2: Deploy to AWS Amplify

### 2.1 Access AWS Amplify Console
1. Go to [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
2. Click "New app" → "Host web app"

### 2.2 Connect Repository
1. Choose your Git provider (GitHub, GitLab, or Bitbucket)
2. Authorize AWS Amplify to access your repositories
3. Select your repository: `cong-phone`
4. Select the branch: `main` (or your default branch)

### 2.3 Configure Build Settings
Amplify should automatically detect your Next.js app. The build settings should be:

**Build specification**: Use the `amplify.yml` file in your repository

**Environment variables** (add these in the Amplify console):
```
NEXT_PUBLIC_API_URL = https://your-api-gateway-url.amazonaws.com/dev
NODE_ENV = production
```

### 2.4 Advanced Build Settings (if needed)
If you need to customize the build, you can modify the `amplify.yml` file:

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
        - echo "Installing dependencies..."
    build:
      commands:
        - npm run build
        - echo "Build completed successfully"
  artifacts:
    baseDirectory: .next
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
      - .next/cache/**/*
```

## Step 3: Configure Domain (Optional)

### 3.1 Custom Domain
1. In the Amplify console, go to "Domain management"
2. Click "Add domain"
3. Enter your custom domain
4. Follow the DNS configuration instructions

### 3.2 SSL Certificate
Amplify automatically provides SSL certificates for your domain.

## Step 4: Environment Variables Setup

### 4.1 In Amplify Console
1. Go to your app in Amplify console
2. Click "Environment variables" in the left sidebar
3. Add the following variables:

| Key | Value | Description |
|-----|-------|-------------|
| `NEXT_PUBLIC_API_URL` | `https://your-api-gateway-url.amazonaws.com/dev` | Your backend API URL |
| `NODE_ENV` | `production` | Environment setting |

### 4.2 Update API Configuration
Make sure your `src/lib/api/config.ts` uses the environment variable:

```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
```

## Step 5: Deploy and Test

### 5.1 Deploy
1. Click "Save and deploy" in the Amplify console
2. Wait for the build to complete (usually 5-10 minutes)
3. Your app will be available at the provided Amplify URL

### 5.2 Test Your Deployment
1. Visit the provided Amplify URL
2. Test all functionality:
   - User authentication
   - Product browsing
   - Cart functionality
   - API calls to your backend

## Step 6: Continuous Deployment

### 6.1 Automatic Deployments
Amplify will automatically deploy when you push to your main branch.

### 6.2 Branch-based Deployments
You can set up different environments for different branches:
- `main` → Production
- `develop` → Staging
- `feature/*` → Preview deployments

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check the build logs in Amplify console
   - Ensure all dependencies are in `package.json`
   - Verify Node.js version compatibility

2. **API Connection Issues**
   - Verify `NEXT_PUBLIC_API_URL` is correct
   - Check CORS settings on your backend
   - Ensure API Gateway is deployed and accessible

3. **Environment Variables**
   - Make sure all required environment variables are set in Amplify
   - Variables starting with `NEXT_PUBLIC_` are available in the browser

4. **Static Export Issues**
   - If using static export, ensure `output: 'standalone'` in `next.config.ts`
   - Check that all dynamic routes are properly configured

### Build Logs
Always check the build logs in the Amplify console for detailed error information.

## Security Considerations

1. **Environment Variables**: Never commit sensitive data to your repository
2. **API Keys**: Store API keys in Amplify environment variables
3. **CORS**: Configure CORS properly on your backend
4. **HTTPS**: Amplify automatically provides HTTPS

## Performance Optimization

1. **Caching**: Amplify provides automatic caching
2. **CDN**: Your app is served from AWS CloudFront CDN
3. **Compression**: Enable gzip compression in your Next.js config
4. **Image Optimization**: Use Next.js Image component for optimized images

## Monitoring

1. **Amplify Console**: Monitor deployments and build status
2. **CloudWatch**: View logs and metrics
3. **Real User Monitoring**: Enable RUM for performance insights

## Cost Optimization

1. **Build Time**: Optimize build scripts to reduce build time
2. **Caching**: Use Amplify's caching features
3. **Static Assets**: Optimize images and assets
4. **Monitoring**: Monitor usage to avoid unexpected costs

## Support

- [AWS Amplify Documentation](https://docs.amplify.aws/)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
- [AWS Support](https://aws.amazon.com/support/)
