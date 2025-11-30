# Developer Workflow & Local Development

## Quick Start

```bash
# Clone repository
git clone <repository-url>
cd blog-micro-fe

# Install dependencies
npm install

# Start all applications
npm run dev

# Open browser
open http://localhost:3000
```

---

## 1. Project Setup

### 1.1 Prerequisites

- **Node.js**: v18+ (LTS recommended)
- **npm**: v9+
- **Git**: Latest version
- **IDE**: VS Code (recommended) with extensions:
  - ESLint
  - Prettier
  - TypeScript
  - Jest Runner

---

### 1.2 Initial Setup

**Step 1**: Install root dependencies

```bash
npm install
```

**Step 2**: Install workspace dependencies

```bash
npm run bootstrap
# or with lerna
npx lerna bootstrap
```

**Step 3**: Build shared UI (required first)

```bash
cd packages/shared-ui
npm run build
```

---

## 2. Development Scripts

### 2.1 Root Package.json

**File**: `package.json`

```json
{
  "name": "blog-micro-fe",
  "version": "1.0.0",
  "private": true,
  "workspaces": ["packages/*"],
  "scripts": {
    "dev": "concurrently \"npm:dev:*\"",
    "dev:shell": "cd packages/shell && npm start",
    "dev:posts": "cd packages/posts && npm start",
    "dev:post-detail": "cd packages/post-detail && npm start",
    "dev:editor": "cd packages/editor && npm start",
    "dev:comments": "cd packages/comments && npm start",
    "dev:author": "cd packages/author && npm start",
    "dev:shared-ui": "cd packages/shared-ui && npm start",

    "build": "npm run build:remotes && npm run build:shell",
    "build:shell": "cd packages/shell && npm run build",
    "build:remotes": "concurrently \"npm:build:remote:*\"",
    "build:remote:posts": "cd packages/posts && npm run build",
    "build:remote:post-detail": "cd packages/post-detail && npm run build",
    "build:remote:editor": "cd packages/editor && npm run build",
    "build:remote:comments": "cd packages/comments && npm run build",
    "build:remote:author": "cd packages/author && npm run build",
    "build:remote:shared-ui": "cd packages/shared-ui && npm run build",

    "test": "npm run test --workspaces",
    "test:watch": "npm run test:watch --workspaces",
    "test:coverage": "npm run test:coverage --workspaces",
    "test:e2e": "playwright test",

    "lint": "eslint packages/*/src --ext .ts,.tsx",
    "lint:fix": "eslint packages/*/src --ext .ts,.tsx --fix",
    "format": "prettier --write \"packages/*/src/**/*.{ts,tsx,css}\"",

    "storybook": "npm run storybook --workspace=@blog/shared-ui",
    "storybook:posts": "npm run storybook --workspace=@blog/posts",

    "clean": "npm run clean --workspaces && rm -rf node_modules",
    "bootstrap": "npm install && npm run build:remote:shared-ui"
  },
  "devDependencies": {
    "concurrently": "^8.2.0",
    "lerna": "^7.0.0",
    "@playwright/test": "^1.40.0",
    "eslint": "^8.50.0",
    "prettier": "^3.0.0",
    "typescript": "^5.2.0"
  }
}
```

---

### 2.2 Individual Package Scripts

**File**: `packages/posts/package.json`

```json
{
  "name": "@blog/posts",
  "version": "1.0.0",
  "scripts": {
    "start": "webpack serve --config webpack.config.js",
    "build": "webpack --config webpack.prod.js",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "storybook": "storybook dev -p 6001",
    "build-storybook": "storybook build",
    "clean": "rm -rf dist"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@babel/core": "^7.23.0",
    "@babel/preset-env": "^7.23.0",
    "@babel/preset-react": "^7.22.0",
    "@babel/preset-typescript": "^7.23.0",
    "@storybook/react-webpack5": "^7.5.0",
    "@testing-library/react": "^14.0.0",
    "@testing-library/jest-dom": "^6.1.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "babel-loader": "^9.1.0",
    "css-loader": "^6.8.0",
    "html-webpack-plugin": "^5.5.0",
    "jest": "^29.7.0",
    "jest-environment-jsdom": "^29.7.0",
    "style-loader": "^3.3.0",
    "ts-jest": "^29.1.0",
    "typescript": "^5.2.0",
    "webpack": "^5.89.0",
    "webpack-cli": "^5.1.0",
    "webpack-dev-server": "^4.15.0"
  }
}
```

---

## 3. Development Workflow

### 3.1 Single Command Start

**Script**: `scripts/dev.sh`

```bash
#!/bin/bash

echo "🚀 Starting Blog Microfrontend Development Environment"
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
  echo "📦 Installing dependencies..."
  npm install
fi

# Build shared-ui first (required)
echo "🔨 Building shared-ui..."
cd packages/shared-ui
npm run build
cd ../..

# Start all applications
echo "🏃 Starting all applications..."
echo ""
echo "Shell:        http://localhost:3000"
echo "Posts:        http://localhost:3001"
echo "Post Detail:  http://localhost:3002"
echo "Editor:       http://localhost:3003"
echo "Comments:     http://localhost:3004"
echo "Author:       http://localhost:3005"
echo "Shared UI:    http://localhost:3006"
echo ""

npm run dev
```

