# catat-uang

Next.js 16 (App Router) + React 19 + TypeScript (strict) + Tailwind CSS v4.

## Commands

| Command | Usage |
|---------|-------|
| `npm run dev` | Dev server at `localhost:3000` |
| `npm run build` | Production build (runs `lint` first) |
| `npm run start` | Start production server |
| `npm run lint` | ESLint v9 (core-web-vitals + typescript configs) |
| `npm run vercel-build` | Vercel build hook — `npx prisma generate && next build` |

No test runner configured.

## Conventions

- Path alias `@/*` maps to `./src/*` (configured in `tsconfig.json`)
- App Router — routes live under `src/app/`
- Tailwind v4 with `@import "tailwindcss"` in globals (no `tailwind.config`)
- Fonts: Geist + Geist Mono via `next/font/google`
- No `.env` files committed (see `.gitignore`)

## Database

- **Prisma 7** with PostgreSQL, adapter: `@prisma/adapter-pg` + `pg`
- Schema at `prisma/schema.prisma`, generated client at `src/generated/prisma/`
- Run `npx prisma generate` after schema changes
- Run `npx prisma migrate dev` to apply schema to database
- Config: `prisma.config.ts` — reads `DATABASE_URL` env var
- Prisma client singleton: `src/lib/prisma.ts`

## Setup

```bash
npm install --ignore-scripts    # Windows: skip native postinstall scripts
npx prisma generate             # generate Prisma client
npm run dev
```

No lockfile committed — `npm install` will generate `package-lock.json`.

## Route Structure

### Pages

| Route | File | Type | Description |
|-------|------|------|-------------|
| `/` | `src/app/page.tsx` | Server (async) | Dashboard — summary cards, debt summary, monthly bar chart |
| `/catat-cepat` | `src/app/catat-cepat/page.tsx` | Server | Quick record — chat interface for NL transaction entry |
| `/transactions` | `src/app/transactions/page.tsx` | Server (async) | Transaction history — filterable, paginated list |
| `/transactions/new` | `src/app/transactions/new/page.tsx` | Server | New transaction form |
| `/transactions/[id]/edit` | `src/app/transactions/[id]/edit/page.tsx` | Server (async) | Edit transaction form |
| `/utang` | `src/app/utang/page.tsx` | Client | Debt management CRUD |

### Layout

Root layout (`src/app/layout.tsx`) sets `<html lang="id">`, loads Geist/Geist Mono fonts, and wraps children in `ToastProvider` + `Navbar` with main content area. Metadata: title "Catat Uang", Indonesian description.

### API Routes

| Method | Route | Description |
|--------|-------|-------------|
| `GET` | `/api/dashboard` | Total balance, monthly income/expense, chart data |
| `GET` | `/api/transactions` | Paginated, filtered transaction list |
| `POST` | `/api/transactions` | Create transaction |
| `PUT` | `/api/transactions/[id]` | Update transaction |
| `DELETE` | `/api/transactions/[id]` | Delete transaction |
| `GET` | `/api/categories` | All categories ordered by name |
| `GET` | `/api/debts` | All debts ordered by date desc |
| `POST` | `/api/debts` | Create debt |
| `PUT` | `/api/debts/[id]` | Partial update debt (toggle `isPaid`) |
| `DELETE` | `/api/debts/[id]` | Delete debt |
| `POST` | `/api/chat` | Parse NL message → create transaction |

All API routes use `NextResponse` and standard `NextRequest`/`Request`. Transaction route params use `Promise<{ id: string }>` (Next.js 16 pattern). Error messages are in Indonesian.

## Shared Types (`src/lib/types.ts`)

Exports: `TransactionType` (`"income" | "expense"`), `Transaction`, `Category`, `DashboardData`, `PaginatedResponse<T>` — used across API routes and components.

## Config Files

