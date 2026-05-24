import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";
import { List, Plus } from "lucide-react";
import FilterBar from "@/components/FilterBar";
import TransactionTable from "@/components/TransactionTable";
import Link from "next/link";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function TransactionsPage({ searchParams }: PageProps) {
  const sp = await searchParams;

  const page = Math.max(1, parseInt((sp.page as string) || "1"));
  const perPage = 10;
  const type = sp.type as string | undefined;
  const category = sp.category as string | undefined;
  const month = sp.month as string | undefined;
  const year = sp.year as string | undefined;
  const search = sp.search as string | undefined;

  const where: Prisma.TransactionWhereInput = {};

  if (type && (type === "income" || type === "expense")) {
    where.type = type;
  }

  if (category) {
    where.category = category;
  }

  if (month || year) {
    const y = parseInt(year || String(new Date().getFullYear()));
    const m = month ? parseInt(month) - 1 : 0;
    const start = new Date(y, month ? m : 0, 1);
    const end = month
      ? new Date(y, parseInt(month), 1)
      : new Date(y + 1, 0, 1);
    where.date = { gte: start, lt: end };
  }

  if (search) {
    where.description = { contains: search };
  }

  const [transactions, total] = await Promise.all([
    prisma.transaction.findMany({
      where,
      orderBy: [{ date: "desc" }, { createdAt: "desc" }],
      take: perPage,
      skip: (page - 1) * perPage,
    }),
    prisma.transaction.count({ where }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / perPage));

  const serialized = transactions.map((tx) => ({
    id: tx.id,
    type: tx.type as "income" | "expense",
    amount: Number(tx.amount),
    category: tx.category,
    description: tx.description,
    date: tx.date instanceof Date ? tx.date.toISOString().split("T")[0] : String(tx.date),
    created_at: tx.createdAt instanceof Date ? tx.createdAt.toISOString() : String(tx.createdAt),
    updated_at: tx.updatedAt instanceof Date ? tx.updatedAt.toISOString() : String(tx.updatedAt),
  }));

  const paramsObj: Record<string, string> = {};
  if (type) paramsObj.type = type;
  if (category) paramsObj.category = category;
  if (month) paramsObj.month = month;
  if (year) paramsObj.year = year;
  if (search) paramsObj.search = search;

  const currentParams = new URLSearchParams(paramsObj).toString();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
            <List className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-blue-600" />
          </div>
          <div className="min-w-0">
            <h1 className="text-base sm:text-lg font-bold text-stone-800 truncate">Riwayat Transaksi</h1>
            <p className="text-xs text-stone-400 truncate">Daftar semua pemasukan dan pengeluaran</p>
          </div>
        </div>
        <Link
          href="/transactions/new"
          className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs sm:text-sm font-medium rounded-xl shadow-sm hover:shadow-md active:scale-[0.97] transition-all duration-200 shrink-0"
        >
          <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span className="hidden sm:inline">Tambah</span>
        </Link>
      </div>

      <FilterBar />
      <TransactionTable
        transactions={serialized}
        pagination={{ page, per_page: perPage, total, total_pages: totalPages }}
        currentParams={currentParams}
      />
    </div>
  );
}
