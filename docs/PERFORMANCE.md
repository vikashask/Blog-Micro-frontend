# Performance Strategy & Optimization

## Performance Goals

| Metric                             | Target          | Measurement             |
| ---------------------------------- | --------------- | ----------------------- |
| **First Contentful Paint (FCP)**   | < 1.8s          | Lighthouse              |
| **Largest Contentful Paint (LCP)** | < 2.5s          | Lighthouse              |
| **Time to Interactive (TTI)**      | < 3.8s          | Lighthouse              |
| **Total Blocking Time (TBT)**      | < 300ms         | Lighthouse              |
| **Cumulative Layout Shift (CLS)**  | < 0.1           | Lighthouse              |
| **Bundle Size (Shell)**            | < 200KB gzipped | webpack-bundle-analyzer |
| **Bundle Size (Remote)**           | < 150KB gzipped | webpack-bundle-analyzer |

---

## 1. Bundle Splitting Strategy

### 1.1 Module Federation Boundaries

**Principle**: Each remote is a separate bundle, loaded on-demand.

```
Shell (eager)
├── React (singleton)
├── React-DOM (singleton)
├── React-Router (singleton)
└── Shell code (~50KB)

Posts Remote (lazy)
├── PostList component
├── PostCard component
├── PostFilters component
└── Dependencies (~100KB)

Post Detail Remote (lazy)
├── PostDetail component
├── Markdown renderer
└── Dependencies (~120KB)

Editor Remote (lazy)
├── Rich text editor
├── Editor toolbar
└── Dependencies (~150KB)

Comments Remote (lazy)
├── CommentThread component
└── Dependencies (~80KB)

Author Remote (lazy)
├── AuthorProfile component
└── Dependencies (~70KB)

Shared UI (lazy)
├── Design system components
└── CSS tokens (~40KB)
```

---

### 1.2 Code Splitting Within Remotes

**Strategy**: Split large dependencies and route-specific code.

**Example**: `packages/post-detail/webpack.config.js`

```javascript
module.exports = {
  optimization: {
    splitChunks: {
      chunks: "all",
      cacheGroups: {
        // Separate vendor code
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          priority: 10,
        },
        // Separate markdown renderer (large dependency)
        markdown: {
          test: /[\\/]node_modules[\\/](react-markdown|remark|rehype)/,
          name: "markdown",
          priority: 20,
        },
      },
    },
  },
};
```

---

## 2. Lazy Loading Strategy

### 2.1 Remote Lazy Loading

**Shell Implementation**:

```typescript
import { lazy, Suspense } from "react";

// Lazy load remotes
const PostList = lazy(() => import("posts/PostList"));
const PostDetail = lazy(() => import("postDetail/PostDetail"));
const PostEditor = lazy(() => import("editor/PostEditor"));

// Use with Suspense
<Suspense fallback={<SkeletonScreen />}>
  <PostList onPostClick={handleClick} />
</Suspense>;
```

---

### 2.2 Component-Level Lazy Loading

**Example**: Lazy load heavy components within a remote.

```typescript
// packages/post-detail/src/components/PostDetail/PostDetail.tsx
import { lazy, Suspense } from "react";

const MarkdownRenderer = lazy(
  () => import("../MarkdownRenderer/MarkdownRenderer")
);
const CommentThread = lazy(() => import("comments/CommentThread"));

export const PostDetail = ({ postId }) => {
  return (
    <article>
      <h1>{post.title}</h1>

      <Suspense fallback={<div>Loading content...</div>}>
        <MarkdownRenderer content={post.content} />
      </Suspense>

      <Suspense fallback={<div>Loading comments...</div>}>
        <CommentThread postId={postId} />
      </Suspense>
    </article>
  );
};
```

---

### 2.3 Image Lazy Loading

**Native Lazy Loading**:

```tsx
<img src={post.coverImage} alt={post.title} loading="lazy" decoding="async" />
```

**Intersection Observer for Custom Loading**:

```typescript
import { useEffect, useRef, useState } from "react";

const useLazyImage = (src: string) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setImageSrc(src);
          observer.disconnect();
        }
      },
      { rootMargin: "50px" }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [src]);

  return { imgRef, imageSrc };
};
```

