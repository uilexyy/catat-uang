# catat-uang

Next.js 16 (App Router) + React 19 + TypeScript (strict) + Tailwind CSS v4.

## Commands

| Command | Usage |
|---------|-------|
| `npm run dev` | Dev server at `localhost:3000` |
| `npm run build` | Production build (runs `lint` first) |
| `npm run start` | Start production server |
| `npm run lint` | ESLint v9 (core-web-vitals + typescript configs) |

No test runner configured.

## Conventions

- Path alias `@/*` maps to `./src/*` (configured in `tsconfig.json`)
- App Router — routes live under `src/app/`
- Tailwind v4 with `@import "tailwindcss"` in globals (no `tailwind.config`)
- Fonts: Geist + Geist Mono via `next/font/google`
- No `.env` files committed (see `.gitignore`)

## Database

- **Prisma 7** with MySQL, adapter: `@prisma/adapter-mariadb` + `mariadb`
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
