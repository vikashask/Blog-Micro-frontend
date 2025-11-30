# Deployment & CI/CD Strategy

## Deployment Overview

**Architecture**: Independent deployment of shell and remotes to CDN

```
CDN (CloudFront/Cloudflare)
├── /shell/          → Shell application
├── /posts/          → Posts remote
├── /post-detail/    → Post detail remote
├── /editor/         → Editor remote
├── /comments/       → Comments remote
├── /author/         → Author remote
└── /shared-ui/      → Shared UI remote
```

---

## 1. Build Process

### 1.1 Production Build

**Build all packages**:

```bash
npm run build
```

**Build output structure**:

```
packages/
├── shell/dist/
│   ├── index.html
│   ├── static/
│   │   ├── js/
│   │   │   ├── main.[hash].js
│   │   │   └── vendors.[hash].js
│   │   └── css/
│   │       └── main.[hash].css
│   └── remoteEntry.js (not present in shell)
│
├── posts/dist/
│   ├── remoteEntry.js
│   ├── static/
│   │   └── js/
│   │       ├── PostList.[hash].js
│   │       └── vendors.[hash].js
│   └── index.html (standalone testing)
│
└── [other remotes follow same pattern]
```

---

### 1.2 Environment-Specific Builds

**Development**:

```bash
NODE_ENV=development npm run build
```

**Staging**:

```bash
NODE_ENV=production STAGE=staging npm run build
```

**Production**:

```bash
NODE_ENV=production STAGE=production npm run build
```

---

### 1.3 Environment Variables

**File**: `packages/shell/.env.production`

```bash
NODE_ENV=production
PUBLIC_URL=https://cdn.example.com/shell

# Remote URLs
POSTS_URL=https://cdn.example.com/posts
POST_DETAIL_URL=https://cdn.example.com/post-detail
EDITOR_URL=https://cdn.example.com/editor
COMMENTS_URL=https://cdn.example.com/comments
AUTHOR_URL=https://cdn.example.com/author
SHARED_UI_URL=https://cdn.example.com/shared-ui
```

**Load in webpack**:

```javascript
const webpack = require("webpack");
const dotenv = require("dotenv");

const env = dotenv.config({
  path: `.env.${process.env.STAGE || "production"}`,
}).parsed;

module.exports = {
  plugins: [
    new webpack.DefinePlugin({
      "process.env": JSON.stringify(env),
    }),
  ],
};
```

---

## 2. CI/CD Pipeline

### 2.1 GitHub Actions Workflow

