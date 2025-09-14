#!/bin/bash

# AWS Amplify Deployment Script
# This script helps prepare your Next.js app for Amplify deployment

echo "🚀 Preparing Next.js app for AWS Amplify deployment..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the frontend directory."
    exit 1
fi

# Check if amplify.yml exists
if [ ! -f "amplify.yml" ]; then
    echo "❌ Error: amplify.yml not found. Please ensure the Amplify configuration file exists."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Run linting
echo "🔍 Running linting..."
npm run lint

# Build the application
echo "🏗️  Building the application..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
    echo "🎉 Your app is ready for Amplify deployment!"
    echo ""
    echo "Next steps:"
    echo "1. Commit your changes: git add . && git commit -m 'Deploy to Amplify'"
    echo "2. Push to your repository: git push origin main"
    echo "3. Go to AWS Amplify Console: https://console.aws.amazon.com/amplify/"
    echo "4. Create a new app and connect your repository"
    echo "5. Set environment variables in Amplify console:"
    echo "   - NEXT_PUBLIC_API_URL=https://adjxk71gc3.execute-api.ap-southeast-1.amazonaws.com/dev"
    echo "   - NODE_ENV=production"
    echo ""
    echo "📖 For detailed instructions, see DEPLOYMENT.md"
else
    echo "❌ Build failed. Please fix the errors before deploying."
    exit 1
fi
