"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useToast } from "@/lib/toast";
import { Pencil, Trash2, AlertTriangle, Loader2, ArrowLeft, ArrowRight } from "lucide-react";
import type { Transaction } from "@/lib/types";
import { formatRupiah, formatDate } from "@/lib/format";
import { EmptyTransactions } from "./EmptyState";

interface TransactionTableProps {
  transactions: Transaction[];
  pagination: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
  currentParams: string;
}

function MobileCard({ tx, onDelete }: { tx: Transaction; onDelete: (id: number) => void }) {
  return (
    <div className="bg-white/80 dark:bg-stone-900/80 backdrop-blur-xl rounded-xl border border-stone-200/80 dark:border-stone-800 p-4 shadow-sm dark:shadow-none shadow-lg shadow-black/5 dark:shadow-black/20 animate-fade-in-up">
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold ${
              tx.type === "income" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${tx.type === "income" ? "bg-emerald-500" : "bg-rose-500"}`} />
              {tx.type === "income" ? "Masuk" : "Keluar"}
            </span>
            <span className="text-[11px] text-stone-400 dark:text-stone-500">{formatDate(tx.date)}</span>
          </div>
          <p className="text-sm font-semibold text-stone-800 dark:text-stone-200">{tx.category}</p>
          {tx.description && (
            <p className="text-xs text-stone-400 dark:text-stone-500 mt-0.5 line-clamp-1">{tx.description}</p>
          )}
        </div>
        <p className={`text-base font-bold whitespace-nowrap ${tx.type === "income" ? "text-emerald-600" : "text-rose-600"}`}>
          {tx.type === "income" ? "+" : "−"}{formatRupiah(tx.amount)}
        </p>
      </div>
      <div className="flex items-center gap-2 pt-2 border-t border-stone-100 dark:border-stone-800">
        <Link
          href={`/transactions/${tx.id}/edit`}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 active:bg-blue-200 rounded-lg transition-all duration-200"
        >
          <Pencil className="w-3.5 h-3.5" />
          Edit
        </Link>
        <button
          onClick={() => onDelete(tx.id)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 active:bg-rose-200 rounded-lg transition-all duration-200"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Hapus
        </button>
      </div>
    </div>
  );
}

export default function TransactionTable({ transactions, pagination, currentParams }: TransactionTableProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function confirmDelete() {
    if (deleteId === null) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/transactions/${deleteId}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast("success", "Transaksi berhasil dihapus");
      setDeleteId(null);
      router.refresh();
    } catch {
      toast("error", "Gagal menghapus transaksi");
    } finally {
      setDeleting(false);
    }
  }

  function buildPageUrl(page: number) {
    const params = new URLSearchParams(currentParams);
    params.set("page", String(page));
    return `/transactions?${params.toString()}`;
  }

  if (transactions.length === 0) {
    return <EmptyTransactions />;
  }

  return (
    <>
      {/* Mobile: card layout */}
      <div className="space-y-3 sm:hidden animate-fade-in-up">
        {transactions.map((tx, i) => (
          <div key={tx.id} style={{ animationDelay: `${i * 0.03}s` }}>
            <MobileCard tx={tx} onDelete={setDeleteId} />
          </div>
        ))}
      </div>

      {/* Desktop: table */}
      <div className="hidden sm:block bg-white/80 dark:bg-stone-900/80 backdrop-blur-xl rounded-2xl border border-stone-200/80 dark:border-stone-800 overflow-hidden shadow-sm dark:shadow-none shadow-lg shadow-black/5 dark:shadow-black/20 animate-fade-in-up">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-stone-50/80 dark:bg-stone-800 border-b border-stone-200/60 dark:border-stone-800">
                <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-stone-400 dark:text-stone-500 uppercase tracking-widest">Tanggal</th>
                <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-stone-400 dark:text-stone-500 uppercase tracking-widest">Jenis</th>
                <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-stone-400 dark:text-stone-500 uppercase tracking-widest">Kategori</th>
                <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-stone-400 dark:text-stone-500 uppercase tracking-widest">Catatan</th>
                <th className="text-right px-5 py-3.5 text-[11px] font-semibold text-stone-400 dark:text-stone-500 uppercase tracking-widest">Jumlah</th>
                <th className="text-center px-5 py-3.5 text-[11px] font-semibold text-stone-400 dark:text-stone-500 uppercase tracking-widest">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
              {transactions.map((tx, i) => (
                <tr
                  key={tx.id}
                  className="hover:bg-stone-50/80 dark:hover:bg-stone-800/50 transition-colors duration-150 animate-fade-in-up"
                  style={{ animationDelay: `${i * 0.03}s` }}
                >
                  <td className="px-5 py-4 text-stone-500 dark:text-stone-400 whitespace-nowrap">{formatDate(tx.date)}</td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold ${
                      tx.type === "income" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${tx.type === "income" ? "bg-emerald-500" : "bg-rose-500"}`} />
                      {tx.type === "income" ? "Masuk" : "Keluar"}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-stone-700 dark:text-stone-300 font-medium">{tx.category}</td>
                  <td className="px-5 py-4 text-stone-400 dark:text-stone-500 max-w-[200px] truncate">{tx.description || "—"}</td>
                  <td className={`px-5 py-4 text-right font-bold whitespace-nowrap tracking-tight ${
                    tx.type === "income" ? "text-emerald-600" : "text-rose-600"
                  }`}>
                    {tx.type === "income" ? "+ " : "− "}{formatRupiah(tx.amount)}
                  </td>
                  <td className="px-5 py-4 text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-1">
                      <Link
                        href={`/transactions/${tx.id}/edit`}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 active:bg-blue-200 rounded-lg transition-all duration-200"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        Edit
                      </Link>
                      <button
                        onClick={() => setDeleteId(tx.id)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 active:bg-rose-200 rounded-lg transition-all duration-200"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {pagination.total_pages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-5 animate-fade-in-up">
          {pagination.page > 1 && (
            <Link
              href={buildPageUrl(pagination.page - 1)}
              className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 text-sm text-stone-500 dark:text-stone-400 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl hover:bg-stone-50 dark:hover:bg-stone-800 active:scale-[0.97] transition-all duration-200 shadow-sm dark:shadow-none"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Sebelumnya</span>
            </Link>
          )}
          <div className="flex items-center gap-1">
            {Array.from({ length: pagination.total_pages }, (_, i) => (
              <Link
                key={i + 1}
                href={buildPageUrl(i + 1)}
                className={`w-8 sm:w-9 h-8 sm:h-9 flex items-center justify-center rounded-xl text-sm font-medium transition-all duration-200 ${
                  pagination.page === i + 1
                    ? "bg-blue-600 text-white shadow-sm dark:shadow-none"
                    : "text-stone-500 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800"
                }`}
              >
                {i + 1}
              </Link>
            ))}
          </div>
          {pagination.page < pagination.total_pages && (
            <Link
              href={buildPageUrl(pagination.page + 1)}
              className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 text-sm text-stone-500 dark:text-stone-400 bg-white/80 dark:bg-stone-900/80 backdrop-blur-xl border border-stone-200 dark:border-stone-800 rounded-xl hover:bg-stone-50 dark:hover:bg-stone-800 active:scale-[0.97] transition-all duration-200 shadow-sm dark:shadow-none shadow-lg shadow-black/5 dark:shadow-black/20"
            >
              <span className="hidden sm:inline">Berikutnya</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      )}

      {/* Delete Modal */}
      {deleteId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm animate-fade-in"
            onClick={() => setDeleteId(null)}
          />
          <div className="relative bg-white dark:bg-stone-900 rounded-2xl p-6 max-w-sm w-full shadow-2xl dark:shadow-none dark:border dark:border-stone-800 animate-scale-in">
            <div className="text-center mb-5">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center mx-auto mb-3">
                <AlertTriangle className="w-6 h-6 text-rose-500" />
              </div>
              <h3 className="text-base font-bold text-stone-800 dark:text-stone-200 mb-1">Hapus Transaksi</h3>
              <p className="text-sm text-stone-400 dark:text-stone-500">Apakah kamu yakin? Tindakan ini tidak dapat dibatalkan.</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 py-2.5 text-sm font-medium text-stone-500 dark:text-stone-400 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 active:scale-[0.97] rounded-xl transition-all duration-200"
              >
                Batal
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleting}
                className="flex-1 py-2.5 text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 active:bg-rose-800 disabled:bg-rose-300 active:scale-[0.97] rounded-xl transition-all duration-200 shadow-sm disabled:cursor-not-allowed"
              >
                {deleting ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Menghapus...
                  </span>
                ) : "Ya, Hapus"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