**File**: `.github/workflows/ci.yml`

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  # Job 1: Install and Cache
  setup:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "18"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Cache node_modules
        uses: actions/cache@v3
        with:
          path: "**/node_modules"
          key: ${{ runner.os }}-modules-${{ hashFiles('**/package-lock.json') }}

  # Job 2: Lint
  lint:
    needs: setup
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: "18"
      - run: npm ci
      - run: npm run lint

  # Job 3: Type Check
  typecheck:
    needs: setup
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: "18"
      - run: npm ci
      - run: npx tsc --noEmit --project packages/shell/tsconfig.json
      - run: npx tsc --noEmit --project packages/posts/tsconfig.json

  # Job 4: Unit Tests
  test:
    needs: setup
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: "18"
      - run: npm ci
      - run: npm run test:coverage

      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info
          flags: unittests

  # Job 5: Build
  build:
    needs: [lint, typecheck, test]
    runs-on: ubuntu-latest
    strategy:
      matrix:
        package:
          [shell, posts, post-detail, editor, comments, author, shared-ui]
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: "18"
      - run: npm ci

      - name: Build ${{ matrix.package }}
        run: cd packages/${{ matrix.package }} && npm run build

      - name: Upload build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: ${{ matrix.package }}-dist
          path: packages/${{ matrix.package }}/dist

  # Job 6: E2E Tests
  e2e:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: "18"
      - run: npm ci

      - name: Install Playwright
        run: npx playwright install --with-deps

      - name: Download all artifacts
        uses: actions/download-artifact@v3

      - name: Run E2E tests
        run: npm run test:e2e

      - name: Upload test results
        if: failure()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: playwright-report/

  # Job 7: Deploy to Staging
  deploy-staging:
    needs: [build, e2e]
    if: github.ref == 'refs/heads/develop'
    runs-on: ubuntu-latest
    environment: staging
    steps:
      - uses: actions/checkout@v3

      - name: Download all artifacts
        uses: actions/download-artifact@v3

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1

      - name: Deploy to S3
        run: |
          aws s3 sync shell-dist/ s3://blog-staging/shell/ --delete
          aws s3 sync posts-dist/ s3://blog-staging/posts/ --delete
          aws s3 sync post-detail-dist/ s3://blog-staging/post-detail/ --delete
          aws s3 sync editor-dist/ s3://blog-staging/editor/ --delete
          aws s3 sync comments-dist/ s3://blog-staging/comments/ --delete
          aws s3 sync author-dist/ s3://blog-staging/author/ --delete
          aws s3 sync shared-ui-dist/ s3://blog-staging/shared-ui/ --delete

      - name: Invalidate CloudFront cache
        run: |
          aws cloudfront create-invalidation \
            --distribution-id ${{ secrets.CLOUDFRONT_DISTRIBUTION_ID_STAGING }} \
            --paths "/*"

  # Job 8: Deploy to Production
  deploy-production:
    needs: [build, e2e]
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    environment: production
    steps:
      - uses: actions/checkout@v3

      - name: Download all artifacts
        uses: actions/download-artifact@v3

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1

      - name: Deploy to S3
        run: |
          aws s3 sync shell-dist/ s3://blog-production/shell/ --delete --cache-control "max-age=31536000,public,immutable"
          aws s3 sync posts-dist/ s3://blog-production/posts/ --delete --cache-control "max-age=31536000,public,immutable"
          aws s3 sync post-detail-dist/ s3://blog-production/post-detail/ --delete --cache-control "max-age=31536000,public,immutable"
          aws s3 sync editor-dist/ s3://blog-production/editor/ --delete --cache-control "max-age=31536000,public,immutable"
          aws s3 sync comments-dist/ s3://blog-production/comments/ --delete --cache-control "max-age=31536000,public,immutable"
          aws s3 sync author-dist/ s3://blog-production/author/ --delete --cache-control "max-age=31536000,public,immutable"
          aws s3 sync shared-ui-dist/ s3://blog-production/shared-ui/ --delete --cache-control "max-age=31536000,public,immutable"

      - name: Invalidate CloudFront cache
        run: |
          aws cloudfront create-invalidation \
            --distribution-id ${{ secrets.CLOUDFRONT_DISTRIBUTION_ID_PRODUCTION }} \
            --paths "/*"

      - name: Create GitHub Release
        uses: actions/create-release@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          tag_name: v${{ github.run_number }}
          release_name: Release v${{ github.run_number }}
          draft: false
          prerelease: false
```

---

### 2.2 Bundle Size Check

**File**: `.github/workflows/bundle-size.yml`

```yaml
name: Bundle Size Check

on: [pull_request]

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: "18"

      - run: npm ci
      - run: npm run build

      - name: Check bundle size
        uses: andresz1/size-limit-action@v1
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
```

---

### 2.3 Lighthouse CI

**File**: `.github/workflows/lighthouse.yml`

```yaml
name: Lighthouse CI

on: [pull_request]

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: "18"

      - run: npm ci
      - run: npm run build

      - name: Run Lighthouse CI
        run: |
          npm install -g @lhci/cli
          lhci autorun
        env:
          LHCI_GITHUB_APP_TOKEN: ${{ secrets.LHCI_GITHUB_APP_TOKEN }}
```

---

## 3. Deployment Strategies

### 3.1 Independent Deployment

**Deploy single remote**:

```bash
# Build remote
cd packages/posts
npm run build

# Deploy to S3
aws s3 sync dist/ s3://blog-production/posts/ --delete

# Invalidate CDN cache
aws cloudfront create-invalidation \
  --distribution-id XXXXX \
  --paths "/posts/*"
```

**Benefits**:

- Fast deployment (only changed remote)
- No downtime for other remotes
- Independent versioning

---

### 3.2 Canary Deployment

**Deploy to subset of users**:

```javascript
// Shell: Load remote based on user segment
const getRemoteUrl = (remoteName) => {
  const isCanaryUser = Math.random() < 0.1; // 10% of users

  if (isCanaryUser) {
    return `https://cdn.example.com/${remoteName}-canary/remoteEntry.js`;
  }

  return `https://cdn.example.com/${remoteName}/remoteEntry.js`;
};
```

---

### 3.3 Blue-Green Deployment

**Maintain two environments**:

```
Blue (current):  https://cdn.example.com/posts/
Green (new):     https://cdn.example.com/posts-green/
```

**Switch traffic**:

```bash
# Deploy to green
aws s3 sync dist/ s3://blog-production/posts-green/

# Test green environment
curl https://cdn.example.com/posts-green/remoteEntry.js

