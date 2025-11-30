# Component Contracts & API Specifications

## Contract Table

| Remote         | Component           | Props                                                                               | Events                                                             | Context Dependencies          | Accessibility                    |
| -------------- | ------------------- | ----------------------------------------------------------------------------------- | ------------------------------------------------------------------ | ----------------------------- | -------------------------------- |
| **posts**      | `PostList`          | `initialFilters?: FilterState`                                                      | `onPostClick: (postId: string) => void`                            | `ThemeContext`                | ARIA list, keyboard nav          |
| **posts**      | `PostCard`          | `post: Post, variant?: 'compact' \| 'full'`                                         | `onClick?: () => void`                                             | `ThemeContext`                | ARIA article, focus styles       |
| **posts**      | `PostFilters`       | `filters: FilterState, onChange: (filters: FilterState) => void`                    | -                                                                  | -                             | ARIA form, labels                |
| **postDetail** | `PostDetail`        | `postId: string`                                                                    | `onAuthorClick?: (authorId: string) => void`                       | `ThemeContext`, `AuthContext` | ARIA article, heading hierarchy  |
| **postDetail** | `PostMeta`          | `author: Author, publishedAt: Date, tags: string[]`                                 | `onTagClick?: (tag: string) => void`                               | -                             | ARIA metadata, time element      |
| **postDetail** | `ShareButtons`      | `postId: string, title: string`                                                     | `onShare?: (platform: string) => void`                             | -                             | ARIA buttons, tooltips           |
| **editor**     | `PostEditor`        | `postId?: string, initialContent?: string`                                          | `onSave: (content: Post) => void, onPublish: (post: Post) => void` | `AuthContext`                 | ARIA textbox, toolbar            |
| **editor**     | `EditorToolbar`     | `onFormat: (type: FormatType) => void`                                              | -                                                                  | -                             | ARIA toolbar, keyboard shortcuts |
| **editor**     | `PublishPanel`      | `post: Post, isDraft: boolean`                                                      | `onPublish: () => void, onSaveDraft: () => void`                   | `AuthContext`                 | ARIA form, status messages       |
| **comments**   | `CommentThread`     | `postId: string, comments: Comment[]`                                               | `onReply: (commentId: string, content: string) => void`            | `AuthContext`, `ThemeContext` | ARIA tree, nested structure      |
| **comments**   | `CommentForm`       | `postId: string, parentId?: string`                                                 | `onSubmit: (content: string) => void`                              | `AuthContext`                 | ARIA form, validation            |
| **comments**   | `CommentModeration` | `comments: Comment[]`                                                               | `onApprove: (id: string) => void, onDelete: (id: string) => void`  | `AuthContext`                 | ARIA table, actions              |
| **author**     | `AuthorProfile`     | `authorId: string`                                                                  | -                                                                  | `ThemeContext`                | ARIA profile, heading hierarchy  |
| **author**     | `AuthorPostList`    | `authorId: string, limit?: number`                                                  | `onPostClick: (postId: string) => void`                            | -                             | ARIA list                        |
| **author**     | `AuthorCard`        | `author: Author, variant?: 'compact' \| 'full'`                                     | `onClick?: () => void`                                             | `ThemeContext`                | ARIA card, focus styles          |
| **sharedUI**   | `Button`            | `variant: 'primary' \| 'secondary', size: 'sm' \| 'md' \| 'lg', disabled?: boolean` | `onClick: () => void`                                              | `ThemeContext`                | ARIA button, focus visible       |
| **sharedUI**   | `Input`             | `type: string, label: string, error?: string, required?: boolean`                   | `onChange: (value: string) => void`                                | `ThemeContext`                | ARIA input, error messages       |
| **sharedUI**   | `Card`              | `children: ReactNode, variant?: 'elevated' \| 'outlined'`                           | -                                                                  | `ThemeContext`                | ARIA region                      |
| **sharedUI**   | `Modal`             | `isOpen: boolean, title: string, children: ReactNode`                               | `onClose: () => void`                                              | `ThemeContext`                | ARIA dialog, focus trap          |