| File | Description |
|------|-------------|
| `next.config.ts` | Next.js config (currently minimal) |
| `postcss.config.mjs` | PostCSS with `@tailwindcss/postcss` plugin |
| `eslint.config.mjs` | ESLint v9 flat config — `core-web-vitals` + `typescript`, ignores `.next/`, `out/`, `build/`, `next-env.d.ts` |
| `vercel.json` | Vercel deployment config |
| `railway.json` | Railway deployment config — build: `npx prisma generate && next build`, start: `next start` |

## Components (`src/components/`)

| Component | Type | Description |
|-----------|------|-------------|
| `Navbar` | Client | Desktop sidebar + mobile bottom nav; uses `usePathname()` for active link |
| `SummaryCards` | Client | 3 dashboard cards: Total Saldo, Pemasukan, Pengeluaran |
| `DebtSummaryCards` | Client | 2 cards: Total Utang, Terbayar |
| `Chart` | Client | Recharts `BarChart` with empty state |
| `FilterBar` | Client | URL search-param based filters (type, category, month, year, search) |
| `TransactionTable` | Client | Cards-on-mobile, table-on-desktop layout with pagination + delete modal |
| `TransactionForm` | Client | Create/edit form with receipt upload, category dropdown, validation |
| `ChatBox` | Client | WhatsApp-style chat UI with suggestion chips, typing indicator, auto-scroll |
| `ReceiptUpload` | Client | Drag-and-drop image upload → `tesseract.js` OCR (Indonesian `ind` model) |

## Prisma Schema (`prisma/schema.prisma`)

Three standalone models (no relations):

- **Transaction** (`transactions`) — `id` (Int, PK), `type` ("income"/"expense"), `amount` (Decimal 15,2), `category`, `description?`, `date` (Date), timestamps
- **Category** (`categories`) — `id` (Int, PK), `name`, `type` ("income"/"expense"/"both")
- **Debt** (`debts`) — `id` (Int, PK), `person`, `amount` (Decimal 15,2), `description`, `date`, `dueDate?`, `isPaid`, `paidAt?`, `notes`, timestamps

Generated client at `src/generated/prisma/` (gitignored). Migrations at `prisma/migrations/` (committed).

## Libraries

| Package | Purpose |
|---------|---------|
| `next` 16.2.6 | Framework (App Router) |
| `react`/`react-dom` 19 | UI library |
| `@prisma/client` + `@prisma/adapter-mariadb` + `mariadb` | ORM + MySQL driver |
| `@prisma/extension-accelerate` | Prisma Accelerate extension |
| `dotenv` | Load `.env` files via `prisma.config.ts` |
| `lucide-react` | Icons |
| `recharts` | Bar chart on dashboard |
| `tesseract.js` | OCR for receipt upload |
| `tailwindcss` v4 | CSS framework |
| `@tailwindcss/postcss` (dev) | Tailwind PostCSS plugin |
| `prisma` (dev) | Prisma CLI |
| `eslint-config-next` (dev) | ESLint config (core-web-vitals + typescript) |
| `typescript` (dev) | TypeScript compiler |
| `@types/node` / `@types/react` / `@types/react-dom` (dev) | TypeScript type definitions |

No auth library, no state management library, no React Query.

## Architecture Notes

- **No authentication** — single-user local/self-hosted app
- **No middleware** — no `middleware.ts`
- **Toast system**: React Context-based (`src/lib/toast.tsx`), exposes `useToast()` hook
- **Formatting**: `formatRupiah()` and `formatDate()` are defined inline per component (no shared utils)
- **Animations**: Tailwind custom classes in `globals.css`: `fade-in-up`, `fade-in`, `scale-in`, `slide-up`
- **Color palette**: Stone neutrals, blue primary, rose (expense), emerald (income)
- **Chat parser** (`src/lib/chat-parser.ts`): Indonesian NL parser — handles number suffixes (rb/jt), slang (gocap/gopek), date parsing, category detection
- **Receipt OCR**: Uses `tesseract.js` with `ind` language pack; parses total amount via regex, extracts date, store name from first line
- **Prisma client**: Singleton stored on `globalThis` in dev (avoids hot-reload connection leaks)
- **Deployment**: Vercel via `vercel.json` or Railway via `railway.json`; build runs `npx prisma generate && next build`
