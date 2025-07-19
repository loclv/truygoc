# 🌿truyGoc

Note: This project is currently under development!

## Problems

- When buying products online, there is a risk of counterfeit goods due to unverified suppliers or intermediaries.
- You don’t need to be a reputable seller to deliver products to consumers.
- There is no reliable way to verify product authenticity during resale or second-hand auctions.

## Solutions

- Use blockchain to store product information and track the ownership of products

## 🍏 Introduction

This project is a supply chain management system that uses Move on Aptos blockchain to store product information and track the ownership of products.

`truyGoc` is a Vietnamese word (truy gốc) means `trace origin`.

- Product can be minted by company with useful information
- Product can be transferred to another company
- Product can be checked on chain
- QR code can be generated for a product
- QR code can be scanned to verify product ownership
- User and other companies can check product ownership and other information on chain
- User and other companies do not need to trust any third party to verify product ownership
- Every product is unique and cannot be replicated on blockchain
- When third party try to fake product ownership and information, it will be detected on blockchain. For example, when they try to copy product ID on blockchain, it will be detected by unmatchable the human-readable ID on product. If they try to copy every product ID on blockchain, it will be not scalable for large number of products.

## Tech Stack

This project was created with [Better-T-Stack](https://github.com/AmanVarshney01/create-better-t-stack), a modern TypeScript stack that combines React, TanStack Router, Hono, TRPC, and more.

- **TypeScript** - For type safety and improved developer experience
- **TanStack Router** - File-based routing with full type safety
- **React Native** - Build mobile apps using React
- **Expo** - Tools for React Native development
- **TailwindCSS** - Utility-first CSS for rapid UI development
- **shadcn/ui** - Reusable UI components
- **Hono** - Lightweight, performant server framework
- **tRPC** - End-to-end type-safe APIs
- **Bun** - Runtime environment
- **Drizzle** - TypeScript-first ORM
- **SQLite/Turso** - Database engine
- **Authentication** - Email & password authentication with Better Auth
- **Turborepo** - Optimized monorepo build system
- **PWA** - Progressive Web App support
- **Tauri** - Build native desktop applications
- **Starlight** - Documentation site with Astro
- **Biome** - Linting and formatting
- **Husky** - Git hooks for code quality

## Getting Started

First, install the dependencies:

```bash
bun install
```

## Database Setup

This project uses SQLite with Drizzle ORM.

1. Start the local SQLite database:

```bash
cd apps/server && bun db:local
```

2. Update your `.env` file in the `apps/server` directory with the appropriate connection details if needed.

3. Apply the schema to your database:

```bash
bun db:push
```

Then, run the development server:

```bash
bun dev
```

Open [http://localhost:3001](http://localhost:3001) in your browser to see the web application.
Use the Expo Go app to run the mobile application.
The API is running at [http://localhost:3000](http://localhost:3000).

## Project Structure

```text
truyGoc/
├── apps/
│   ├── web/         # Frontend application (React + TanStack Router)
│   ├── native/      # Mobile application (React Native, Expo)
│   ├── docs/        # Documentation site (Astro Starlight)
│   └── server/      # Backend API (Hono, TRPC)
```

## Available Scripts

- `bun dev`: Start all applications in development mode
- `bun build`: Build all applications
- `bun dev:web`: Start only the web application
- `bun dev:server`: Start only the server
- `bun check-types`: Check TypeScript types across all apps
- `bun dev:native`: Start the React Native/Expo development server
- `bun db:push`: Push schema changes to database
- `bun db:studio`: Open database studio UI
- `cd apps/server && bun db:local`: Start the local SQLite database
- `bun check`: Run Biome formatting and linting
- `cd apps/web && bun generate-pwa-assets`: Generate PWA assets
- `cd apps/web && bun desktop:dev`: Start Tauri desktop app in development
- `cd apps/web && bun desktop:build`: Build Tauri desktop app
- `cd apps/docs && bun dev`: Start documentation site
- `cd apps/docs && bun build`: Build documentation site

Your project will be available at:

- Frontend: <http://localhost:3001>
- Backend API: <http://localhost:3000>
- Docs: <http://localhost:4321>

NOTE: For Expo connectivity issues, update apps/native/.env with your local IP address:
EXPO_PUBLIC_SERVER_URL=http://<YOUR_LOCAL_IP>:3000

Database commands:

- Apply schema: `bun db:push`
- Database UI: `bun db:studio`
- Start local DB (if needed): `cd apps/server && bun db:local`

Desktop app with Tauri:

- Start desktop app: `cd apps/web && bun desktop:dev`
- Build desktop app: `cd apps/web && bun desktop:build`

NOTE: Tauri requires Rust and platform-specific dependencies. See: <https://v2.tauri.app/start/prerequisites/>

Linting and formatting:

- Format and lint fix: `bun check`

Documentation with Starlight:

- Start docs site: `cd apps/docs && bun dev`
- Build docs site: `cd apps/docs && bun build`

WARNING: 'bun' might cause issues with web + native apps in a monorepo. Use 'pnpm' if problems arise.

Update all dependencies: `bunx taze -r`

You can reproduce this setup with the following command:

```bash
bun create better-t-stack@latest truyGoc --frontend tanstack-router native-unistyles --backend hono --runtime bun --database sqlite --orm drizzle --api trpc --auth --addons turborepo pwa tauri starlight biome husky --examples todo ai --db-setup turso --git --package-manager bun --install
```