**Make executable**:

```bash
chmod +x scripts/dev.sh
```

**Usage**:

```bash
./scripts/dev.sh
```

---

### 3.2 Selective Development

**Start only shell + posts**:

```bash
npm run dev:shell & npm run dev:posts
```

**Start specific remote**:

```bash
cd packages/posts
npm start
```

---

### 3.3 Hot Module Replacement (HMR)

**Webpack Dev Server Config** (already configured):

```javascript
devServer: {
  port: 3001,
  hot: true,
  historyApiFallback: true,
}
```

**HMR works automatically** for:

- Component changes
- CSS changes
- Type changes

**HMR does NOT work** for:

- Webpack config changes (requires restart)
- Module Federation config changes (requires restart)

---

## 4. Working with Remotes

### 4.1 Developing a Remote in Isolation

**Step 1**: Start the remote

```bash
cd packages/posts
npm start
```

**Step 2**: Open standalone view

```
http://localhost:3001
```

**Step 3**: Use Storybook for component development

```bash
npm run storybook
```

---

### 4.2 Testing Remote Integration

**Step 1**: Start shell + remote

```bash
# Terminal 1
cd packages/shell
npm start

# Terminal 2
cd packages/posts
npm start
```

**Step 2**: Navigate to shell

```
http://localhost:3000
```

**Step 3**: Verify remote loads correctly

---

### 4.3 Debugging Remote Loading Issues

**Check browser console** for errors:

```
Failed to load remote entry: posts
```

**Common issues**:

1. **Remote not running**: Start the remote application
2. **Port mismatch**: Check webpack config ports
3. **CORS issues**: Ensure `Access-Control-Allow-Origin: *` header
4. **Module not exposed**: Check `exposes` in ModuleFederationPlugin

**Debug checklist**:

```bash
# Verify remote is running
curl http://localhost:3001/remoteEntry.js

# Check exposed modules
curl http://localhost:3001/remoteEntry.js | grep "PostList"

# Verify CORS headers
curl -I http://localhost:3001/remoteEntry.js
```

---

## 5. Testing Workflow

### 5.1 Unit Tests

**Run all tests**:

```bash
npm test
```

**Run tests for specific package**:

```bash
cd packages/posts
npm test
```

**Watch mode**:

```bash
npm run test:watch
```

**Coverage**:

```bash
npm run test:coverage
```

---

### 5.2 Integration Tests

**Run integration tests**:

```bash
npm run test:integration
```

---

### 5.3 E2E Tests

**Run E2E tests**:

```bash
# Start dev servers first
npm run dev

# In another terminal
npm run test:e2e
```

**Run with UI**:

```bash
npm run test:e2e:ui
```

**Run specific test**:

```bash
npx playwright test e2e/blog-flow.spec.ts
```

---

## 6. Code Quality

### 6.1 Linting

**Run ESLint**:

```bash
npm run lint
```

**Auto-fix issues**:

```bash
npm run lint:fix
```

**ESLint Config** (`eslintrc.js`):

```javascript
module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:jsx-a11y/recommended",
  ],
  parser: "@typescript-eslint/parser",
  plugins: ["react", "@typescript-eslint", "jsx-a11y"],
  rules: {
    "react/react-in-jsx-scope": "off",
    "@typescript-eslint/no-explicit-any": "warn",
    "jsx-a11y/anchor-is-valid": "warn",
  },
  settings: {
    react: {
      version: "detect",
    },
  },
};
```

---

### 6.2 Formatting

**Run Prettier**:

```bash
npm run format
```

**Prettier Config** (`.prettierrc`):

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false
}
```

---

### 6.3 Pre-commit Hooks

**Install Husky**:

```bash
npm install --save-dev husky lint-staged
npx husky install
```

**Add pre-commit hook**:

```bash
npx husky add .husky/pre-commit "npx lint-staged"
```

**Lint-staged Config** (`.lintstagedrc`):

```json
{
  "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
  "*.{css,scss}": ["prettier --write"]
}
```

---

## 7. Debugging

### 7.1 VS Code Debug Configuration

**File**: `.vscode/launch.json`

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "chrome",
      "request": "launch",
      "name": "Debug Shell",
      "url": "http://localhost:3000",
      "webRoot": "${workspaceFolder}/packages/shell/src",
      "sourceMapPathOverrides": {
        "webpack:///./*": "${webRoot}/*"
      }
    },
    {
      "type": "node",
      "request": "launch",
      "name": "Jest Tests",
      "program": "${workspaceFolder}/node_modules/.bin/jest",
      "args": ["--runInBand", "--no-cache"],
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen"
    }
  ]
}
```

---

### 7.2 Browser DevTools

