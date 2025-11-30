# Developer-Ready Implementation Prompt

> **Purpose**: This document provides copy-paste ready prompts for AI coding assistants (Claude, ChatGPT, Copilot) to generate the complete microfrontend blog application.

---

## How to Use This Document

1. **Copy a prompt section** from below
2. **Paste into your AI assistant** (Claude, ChatGPT, etc.)
3. **Review and customize** the generated code
4. **Iterate** with follow-up questions if needed

Each prompt is self-contained and references the architecture documents in this repository.

---

## Prompt 1: Initialize Project Structure

```
I need you to create a complete monorepo structure for a React microfrontend blog application using Webpack 5 Module Federation.

Requirements:
- Use npm workspaces
- Create 7 packages: shell, posts, post-detail, editor, comments, author, shared-ui
- Each package should have: src/, public/, webpack.config.js, package.json, tsconfig.json
- Root package.json with workspace configuration
- Scripts for dev, build, test, lint

Please generate:
1. Complete directory structure with all folders
2. Root package.json with workspaces and scripts
3. Template package.json for each package
4. .gitignore file
5. .eslintrc.js and .prettierrc configuration files

Follow the structure defined in STRUCTURE.md in this repository.
```

---

## Prompt 2: Create Shared UI Package

```
Create a complete Shared UI package for a microfrontend application with the following:

Components to implement:
1. Button (primary, secondary, tertiary variants; sm, md, lg sizes)
2. Input (with label, error state, validation)
3. Card (elevated and outlined variants)
4. Modal (with focus trap and ARIA attributes)

Requirements:
- Use TypeScript with full type definitions
- CSS Modules for styling
- CSS design tokens (colors, spacing, typography)
- Support light/dark themes via CSS variables
- WCAG 2.1 AA compliant
- Webpack 5 Module Federation configuration
- Export components via Module Federation

Files to generate:
1. packages/shared-ui/src/components/Button/Button.tsx
2. packages/shared-ui/src/components/Button/Button.module.css
3. packages/shared-ui/src/components/Input/Input.tsx
4. packages/shared-ui/src/components/Card/Card.tsx
5. packages/shared-ui/src/components/Modal/Modal.tsx
6. packages/shared-ui/src/tokens/colors.css
7. packages/shared-ui/src/tokens/spacing.css
8. packages/shared-ui/src/tokens/typography.css
9. packages/shared-ui/webpack.config.js (with ModuleFederationPlugin)
10. packages/shared-ui/package.json

Reference CONTRACTS.md for component prop interfaces and CODE_EXAMPLES.md for implementation patterns.
```

---

## Prompt 3: Create Shell Application

```
Create a complete Shell (host) application for a microfrontend blog with the following:

Features:
1. React Router v6 client-side routing
2. ThemeContext (light/dark mode with localStorage persistence)
3. AuthContext (mock authentication with login/logout)
4. NotificationContext (toast notifications)
5. Layout components (Header with navigation, Footer)
6. Error boundaries for remote loading failures
7. Loading fallbacks (skeleton screens)
8. Module Federation configuration to load 6 remotes

Remotes to configure:
- posts@http://localhost:3001/remoteEntry.js
- postDetail@http://localhost:3002/remoteEntry.js
- editor@http://localhost:3003/remoteEntry.js
- comments@http://localhost:3004/remoteEntry.js
- author@http://localhost:3005/remoteEntry.js
- sharedUI@http://localhost:3006/remoteEntry.js

Routes to implement:
- / → PostList
- /posts → PostList
- /posts/:id → PostDetail
- /posts/new → PostEditor (protected)
- /posts/:id/edit → PostEditor (protected)
- /authors/:id → AuthorProfile

Files to generate:
1. packages/shell/src/App.tsx
2. packages/shell/src/contexts/ThemeContext.tsx
3. packages/shell/src/contexts/AuthContext.tsx
4. packages/shell/src/contexts/NotificationContext.tsx
5. packages/shell/src/components/Layout/Header.tsx
6. packages/shell/src/components/Layout/Footer.tsx
7. packages/shell/src/components/Layout/Layout.tsx
8. packages/shell/src/components/ErrorBoundary/RemoteErrorBoundary.tsx
9. packages/shell/src/components/LoadingFallback/SkeletonScreen.tsx
10. packages/shell/src/routes/AppRoutes.tsx
11. packages/shell/src/types/remotes.d.ts
12. packages/shell/src/types/common.types.ts
13. packages/shell/webpack.config.js
14. packages/shell/public/index.html
15. packages/shell/package.json

Reference CODE_EXAMPLES.md for implementation patterns and CONTRACTS.md for type definitions.
```

