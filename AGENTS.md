# catat-uang

Next.js 16 (App Router) + React 19 + TypeScript (strict) + Tailwind CSS v4.

## Commands

| Command | Usage |
|---------|-------|
| `npm run dev` | Dev server at `localhost:3000` (flag `-H 0.0.0.0`, webpack) |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | ESLint v9 |
| `npm run vercel-build` | Vercel build hook — `npx prisma migrate deploy && npx prisma generate && next build` |

No test runner configured.

## Conventions

- Path alias `@/*` maps to `./src/*` (configured in `tsconfig.json`)
- App Router — routes live under `src/app/`
- Tailwind v4 with `@import "tailwindcss"` in globals (no `tailwind.config`)
- Fonts: Geist + Geist Mono via `next/font/google`
- No `.env` files committed (see `.gitignore`)

## Database

- **Prisma 7** with **PostgreSQL**, adapter: `@prisma/adapter-pg` + `pg`
- Schema at `prisma/schema.prisma`, generated client at `src/generated/prisma/`
- Run `npx prisma generate` after schema changes
- Run `npx prisma migrate dev` to apply schema to database
- Config: `prisma.config.ts` — reads `DATABASE_URL` env var
- Prisma client singleton: `src/lib/prisma.ts` (`PrismaPg` adapter, fallback to `withAccelerate` for `prisma://` URLs)

## Setup

```bash
npm install --ignore-scripts    # Windows: skip native postinstall scripts
npx prisma generate             # generate Prisma client
npm run dev
```

No lockfile committed — `npm install` will generate `package-lock.json`.

### Seed

Run `npx prisma db seed` to populate default categories (12 categories: income, expense, and both types). Configured in `prisma.config.ts` via `migrations.seed`.

## Route Structure

### Pages

| Route | File | Type | Description |
|-------|------|------|-------------|
| `/` | `src/app/page.tsx` | Server (async) | Dashboard — summary cards, debt summary, monthly bar chart, budget progress |
| `/catat-cepat` | `src/app/catat-cepat/page.tsx` | Server | Quick record — chat interface for NL transaction entry |
| `/transactions` | `src/app/transactions/page.tsx` | Server (async) | Transaction history — filterable, paginated list |
| `/transactions/new` | `src/app/transactions/new/page.tsx` | Server | New transaction form |
| `/transactions/[id]/edit` | `src/app/transactions/[id]/edit/page.tsx` | Server (async) | Edit transaction form |
| `/utang` | `src/app/utang/page.tsx` | Client | Debt management CRUD |
| `/anggaran` | `src/app/anggaran/page.tsx` | Client | Budget management CRUD — create/edit/delete budget limits per category, month, year |
| `/login` | `src/app/login/page.tsx` | Client | Login page with username/password, supports `?redirect=` param |
| `/register` | `src/app/register/page.tsx` | Client | Registration page with password minimum 6 chars |

### Special Files

| File | Description |
|------|-------------|
| `src/app/error.tsx` | Client error boundary with "Coba Lagi" button |
| `src/app/loading.tsx` | Loading UI using `SkeletonCard`, `SkeletonChart`, `SkeletonLine` |
| `src/app/manifest.ts` | PWA manifest — `display: standalone`, theme/background colors, SVG icons |

### Layout

Root layout (`src/app/layout.tsx`) sets `<html lang="id">` with `suppressHydrationWarning`, loads Geist/Geist Mono fonts, and wraps children in `ThemeProvider` > `ToastProvider` > `Navbar` + `PageTransition` + `FAB` + `ScrollToTop`. Metadata: title "Catat Uang", Indonesian description, `appleWebApp` capability. Viewport: `viewport-fit=cover`. Body: `transition-colors duration-200`, radial-gradient background dots, safe-area bottom padding.

### API Routes