# Switch traffic (update shell config)
# Update POSTS_URL to point to posts-green

# After verification, make green the new blue
aws s3 sync s3://blog-production/posts-green/ s3://blog-production/posts/
```

---

## 4. Rollback Strategy

### 4.1 Immediate Rollback

**Revert to previous version**:

```bash
# List previous versions
aws s3api list-object-versions \
  --bucket blog-production \
  --prefix posts/

# Restore specific version
aws s3api copy-object \
  --copy-source blog-production/posts/remoteEntry.js?versionId=VERSION_ID \
  --bucket blog-production \
  --key posts/remoteEntry.js

# Invalidate cache
aws cloudfront create-invalidation \
  --distribution-id XXXXX \
  --paths "/posts/*"
```

---

### 4.2 Automated Rollback

**Monitor and auto-rollback on errors**:

```yaml
# .github/workflows/deploy-with-rollback.yml
- name: Deploy
  id: deploy
  run: ./scripts/deploy.sh

- name: Health check
  id: health
  run: ./scripts/health-check.sh
  continue-on-error: true

- name: Rollback on failure
  if: steps.health.outcome == 'failure'
  run: ./scripts/rollback.sh
```

---

## 5. Versioning Strategy

### 5.1 Semantic Versioning

**Version format**: `MAJOR.MINOR.PATCH`

- **MAJOR**: Breaking changes (incompatible API changes)
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

**Example**:

```json
{
  "name": "@blog/posts",
  "version": "1.2.3"
}
```

---

### 5.2 Version Compatibility

**Remote version export**:

```typescript
// packages/posts/src/bootstrap.tsx
export const version = "1.2.3";
export const apiVersion = "v1";
```

**Shell version check**:

```typescript
import { version as postsVersion } from "posts/PostList";

const checkCompatibility = (remoteVersion: string) => {
  const [major] = remoteVersion.split(".");
  const [expectedMajor] = "1.0.0".split(".");

  if (major !== expectedMajor) {
    console.error("Incompatible remote version");
    return false;
  }

  return true;
};
```

---

## 6. CDN Configuration

### 6.1 CloudFront Setup

**Distribution settings**:

```yaml
Origins:
  - DomainName: blog-production.s3.amazonaws.com
    Id: S3-blog-production
    S3OriginConfig:
      OriginAccessIdentity: origin-access-identity/cloudfront/XXXXX

DefaultCacheBehavior:
  TargetOriginId: S3-blog-production
  ViewerProtocolPolicy: redirect-to-https
  AllowedMethods: [GET, HEAD, OPTIONS]
  CachedMethods: [GET, HEAD]
  Compress: true
  DefaultTTL: 86400
  MaxTTL: 31536000
  MinTTL: 0

CacheBehaviors:
  - PathPattern: "*/remoteEntry.js"
    TargetOriginId: S3-blog-production
    ViewerProtocolPolicy: redirect-to-https
    DefaultTTL: 3600 # Shorter TTL for remoteEntry.js
    MaxTTL: 3600
    MinTTL: 0
```

---

### 6.2 Cache Invalidation

**Invalidate on deployment**:

```bash
aws cloudfront create-invalidation \
  --distribution-id E1234567890ABC \
  --paths "/*"
```

**Selective invalidation**:

```bash
# Invalidate only posts remote
aws cloudfront create-invalidation \
  --distribution-id E1234567890ABC \
  --paths "/posts/*"
```

---

## 7. Monitoring & Observability

### 7.1 Error Tracking

**Sentry Integration**:

```typescript
// packages/shell/src/index.ts
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.STAGE,
  integrations: [new Sentry.BrowserTracing(), new Sentry.Replay()],
  tracesSampleRate: 0.1,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});
```

---

### 7.2 Performance Monitoring

**Web Vitals Tracking**:

```typescript
import { getCLS, getFID, getFCP, getLCP, getTTFB } from "web-vitals";

const sendToAnalytics = (metric) => {
  fetch("/api/analytics", {
    method: "POST",
    body: JSON.stringify(metric),
  });
};

getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getFCP(sendToAnalytics);
getLCP(sendToAnalytics);
getTTFB(sendToAnalytics);
```

---

### 7.3 Health Checks

**Health check endpoint**:

```typescript
// packages/shell/src/health.ts
export const healthCheck = async () => {
  const remotes = [
    "posts",
    "postDetail",
    "editor",
    "comments",
    "author",
    "sharedUI",
  ];

  const results = await Promise.all(
    remotes.map(async (remote) => {
      try {
        const url = getRemoteUrl(remote);
        const response = await fetch(url);
        return { remote, status: response.ok ? "healthy" : "unhealthy" };
      } catch (error) {
        return { remote, status: "unhealthy", error: error.message };
      }
    })
  );

  return results;
};
```

---

## 8. Deployment Checklist

### Pre-Deployment

- [ ] All tests pass (unit, integration, E2E)
- [ ] Code review approved
- [ ] Bundle size within budget
- [ ] Lighthouse score meets targets
- [ ] No console errors or warnings
- [ ] Accessibility audit passed
- [ ] Security scan completed
- [ ] Documentation updated
- [ ] Changelog updated

### Deployment

- [ ] Build all packages
- [ ] Run smoke tests on build artifacts
- [ ] Deploy to staging first
- [ ] Verify staging deployment
- [ ] Deploy to production
- [ ] Invalidate CDN cache
- [ ] Verify production deployment
- [ ] Monitor error rates
- [ ] Monitor performance metrics

### Post-Deployment

- [ ] Verify all remotes load correctly
- [ ] Check error tracking dashboard
- [ ] Monitor performance metrics
- [ ] Verify analytics tracking
- [ ] Check user feedback channels
- [ ] Update deployment log
- [ ] Notify team of deployment

---

## 9. Disaster Recovery

### 9.1 Backup Strategy

**S3 Versioning**:

```bash
# Enable versioning
aws s3api put-bucket-versioning \
  --bucket blog-production \
  --versioning-configuration Status=Enabled
```

**Regular backups**:

```bash
# Backup to separate bucket
aws s3 sync s3://blog-production/ s3://blog-backups/$(date +%Y-%m-%d)/
```

---

### 9.2 Recovery Procedures

**Restore from backup**:

```bash
# List backups
aws s3 ls s3://blog-backups/

# Restore specific backup
aws s3 sync s3://blog-backups/2024-01-15/ s3://blog-production/ --delete

# Invalidate cache
aws cloudfront create-invalidation \
  --distribution-id XXXXX \
  --paths "/*"
```

---

## 10. Security

### 10.1 S3 Bucket Policy

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowCloudFrontAccess",
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::cloudfront:user/CloudFront Origin Access Identity XXXXX"
      },
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::blog-production/*"
    }
  ]
}
```

---

### 10.2 HTTPS Enforcement

**CloudFront settings**:

```yaml
ViewerProtocolPolicy: redirect-to-https
```

---

### 10.3 Content Security Policy

**Add CSP headers**:

```javascript
// Lambda@Edge function
exports.handler = (event, context, callback) => {
  const response = event.Records[0].cf.response;
  const headers = response.headers;

  headers["content-security-policy"] = [
    {
      key: "Content-Security-Policy",
      value:
        "default-src 'self'; script-src 'self' 'unsafe-inline' cdn.example.com; style-src 'self' 'unsafe-inline';",
    },
  ];

  callback(null, response);
};
```

---

## 11. Cost Optimization

### 11.1 S3 Lifecycle Policies

```json
{
  "Rules": [
    {
      "Id": "DeleteOldVersions",
      "Status": "Enabled",
      "NoncurrentVersionExpiration": {
        "NoncurrentDays": 30
      }
    }
  ]
}
```

---

### 11.2 CloudFront Cost Optimization

- Use compression (Gzip/Brotli)
- Set appropriate cache TTLs
- Use regional edge caches
- Monitor data transfer costs

---

## 12. Deployment Scripts

**File**: `scripts/deploy.sh`

```bash
#!/bin/bash

set -e

STAGE=${1:-production}
BUCKET="blog-${STAGE}"
DISTRIBUTION_ID=${2}

echo "🚀 Deploying to ${STAGE}..."

# Build all packages
echo "📦 Building packages..."
npm run build

# Deploy each package
for package in shell posts post-detail editor comments author shared-ui; do
  echo "📤 Deploying ${package}..."
  aws s3 sync "packages/${package}/dist/" "s3://${BUCKET}/${package}/" \
    --delete \
    --cache-control "max-age=31536000,public,immutable"
done

# Invalidate CloudFront cache
if [ -n "$DISTRIBUTION_ID" ]; then
  echo "🔄 Invalidating CloudFront cache..."
  aws cloudfront create-invalidation \
    --distribution-id "$DISTRIBUTION_ID" \
    --paths "/*"
fi

echo "✅ Deployment complete!"
```

**Usage**:

```bash
./scripts/deploy.sh production E1234567890ABC
```