---

## Prompt 4: Create Posts Remote

```
Create a complete Posts remote microfrontend with the following:

Components:
1. PostList - Main component with filtering, sorting, pagination
2. PostCard - Individual post preview card (compact and full variants)
3. PostFilters - Search and filter UI

Features:
- Mock data (10+ realistic blog posts)
- Client-side filtering by search term and tags
- Sorting by date, title, author
- Responsive grid layout
- Keyboard navigation
- ARIA attributes for accessibility
- Loading and error states

Custom hooks:
- usePosts(filters: FilterState) - Fetch and filter posts
- usePostFilters() - Manage filter state

Files to generate:
1. packages/posts/src/components/PostList/PostList.tsx
2. packages/posts/src/components/PostList/PostList.module.css
3. packages/posts/src/components/PostCard/PostCard.tsx
4. packages/posts/src/components/PostCard/PostCard.module.css
5. packages/posts/src/components/PostFilters/PostFilters.tsx
6. packages/posts/src/components/PostFilters/PostFilters.module.css
7. packages/posts/src/hooks/usePosts.ts
8. packages/posts/src/hooks/usePostFilters.ts
9. packages/posts/src/types/post.types.ts
10. packages/posts/src/utils/mockData.ts (10+ posts)
11. packages/posts/webpack.config.js (expose PostList, PostCard, PostFilters)
12. packages/posts/package.json

Also generate tests:
13. packages/posts/src/components/PostCard/PostCard.test.tsx
14. packages/posts/src/hooks/usePosts.test.ts

And Storybook stories:
15. packages/posts/stories/PostCard.stories.tsx
16. packages/posts/.storybook/main.js
17. packages/posts/.storybook/preview.js

Reference CODE_EXAMPLES.md for implementation patterns and TESTING.md for test examples.
```

---

## Prompt 5: Create Post Detail Remote

```
Create a complete Post Detail remote microfrontend with the following:

Components:
1. PostDetail - Full post view with content rendering
2. PostMeta - Author info, publish date, tags
3. ShareButtons - Social sharing (Twitter, Facebook, LinkedIn, Copy link)

Features:
- Fetch post by ID from mock data
- Render markdown or rich text content
- Display author information with click handler
- Tag navigation
- Social sharing functionality
- Related posts section
- Lazy load comments component
- Loading and error states
- Responsive layout
- ARIA attributes

Files to generate:
1. packages/post-detail/src/components/PostDetail/PostDetail.tsx
2. packages/post-detail/src/components/PostDetail/PostDetail.module.css
3. packages/post-detail/src/components/PostMeta/PostMeta.tsx
4. packages/post-detail/src/components/PostMeta/PostMeta.module.css
5. packages/post-detail/src/components/ShareButtons/ShareButtons.tsx
6. packages/post-detail/src/components/ShareButtons/ShareButtons.module.css
7. packages/post-detail/src/hooks/usePostDetail.ts
8. packages/post-detail/webpack.config.js (expose PostDetail, PostMeta, ShareButtons)
9. packages/post-detail/package.json

Also generate tests:
10. packages/post-detail/src/components/PostDetail/PostDetail.test.tsx

Reference CODE_EXAMPLES.md and CONTRACTS.md for implementation details.
```

---

## Prompt 6: Create Comments Remote

```
Create a complete Comments remote microfrontend with the following:

Components:
1. CommentThread - Nested comment display with threading
2. CommentForm - New comment and reply form
3. CommentModeration - Admin moderation UI (approve/delete)

Features:
- Display nested comments (replies)
- Reply to comments
- Like/reaction buttons
- Comment submission with validation
- Mock authentication check
- Moderation controls (admin only)
- Loading and error states
- ARIA tree structure for threading
- Keyboard navigation

Mock data:
- 20+ comments with nested replies
- Different authors
- Timestamps
- Like counts

Files to generate:
1. packages/comments/src/components/CommentThread/CommentThread.tsx
2. packages/comments/src/components/CommentThread/CommentThread.module.css
3. packages/comments/src/components/CommentForm/CommentForm.tsx
4. packages/comments/src/components/CommentForm/CommentForm.module.css
5. packages/comments/src/components/CommentModeration/CommentModeration.tsx
6. packages/comments/src/hooks/useComments.ts
7. packages/comments/src/types/comment.types.ts
8. packages/comments/src/utils/mockComments.ts
9. packages/comments/webpack.config.js (expose CommentThread, CommentForm, CommentModeration)
10. packages/comments/package.json

Reference CONTRACTS.md for component interfaces.
```