| Method | Route | Description |
|--------|-------|-------------|
| `POST` | `/api/auth/login` | Authenticate user, sets `token` httpOnly cookie (7d expiry) |
| `POST` | `/api/auth/register` | Create user, sets `token` httpOnly cookie |
| `POST` | `/api/auth/logout` | Clear `token` cookie (empty, maxAge 0) |
| `GET` | `/api/auth/me` | Get current user info from session token |
| `GET` | `/api/dashboard` | Total balance, monthly income/expense, chart data |
| `GET` | `/api/transactions` | Paginated, filtered transaction list |
| `POST` | `/api/transactions` | Create transaction |
| `PUT` | `/api/transactions/[id]` | Update transaction |
| `DELETE` | `/api/transactions/[id]` | Delete transaction |
| `GET` | `/api/transactions/export` | Export transactions as `.xlsx` (Excel via `exceljs`) with type/category/month/year/search filters |
| `GET` | `/api/categories` | All categories ordered by name |
| `GET` | `/api/budgets` | List all budgets for user ordered by year/month/category |
| `POST` | `/api/budgets` | Create a budget (validates type, amount, month range) |
| `PUT` | `/api/budgets/[id]` | Update a budget (validates ownership) |
| `DELETE` | `/api/budgets/[id]` | Delete a budget (validates ownership) |
| `GET` | `/api/budgets/usage` | Budget spending for current month — returns budgeted vs spent with percentage |
| `GET` | `/api/debts` | All debts ordered by date desc |
| `POST` | `/api/debts` | Create debt |
| `PUT` | `/api/debts/[id]` | Partial update debt (toggle `isPaid`) |
| `DELETE` | `/api/debts/[id]` | Delete debt |
| `GET` | `/api/debts/[id]/payments` | List payments for a debt |
| `POST` | `/api/debts/[id]/payments` | Record a payment against a debt (auto-marks as paid if fully covered) |
| `POST` | `/api/chat` | Parse NL message → create transaction |

All API routes use `NextResponse` and standard `NextRequest`/`Request`. Route params use `Promise<{ id: string }>` (Next.js 16 pattern). Error messages are in Indonesian. Authenticated routes extract `userId` via `getUserId(request)` reading `x-user-id` header (set by middleware/session).

## Shared Types (`src/lib/types.ts`)

Exports: `TransactionType` (`"income" | "expense"`), `Transaction`, `DebtPayment`, `Budget`, `Category`, `DashboardData`, `PaginatedResponse<T>` — used across API routes and components.

## Config Files

| File | Description |
|------|-------------|
| `next.config.ts` | Next.js config (currently minimal) |
| `postcss.config.mjs` | PostCSS with `@tailwindcss/postcss` plugin |
| `eslint.config.mjs` | ESLint v9 flat config |
| `tsconfig.json` | TypeScript strict mode, `@/*` → `./src/*` alias, bundler module resolution |
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
| `BudgetProgress` | Client | Dashboard card showing current month budget usage with colored progress bars (green/amber/rose) |
| `EmptyState` | Static | Exports `EmptyTransactions`, `EmptyFiltered`, `EmptyChart`, `EmptyDebts`, `EmptyBudgets` — each with SVG illustrations and action links |
| `ExportButton` | Client | Dropdown button to export transactions as `.xlsx` with current-filter or all-data options |
| `FAB` | Client | Floating Action Button (bottom-right) for quick transaction entry; hidden on `/transactions/new`, `/catat-cepat`, `/login`, `/register` |
| `PageTransition` | Client | Wraps children with fade/slide animation on route change using `usePathname()` |
| `ScrollToTop` | Client | Scroll-to-top button appearing after 300px scroll |
| `Skeleton` | Static | Exports `SkeletonCard`, `SkeletonTableRow`, `SkeletonChart`, `SkeletonLine` for loading states |
| `ThemeToggle` | Client | Dark/light mode toggle button using `useTheme()` from `@/lib/theme` |

## Prisma Schema (`prisma/schema.prisma`)

Six models with relations (PostgreSQL):

- **User** (`users`) — `id` (Int, PK), `username` (unique, VarChar 100), `password` (VarChar 255), timestamps. Has relations to `Transaction[]`, `Debt[]`, `Budget[]`.
- **Transaction** (`transactions`) — `id` (Int, PK), `userId` (FK → User), `type` ("income"/"expense"), `amount` (Decimal 15,2), `category` (VarChar 100), `description?` (Text), `date` (Date), timestamps.
- **Category** (`categories`) — `id` (Int, PK), `name` (VarChar 100), `type` ("income"/"expense"/"both"). Standalone (no userId).
- **Budget** (`budgets`) — `id` (Int, PK), `userId` (FK → User), `category` (VarChar 100), `type` ("income"/"expense"), `amount` (Decimal 15,2), `month` (Int), `year` (Int), timestamps.
- **DebtPayment** (`debt_payments`) — `id` (Int, PK), `debtId` (FK → Debt), `amount` (Decimal 15,2), `date` (Date), `notes` (Text, default ""), timestamps.
- **Debt** (`debts`) — `id` (Int, PK), `userId` (FK → User), `person` (VarChar 200), `amount` (Decimal 15,2), `description` (Text, default ""), `date` (Date), `dueDate?` (Date), `isPaid` (Boolean), `paidAt?` (Date), `notes` (Text, default ""), timestamps. Has `payments` relation to `DebtPayment[]`.

