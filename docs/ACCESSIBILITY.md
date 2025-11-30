# Accessibility Checklist (WCAG 2.1 AA Compliance)

## Overview

All microfrontends must meet **WCAG 2.1 Level AA** standards. This document provides actionable checklists for each remote.

---

## 1. Perceivable

### 1.1 Text Alternatives

- [ ] All images have `alt` attributes
- [ ] Decorative images use `alt=""` or `role="presentation"`
- [ ] Icons have `aria-label` or accompanying text
- [ ] SVG icons include `<title>` elements

**Example**:

```tsx
<img src="post-cover.jpg" alt="React architecture diagram" />
<img src="decorative-bg.jpg" alt="" role="presentation" />
<button aria-label="Close modal">
  <CloseIcon aria-hidden="true" />
</button>
```

---

### 1.2 Time-based Media

- [ ] Video content has captions (if applicable)
- [ ] Audio content has transcripts (if applicable)
- [ ] Auto-playing media can be paused

---

### 1.3 Adaptable

- [ ] Content structure uses semantic HTML (`<header>`, `<nav>`, `<main>`, `<article>`, `<aside>`, `<footer>`)
- [ ] Heading hierarchy is logical (h1 → h2 → h3, no skipping levels)
- [ ] Lists use `<ul>`, `<ol>`, `<li>` elements
- [ ] Forms use `<label>` elements associated with inputs
- [ ] Tables use `<th>`, `<caption>`, and `scope` attributes

**Example**:

```tsx
<article>
  <h1>Post Title</h1>
  <section>
    <h2>Section Title</h2>
    <p>Content...</p>
  </section>
</article>
```

---

### 1.4 Distinguishable

- [ ] Color contrast ratio ≥ 4.5:1 for normal text
- [ ] Color contrast ratio ≥ 3:1 for large text (18pt+ or 14pt+ bold)
- [ ] Color is not the only means of conveying information
- [ ] Text can be resized up to 200% without loss of functionality
- [ ] Focus indicators are visible (2px outline minimum)

**CSS Example**:

```css
:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}
```

---

## 2. Operable

### 2.1 Keyboard Accessible

- [ ] All interactive elements are keyboard accessible
- [ ] Tab order is logical and matches visual order
- [ ] No keyboard traps (users can navigate away)
- [ ] Skip links provided for main content
- [ ] Keyboard shortcuts don't conflict with assistive technologies

**Example**:

```tsx
<a href="#main-content" className="skip-link">
  Skip to main content
</a>

<main id="main-content" tabIndex={-1}>
  {/* Content */}
</main>
```

---

### 2.2 Enough Time

- [ ] Auto-save functionality for editor (no time limits)
- [ ] Session timeouts have warnings
- [ ] Users can extend time limits

---

### 2.3 Seizures and Physical Reactions

- [ ] No content flashes more than 3 times per second
- [ ] Animations can be disabled via `prefers-reduced-motion`

**CSS Example**:

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

### 2.4 Navigable

- [ ] Page titles are descriptive and unique
- [ ] Focus order is logical
- [ ] Link purpose is clear from link text or context
- [ ] Multiple ways to find content (search, navigation, sitemap)
- [ ] Headings and labels are descriptive

**Example**:

```tsx
<Helmet>
  <title>Getting Started with React - Blog</title>
</Helmet>

<a href="/posts/123">
  Read more about "Getting Started with React"
</a>
```

---

### 2.5 Input Modalities

- [ ] All functionality available via pointer (mouse/touch)
- [ ] Drag-and-drop has keyboard alternative
- [ ] Target size ≥ 44x44 pixels for touch targets

---

## 3. Understandable

### 3.1 Readable

- [ ] Page language is set (`<html lang="en">`)
- [ ] Language changes are marked (`<span lang="fr">`)
- [ ] Unusual words have definitions or glossary

**Example**:

```html
<html lang="en">
  <body>
    <p>The <span lang="fr">raison d'être</span> of this project...</p>
  </body>
</html>
```

---

### 3.2 Predictable

- [ ] Navigation is consistent across pages
- [ ] Components behave consistently
- [ ] Focus doesn't change context unexpectedly
- [ ] Forms don't auto-submit on input

---

### 3.3 Input Assistance

