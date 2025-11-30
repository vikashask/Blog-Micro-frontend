# Testing & Storybook Strategy

## Testing Overview

### Testing Pyramid

```
        E2E Tests (Playwright)
              /\
             /  \
            /    \
           /      \
          /________\
    Integration Tests
         /\
        /  \
       /    \
      /______\
   Unit Tests
```

**Distribution**:

- **70%** Unit tests (Jest + React Testing Library)
- **20%** Integration tests (cross-remote interactions)
- **10%** E2E tests (Playwright)

---

## 1. Unit Testing Setup

### Jest Configuration

**File**: `packages/posts/jest.config.js`

```javascript
module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  roots: ["<rootDir>/src"],
  testMatch: ["**/__tests__/**/*.ts?(x)", "**/?(*.)+(spec|test).ts?(x)"],
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "\\.(jpg|jpeg|png|gif|svg)$": "<rootDir>/__mocks__/fileMock.js",
  },
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.d.ts",
    "!src/**/*.stories.tsx",
    "!src/index.ts",
    "!src/bootstrap.tsx",
  ],
  coverageThresholds: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
};
```

### Setup File

**File**: `packages/posts/src/setupTests.ts`

```typescript
import "@testing-library/jest-dom";

// Mock window.matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return [];
  }
  unobserve() {}
} as any;
```

---

## 2. Component Unit Tests

### PostCard.test.tsx

**File**: `packages/posts/src/components/PostCard/PostCard.test.tsx`

```typescript
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { PostCard } from "./PostCard";
import { Post } from "../../types/post.types";

const mockPost: Post = {
  id: "1",
  title: "Test Post",
  excerpt: "This is a test post excerpt",
  content: "Full content here",
  authorId: "author-1",
  author: {
    id: "author-1",
    name: "John Doe",
    bio: "Test author",
  },
  publishedAt: new Date("2024-01-01"),
  updatedAt: new Date("2024-01-01"),
  tags: ["react", "testing"],
  status: "published",
  readTime: 5,
};

describe("PostCard", () => {
  it("renders post title and excerpt", () => {
    render(<PostCard post={mockPost} />);

    expect(screen.getByText("Test Post")).toBeInTheDocument();
    expect(screen.getByText("This is a test post excerpt")).toBeInTheDocument();
  });

  it("displays author name and publish date", () => {
    render(<PostCard post={mockPost} />);

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("1/1/2024")).toBeInTheDocument();
  });

  it("renders tags", () => {
    render(<PostCard post={mockPost} />);

    expect(screen.getByText("react")).toBeInTheDocument();
    expect(screen.getByText("testing")).toBeInTheDocument();
  });

  it("calls onClick when card is clicked", () => {
    const handleClick = jest.fn();
    render(<PostCard post={mockPost} onClick={handleClick} />);

    const card = screen.getByRole("article");
    fireEvent.click(card);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("calls onClick when Enter key is pressed", () => {
    const handleClick = jest.fn();
    render(<PostCard post={mockPost} onClick={handleClick} />);

    const card = screen.getByRole("article");
    fireEvent.keyPress(card, { key: "Enter", code: "Enter" });

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("renders cover image when provided", () => {
    const postWithImage = {
      ...mockPost,
      coverImage: "https://example.com/image.jpg",
    };
    render(<PostCard post={postWithImage} />);

    const image = screen.getByRole("img");
    expect(image).toHaveAttribute("src", "https://example.com/image.jpg");
    expect(image).toHaveAttribute("loading", "lazy");
  });

  it("applies compact variant class", () => {
    const { container } = render(
      <PostCard post={mockPost} variant="compact" />
    );
    const card = container.querySelector(".compact");
    expect(card).toBeInTheDocument();
  });

  it("has correct ARIA attributes", () => {
    render(<PostCard post={mockPost} />);

    const card = screen.getByRole("article");
    expect(card).toHaveAttribute("tabIndex", "0");
    expect(card).toHaveAttribute("aria-labelledby", "post-title-1");
  });
});
```

---

## 3. Hook Testing

### usePosts.test.ts

**File**: `packages/posts/src/hooks/usePosts.test.ts`

