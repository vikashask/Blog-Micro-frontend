# Webpack & Module Federation Configuration

## Shell Webpack Config

**File**: `packages/shell/webpack.config.js`

```javascript
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const path = require("path");

module.exports = {
  entry: "./src/index.ts",
  mode: "development",
  devServer: {
    port: 3000,
    historyApiFallback: true,
    hot: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  },
  output: {
    publicPath: "http://localhost:3000/",
    clean: true,
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"],
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              "@babel/preset-env",
              "@babel/preset-react",
              "@babel/preset-typescript",
            ],
          },
        },
      },
      {
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
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/,
        type: "asset/resource",
      },
    ],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "shell",
      remotes: {
        posts: "posts@http://localhost:3001/remoteEntry.js",
        postDetail: "postDetail@http://localhost:3002/remoteEntry.js",
        editor: "editor@http://localhost:3003/remoteEntry.js",
        comments: "comments@http://localhost:3004/remoteEntry.js",
        author: "author@http://localhost:3005/remoteEntry.js",
        sharedUI: "sharedUI@http://localhost:3006/remoteEntry.js",
      },
      shared: {
        react: {
          singleton: true,
          requiredVersion: "^18.2.0",
          eager: true,
        },
        "react-dom": {
          singleton: true,
          requiredVersion: "^18.2.0",
          eager: true,
        },
        "react-router-dom": {
          singleton: true,
          requiredVersion: "^6.20.0",
          eager: true,
        },
      },
    }),
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
  ],
};
```

---

## Remote Webpack Config (Posts Example)

**File**: `packages/posts/webpack.config.js`

```javascript
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");

module.exports = {
  entry: "./src/index.ts",
  mode: "development",
  devServer: {
    port: 3001,
    hot: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  },
  output: {
    publicPath: "http://localhost:3001/",
    clean: true,
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"],
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              "@babel/preset-env",
              "@babel/preset-react",
              "@babel/preset-typescript",
            ],
          },
        },
      },
      {
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
      },
    ],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "posts",
      filename: "remoteEntry.js",
      exposes: {
        "./PostList": "./src/components/PostList/PostList.tsx",
        "./PostCard": "./src/components/PostCard/PostCard.tsx",
        "./PostFilters": "./src/components/PostFilters/PostFilters.tsx",
      },
      remotes: {
        sharedUI: "sharedUI@http://localhost:3006/remoteEntry.js",
      },
      shared: {
        react: {
          singleton: true,
          requiredVersion: "^18.2.0",
        },
        "react-dom": {
          singleton: true,
          requiredVersion: "^18.2.0",
        },
        "react-router-dom": {
          singleton: true,
          requiredVersion: "^6.20.0",
        },
      },
    }),
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
  ],
};
```

---

## Production Webpack Config

**File**: `packages/shell/webpack.prod.js`

```javascript
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const TerserPlugin = require("terser-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

module.exports = {
  entry: "./src/index.ts",
  mode: "production",
  output: {
    publicPath: process.env.PUBLIC_URL || "https://cdn.example.com/shell/",
    filename: "[name].[contenthash].js",
    chunkFilename: "[name].[contenthash].chunk.js",
    path: __dirname + "/dist",
    clean: true,
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"],
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              "@babel/preset-env",
              "@babel/preset-react",
              "@babel/preset-typescript",
            ],
          },
        },
      },
      {
        test: /\.css$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              modules: {
                auto: true,
                localIdentName: "[hash:base64:5]",
              },
            },
          },
        ],
      },
    ],
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true,
          },
        },
      }),
      new CssMinimizerPlugin(),
    ],
    splitChunks: {
      chunks: "all",
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          priority: 10,
        },
      },
    },
    runtimeChunk: "single",
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "shell",
      remotes: {
        posts: `posts@${
          process.env.POSTS_URL || "https://cdn.example.com/posts"
        }/remoteEntry.js`,
        postDetail: `postDetail@${
          process.env.POST_DETAIL_URL || "https://cdn.example.com/post-detail"
        }/remoteEntry.js`,
        editor: `editor@${
          process.env.EDITOR_URL || "https://cdn.example.com/editor"
        }/remoteEntry.js`,
        comments: `comments@${
          process.env.COMMENTS_URL || "https://cdn.example.com/comments"
        }/remoteEntry.js`,
        author: `author@${
          process.env.AUTHOR_URL || "https://cdn.example.com/author"
        }/remoteEntry.js`,
        sharedUI: `sharedUI@${
          process.env.SHARED_UI_URL || "https://cdn.example.com/shared-ui"
        }/remoteEntry.js`,
      },
      shared: {
        react: {
          singleton: true,
          requiredVersion: "^18.2.0",
          eager: true,
        },
        "react-dom": {
          singleton: true,
          requiredVersion: "^18.2.0",
          eager: true,
        },
        "react-router-dom": {
          singleton: true,
          requiredVersion: "^6.20.0",
          eager: true,
        },
      },
    }),
    new HtmlWebpackPlugin({
      template: "./public/index.html",
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      },
    }),
  ],
};
```

---

## Port Assignments

| Application | Port | Remote Name |
| ----------- | ---- | ----------- |
| Shell       | 3000 | shell       |
| Posts       | 3001 | posts       |
| Post Detail | 3002 | postDetail  |
| Editor      | 3003 | editor      |
| Comments    | 3004 | comments    |
| Author      | 3005 | author      |
| Shared UI   | 3006 | sharedUI    |

---

## Environment Variables

**File**: `packages/shell/.env.example`

```bash
# Development
NODE_ENV=development
PUBLIC_URL=http://localhost:3000

# Production Remote URLs
POSTS_URL=https://cdn.example.com/posts
POST_DETAIL_URL=https://cdn.example.com/post-detail
EDITOR_URL=https://cdn.example.com/editor
COMMENTS_URL=https://cdn.example.com/comments
AUTHOR_URL=https://cdn.example.com/author
SHARED_UI_URL=https://cdn.example.com/shared-ui
```
