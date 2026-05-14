#!/bin/bash

echo "🚀 Initializing Git Repository for Kaizen..."

# 1. Initialize git if not already initialized
git init

# 2. Add .gitignore if missing (standard Expo gitignore)
if [ ! -f .gitignore ]; then
  echo "node_modules/
.expo/
dist/
npm-debug.*
*.jks
*.p8
*.p12
*.key
*.mobileprovision
*.orig.*
veda
.idea/
.DS_Store" > .gitignore
fi

# 3. Create structured commits

# Base Setup
git add package.json package-lock.json app.json tsconfig.json .gitignore
git commit -m "chore: initial project setup and dependencies"

# Store & Config
git add store/useStore.ts firebaseConfig.ts
git commit -m "feat: setup global state management and firebase config"

# Components
git add components/
git commit -m "feat: implement core UI components (HabitCard, Modals, FriendFeed)"

# Screens
git add app/
git commit -m "feat: build app navigation and core screens (Home, Friends, Challenges)"

# Any remaining files
git add .
git commit -m "chore: add remaining assets and configuration files"

echo "✅ Local commits created successfully!"
echo ""
echo "=================================================="
echo "🌟 NEXT STEPS TO PUSH TO GITHUB 🌟"
echo "=================================================="
echo "Since I don't have your GitHub password, please run these two commands in your terminal to create the repo and upload your code:"
echo ""
echo "1. Create the repository on GitHub (requires GitHub CLI):"
echo "   gh repo create Kaizen --public --source=. --remote=origin"
echo ""
echo "2. Push your code to GitHub:"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "(If you don't have 'gh' installed, simply create a new repo named 'Kaizen' manually on github.com, copy its URL, and run: 'git remote add origin <URL>' followed by 'git push -u origin main')"
