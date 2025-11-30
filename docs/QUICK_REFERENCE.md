# Quick Reference Guide

> Fast lookup for common tasks, commands, and patterns

---

## 🚀 Quick Start

```bash
npm install && npm run dev
```

Open http://localhost:3000

---

## 📦 Port Reference

| Application | Port | URL                   |
| ----------- | ---- | --------------------- |
| Shell       | 3000 | http://localhost:3000 |
| Posts       | 3001 | http://localhost:3001 |
| Post Detail | 3002 | http://localhost:3002 |
| Editor      | 3003 | http://localhost:3003 |
| Comments    | 3004 | http://localhost:3004 |
| Author      | 3005 | http://localhost:3005 |
| Shared UI   | 3006 | http://localhost:3006 |

---

## 🛠️ Common Commands

### Development

```bash
npm run dev                    # Start all apps
npm run dev:shell              # Start shell only
npm run dev:posts              # Start posts only
```

### Building

```bash
npm run build                  # Build all
npm run build:shell            # Build shell
npm run build:remotes          # Build all remotes
```

### Testing

```bash
npm test                       # All tests
npm run test:watch             # Watch mode
npm run test:coverage          # With coverage
npm run test:e2e               # E2E tests
```

### Code Quality

```bash
npm run lint                   # Lint
npm run lint:fix               # Fix lint issues
npm run format                 # Format code
```

### Storybook

```bash
npm run storybook              # Shared UI
npm run storybook:posts        # Posts
```

---

## 📁 File Locations

### Shell

```
packages/shell/src/
├── App.tsx                    # Main app component
├── contexts/
│   ├── ThemeContext.tsx       # Light/dark theme
│   ├── AuthContext.tsx        # Authentication
│   └── NotificationContext.tsx # Toasts
├── components/Layout/
│   ├── Header.tsx             # Top navigation
│   └── Footer.tsx             # Footer
├── routes/
│   └── AppRoutes.tsx          # Route definitions
└── types/
    └── remotes.d.ts           # Remote type definitions
```

### Posts Remote

```
packages/posts/src/
├── components/
│   ├── PostList/
│   ├── PostCard/
│   └── PostFilters/
├── hooks/
│   └── usePosts.ts
└── utils/
    └── mockData.ts
```

---

## 🔌 Module Federation Config

### Shell (Consumer)

```javascript
remotes: {
  posts: 'posts@http://localhost:3001/remoteEntry.js',
  postDetail: 'postDetail@http://localhost:3002/remoteEntry.js',
  // ...
}
```

### Remote (Provider)

```javascript
exposes: {
  './PostList': './src/components/PostList/PostList.tsx',
  './PostCard': './src/components/PostCard/PostCard.tsx',
}
```

---

## 🎨 Component Patterns

### Basic Component

```typescript
import React from "react";
import styles from "./Component.module.css";

interface ComponentProps {
  title: string;
  onClick?: () => void;
}

export const Component: React.FC<ComponentProps> = ({ title, onClick }) => {
  return (
    <div className={styles.container} onClick={onClick}>
      <h2>{title}</h2>
    </div>
  );
};

export default Component;
```

### Component with Hook

```typescript
import { useState, useEffect } from "react";

export const useData = (id: string) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData(id)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [id]);

  return { data, loading, error };
};
```

---

## 🧪 Testing Patterns

### Component Test

```typescript
import { render, screen, fireEvent } from "@testing-library/react";
import { Component } from "./Component";

test("renders and handles click", () => {
  const handleClick = jest.fn();
  render(<Component title="Test" onClick={handleClick} />);

  expect(screen.getByText("Test")).toBeInTheDocument();

  fireEvent.click(screen.getByText("Test"));
  expect(handleClick).toHaveBeenCalled();
});
```

### Hook Test

```typescript
import { renderHook, waitFor } from "@testing-library/react";
import { useData } from "./useData";

test("fetches data", async () => {
  const { result } = renderHook(() => useData("123"));

  expect(result.current.loading).toBe(true);

  await waitFor(() => {
    expect(result.current.loading).toBe(false);
  });

  expect(result.current.data).toBeDefined();
});
```

---

## ♿ Accessibility Quick Checks

### Keyboard Navigation

```typescript
<button onClick={handleClick} aria-label="Close">
  ×
</button>

<div
  role="button"
  tabIndex={0}
  onClick={handleClick}
  onKeyPress={(e) => e.key === 'Enter' && handleClick()}
>
  Click me
</div>
```

### ARIA Attributes

```typescript
// Modal
<div role="dialog" aria-modal="true" aria-labelledby="modal-title">
  <h2 id="modal-title">Modal Title</h2>
</div>

// Alert
<div role="alert" aria-live="assertive">
  Error message
</div>

// Loading
<div role="status" aria-live="polite">
  Loading...
</div>
```

---

## 🎯 Performance Patterns

### Lazy Loading

```typescript
import { lazy, Suspense } from "react";

const PostList = lazy(() => import("posts/PostList"));

<Suspense fallback={<Loading />}>
  <PostList />
</Suspense>;
```

### Memoization

```typescript
import { memo, useMemo, useCallback } from "react";

// Memoize component
export const PostCard = memo(({ post }) => {
  return <div>{post.title}</div>;
});

// Memoize value
const filteredPosts = useMemo(() => {
  return posts.filter((p) => p.published);
}, [posts]);

// Memoize callback
const handleClick = useCallback(() => {
  navigate(`/posts/${id}`);
}, [id, navigate]);
```

