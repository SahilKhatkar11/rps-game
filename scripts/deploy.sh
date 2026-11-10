#!/usr/bin/env bash
set -e

echo "🚀 Building Rock Paper Scissors static distribution..."
npm run build

echo "📦 Deploying dist/ to GitHub Pages via gh-pages..."
npx gh-pages -d dist

echo "✅ Deployment complete! Check your GitHub repository Pages settings."