```typescript
import { renderHook, waitFor } from "@testing-library/react";
import { usePosts } from "./usePosts";

describe("usePosts", () => {
  it("returns loading state initially", () => {
    const { result } = renderHook(() => usePosts({}));

    expect(result.current.loading).toBe(true);
    expect(result.current.posts).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it("fetches and returns posts", async () => {
    const { result } = renderHook(() => usePosts({}));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.posts.length).toBeGreaterThan(0);
    expect(result.current.error).toBeNull();
  });

  it("filters posts by search term", async () => {
    const { result } = renderHook(() => usePosts({ search: "React" }));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    result.current.posts.forEach((post) => {
      const matchesSearch =
        post.title.toLowerCase().includes("react") ||
        post.excerpt.toLowerCase().includes("react");
      expect(matchesSearch).toBe(true);
    });
  });

  it("filters posts by tags", async () => {
    const { result } = renderHook(() => usePosts({ tags: ["react"] }));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    result.current.posts.forEach((post) => {
      expect(post.tags).toContain("react");
    });
  });

  it("sorts posts by date descending", async () => {
    const { result } = renderHook(() =>
      usePosts({ sortBy: "date", sortOrder: "desc" })
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const posts = result.current.posts;
    for (let i = 0; i < posts.length - 1; i++) {
      const current = new Date(posts[i].publishedAt).getTime();
      const next = new Date(posts[i + 1].publishedAt).getTime();
      expect(current).toBeGreaterThanOrEqual(next);
    }
  });
});
```

---

## 4. Integration Testing

### PostList Integration Test

**File**: `packages/posts/src/components/PostList/PostList.integration.test.tsx`

```typescript
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { PostList } from "./PostList";

describe("PostList Integration", () => {
  it("renders post list and handles filtering", async () => {
    const handlePostClick = jest.fn();
    render(<PostList onPostClick={handlePostClick} />);

    // Wait for posts to load
    await waitFor(() => {
      expect(screen.queryByText("Loading posts...")).not.toBeInTheDocument();
    });

    // Verify posts are rendered
    const posts = screen.getAllByRole("article");
    expect(posts.length).toBeGreaterThan(0);

    // Test search filter
    const searchInput = screen.getByPlaceholderText(/search/i);
    fireEvent.change(searchInput, { target: { value: "React" } });

    await waitFor(() => {
      const filteredPosts = screen.getAllByRole("article");
      expect(filteredPosts.length).toBeLessThanOrEqual(posts.length);
    });

    // Test post click
    const firstPost = screen.getAllByRole("article")[0];
    fireEvent.click(firstPost);
    expect(handlePostClick).toHaveBeenCalled();
  });

  it("shows empty state when no posts match filters", async () => {
    render(<PostList onPostClick={jest.fn()} />);

    await waitFor(() => {
      expect(screen.queryByText("Loading posts...")).not.toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/search/i);
    fireEvent.change(searchInput, {
      target: { value: "nonexistent-search-term-xyz" },
    });

    await waitFor(() => {
      expect(screen.getByText("No posts found")).toBeInTheDocument();
    });
  });
});
```

---

## 5. Storybook Setup

### Main Configuration

**File**: `packages/posts/.storybook/main.js`

```javascript
module.exports = {
  stories: ["../stories/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "@storybook/addon-a11y",
  ],
  framework: {
    name: "@storybook/react-webpack5",
    options: {},
  },
  docs: {
    autodocs: "tag",
  },
  webpackFinal: async (config) => {
    // Add CSS Modules support
    config.module.rules.push({
      test: /\.css$/,
      use: [
        "style-loader",
        {
          loader: "css-loader",
          options: {
            modules: {
              auto: true,
              localIdentName: "[name]__[local]--[hash:base64:5]",
            },
          },
        },
      ],
    });

    return config;
  },
};
```

### Preview Configuration

**File**: `packages/posts/.storybook/preview.js`

```javascript
import React from "react";
import "../src/styles/global.css";

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  a11y: {
    element: "#root",
    config: {},
    options: {},
    manual: false,
  },
};

// Global decorators
export const decorators = [
  (Story) => (
    <div style={{ padding: "2rem" }}>
      <Story />
    </div>
  ),
];
```

---

## 6. Storybook Stories

### PostCard.stories.tsx

**File**: `packages/posts/stories/PostCard.stories.tsx`

```typescript
import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { PostCard } from "../src/components/PostCard/PostCard";
import { Post } from "../src/types/post.types";

const mockPost: Post = {
  id: "1",
  title: "Getting Started with React Microfrontends",
  excerpt:
    "Learn how to build scalable applications using microfrontend architecture with React and Module Federation.",
  content: "Full content...",
  authorId: "author-1",
  author: {
    id: "author-1",
    name: "Jane Smith",
    bio: "Senior Frontend Engineer",
    avatar: "https://i.pravatar.cc/150?img=1",
  },
  publishedAt: new Date("2024-01-15"),
  updatedAt: new Date("2024-01-15"),
  tags: ["react", "microfrontends", "architecture"],
  coverImage: "https://picsum.photos/800/400",
  status: "published",
  readTime: 8,
};

const meta: Meta<typeof PostCard> = {
  title: "Components/PostCard",
  component: PostCard,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["compact", "full"],
    },
    onClick: { action: "clicked" },
  },
};

export default meta;
type Story = StoryObj<typeof PostCard>;

export const Compact: Story = {
  args: {
    post: mockPost,
    variant: "compact",
  },
};

export const Full: Story = {
  args: {
    post: mockPost,
    variant: "full",
  },
};

export const WithoutCoverImage: Story = {
  args: {
    post: { ...mockPost, coverImage: undefined },
    variant: "compact",
  },
};

export const WithoutTags: Story = {
  args: {
    post: { ...mockPost, tags: [] },
    variant: "compact",
  },
};

export const LongTitle: Story = {
  args: {
    post: {
      ...mockPost,
      title:
        "This is a Very Long Post Title That Should Wrap to Multiple Lines and Test the Layout",
    },
    variant: "compact",
  },
};

export const Interactive: Story = {
  args: {
    post: mockPost,
    variant: "compact",
  },
  play: async ({ canvasElement }) => {
    // Add interaction tests here
  },
};
```