---

## Prompt 7: Create Editor Remote

```
Create a complete Editor remote microfrontend with the following:

Components:
1. PostEditor - Main editor component with textarea/contenteditable
2. EditorToolbar - Formatting controls (bold, italic, heading, link, image)
3. PublishPanel - Publish/draft controls, tags, category selection

Features:
- Rich text editing (markdown or contenteditable)
- Formatting toolbar with keyboard shortcuts
- Auto-save to localStorage every 30 seconds
- Draft/publish status
- Tag input with autocomplete
- Image upload UI (mock)
- Character/word count
- Preview mode
- Loading and error states
- ARIA toolbar and textbox attributes

Keyboard shortcuts:
- Ctrl/Cmd+B: Bold
- Ctrl/Cmd+I: Italic
- Ctrl/Cmd+K: Insert link
- Ctrl/Cmd+S: Save draft
- Ctrl/Cmd+Enter: Publish

Files to generate:
1. packages/editor/src/components/PostEditor/PostEditor.tsx
2. packages/editor/src/components/PostEditor/PostEditor.module.css
3. packages/editor/src/components/EditorToolbar/EditorToolbar.tsx
4. packages/editor/src/components/EditorToolbar/EditorToolbar.module.css
5. packages/editor/src/components/PublishPanel/PublishPanel.tsx
6. packages/editor/src/components/PublishPanel/PublishPanel.module.css
7. packages/editor/src/hooks/useEditor.ts
8. packages/editor/src/hooks/useAutoSave.ts
9. packages/editor/webpack.config.js (expose PostEditor, EditorToolbar, PublishPanel)
10. packages/editor/package.json

Reference ACCESSIBILITY.md for keyboard shortcuts and ARIA patterns.
```

---

## Prompt 8: Create Author Remote

```
Create a complete Author remote microfrontend with the following:

Components:
1. AuthorProfile - Full author profile page
2. AuthorPostList - List of posts by author
3. AuthorCard - Compact author display card

Features:
- Author bio and information
- Social links (Twitter, GitHub, LinkedIn, Website)
- Author statistics (post count, followers)
- List of posts by author
- Follow/unfollow button (mock)
- Avatar display
- Responsive layout
- ARIA attributes

Mock data:
- 5+ author profiles
- Each with 3+ posts

Files to generate:
1. packages/author/src/components/AuthorProfile/AuthorProfile.tsx
2. packages/author/src/components/AuthorProfile/AuthorProfile.module.css
3. packages/author/src/components/AuthorPostList/AuthorPostList.tsx
4. packages/author/src/components/AuthorPostList/AuthorPostList.module.css
5. packages/author/src/components/AuthorCard/AuthorCard.tsx
6. packages/author/src/components/AuthorCard/AuthorCard.module.css
7. packages/author/src/hooks/useAuthor.ts
8. packages/author/src/types/author.types.ts
9. packages/author/src/utils/mockAuthors.ts
10. packages/author/webpack.config.js (expose AuthorProfile, AuthorPostList, AuthorCard)
11. packages/author/package.json

Reference CONTRACTS.md for component interfaces.
```

---

## Prompt 9: Setup Testing Infrastructure

```
Setup complete testing infrastructure for the microfrontend blog application:

1. Jest configuration for unit tests
   - React Testing Library setup
   - CSS Modules mock
   - Coverage thresholds (70% minimum)
   - setupTests.ts with mocks

2. Playwright configuration for E2E tests
   - Multi-browser testing (Chrome, Firefox, Safari)
   - Test scenarios: home → post list → post detail
   - Screenshot on failure
   - Video recording

3. Storybook configuration
   - Webpack 5 support
   - CSS Modules support
   - Accessibility addon
   - Dark mode toggle

4. Example tests
   - PostCard.test.tsx (unit test)
   - usePosts.test.ts (hook test)
   - PostList.integration.test.tsx (integration test)
   - blog-flow.spec.ts (E2E test)

5. Example stories
   - PostCard.stories.tsx
   - Button.stories.tsx

Files to generate:
1. packages/posts/jest.config.js
2. packages/posts/src/setupTests.ts
3. packages/posts/.storybook/main.js
4. packages/posts/.storybook/preview.js
5. playwright.config.ts (root)
6. e2e/blog-flow.spec.ts
7. Example test files (see above)
8. Example story files (see above)

Reference TESTING.md for complete testing strategy.
```

