# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

PromoManager (Promoly) is a full-stack Next.js 15 application for managing promotional campaigns in VTEX and Shopify e-commerce stores. It uses the App Router, Bun as the runtime/package manager, PostgreSQL via Prisma ORM, and shadcn/ui components.

## Commands

```bash
# Development
bun install                # Install dependencies
bun run dev                # Start dev server (port 3000, logs to dev.log)
bun run build              # Production build (standalone output)
bun run start              # Start production server
bun run lint               # ESLint

# Database (Prisma)
bun run db:generate        # Generate Prisma client
bun run db:push            # Sync schema to database (no migration files)
bun run db:migrate         # Run migrations
bun run db:reset           # Reset database (destructive)
bun run db:seed            # Seed test data
bun run db:studio          # Prisma Studio at localhost:5555

# Docker (PostgreSQL, Redis, pgAdmin)
docker-compose -f docker/docker-compose.dev.yaml up -d
docker-compose -f docker/docker-compose.dev.yaml down
```

**Test account after seeding:** `develop@test.com` / `test123`

## Architecture

### Tech Stack
- **Frontend:** Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS 4, shadcn/ui (Radix)
- **State:** Zustand (`useAuth`, `useStore`), TanStack React Query, React Hook Form + Zod
- **Backend:** Next.js API routes, Prisma 6 with PostgreSQL 16, native `pg` connection pool
- **Runtime:** Bun 1.0.37
- **Path alias:** `@/*` → `./src/*`

### Source Layout (`src/`)
- `app/` — Next.js App Router. Single-page SPA entry at `page.tsx`, API routes under `app/api/`
- `components/ui/` — shadcn/ui primitives (61 files, don't edit manually—use shadcn CLI)
- `components/auth/` — Login, Register, ForgotPassword forms
- `components/setup/` — Platform selector (VTEX/Shopify), store config
- `components/dashboard/` — Main app views: PromotionList, PromotionForm, PromotionMetrics, Settings, Account
- `hooks/` — `use-toast.ts`, `use-mobile.ts`
- `lib/db.ts` — Prisma singleton + pg pool init with `withTransaction()` helper
- `lib/auth/hash.ts` — SHA256 password hashing
- `store/` — Zustand stores: `use-auth.ts` (auth state), `use-store.ts` (platform/storeId)
- `types/` — TypeScript types for User, Promotion, Store, metrics

### Database Schema (Prisma)
Four models: **User** → **Store** (platform config with JSON credentials) → **Promotion** (4 targeting types, 3 discount types, priority 0-20) → **PromotionMetric** (daily views/clicks/redemptions/revenue).

### API Routes
- `/api/auth/*` — login, register, forgot-password, reset-password
- `/api/user`, `/api/user/avatar` — profile management
- `/api/promotions`, `/api/promotions/[id]` — CRUD with metrics
- `/api/store` — store configuration
- `/api/seed` — populate test data

### State Management Pattern
Client-side auth via Zustand + localStorage (no server-side session/JWT middleware). The `useAuth` store holds user state; `useStore` holds platform and storeId. API routes have no auth middleware—they trust client-provided IDs.

## Configuration Notes

- **ESLint and TypeScript errors are ignored during build** (`next.config.ts` sets `ignoreBuildErrors: true` for both)
- **Standalone output** mode enabled for Docker deployments
- **Tailwind v4** via `@tailwindcss/postcss` — dark mode is class-based with HSL CSS variables
- **No test framework** is configured (no Jest/Vitest)
- **Redis** is available at port 6379 but not yet integrated into application code