---

## 3. Prefetching Strategy

### 3.1 Remote Prefetching

**Prefetch on Hover**:

```typescript
const prefetchRemote = (remoteName: string) => {
  const remoteUrl = getRemoteUrl(remoteName);
  const link = document.createElement("link");
  link.rel = "prefetch";
  link.href = remoteUrl;
  document.head.appendChild(link);
};

// Usage in PostCard
<article
  onMouseEnter={() => prefetchRemote("postDetail")}
  onClick={() => navigate(`/posts/${post.id}`)}
>
  {/* Post content */}
</article>;
```

---

### 3.2 Route-Based Prefetching

**Prefetch Next Likely Route**:

```typescript
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const usePrefetch = () => {
  const location = useLocation();

  useEffect(() => {
    // On homepage, prefetch post detail remote
    if (location.pathname === "/") {
      prefetchRemote("postDetail");
    }

    // On post detail, prefetch comments remote
    if (location.pathname.startsWith("/posts/")) {
      prefetchRemote("comments");
    }
  }, [location]);
};
```

---

### 3.3 Intelligent Prefetching

**Prefetch Based on User Behavior**:

```typescript
const useSmartPrefetch = () => {
  useEffect(() => {
    // Prefetch after 2 seconds of idle time
    const timeout = setTimeout(() => {
      prefetchRemote("editor");
      prefetchRemote("author");
    }, 2000);

    return () => clearTimeout(timeout);
  }, []);
};
```

---

## 4. Caching Strategy

### 4.1 HTTP Caching Headers

**Production Server Configuration** (Nginx example):

```nginx
# Cache static assets
location ~* \.(js|css|png|jpg|jpeg|gif|svg|woff|woff2)$ {
  expires 1y;
  add_header Cache-Control "public, immutable";
}

# Cache remoteEntry.js with shorter TTL
location = /remoteEntry.js {
  expires 1h;
  add_header Cache-Control "public, must-revalidate";
}

# No cache for HTML
location ~* \.html$ {
  expires -1;
  add_header Cache-Control "no-cache, no-store, must-revalidate";
}
```

---

### 4.2 Service Worker Caching

**File**: `packages/shell/src/serviceWorker.ts`

```typescript
const CACHE_NAME = "blog-v1";
const REMOTE_CACHE = "blog-remotes-v1";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(["/", "/static/css/main.css", "/static/js/main.js"]);
    })
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Cache remoteEntry.js files
  if (request.url.includes("remoteEntry.js")) {
    event.respondWith(
      caches.open(REMOTE_CACHE).then((cache) => {
        return cache.match(request).then((response) => {
          const fetchPromise = fetch(request).then((networkResponse) => {
            cache.put(request, networkResponse.clone());
            return networkResponse;
          });

          return response || fetchPromise;
        });
      })
    );
  }
});
```

---

### 4.3 Browser Caching (LocalStorage)

**Cache API Responses**:

```typescript
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const getCachedData = (key: string) => {
  const cached = localStorage.getItem(key);
  if (!cached) return null;

  const { data, timestamp } = JSON.parse(cached);
  if (Date.now() - timestamp > CACHE_DURATION) {
    localStorage.removeItem(key);
    return null;
  }

  return data;
};

const setCachedData = (key: string, data: any) => {
  localStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }));
};

// Usage in usePosts hook
const usePosts = (filters: FilterState) => {
  const cacheKey = `posts-${JSON.stringify(filters)}`;

  useEffect(() => {
    const cached = getCachedData(cacheKey);
    if (cached) {
      setPosts(cached);
      setLoading(false);
      return;
    }

    fetchPosts().then((data) => {
      setPosts(data);
      setCachedData(cacheKey, data);
      setLoading(false);
    });
  }, [filters]);
};
```

---

## 5. Bundle Size Optimization

### 5.1 Tree Shaking

**Ensure Tree Shaking Works**:

```json
// package.json
{
  "sideEffects": ["*.css", "*.scss"]
}
```

**Import Only What You Need**:

