#!/bin/bash
# Render Deployment Helper Script
# This script helps prepare your Rock Stock app for deployment to Render

set -e

echo "🚀 Rock Stock - Render Deployment Helper"
echo "=========================================="
echo ""

# Check if Git is initialized
if [ ! -d .git ]; then
    echo "❌ Error: Not a git repository. Please run 'git init' first."
    exit 1
fi

# Check if files exist
if [ ! -f "render.yaml" ]; then
    echo "❌ Error: render.yaml not found. Make sure you're in the project root."
    exit 1
fi

echo "✅ Git repository found"
echo "✅ render.yaml found"
echo ""

# Verify dependencies
echo "Checking dependencies..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not installed"
    exit 1
fi
echo "✅ Node.js v$(node -v)"

if ! command -v npm &> /dev/null; then
    echo "❌ npm not installed"
    exit 1
fi
echo "✅ npm v$(npm -v)"

echo ""
echo "Pre-deployment Checks"
echo "====================="

# Check backend
echo ""
echo "Checking backend..."
cd backend

if [ ! -f "package.json" ]; then
    echo "❌ package.json not found in backend/"
    exit 1
fi
echo "✅ package.json found"

if [ ! -f "tsconfig.json" ]; then
    echo "❌ tsconfig.json not found in backend/"
    exit 1
fi
echo "✅ tsconfig.json found"

# Install and build
echo "Installing dependencies..."
npm install --quiet

echo "Building TypeScript..."
npm run build

echo "Running tests..."
npm test -- --passWithNoTests

echo "✅ Backend ready for deployment"

cd ..

# Check frontend
echo ""
echo "Checking frontend..."
cd frontend

if [ ! -f "package.json" ]; then
    echo "❌ package.json not found in frontend/"
    exit 1
fi
echo "✅ package.json found"

if [ ! -f "angular.json" ]; then
    echo "❌ angular.json not found in frontend/"
    exit 1
fi
echo "✅ angular.json found"

# Install and build
echo "Installing dependencies..."
npm install --quiet

echo "Building Angular..."
npm run build

echo "✅ Frontend ready for deployment"

cd ..

echo ""
echo "✅ All checks passed!"
echo ""
echo "Next steps:"
echo "==========="
echo "1. Commit your changes:"
echo "   git add ."
echo "   git commit -m 'chore: Prepare for Render deployment'"
echo "   git push origin main"
echo ""
echo "2. Deploy to Render:"
echo "   Option A: Visit https://render.com and connect your GitHub repo"
echo "   Option B: Use render.yaml for automatic deployment"
echo ""
echo "3. Set environment variables in Render Dashboard:"
echo "   - RAPIDAPI_KEY (required for live API)"
echo "   - RAPIDAPI_HOST (default: real-time-finance-data.p.rapidapi.com)"
echo "   - CACHE_TTL_SECONDS (default: 600)"
echo "   - REDIS_URL (optional, for Redis caching)"
echo ""
echo "4. Monitor deployment at https://dashboard.render.com"
echo ""
echo "📖 For detailed instructions, see RENDER_DEPLOYMENT.md"
echo ""
echo "🎉 Happy deploying!"