- [ ] Form errors are identified and described
- [ ] Labels and instructions are provided
- [ ] Error suggestions are provided
- [ ] Confirmation for destructive actions

**Example**:

```tsx
<Input
  label="Email"
  type="email"
  value={email}
  error={emailError}
  required
  aria-describedby="email-error"
  onChange={setEmail}
/>;
{
  emailError && (
    <span id="email-error" role="alert">
      {emailError}
    </span>
  );
}
```

---

## 4. Robust

### 4.1 Compatible

- [ ] Valid HTML (no duplicate IDs, proper nesting)
- [ ] ARIA attributes used correctly
- [ ] Name, role, value available for all UI components
- [ ] Status messages use `role="status"` or `role="alert"`

**Example**:

```tsx
<div role="alert" aria-live="assertive">
  Post published successfully!
</div>

<div role="status" aria-live="polite">
  Loading posts...
</div>
```

---

## 5. Component-Specific Checklists

### 5.1 PostList (Posts Remote)

- [ ] List uses `role="list"` and `aria-label`
- [ ] Each post card is an `<article>` with `role="article"`
- [ ] Post cards are keyboard navigable (tabIndex={0})
- [ ] Search input has associated `<label>`
- [ ] Filter controls have clear labels
- [ ] Loading state announced to screen readers
- [ ] Empty state is descriptive

---

### 5.2 PostCard (Posts Remote)

- [ ] Card is focusable and has focus styles
- [ ] Title has unique ID for `aria-labelledby`
- [ ] Publish date uses `<time datetime="...">`
- [ ] Tags use semantic list markup
- [ ] Click handler supports Enter key
- [ ] Cover image has descriptive alt text

---

### 5.3 PostDetail (Post Detail Remote)

- [ ] Heading hierarchy starts with h1
- [ ] Author link is keyboard accessible
- [ ] Share buttons have descriptive labels
- [ ] Related posts section has heading
- [ ] Comments section has heading and landmark

---

### 5.4 PostEditor (Editor Remote)

- [ ] Editor has `role="textbox"` and `aria-multiline="true"`
- [ ] Toolbar has `role="toolbar"`
- [ ] Toolbar buttons have `aria-label`
- [ ] Keyboard shortcuts documented and accessible
- [ ] Format changes announced to screen readers
- [ ] Save/publish status announced
- [ ] Error messages are descriptive

**Example**:

```tsx
<div
  role="textbox"
  aria-multiline="true"
  aria-label="Post content editor"
  contentEditable
  onKeyDown={handleKeyDown}
>
  {content}
</div>

<div role="toolbar" aria-label="Formatting toolbar">
  <button aria-label="Bold (Ctrl+B)" onClick={handleBold}>
    <BoldIcon aria-hidden="true" />
  </button>
</div>
```

---

### 5.5 CommentThread (Comments Remote)

- [ ] Thread uses `role="tree"` or nested lists
- [ ] Reply forms are keyboard accessible
- [ ] Comment nesting is clear to screen readers
- [ ] Like buttons have descriptive labels
- [ ] Moderation actions have confirmation dialogs

---

### 5.6 AuthorProfile (Author Remote)

- [ ] Profile uses semantic HTML
- [ ] Social links have descriptive text
- [ ] Post list is keyboard navigable
- [ ] Avatar has alt text with author name

---

### 5.7 Modal (Shared UI)

- [ ] Modal has `role="dialog"` and `aria-modal="true"`
- [ ] Modal has `aria-labelledby` pointing to title
- [ ] Focus trapped within modal when open
- [ ] Focus returns to trigger element on close
- [ ] Escape key closes modal
- [ ] Close button has descriptive label

**Example**:

```tsx
<div
  role="dialog"
  aria-modal="true"
  aria-labelledby="modal-title"
  onKeyDown={(e) => e.key === "Escape" && onClose()}
>
  <h2 id="modal-title">Modal Title</h2>
  <button aria-label="Close modal" onClick={onClose}>
    ×
  </button>
  {children}
</div>
```

---

### 5.8 Button (Shared UI)

- [ ] Button has `type` attribute
- [ ] Disabled state uses `aria-disabled`
- [ ] Icon-only buttons have `aria-label`
- [ ] Focus visible styles present
- [ ] Minimum 44x44px touch target

