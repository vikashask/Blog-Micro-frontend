#!/bin/bash

echo "🚀 Setting up Blog Microfrontend Application"
echo ""

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Install dependencies for each package
echo ""
echo "📦 Installing package dependencies..."

packages=("shared-ui" "posts" "post-detail" "comments" "shell")

for package in "${packages[@]}"; do
  echo "  → Installing dependencies for $package..."
  cd packages/$package
  npm install
  cd ../..
done

echo ""
echo "✅ Setup complete!"
echo ""
echo "To start the application, run:"
echo "  npm run dev"
echo ""
echo "The application will be available at:"
echo "  Shell (Main App): http://localhost:3000"
echo "  Posts:            http://localhost:3001"
echo "  Post Detail:      http://localhost:3002"
echo "  Comments:         http://localhost:3004"
echo "  Shared UI:        http://localhost:3006"
