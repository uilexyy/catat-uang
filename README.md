# Catat Uang

Aplikasi pencatatan keuangan pribadi berbasis web. Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS v4 + PostgreSQL.

## Fitur

- **Dashboard** — ringkasan saldo, pemasukan/pengeluaran bulan ini, grafik bulanan, progress anggaran
- **Catat Cepat** — input transaksi via chat (natural language parser bahasa Indonesia)
- **Riwayat Transaksi** — filter, cari, pagination, export ke Excel
- **Tambah/Ubah Transaksi** — form dengan upload struk (OCR otomatis)
- **Anggaran** — atur batas pengeluaran per kategori, lihat progress di dashboard
- **Utang** — catat dan kelola utang piutang

## Prasyarat

- **Node.js** 20+
- **PostgreSQL** 15+
- **npm**

## Instalasi

### 1. Clone & install dependencies

```bash
git clone https://github.com/uilexyy/catat-uang.git
cd catat-uang
npm install --ignore-scripts
```

### 2. Setup database

Pastikan PostgreSQL berjalan. Buat database:

```bash
createdb -U postgres catat_uang
```

Salin `.env.example` (atau buat `.env`):

```env
DATABASE_URL="postgresql://postgres@localhost:5432/catat_uang"
```

Sesuaikan username/password dengan PostgreSQL kamu.

### 3. Generate Prisma client & migrate

```bash
npx prisma generate
npx prisma migrate dev
```

### 4. Seed kategori

```bash
psql -U postgres -d catat_uang -c "
INSERT INTO categories (name, type) VALUES
('Gaji', 'income'),
('Freelance', 'income'),
('Investasi', 'income'),
('Hadiah', 'income'),
('Makanan', 'expense'),
('Transport', 'expense'),
('Belanja', 'expense'),
('Hiburan', 'expense'),
('Tagihan', 'expense'),
('Kesehatan', 'expense'),
('Pendidikan', 'expense'),
('Lainnya', 'both');
"
```

### 5. Jalankan

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000).

## Perintah

| Perintah | Kegunaan |
|----------|----------|
| `npm run dev` | Dev server (webpack) |
| `npm run build` | Build production |
| `npm start` | Jalankan production server |
| `npm run lint` | ESLint |
| `npx prisma generate` | Generate Prisma client setelah perubahan schema |
| `npx prisma migrate dev` | Terapkan migrasi ke database |

## Stack

- **Framework**: Next.js 16 (App Router)
- **UI**: React 19, Tailwind CSS v4
- **Database**: PostgreSQL + Prisma 7 ORM
- **Icons**: Lucide React
- **Chart**: Recharts
- **OCR**: Tesseract.js (bahasa Indonesia)
- **Export**: ExcelJS

## Lisensi

MIT