Generated client at `src/generated/prisma/` (gitignored). Migrations at `prisma/migrations/` (committed).

## Libraries

| Package | Purpose |
|---------|---------|
| `next` 16.2.6 | Framework (App Router) |
| `react`/`react-dom` 19 | UI library |
| `@prisma/client` + `@prisma/adapter-pg` + `pg` | ORM + PostgreSQL driver |
| `@prisma/extension-accelerate` | Prisma Accelerate extension |
| `bcryptjs` | Password hashing (12 rounds) |
| `exceljs` | Excel (.xlsx) generation for transaction export |
| `jose` | JWT signing and verification (HS256, 7d expiry) |
| `dotenv` | Load `.env` files via `prisma.config.ts` |
| `lucide-react` | Icons |
| `recharts` | Bar chart on dashboard |
| `tesseract.js` | OCR for receipt upload |
| `tailwindcss` v4 | CSS framework |
| `@tailwindcss/postcss` (dev) | Tailwind PostCSS plugin |
| `prisma` (dev) | Prisma CLI |
| `eslint-config-next` (dev) | ESLint config |
| `typescript` (dev) | TypeScript compiler |
| `@types/node` / `@types/react` / `@types/react-dom` / `@types/bcryptjs` / `@types/pg` (dev) | TypeScript type definitions |

No state management library, no React Query.

## Architecture Notes

- **Authentication**: JWT-based with httpOnly cookies (`token`, 7d expiry); `jose` for signing (`HS256`), `bcryptjs` for password hashing (12 rounds). API routes authenticate via `getUserId(request)` reading `x-user-id` header; pages use `getSession()` from `@/lib/auth`. Login/register pages redirect authenticated users; all other pages redirect to `/login` if unauthenticated.
- **Theme system**: React Context-based (`src/lib/theme.tsx`) with `ThemeProvider` + `useTheme()` hook; persists to `localStorage`; respects `prefers-color-scheme`; toggles `.dark` class on `<html>`.
- **Toast system**: React Context-based (`src/lib/toast.tsx`), exposes `useToast()` hook.
- **Formatting**: Shared `formatRupiah()` and `formatDate()` at `src/lib/format.ts` (`Intl.NumberFormat` for IDR, `toLocaleString` for dates).
- **Category icons**: `src/lib/category-icons.ts` — maps category names to emoji icons via `getCategoryIcon()`.
- **Animations** (`globals.css`): `fade-in-up`, `fade-in`, `scale-in`, `slide-up`, `slide-in-right` (toast), `skeleton-shimmer` (skeleton), `stagger-fade` (table rows). All disabled via `prefers-reduced-motion`.
- **Theme config**: `@theme inline` block defines `--color-background`, `--color-foreground`, `--font-sans`, `--font-mono`, and all animation keyframes. `@custom-variant dark` for Tailwind dark mode.
- **Color palette**: Stone neutrals, blue primary, rose (expense), emerald (income).
- **Chat parser** (`src/lib/chat-parser.ts`): Indonesian NL parser — handles number suffixes (rb/jt), slang (gocap/gopek), date parsing, category detection.
- **Receipt OCR**: Uses `tesseract.js` with `ind` language pack; parses total amount via regex, extracts date, store name from first line.
- **Budget system**: Separate CRUD at `/anggaran` with per-category monthly/yearly limits; `BudgetProgress` dashboard card shows current-month spending vs budget with color-coded progress bars.
- **Debt payments**: `DebtPayment` model tracks partial payments against debts; auto-marks debt as paid when total payments reach/ exceed debt amount.
- **Export to Excel**: `GET /api/transactions/export` generates `.xlsx` via `exceljs` with styled headers, alternating rows, totals, and balance row. Triggered by `ExportButton` component.
- **Page transitions**: `PageTransition` component wraps all page content with opacity/translate fade animation on route change.
- **FAB (Floating Action Button)**: Quick transaction entry modal accessible from any page (except `/transactions/new`, `/catat-cepat`, `/login`, `/register`).
- **PWA**: Web app manifest at `/manifest.ts` with `display: standalone`, theme/background colors, SVG icons. `appleWebApp` metadata in layout. Safe-area padding for notched devices.
- **Loading skeletons**: `@/components/Skeleton` exports `SkeletonCard`, `SkeletonTableRow`, `SkeletonChart`, `SkeletonLine` for loading states.
- **Prisma client**: Singleton stored on `globalThis` in dev (avoids hot-reload connection leaks). Uses `PrismaPg` adapter with connection string, or `withAccelerate` for `prisma://` URLs.
- **Deployment**: Vercel via `vercel.json` or Railway via `railway.json`; build runs `npx prisma generate && next build`.