---

## 6. Testing Tools

### Automated Testing

```bash
# Install axe-core for automated a11y testing
npm install --save-dev @axe-core/react jest-axe

# Install Storybook a11y addon
npm install --save-dev @storybook/addon-a11y
```

**Jest Test Example**:

```typescript
import { axe, toHaveNoViolations } from "jest-axe";

expect.extend(toHaveNoViolations);

test("PostCard has no accessibility violations", async () => {
  const { container } = render(<PostCard post={mockPost} />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

---

### Manual Testing Checklist

- [ ] Test with keyboard only (unplug mouse)
- [ ] Test with screen reader (NVDA, JAWS, VoiceOver)
- [ ] Test with browser zoom at 200%
- [ ] Test with high contrast mode
- [ ] Test with reduced motion enabled
- [ ] Test with color blindness simulator

---

### Browser Extensions

- **axe DevTools**: Automated accessibility testing
- **WAVE**: Visual accessibility evaluation
- **Lighthouse**: Accessibility audit in Chrome DevTools
- **Color Contrast Analyzer**: Check contrast ratios

---

## 7. ARIA Patterns Reference

### Common ARIA Roles

| Pattern        | Role                         | Required ARIA                          |
| -------------- | ---------------------------- | -------------------------------------- |
| Modal Dialog   | `dialog`                     | `aria-modal="true"`, `aria-labelledby` |
| Dropdown Menu  | `menu`                       | `aria-haspopup`, `aria-expanded`       |
| Tabs           | `tablist`, `tab`, `tabpanel` | `aria-selected`, `aria-controls`       |
| Accordion      | `button`                     | `aria-expanded`, `aria-controls`       |
| Alert          | `alert`                      | `aria-live="assertive"`                |
| Status Message | `status`                     | `aria-live="polite"`                   |
| Breadcrumb     | `navigation`                 | `aria-label="Breadcrumb"`              |

---

## 8. Focus Management

### Focus Trap (Modal Example)

```typescript
import { useEffect, useRef } from "react";

const useFocusTrap = (isOpen: boolean) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const container = containerRef.current;
    if (!container) return;

    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[
      focusableElements.length - 1
    ] as HTMLElement;

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    };

    container.addEventListener("keydown", handleTab);
    firstElement?.focus();

    return () => {
      container.removeEventListener("keydown", handleTab);
    };
  }, [isOpen]);

  return containerRef;
};
```

---

## 9. Keyboard Shortcuts

### Editor Shortcuts

| Action  | Shortcut         | ARIA Announcement    |
| ------- | ---------------- | -------------------- |
| Bold    | Ctrl/Cmd + B     | "Bold applied"       |
| Italic  | Ctrl/Cmd + I     | "Italic applied"     |
| Link    | Ctrl/Cmd + K     | "Link dialog opened" |
| Save    | Ctrl/Cmd + S     | "Draft saved"        |
| Publish | Ctrl/Cmd + Enter | "Post published"     |

**Implementation**:

```typescript
const handleKeyDown = (e: KeyboardEvent) => {
  const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
  const modifier = isMac ? e.metaKey : e.ctrlKey;

  if (modifier && e.key === "b") {
    e.preventDefault();
    applyFormat("bold");
    announceToScreenReader("Bold applied");
  }
};
```

---

## 10. Screen Reader Announcements

### Live Region Example

```typescript
const announceToScreenReader = (message: string) => {
  const announcement = document.createElement("div");
  announcement.setAttribute("role", "status");
  announcement.setAttribute("aria-live", "polite");
  announcement.className = "sr-only";
  announcement.textContent = message;

  document.body.appendChild(announcement);

  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
};
```

### Screen Reader Only CSS

```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

---

## 11. Accessibility Audit Schedule

### Pre-Release Checklist

- [ ] Run automated tests (axe, Lighthouse)
- [ ] Manual keyboard navigation test
- [ ] Screen reader test (at least one platform)
- [ ] Color contrast verification
- [ ] Zoom test (200%)
- [ ] Documentation review

### Ongoing Monitoring

- **Weekly**: Automated tests in CI/CD
- **Monthly**: Manual accessibility review
- **Quarterly**: Full WCAG audit
- **Annually**: Third-party accessibility audit

---

## 12. Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