---

## Prompt 10: Setup CI/CD Pipeline

```
Create a complete CI/CD pipeline using GitHub Actions for the microfrontend blog application:

Workflows needed:
1. CI Pipeline (on push/PR)
   - Install dependencies
   - Lint code
   - Type check
   - Run unit tests with coverage
   - Run E2E tests
   - Build all packages
   - Upload artifacts

2. Bundle Size Check (on PR)
   - Build packages
   - Check bundle sizes against budget
   - Comment on PR with results

3. Lighthouse CI (on PR)
   - Build and serve application
   - Run Lighthouse audits
   - Comment on PR with scores

4. Deploy to Staging (on develop branch)
   - Build all packages
   - Deploy to S3
   - Invalidate CloudFront cache
   - Run smoke tests

5. Deploy to Production (on main branch)
   - Build all packages
   - Deploy to S3 with cache headers
   - Invalidate CloudFront cache
   - Create GitHub release
   - Send Slack notification

Files to generate:
1. .github/workflows/ci.yml
2. .github/workflows/bundle-size.yml
3. .github/workflows/lighthouse.yml
4. .github/workflows/deploy-staging.yml
5. .github/workflows/deploy-production.yml
6. scripts/deploy.sh
7. scripts/health-check.sh
8. lighthouserc.js

Reference DEPLOYMENT.md for complete deployment strategy.
```

---

## Prompt 11: Implement Accessibility Features

```
Implement comprehensive accessibility features across all microfrontends:

Requirements:
1. Keyboard navigation
   - Tab order
   - Focus management
   - Skip links
   - Keyboard shortcuts

2. Screen reader support
   - ARIA labels and roles
   - Live regions for announcements
   - Semantic HTML
   - Alt text for images

3. Visual accessibility
   - Color contrast (4.5:1 minimum)
   - Focus indicators (2px outline)
   - Reduced motion support
   - Text resize support (200%)

4. Component-specific
   - Modal: focus trap, escape key
   - Dropdown: arrow key navigation
   - Form: error announcements
   - Loading: status announcements

Files to update:
1. All component files with ARIA attributes
2. CSS files with focus styles
3. Add useAnnouncement hook for screen reader announcements
4. Add useFocusTrap hook for modals
5. Add useKeyboardShortcuts hook for editor

Also generate:
6. Accessibility test suite (jest-axe)
7. Accessibility documentation

Reference ACCESSIBILITY.md for complete WCAG 2.1 AA checklist.
```

---

## Prompt 12: Optimize Performance

```
Implement performance optimizations across the microfrontend blog application:

Optimizations needed:
1. Code splitting
   - Lazy load remotes
   - Lazy load heavy components
   - Route-based splitting

2. Bundle optimization
   - Tree shaking
   - Minification
   - Compression (Gzip/Brotli)
   - Replace heavy dependencies

3. Runtime optimization
   - React.memo for expensive components
   - useMemo for expensive calculations
   - useCallback for callbacks
   - Virtualization for long lists (react-window)

4. Network optimization
   - Prefetch remotes on hover
   - Image lazy loading
   - HTTP/2 server push
   - CDN configuration

5. Caching
   - Service worker
   - LocalStorage for API responses
   - HTTP cache headers

Files to generate/update:
1. Update webpack configs with optimization settings
2. Add prefetch logic to PostCard
3. Add virtualization to PostList
4. Create serviceWorker.ts for shell
5. Add usePrefetch hook
6. Add useCache hook for data caching
7. Update components with React.memo, useMemo, useCallback

Reference PERFORMANCE.md for complete optimization strategy.
```

---

## Prompt 13: Create Development Scripts

```
Create comprehensive development scripts for the microfrontend blog application:

Scripts needed:
1. dev.sh - Start all applications in development mode
2. build-all.sh - Build all packages in correct order
3. test-all.sh - Run all tests (unit, integration, E2E)
4. deploy.sh - Deploy to specified environment (staging/production)
5. health-check.sh - Check if all remotes are accessible
6. rollback.sh - Rollback to previous deployment

Requirements:
- Color-coded output
- Error handling
- Progress indicators
- Parallel execution where possible
- Environment variable support
- Dry-run mode for deploy script

Files to generate:
1. scripts/dev.sh
2. scripts/build-all.sh
3. scripts/test-all.sh
4. scripts/deploy.sh
5. scripts/health-check.sh
6. scripts/rollback.sh
7. scripts/README.md (documentation)

Make all scripts executable (chmod +x).

Reference DEVELOPER_WORKFLOW.md for workflow details.
```

