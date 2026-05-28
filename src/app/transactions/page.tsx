import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";
import { List, Plus } from "lucide-react";
import FilterBar from "@/components/FilterBar";
import TransactionTable from "@/components/TransactionTable";
import Link from "next/link";
import ExportButton from "@/components/ExportButton";

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
      <div className="animate-fade-in-up">
        <div className="flex items-center justify-between gap-4">
          <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl p-5 shadow-lg flex-1">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                <List className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">Riwayat Transaksi</h1>
                <p className="text-sm text-blue-100">Daftar semua pemasukan dan pengeluaran</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ExportButton currentParams={currentParams} />
            <Link
              href="/transactions/new"
              className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs sm:text-sm font-medium rounded-xl shadow-sm hover:shadow-md active:scale-[0.97] transition-all duration-200 shrink-0"
            >
              <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Tambah</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="animate-fade-in-up [animation-delay:0.1s]">
        <FilterBar />
      </div>
      <div className="animate-fade-in-up [animation-delay:0.2s]">
        <TransactionTable
          transactions={serialized}
          pagination={{ page, per_page: perPage, total, total_pages: totalPages }}
          currentParams={currentParams}
        />
      </div>
    </div>
  );
}