### Button.stories.tsx (Shared UI)

**File**: `packages/shared-ui/stories/Button.stories.tsx`

```typescript
import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import Button from "../src/components/Button/Button";

const meta: Meta<typeof Button> = {
  title: "Design System/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "tertiary"],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    disabled: {
      control: "boolean",
    },
    onClick: { action: "clicked" },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    children: "Primary Button",
    variant: "primary",
    size: "md",
  },
};

export const Secondary: Story = {
  args: {
    children: "Secondary Button",
    variant: "secondary",
    size: "md",
  },
};

export const Tertiary: Story = {
  args: {
    children: "Tertiary Button",
    variant: "tertiary",
    size: "md",
  },
};

export const Small: Story = {
  args: {
    children: "Small Button",
    size: "sm",
  },
};

export const Large: Story = {
  args: {
    children: "Large Button",
    size: "lg",
  },
};

export const Disabled: Story = {
  args: {
    children: "Disabled Button",
    disabled: true,
  },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
      <Button variant="primary" onClick={() => {}}>
        Primary
      </Button>
      <Button variant="secondary" onClick={() => {}}>
        Secondary
      </Button>
      <Button variant="tertiary" onClick={() => {}}>
        Tertiary
      </Button>
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
      <Button size="sm" onClick={() => {}}>
        Small
      </Button>
      <Button size="md" onClick={() => {}}>
        Medium
      </Button>
      <Button size="lg" onClick={() => {}}>
        Large
      </Button>
    </div>
  ),
};
```

---

## 7. E2E Testing with Playwright

### Playwright Configuration

**File**: `playwright.config.ts` (root)

```typescript
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
  ],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
  },
});
```

### E2E Test Example

**File**: `e2e/blog-flow.spec.ts`

```typescript
import { test, expect } from "@playwright/test";

test.describe("Blog Flow", () => {
  test("should display post list on homepage", async ({ page }) => {
    await page.goto("/");

    // Wait for posts to load
    await page.waitForSelector('[role="article"]');

    // Verify posts are displayed
    const posts = await page.locator('[role="article"]').count();
    expect(posts).toBeGreaterThan(0);

    // Verify page title
    await expect(page).toHaveTitle(/Blog/);
  });

  test("should navigate to post detail", async ({ page }) => {
    await page.goto("/");

    // Click first post
    await page.locator('[role="article"]').first().click();

    // Verify navigation to post detail
    await expect(page).toHaveURL(/\/posts\/\w+/);

    // Verify post content is displayed
    await expect(page.locator("h1")).toBeVisible();
  });

  test("should filter posts by search", async ({ page }) => {
    await page.goto("/");

    // Wait for posts to load
    await page.waitForSelector('[role="article"]');
    const initialCount = await page.locator('[role="article"]').count();

    // Enter search term
    await page.fill('input[placeholder*="search"]', "React");

    // Wait for filtered results
    await page.waitForTimeout(500);

    const filteredCount = await page.locator('[role="article"]').count();
    expect(filteredCount).toBeLessThanOrEqual(initialCount);
  });

  test("should toggle theme", async ({ page }) => {
    await page.goto("/");

    // Get initial theme
    const initialTheme = await page.evaluate(() =>
      document.documentElement.getAttribute("data-theme")
    );

    // Click theme toggle
    await page.click('button[aria-label*="theme"]');

    // Verify theme changed
    const newTheme = await page.evaluate(() =>
      document.documentElement.getAttribute("data-theme")
    );

    expect(newTheme).not.toBe(initialTheme);
  });
});
```

---

## 8. Test Scripts

### package.json Scripts

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "storybook": "storybook dev -p 6006",
    "build-storybook": "storybook build"
  }
}
```

---

## 9. CI Test Pipeline

**File**: `.github/workflows/test.yml`

```yaml
name: Test

on: [push, pull_request]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: "18"
      - run: npm ci
      - run: npm run test:coverage
      - uses: codecov/codecov-action@v3

  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: "18"
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run test:e2e
      - uses: actions/upload-artifact@v3
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/
```