---

## Prompt 14: Generate Documentation

```
Generate comprehensive documentation for the microfrontend blog application:

Documentation needed:
1. API documentation for each component
   - Props interface
   - Usage examples
   - Accessibility notes
   - Performance considerations

2. Architecture decision records (ADRs)
   - Why Module Federation
   - Why independent deployment
   - Why CSS Modules
   - Why TypeScript

3. Troubleshooting guide
   - Common errors and solutions
   - Debug techniques
   - Performance profiling

4. Onboarding guide for new developers
   - Setup instructions
   - Architecture overview
   - Development workflow
   - Testing strategy

5. Deployment runbook
   - Pre-deployment checklist
   - Deployment steps
   - Post-deployment verification
   - Rollback procedure

Files to generate:
1. docs/API.md
2. docs/ADR.md
3. docs/TROUBLESHOOTING.md
4. docs/ONBOARDING.md
5. docs/DEPLOYMENT_RUNBOOK.md
6. Update README.md with links to all docs

Use clear examples, diagrams (ASCII art), and step-by-step instructions.
```

---

## Prompt 15: Create Example Application Flow

```
Create a complete, working example of the blog application flow:

User journey to implement:
1. User lands on homepage (/)
2. Sees list of blog posts (PostList)
3. Clicks on a post
4. Navigates to post detail (/posts/:id)
5. Reads post content (PostDetail)
6. Scrolls down to see comments (CommentThread)
7. Clicks on author name
8. Navigates to author profile (/authors/:id)
9. Sees author bio and posts (AuthorProfile)
10. Clicks "Write" in header (requires auth)
11. Redirected to login if not authenticated
12. After login, navigates to editor (/posts/new)
13. Writes post with formatting (PostEditor)
14. Saves draft (auto-save)
15. Publishes post
16. Redirected to published post

Requirements:
- All navigation working
- All remotes loading correctly
- Error boundaries catching errors
- Loading states showing
- Authentication flow working
- Data persisting in localStorage
- Responsive on mobile

Generate:
1. Complete working code for all components
2. Mock data for realistic content
3. Navigation logic in shell
4. State management for auth and posts
5. E2E test covering this flow

Reference IMPLEMENTATION_PLAN.md for step-by-step implementation.
```

---

## Follow-Up Prompts

### For Debugging

```
I'm getting this error: [paste error message]

Context:
- Package: [shell/posts/etc]
- File: [file path]
- What I'm trying to do: [description]

Please help me debug and fix this issue.
```

### For Enhancements

```
I want to add [feature name] to the [package name] package.

Requirements:
- [requirement 1]
- [requirement 2]

Please generate the code following the existing patterns in this codebase.
Reference [relevant doc file] for context.
```

### For Refactoring

```
I want to refactor [component/file name] to improve [performance/accessibility/maintainability].

Current implementation: [paste code or describe]

Please suggest improvements and generate the refactored code.
```

---

## Tips for Using These Prompts

1. **Be Specific**: Add project-specific details (API endpoints, design system, etc.)
2. **Provide Context**: Reference existing files and patterns
3. **Iterate**: Start with basic implementation, then enhance
4. **Review**: Always review generated code for correctness
5. **Test**: Run tests after implementing generated code
6. **Customize**: Adapt prompts to your specific needs

---

## Verification Checklist

After using prompts, verify:

- [ ] Code compiles without TypeScript errors
- [ ] All tests pass
- [ ] Linter passes
- [ ] Application runs locally
- [ ] All remotes load correctly
- [ ] Navigation works
- [ ] Accessibility checks pass
- [ ] Performance meets targets
- [ ] Documentation is updated

---

## Additional Resources

- [ARCHITECTURE.md](./ARCHITECTURE.md) - System architecture
- [CODE_EXAMPLES.md](./CODE_EXAMPLES.md) - Implementation patterns
- [TESTING.md](./TESTING.md) - Testing strategies
- [ACCESSIBILITY.md](./ACCESSIBILITY.md) - Accessibility guidelines
- [PERFORMANCE.md](./PERFORMANCE.md) - Performance optimization
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment procedures
- [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md) - Week 1 plan

---

## Support

If you encounter issues with these prompts:

1. Check the referenced documentation files
2. Review existing code examples
3. Consult the troubleshooting guide
4. Ask for clarification in team chat

Happy coding! 🚀