---

## TypeScript Type Definitions

**File**: `packages/shell/src/types/remotes.d.ts`

```typescript
// ============================================
// Remote Module Declarations
// ============================================

declare module "posts/PostList" {
  import { FC } from "react";

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

  const PostList: FC<PostListProps>;
  export default PostList;
}

declare module "posts/PostCard" {
  import { FC } from "react";
  import { Post } from "../types/common.types";

  export interface PostCardProps {
    post: Post;
    variant?: "compact" | "full";
    onClick?: () => void;
  }

  const PostCard: FC<PostCardProps>;
  export default PostCard;
}

declare module "posts/PostFilters" {
  import { FC } from "react";
  import { FilterState } from "posts/PostList";

  export interface PostFiltersProps {
    filters: FilterState;
    onChange: (filters: FilterState) => void;
  }

  const PostFilters: FC<PostFiltersProps>;
  export default PostFilters;
}

declare module "postDetail/PostDetail" {
  import { FC } from "react";

  export interface PostDetailProps {
    postId: string;
    onAuthorClick?: (authorId: string) => void;
  }

  const PostDetail: FC<PostDetailProps>;
  export default PostDetail;
}

declare module "postDetail/PostMeta" {
  import { FC } from "react";
  import { Author } from "../types/common.types";

  export interface PostMetaProps {
    author: Author;
    publishedAt: Date;
    tags: string[];
    onTagClick?: (tag: string) => void;
  }

  const PostMeta: FC<PostMetaProps>;
  export default PostMeta;
}

declare module "postDetail/ShareButtons" {
  import { FC } from "react";

  export interface ShareButtonsProps {
    postId: string;
    title: string;
    onShare?: (platform: string) => void;
  }

  const ShareButtons: FC<ShareButtonsProps>;
  export default ShareButtons;
}

declare module "editor/PostEditor" {
  import { FC } from "react";
  import { Post } from "../types/common.types";

  export interface PostEditorProps {
    postId?: string;
    initialContent?: string;
    onSave: (content: Post) => void;
    onPublish: (post: Post) => void;
  }

  const PostEditor: FC<PostEditorProps>;
  export default PostEditor;
}

declare module "editor/EditorToolbar" {
  import { FC } from "react";

  export type FormatType =
    | "bold"
    | "italic"
    | "underline"
    | "heading"
    | "link"
    | "image";

  export interface EditorToolbarProps {
    onFormat: (type: FormatType) => void;
  }

  const EditorToolbar: FC<EditorToolbarProps>;
  export default EditorToolbar;
}

declare module "editor/PublishPanel" {
  import { FC } from "react";
  import { Post } from "../types/common.types";

  export interface PublishPanelProps {
    post: Post;
    isDraft: boolean;
    onPublish: () => void;
    onSaveDraft: () => void;
  }

  const PublishPanel: FC<PublishPanelProps>;
  export default PublishPanel;
}

declare module "comments/CommentThread" {
  import { FC } from "react";
  import { Comment } from "../types/common.types";

  export interface CommentThreadProps {
    postId: string;
    comments: Comment[];
    onReply: (commentId: string, content: string) => void;
  }

  const CommentThread: FC<CommentThreadProps>;
  export default CommentThread;
}

declare module "comments/CommentForm" {
  import { FC } from "react";

  export interface CommentFormProps {
    postId: string;
    parentId?: string;
    onSubmit: (content: string) => void;
  }

  const CommentForm: FC<CommentFormProps>;
  export default CommentForm;
}

declare module "comments/CommentModeration" {
  import { FC } from "react";
  import { Comment } from "../types/common.types";

  export interface CommentModerationProps {
    comments: Comment[];
    onApprove: (id: string) => void;
    onDelete: (id: string) => void;
  }

  const CommentModeration: FC<CommentModerationProps>;
  export default CommentModeration;
}

declare module "author/AuthorProfile" {
  import { FC } from "react";

  export interface AuthorProfileProps {
    authorId: string;
  }

  const AuthorProfile: FC<AuthorProfileProps>;
  export default AuthorProfile;
}

declare module "author/AuthorPostList" {
  import { FC } from "react";

  export interface AuthorPostListProps {
    authorId: string;
    limit?: number;
    onPostClick: (postId: string) => void;
  }

  const AuthorPostList: FC<AuthorPostListProps>;
  export default AuthorPostList;
}

declare module "author/AuthorCard" {
  import { FC } from "react";
  import { Author } from "../types/common.types";

  export interface AuthorCardProps {
    author: Author;
    variant?: "compact" | "full";
    onClick?: () => void;
  }

  const AuthorCard: FC<AuthorCardProps>;
  export default AuthorCard;
}

declare module "sharedUI/Button" {
  import { FC, ReactNode } from "react";

  export interface ButtonProps {
    children: ReactNode;
    variant?: "primary" | "secondary" | "tertiary";
    size?: "sm" | "md" | "lg";
    disabled?: boolean;
    onClick: () => void;
    ariaLabel?: string;
  }

  const Button: FC<ButtonProps>;
  export default Button;
}

declare module "sharedUI/Input" {
  import { FC } from "react";

  export interface InputProps {
    type: string;
    label: string;
    value: string;
    error?: string;
    required?: boolean;
    onChange: (value: string) => void;
  }

  const Input: FC<InputProps>;
  export default Input;
}

declare module "sharedUI/Card" {
  import { FC, ReactNode } from "react";

  export interface CardProps {
    children: ReactNode;
    variant?: "elevated" | "outlined";
  }

  const Card: FC<CardProps>;
  export default Card;
}

declare module "sharedUI/Modal" {
  import { FC, ReactNode } from "react";

  export interface ModalProps {
    isOpen: boolean;
    title: string;
    children: ReactNode;
    onClose: () => void;
  }

  const Modal: FC<ModalProps>;
  export default Modal;
}
```

