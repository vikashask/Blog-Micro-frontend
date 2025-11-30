# Code Examples

## 1. Shell Application Setup

### App.tsx (Shell)

**File**: `packages/shell/src/App.tsx`

```typescript
import React from "react";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import { Layout } from "./components/Layout/Layout";
import { AppRoutes } from "./routes/AppRoutes";
import "./styles/global.css";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <NotificationProvider>
            <Layout>
              <AppRoutes />
            </Layout>
          </NotificationProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;
```

### Bootstrap Pattern (Shell)

**File**: `packages/shell/src/index.ts`

```typescript
import("./bootstrap");
```

**File**: `packages/shell/src/bootstrap.tsx`

```typescript
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

---

## 2. Routing with Lazy Loading

### AppRoutes.tsx (Shell)

**File**: `packages/shell/src/routes/AppRoutes.tsx`

```typescript
import React, { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { RemoteErrorBoundary } from "../components/ErrorBoundary/RemoteErrorBoundary";
import { SkeletonScreen } from "../components/LoadingFallback/SkeletonScreen";
import { useAuth } from "../contexts/AuthContext";

// Lazy load remotes
const PostList = lazy(() => import("posts/PostList"));
const PostDetail = lazy(() => import("postDetail/PostDetail"));
const PostEditor = lazy(() => import("editor/PostEditor"));
const CommentThread = lazy(() => import("comments/CommentThread"));
const AuthorProfile = lazy(() => import("author/AuthorProfile"));

// Protected route wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Home / Post List */}
      <Route
        path="/"
        element={
          <RemoteErrorBoundary remoteName="posts">
            <Suspense fallback={<SkeletonScreen type="postList" />}>
              <PostList
                onPostClick={(postId) =>
                  (window.location.href = `/posts/${postId}`)
                }
              />
            </Suspense>
          </RemoteErrorBoundary>
        }
      />

      {/* All Posts */}
      <Route
        path="/posts"
        element={
          <RemoteErrorBoundary remoteName="posts">
            <Suspense fallback={<SkeletonScreen type="postList" />}>
              <PostList
                onPostClick={(postId) =>
                  (window.location.href = `/posts/${postId}`)
                }
              />
            </Suspense>
          </RemoteErrorBoundary>
        }
      />

      {/* Post Detail */}
      <Route
        path="/posts/:id"
        element={
          <RemoteErrorBoundary remoteName="postDetail">
            <Suspense fallback={<SkeletonScreen type="postDetail" />}>
              <PostDetail
                postId={window.location.pathname.split("/")[2]}
                onAuthorClick={(authorId) =>
                  (window.location.href = `/authors/${authorId}`)
                }
              />
            </Suspense>
          </RemoteErrorBoundary>
        }
      />

      {/* Create New Post (Protected) */}
      <Route
        path="/posts/new"
        element={
          <ProtectedRoute>
            <RemoteErrorBoundary remoteName="editor">
              <Suspense fallback={<SkeletonScreen type="editor" />}>
                <PostEditor
                  onSave={(post) => console.log("Post saved:", post)}
                  onPublish={(post) => console.log("Post published:", post)}
                />
              </Suspense>
            </RemoteErrorBoundary>
          </ProtectedRoute>
        }
      />

      {/* Edit Post (Protected) */}
      <Route
        path="/posts/:id/edit"
        element={
          <ProtectedRoute>
            <RemoteErrorBoundary remoteName="editor">
              <Suspense fallback={<SkeletonScreen type="editor" />}>
                <PostEditor
                  postId={window.location.pathname.split("/")[2]}
                  onSave={(post) => console.log("Post saved:", post)}
                  onPublish={(post) => console.log("Post published:", post)}
                />
              </Suspense>
            </RemoteErrorBoundary>
          </ProtectedRoute>
        }
      />

      {/* Author Profile */}
      <Route
        path="/authors/:id"
        element={
          <RemoteErrorBoundary remoteName="author">
            <Suspense fallback={<SkeletonScreen type="authorProfile" />}>
              <AuthorProfile
                authorId={window.location.pathname.split("/")[2]}
              />
            </Suspense>
          </RemoteErrorBoundary>
        }
      />

      {/* 404 */}
      <Route path="*" element={<div>404 - Page Not Found</div>} />
    </Routes>
  );
};
```

---

## 3. Error Boundary for Remotes

### RemoteErrorBoundary.tsx (Shell)

**File**: `packages/shell/src/components/ErrorBoundary/RemoteErrorBoundary.tsx`

```typescript
import React, { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
  remoteName: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class RemoteErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(
      `Error loading remote "${this.props.remoteName}":`,
      error,
      errorInfo
    );
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          style={{
            padding: "2rem",
            border: "1px solid #f44336",
            borderRadius: "8px",
            backgroundColor: "#ffebee",
            color: "#c62828",
          }}
        >
          <h2>Failed to load {this.props.remoteName}</h2>
          <p>
            The microfrontend could not be loaded. Please try refreshing the
            page.
          </p>
          <details style={{ marginTop: "1rem" }}>
            <summary>Error details</summary>
            <pre style={{ fontSize: "0.875rem", marginTop: "0.5rem" }}>
              {this.state.error?.message}
            </pre>
          </details>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: "1rem",
              padding: "0.5rem 1rem",
              backgroundColor: "#c62828",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

---

## 4. Theme Provider Implementation

### ThemeContext.tsx (Shell)

**File**: `packages/shell/src/contexts/ThemeContext.tsx`

```typescript
import React, { createContext, useState, useEffect, ReactNode } from "react";

export type Theme = "light" | "dark";

export interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextValue | undefined>(
  undefined
);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem("theme");
    return (saved as Theme) || "light";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = React.useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
};
```

---

## 5. Layout Component (Shell)

### Layout.tsx (Shell)

**File**: `packages/shell/src/components/Layout/Layout.tsx`

```typescript
import React, { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import styles from "./Layout.module.css";

interface LayoutProps {
  children: ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className={styles.layout}>
      <Header />
      <main className={styles.main} id="main-content" role="main">
        {children}
      </main>
      <Footer />
    </div>
  );
};
```

### Header.tsx (Shell)

**File**: `packages/shell/src/components/Layout/Header.tsx`

```typescript
import React from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";
import { useAuth } from "../../contexts/AuthContext";
import styles from "./Layout.module.css";

export const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <header className={styles.header} role="banner">
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          <h1>Blog</h1>
        </Link>

        <nav
          className={styles.nav}
          role="navigation"
          aria-label="Main navigation"
        >
          <Link to="/" className={styles.navLink}>
            Home
          </Link>
          <Link to="/posts" className={styles.navLink}>
            Posts
          </Link>
          {isAuthenticated && (
            <Link to="/posts/new" className={styles.navLink}>
              Write
            </Link>
          )}
        </nav>

        <div className={styles.actions}>
          <button
            onClick={toggleTheme}
            className={styles.themeToggle}
            aria-label={`Switch to ${
              theme === "light" ? "dark" : "light"
            } mode`}
          >
            {theme === "light" ? "🌙" : "☀️"}
          </button>

          {isAuthenticated ? (
            <div className={styles.userMenu}>
              <span>{user?.name}</span>
              <button onClick={logout} className={styles.logoutBtn}>
                Logout
              </button>
            </div>
          ) : (
            <button className={styles.loginBtn}>Login</button>
          )}
        </div>
      </div>
    </header>
  );
};
```

---

## 6. Remote Component Example: PostList

### PostList.tsx (Posts Remote)

**File**: `packages/posts/src/components/PostList/PostList.tsx`

```typescript
import React, { useState, useEffect } from "react";
import { Post } from "../../types/post.types";
import { usePosts } from "../../hooks/usePosts";
import { PostCard } from "../PostCard/PostCard";
import { PostFilters } from "../PostFilters/PostFilters";
import styles from "./PostList.module.css";

export interface FilterState {
  search?: string;
  tags?: string[];
  sortBy?: "date" | "title" | "author";
  sortOrder?: "asc" | "desc";
}

export interface PostListProps {
  initialFilters?: FilterState;
  onPostClick: (postId: string) => void;
}

const PostList: React.FC<PostListProps> = ({ initialFilters, onPostClick }) => {
  const [filters, setFilters] = useState<FilterState>(initialFilters || {});
  const { posts, loading, error } = usePosts(filters);

  if (loading) {
    return <div className={styles.loading}>Loading posts...</div>;
  }

  if (error) {
    return (
      <div className={styles.error} role="alert">
        Error: {error}
      </div>
    );
  }

  return (
    <div className={styles.postList}>
      <PostFilters filters={filters} onChange={setFilters} />

      <div className={styles.grid} role="list" aria-label="Blog posts">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            variant="compact"
            onClick={() => onPostClick(post.id)}
          />
        ))}
      </div>

      {posts.length === 0 && <div className={styles.empty}>No posts found</div>}
    </div>
  );
};

export default PostList;
```

### PostCard.tsx (Posts Remote)

**File**: `packages/posts/src/components/PostCard/PostCard.tsx`

```typescript
import React from "react";
import { Post } from "../../types/post.types";
import styles from "./PostCard.module.css";

export interface PostCardProps {
  post: Post;
  variant?: "compact" | "full";
  onClick?: () => void;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  variant = "compact",
  onClick,
}) => {
  return (
    <article
      className={`${styles.card} ${styles[variant]}`}
      onClick={onClick}
      onKeyPress={(e) => e.key === "Enter" && onClick?.()}
      tabIndex={0}
      role="article"
      aria-labelledby={`post-title-${post.id}`}
    >
      {post.coverImage && (
        <img
          src={post.coverImage}
          alt=""
          className={styles.coverImage}
          loading="lazy"
        />
      )}

      <div className={styles.content}>
        <h2 id={`post-title-${post.id}`} className={styles.title}>
          {post.title}
        </h2>

        <p className={styles.excerpt}>{post.excerpt}</p>

        <div className={styles.meta}>
          <span className={styles.author}>{post.author.name}</span>
          <time dateTime={post.publishedAt.toISOString()}>
            {new Date(post.publishedAt).toLocaleDateString()}
          </time>
          {post.readTime && (
            <span className={styles.readTime}>{post.readTime} min read</span>
          )}
        </div>

        {post.tags.length > 0 && (
          <div className={styles.tags} role="list" aria-label="Post tags">
            {post.tags.map((tag) => (
              <span key={tag} className={styles.tag} role="listitem">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
};

export default PostCard;
```

---

## 7. Custom Hook Example: usePosts

### usePosts.ts (Posts Remote)

**File**: `packages/posts/src/hooks/usePosts.ts`

```typescript
import { useState, useEffect } from "react";
import { Post } from "../types/post.types";
import { FilterState } from "../components/PostList/PostList";
import { mockPosts } from "../utils/mockData";

export const usePosts = (filters: FilterState) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);

      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500));

        let filtered = [...mockPosts];

        // Apply search filter
        if (filters.search) {
          const searchLower = filters.search.toLowerCase();
          filtered = filtered.filter(
            (post) =>
              post.title.toLowerCase().includes(searchLower) ||
              post.excerpt.toLowerCase().includes(searchLower)
          );
        }

        // Apply tag filter
        if (filters.tags && filters.tags.length > 0) {
          filtered = filtered.filter((post) =>
            filters.tags!.some((tag) => post.tags.includes(tag))
          );
        }

        // Apply sorting
        if (filters.sortBy) {
          filtered.sort((a, b) => {
            let comparison = 0;

            switch (filters.sortBy) {
              case "date":
                comparison =
                  new Date(b.publishedAt).getTime() -
                  new Date(a.publishedAt).getTime();
                break;
              case "title":
                comparison = a.title.localeCompare(b.title);
                break;
              case "author":
                comparison = a.author.name.localeCompare(b.author.name);
                break;
            }

            return filters.sortOrder === "desc" ? -comparison : comparison;
          });
        }

        setPosts(filtered);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch posts");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [filters]);

  return { posts, loading, error };
};
```

---

## 8. Shared UI Component: Button

### Button.tsx (Shared UI Remote)

**File**: `packages/shared-ui/src/components/Button/Button.tsx`

```typescript
import React, { ReactNode } from "react";
import styles from "./Button.module.css";

export interface ButtonProps {
  children: ReactNode;
  variant?: "primary" | "secondary" | "tertiary";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  onClick: () => void;
  ariaLabel?: string;
  type?: "button" | "submit" | "reset";
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  onClick,
  ariaLabel,
  type = "button",
}) => {
  return (
    <button
      type={type}
      className={`${styles.button} ${styles[variant]} ${styles[size]}`}
      disabled={disabled}
      onClick={onClick}
      aria-label={ariaLabel}
      aria-disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
```

### Button.module.css (Shared UI Remote)

**File**: `packages/shared-ui/src/components/Button/Button.module.css`

```css
.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-family);
  font-weight: 600;
  border: none;
  border-radius: var(--border-radius-md);
  cursor: pointer;
  transition: all 0.2s ease;
  outline: none;
}

.button:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Variants */
.primary {
  background-color: var(--color-primary);
  color: var(--color-white);
}

.primary:hover:not(:disabled) {
  background-color: var(--color-primary-dark);
}

.secondary {
  background-color: var(--color-secondary);
  color: var(--color-text);
  border: 1px solid var(--color-border);
}

.secondary:hover:not(:disabled) {
  background-color: var(--color-secondary-dark);
}

.tertiary {
  background-color: transparent;
  color: var(--color-primary);
}

.tertiary:hover:not(:disabled) {
  background-color: var(--color-secondary);
}

/* Sizes */
.sm {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
}

.md {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
}

.lg {
  padding: 1rem 2rem;
  font-size: 1.125rem;
}
```

---

## 9. CSS Design Tokens

### colors.css (Shared UI Remote)

**File**: `packages/shared-ui/src/tokens/colors.css`

```css
:root {
  /* Primary Colors */
  --color-primary: #3b82f6;
  --color-primary-dark: #2563eb;
  --color-primary-light: #60a5fa;

  /* Secondary Colors */
  --color-secondary: #f3f4f6;
  --color-secondary-dark: #e5e7eb;

  /* Text Colors */
  --color-text: #1f2937;
  --color-text-secondary: #6b7280;
  --color-text-muted: #9ca3af;

  /* Background Colors */
  --color-background: #ffffff;
  --color-background-alt: #f9fafb;

  /* Border Colors */
  --color-border: #e5e7eb;
  --color-border-dark: #d1d5db;

  /* Status Colors */
  --color-success: #10b981;
  --color-error: #ef4444;
  --color-warning: #f59e0b;
  --color-info: #3b82f6;

  /* Neutral Colors */
  --color-white: #ffffff;
  --color-black: #000000;
}

[data-theme="dark"] {
  --color-primary: #60a5fa;
  --color-primary-dark: #3b82f6;
  --color-primary-light: #93c5fd;

  --color-secondary: #374151;
  --color-secondary-dark: #1f2937;

  --color-text: #f9fafb;
  --color-text-secondary: #d1d5db;
  --color-text-muted: #9ca3af;

  --color-background: #111827;
  --color-background-alt: #1f2937;

  --color-border: #374151;
  --color-border-dark: #4b5563;
}
```