```typescript
// ❌ Bad: Imports entire library
import _ from "lodash";

// ✅ Good: Imports specific function
import debounce from "lodash/debounce";
```

---

### 5.2 Bundle Analysis

**Add Bundle Analyzer**:

```bash
npm install --save-dev webpack-bundle-analyzer
```

**Webpack Config**:

```javascript
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

module.exports = {
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: process.env.ANALYZE ? "server" : "disabled",
    }),
  ],
};
```

**Run Analysis**:

```bash
ANALYZE=true npm run build
```

---

### 5.3 Dependency Optimization

**Replace Heavy Dependencies**:

| Heavy         | Lightweight Alternative      | Savings |
| ------------- | ---------------------------- | ------- |
| `moment`      | `date-fns`                   | ~70KB   |
| `lodash`      | `lodash-es` (tree-shakeable) | ~50KB   |
| `axios`       | `fetch` (native)             | ~15KB   |
| `react-icons` | `lucide-react`               | ~40KB   |

---

### 5.4 CSS Optimization

**Use CSS Modules for Scoping**:

```css
/* PostCard.module.css */
.card {
  /* Scoped styles */
}
```

**Purge Unused CSS** (if using Tailwind):

```javascript
// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  // ...
};
```

---

## 6. Runtime Performance

### 6.1 React Performance

**Memoization**:

```typescript
import { memo, useMemo, useCallback } from "react";

// Memoize expensive components
export const PostCard = memo(({ post, onClick }) => {
  return <article onClick={onClick}>{/* ... */}</article>;
});

// Memoize expensive calculations
const filteredPosts = useMemo(() => {
  return posts.filter((post) => post.tags.includes(selectedTag));
}, [posts, selectedTag]);

// Memoize callbacks
const handleClick = useCallback(() => {
  navigate(`/posts/${post.id}`);
}, [post.id, navigate]);
```

---

### 6.2 Virtualization for Long Lists

**Use React Window**:

```typescript
import { FixedSizeList } from "react-window";

const PostList = ({ posts }) => {
  const Row = ({ index, style }) => (
    <div style={style}>
      <PostCard post={posts[index]} />
    </div>
  );

  return (
    <FixedSizeList
      height={600}
      itemCount={posts.length}
      itemSize={200}
      width="100%"
    >
      {Row}
    </FixedSizeList>
  );
};
```

---

### 6.3 Debouncing and Throttling

**Debounce Search Input**:

```typescript
import { useState, useEffect } from "react";
import debounce from "lodash/debounce";

const PostFilters = ({ onChange }) => {
  const [search, setSearch] = useState("");

  const debouncedOnChange = useMemo(
    () => debounce((value) => onChange({ search: value }), 300),
    [onChange]
  );

  useEffect(() => {
    debouncedOnChange(search);
  }, [search, debouncedOnChange]);

  return (
    <input
      type="text"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      placeholder="Search posts..."
    />
  );
};
```

---

## 7. Network Performance

### 7.1 HTTP/2 Server Push

**Push Critical Resources**:

```nginx
location = / {
  http2_push /static/js/main.js;
  http2_push /static/css/main.css;
  http2_push /remoteEntry.js;
}
```

---

### 7.2 Compression

**Enable Gzip/Brotli**:

```nginx
gzip on;
gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
gzip_min_length 1000;

brotli on;
brotli_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
```

---

### 7.3 CDN Strategy

**Deploy Remotes to CDN**:

```
Shell:          https://cdn.example.com/shell/
Posts:          https://cdn.example.com/posts/
Post Detail:    https://cdn.example.com/post-detail/
Editor:         https://cdn.example.com/editor/
Comments:       https://cdn.example.com/comments/
Author:         https://cdn.example.com/author/
Shared UI:      https://cdn.example.com/shared-ui/
```

**Benefits**:

- Reduced latency (edge caching)
- Parallel downloads (different domains)
- Better caching (long TTL for versioned assets)

---

## 8. Monitoring & Metrics

### 8.1 Performance Monitoring

**Use Web Vitals**:

```typescript
import { getCLS, getFID, getFCP, getLCP, getTTFB } from "web-vitals";

const sendToAnalytics = (metric) => {
  console.log(metric);
  // Send to analytics service
};

getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getFCP(sendToAnalytics);
getLCP(sendToAnalytics);
getTTFB(sendToAnalytics);
```

---

### 8.2 Bundle Size Budget

**File**: `packages/shell/.bundlewatch.config.json`

```json
{
  "files": [
    {
      "path": "dist/static/js/*.js",
      "maxSize": "200kb"
    },
    {
      "path": "dist/static/css/*.css",
      "maxSize": "50kb"
    }
  ]
}
```

**CI Integration**:

```yaml
# .github/workflows/bundle-size.yml
name: Bundle Size Check

on: [pull_request]

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm ci
      - run: npm run build
      - run: npx bundlewatch
```

---

### 8.3 Lighthouse CI

**File**: `lighthouserc.js`

```javascript
module.exports = {
  ci: {
    collect: {
      url: ["http://localhost:3000/", "http://localhost:3000/posts"],
      numberOfRuns: 3,
    },
    assert: {
      assertions: {
        "categories:performance": ["error", { minScore: 0.9 }],
        "categories:accessibility": ["error", { minScore: 0.9 }],
        "first-contentful-paint": ["error", { maxNumericValue: 1800 }],
        "largest-contentful-paint": ["error", { maxNumericValue: 2500 }],
        "cumulative-layout-shift": ["error", { maxNumericValue: 0.1 }],
      },
    },
  },
};
```

---

## 9. Performance Checklist

### Build Time

- [ ] Enable production mode (`NODE_ENV=production`)
- [ ] Enable minification (Terser)
- [ ] Enable tree shaking
- [ ] Analyze bundle size
- [ ] Remove source maps in production (or use hidden source maps)
- [ ] Enable code splitting
- [ ] Optimize images (compress, WebP format)

### Runtime

- [ ] Lazy load remotes
- [ ] Lazy load heavy components
- [ ] Implement virtualization for long lists
- [ ] Memoize expensive components
- [ ] Debounce/throttle event handlers
- [ ] Use native lazy loading for images
- [ ] Implement skeleton screens

### Network

- [ ] Enable HTTP/2
- [ ] Enable compression (Gzip/Brotli)
- [ ] Set cache headers
- [ ] Use CDN for static assets
- [ ] Prefetch critical resources
- [ ] Implement service worker

### Monitoring

- [ ] Track Web Vitals
- [ ] Set bundle size budget
- [ ] Run Lighthouse CI
- [ ] Monitor real user metrics (RUM)

---

## 10. Performance Budget

| Asset Type        | Budget | Current | Status |
| ----------------- | ------ | ------- | ------ |
| Shell JS          | 200KB  | TBD     | 🟡     |
| Remote JS (avg)   | 150KB  | TBD     | 🟡     |
| CSS (total)       | 50KB   | TBD     | 🟡     |
| Images (per page) | 500KB  | TBD     | 🟡     |
| Total Page Weight | 1MB    | TBD     | 🟡     |
| FCP               | < 1.8s | TBD     | 🟡     |
| LCP               | < 2.5s | TBD     | 🟡     |
| TTI               | < 3.8s | TBD     | 🟡     |
| CLS               | < 0.1  | TBD     | 🟡     |

---

## 11. Optimization Roadmap

### Phase 1: Foundation (Week 1-2)

- [ ] Implement lazy loading for all remotes
- [ ] Add skeleton screens
- [ ] Enable code splitting
- [ ] Optimize images

### Phase 2: Advanced (Week 3-4)

- [ ] Implement prefetching strategy
- [ ] Add service worker
- [ ] Optimize bundle sizes
- [ ] Add performance monitoring

### Phase 3: Fine-Tuning (Week 5-6)

- [ ] Implement virtualization
- [ ] Add intelligent prefetching
- [ ] Optimize CSS delivery
- [ ] Set up Lighthouse CI

### Phase 4: Monitoring (Ongoing)

- [ ] Track Web Vitals
- [ ] Monitor bundle sizes
- [ ] Analyze user metrics
- [ ] Continuous optimization