---

## 🔧 Debugging

### Check Remote Loading

```bash
# Verify remote is accessible
curl http://localhost:3001/remoteEntry.js

# Check if module is exposed
curl http://localhost:3001/remoteEntry.js | grep "PostList"
```

### Browser Console

```javascript
// Check if remote loaded
console.log(window.posts);

// Check Module Federation
console.log(__webpack_require__.federation);
```

### Common Errors

| Error                                 | Solution                |
| ------------------------------------- | ----------------------- |
| "Failed to load remote entry"         | Check remote is running |
| "Cannot find module 'posts/PostList'" | Check exposes config    |
| "Shared module is not available"      | Check shared config     |
| TypeScript errors on imports          | Update remotes.d.ts     |

---

## 🌐 Environment Variables

### Development

```bash
# .env.development
NODE_ENV=development
PUBLIC_URL=http://localhost:3000
POSTS_URL=http://localhost:3001
```

### Production

```bash
# .env.production
NODE_ENV=production
PUBLIC_URL=https://cdn.example.com/shell
POSTS_URL=https://cdn.example.com/posts
```

---

## 📊 Bundle Size Targets

| Package     | Target  | Current |
| ----------- | ------- | ------- |
| Shell       | < 200KB | TBD     |
| Posts       | < 150KB | TBD     |
| Post Detail | < 150KB | TBD     |
| Editor      | < 150KB | TBD     |
| Comments    | < 100KB | TBD     |
| Author      | < 100KB | TBD     |
| Shared UI   | < 50KB  | TBD     |

---

## 🚨 Troubleshooting Checklist

### Remote Not Loading

- [ ] Remote dev server is running
- [ ] Port matches webpack config
- [ ] CORS headers present
- [ ] Module is exposed in webpack config
- [ ] remoteEntry.js is accessible

### TypeScript Errors

- [ ] remotes.d.ts exists and up to date
- [ ] TypeScript server restarted
- [ ] tsconfig.json includes type definitions
- [ ] Module name matches webpack config

### Tests Failing

- [ ] setupTests.ts configured
- [ ] jest.config.js paths correct
- [ ] Mocks in place for browser APIs
- [ ] Async operations handled with waitFor
- [ ] Jest cache cleared

### Build Errors

- [ ] All dependencies installed
- [ ] Webpack config valid
- [ ] No circular dependencies
- [ ] TypeScript compiles
- [ ] Shared UI built first

---

## 📝 Git Workflow

### Branch Naming

```
feature/post-search
bugfix/comment-loading
hotfix/security-patch
```

### Commit Messages

```
feat(posts): add search functionality
fix(editor): resolve auto-save issue
docs(readme): update setup instructions
test(posts): add PostCard tests
chore(deps): update dependencies
```

### Before Committing

```bash
npm run lint
npm test
npm run build
```

---

## 🔗 Useful Links

- [React Docs](https://react.dev/)
- [Webpack Module Federation](https://webpack.js.org/concepts/module-federation/)
- [React Router](https://reactrouter.com/)
- [Testing Library](https://testing-library.com/)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

---

## 💡 Tips & Tricks

### Fast Restart

```bash
# Kill all node processes
killall node

# Restart dev environment
npm run dev
```

### Clear All Caches

```bash
# Clear npm cache
npm cache clean --force

# Clear Jest cache
npm test -- --clearCache

# Clear webpack cache
rm -rf packages/*/node_modules/.cache
```

### Debug Webpack

```bash
# Verbose webpack output
cd packages/shell
webpack serve --config webpack.config.js --progress --verbose
```

### Profile Performance

```javascript
// Add to component
import { Profiler } from "react";

<Profiler
  id="PostList"
  onRender={(id, phase, actualDuration) => {
    console.log(`${id} (${phase}) took ${actualDuration}ms`);
  }}
>
  <PostList />
</Profiler>;
```

---

## 📞 Getting Help

1. Check this quick reference
2. Review full documentation
3. Search existing issues
4. Ask in team chat
5. Create GitHub issue

---

## ✅ Daily Checklist

### Morning

- [ ] `git pull`
- [ ] `npm install` (if package.json changed)
- [ ] `npm run dev`
- [ ] Check for breaking changes

### Before Committing

- [ ] `npm run lint`
- [ ] `npm test`
- [ ] Check browser console for errors
- [ ] Test in multiple browsers

### Before PR

- [ ] `git rebase develop`
- [ ] `npm run test:coverage`
- [ ] `npm run test:e2e`
- [ ] Update documentation
- [ ] Add changeset

---

## 🎓 Learning Path

### Week 1: Basics

- [ ] Understand monorepo structure
- [ ] Learn Module Federation basics
- [ ] Implement first component
- [ ] Write first test

### Week 2: Integration

- [ ] Connect shell and remotes
- [ ] Implement routing
- [ ] Add error boundaries
- [ ] Setup Storybook

### Week 3: Advanced

- [ ] Optimize performance
- [ ] Improve accessibility
- [ ] Add E2E tests
- [ ] Setup CI/CD

### Week 4: Production

- [ ] Deploy to staging
- [ ] Performance audit
- [ ] Security review
- [ ] Production deployment

---

This quick reference should be your go-to for daily development tasks!