---

## Common Types

**File**: `packages/shell/src/types/common.types.ts`

```typescript
export interface Post {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  authorId: string;
  author: Author;
  publishedAt: Date;
  updatedAt: Date;
  tags: string[];
  coverImage?: string;
  status: "draft" | "published";
  readTime?: number; // in minutes
}

export interface Author {
  id: string;
  name: string;
  bio: string;
  avatar?: string;
  socialLinks?: {
    twitter?: string;
    github?: string;
    linkedin?: string;
    website?: string;
  };
  postCount?: number;
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  author: Author;
  content: string;
  createdAt: Date;
  updatedAt?: Date;
  parentId?: string;
  replies?: Comment[];
  likes: number;
  status: "pending" | "approved" | "rejected";
}

export interface FilterState {
  search?: string;
  tags?: string[];
  sortBy?: "date" | "title" | "author";
  sortOrder?: "asc" | "desc";
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "admin" | "author" | "reader";
}
```

---

## Context Contracts

### ThemeContext

**File**: `packages/shell/src/contexts/ThemeContext.tsx`

```typescript
import { createContext, useContext } from "react";

export type Theme = "light" | "dark";

export interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextValue | undefined>(
  undefined
);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
};
```

### AuthContext

**File**: `packages/shell/src/contexts/AuthContext.tsx`

```typescript
import { createContext, useContext } from "react";
import { User } from "../types/common.types";

export interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined
);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
```

### NotificationContext

**File**: `packages/shell/src/contexts/NotificationContext.tsx`

```typescript
import { createContext, useContext } from "react";

export type NotificationType = "success" | "error" | "warning" | "info";

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  duration?: number;
}

export interface NotificationContextValue {
  notifications: Notification[];
  addNotification: (
    type: NotificationType,
    message: string,
    duration?: number
  ) => void;
  removeNotification: (id: string) => void;
}

export const NotificationContext = createContext<
  NotificationContextValue | undefined
>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification must be used within NotificationProvider");
  }
  return context;
};
```
