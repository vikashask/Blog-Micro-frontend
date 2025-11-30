# Setup Instructions

## Quick Start

### Option 1: Automated Setup (Recommended)

```bash
# Make setup script executable
chmod +x setup.sh

# Run setup
./setup.sh

# Start all applications
npm run dev
```

### Option 2: Manual Setup

```bash
# 1. Install root dependencies
npm install

# 2. Install dependencies for each package
cd packages/shared-ui && npm install && cd ../..
cd packages/posts && npm install && cd ../..
cd packages/post-detail && npm install && cd ../..
cd packages/comments && npm install && cd ../..
cd packages/shell && npm install && cd ../..

# 3. Start all applications
npm run dev
```

## Access the Application

Once running, open your browser:

- **Main Application (Shell)**: http://localhost:3000
- **Posts (Standalone)**: http://localhost:3001
- **Post Detail (Standalone)**: http://localhost:3002
- **Comments (Standalone)**: http://localhost:3004
- **Shared UI (Standalone)**: http://localhost:3006

## What You'll See

1. **Homepage** - List of blog posts with search functionality
2. **Click any post** - View full post details with comments
3. **Add comments** - Try adding a comment on the post detail page
4. **Search** - Use the search bar to filter posts

## Architecture

This application demonstrates:

- ✅ **Module Federation** - Remotes loaded at runtime
- ✅ **Independent Deployment** - Each remote runs on its own port
- ✅ **Error Boundaries** - Graceful error handling
- ✅ **Lazy Loading** - Components loaded on-demand
- ✅ **Routing** - React Router v6 integration
- ✅ **Shared Dependencies** - React shared as singleton

## Troubleshooting

### Port Already in Use

If you get a port conflict error:

```bash
# Find and kill the process
lsof -ti:3000 | xargs kill -9
lsof -ti:3001 | xargs kill -9
# ... repeat for other ports
```

### Remote Not Loading

1. Make sure all services are running
2. Check browser console for errors
3. Verify all ports are accessible:
   ```bash
   curl http://localhost:3001/remoteEntry.js
   curl http://localhost:3002/remoteEntry.js
   curl http://localhost:3004/remoteEntry.js
   curl http://localhost:3006/remoteEntry.js
   ```

### Dependencies Not Installing

```bash
# Clear npm cache
npm cache clean --force

# Remove all node_modules
npm run clean

# Reinstall
./setup.sh
```

## Development

### Start Individual Services

```bash
# Start only the shell
npm run dev:shell

# Start only posts
npm run dev:posts

# Start specific services
npm run dev:shell & npm run dev:posts
```

### Build for Production

```bash
npm run build
```

## Project Structure

```
blog-micro-fe/
├── packages/
│   ├── shell/          # Main application (Port 3000)
│   ├── posts/          # Post listing (Port 3001)
│   ├── post-detail/    # Post detail view (Port 3002)
│   ├── comments/       # Comments system (Port 3004)
│   └── shared-ui/      # Design system (Port 3006)
└── package.json        # Root workspace config
```

## Next Steps

1. ✅ **Explore the code** - Check out the component implementations
2. ✅ **Modify a remote** - Try changing the PostCard component
3. ✅ **Add features** - Implement the Editor or Author remotes
4. ✅ **Add tests** - Follow the testing guide in TESTING.md
5. ✅ **Deploy** - Follow the deployment guide in DEPLOYMENT.md

## Features Implemented

- ✅ Shell application with routing
- ✅ Posts remote with search and filtering
- ✅ Post detail remote with full content
- ✅ Comments remote with thread display
- ✅ Shared UI components (Button, Card)
- ✅ Error boundaries for each remote
- ✅ Loading states and suspense
- ✅ Responsive design
- ✅ Module Federation configuration

## Features Not Yet Implemented

- ⏳ Editor remote (rich text editing)
- ⏳ Author remote (author profiles)
- ⏳ Authentication (mock login/logout)
- ⏳ Theme toggle (light/dark mode)
- ⏳ Unit tests
- ⏳ E2E tests
- ⏳ Storybook

See IMPLEMENTATION_PLAN.md for the complete roadmap.

## Support

For issues or questions:

1. Check the documentation in the root directory
2. Review QUICK_REFERENCE.md for common commands
3. See DEVELOPER_WORKFLOW.md for troubleshooting