**React DevTools**:

- Install React DevTools extension
- Inspect component tree
- View props and state

**Module Federation DevTools**:

- Check Network tab for `remoteEntry.js` loads
- Verify chunk loading
- Check for errors

---

### 7.3 Common Issues

#### Issue: Remote not loading

**Solution**:

1. Check remote is running: `curl http://localhost:3001/remoteEntry.js`
2. Check browser console for errors
3. Verify webpack config `remotes` URLs
4. Clear browser cache

#### Issue: Type errors in remote imports

**Solution**:

1. Ensure `remotes.d.ts` is up to date
2. Restart TypeScript server in IDE
3. Run `npm run build` in remote package

#### Issue: CSS not loading

**Solution**:

1. Check CSS loader configuration
2. Verify CSS import statements
3. Check for CSS module naming conflicts

#### Issue: HMR not working

**Solution**:

1. Restart dev server
2. Check webpack config `hot: true`
3. Clear browser cache
4. Check for syntax errors

---

## 8. Storybook Workflow

### 8.1 Running Storybook

**Shared UI Storybook**:

```bash
cd packages/shared-ui
npm run storybook
```

**Posts Storybook**:

```bash
cd packages/posts
npm run storybook
```

---

### 8.2 Writing Stories

**Create story file**:

```bash
touch packages/posts/stories/PostCard.stories.tsx
```

**Write story** (see TESTING.md for examples)

**View in Storybook**:

```
http://localhost:6001
```

---

## 9. Git Workflow

### 9.1 Branch Strategy

```
main
├── develop
│   ├── feature/post-list
│   ├── feature/post-editor
│   └── bugfix/comment-loading
└── release/v1.0.0
```

---

### 9.2 Commit Convention

**Format**: `<type>(<scope>): <subject>`

**Types**:

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting
- `refactor`: Code restructuring
- `test`: Adding tests
- `chore`: Maintenance

**Examples**:

```bash
git commit -m "feat(posts): add search functionality"
git commit -m "fix(editor): resolve auto-save issue"
git commit -m "docs(readme): update setup instructions"
```

---

### 9.3 Pull Request Checklist

- [ ] Code follows style guidelines
- [ ] All tests pass
- [ ] New tests added for new features
- [ ] Documentation updated
- [ ] No console errors or warnings
- [ ] Accessibility checked
- [ ] Performance impact assessed

---

## 10. Troubleshooting

### 10.1 Clean Install

```bash
# Remove all node_modules and build artifacts
npm run clean

# Reinstall dependencies
npm install

# Rebuild
npm run build
```

---

### 10.2 Port Conflicts

**Check ports in use**:

```bash
lsof -i :3000
lsof -i :3001
```

**Kill process**:

```bash
kill -9 <PID>
```

**Change port** (in webpack config):

```javascript
devServer: {
  port: 3007, // Change to available port
}
```

---

### 10.3 TypeScript Errors

**Restart TypeScript server** (VS Code):

```
Cmd+Shift+P → TypeScript: Restart TS Server
```

**Regenerate types**:

```bash
npm run build --workspace=@blog/shared-ui
```

---

## 11. Performance Profiling

### 11.1 Webpack Bundle Analyzer

```bash
cd packages/shell
ANALYZE=true npm run build
```

---

### 11.2 React Profiler

**Enable in code**:

```tsx
import { Profiler } from "react";

<Profiler id="PostList" onRender={onRenderCallback}>
  <PostList />
</Profiler>;
```

---

## 12. Daily Development Checklist

### Morning Setup

- [ ] Pull latest changes: `git pull`
- [ ] Install new dependencies: `npm install`
- [ ] Start dev environment: `npm run dev`
- [ ] Check for breaking changes in Slack/email

### Before Committing

- [ ] Run tests: `npm test`
- [ ] Run linter: `npm run lint`
- [ ] Format code: `npm run format`
- [ ] Check for console errors
- [ ] Test in multiple browsers

### Before PR

- [ ] Rebase on develop: `git rebase develop`
- [ ] Run full test suite: `npm run test:coverage`
- [ ] Run E2E tests: `npm run test:e2e`
- [ ] Update documentation
- [ ] Add changeset (if using changesets)

---

## 13. Useful Commands Reference

```bash
# Development
npm run dev                    # Start all apps
npm run dev:shell              # Start shell only
npm run dev:posts              # Start posts only

# Building
npm run build                  # Build all
npm run build:shell            # Build shell
npm run build:remotes          # Build all remotes

# Testing
npm test                       # Run all tests
npm run test:watch             # Watch mode
npm run test:coverage          # With coverage
npm run test:e2e               # E2E tests

# Code Quality
npm run lint                   # Lint code
npm run lint:fix               # Fix lint issues
npm run format                 # Format code

# Storybook
npm run storybook              # Shared UI storybook
npm run storybook:posts        # Posts storybook

# Utilities
npm run clean                  # Clean all
npm run bootstrap              # Setup project
```
