import { type ReactNode } from "react";
import Link from "next/link";

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: { label: string; href: string };
}

function Illustration({ children }: { children: ReactNode }) {
  return (
    <div className="relative w-24 h-24 sm:w-28 sm:h-28 mx-auto mb-5">
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 120 120" fill="none">
        <circle cx="60" cy="60" r="56" className="stroke-stone-200 dark:stroke-stone-700" strokeWidth="2" strokeDasharray="6 4" />
        <circle cx="60" cy="60" r="44" className="fill-stone-100 dark:fill-stone-800/50" />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}

export function EmptyTransactions() {
  return (
    <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200/80 dark:border-stone-800 p-8 sm:p-12 text-center shadow-sm animate-fade-in-up">
      <Illustration>
        <svg viewBox="0 0 48 48" className="w-12 h-12 text-stone-300 dark:text-stone-600">
          <rect x="6" y="10" width="36" height="28" rx="3" stroke="currentColor" strokeWidth="2" fill="none" />
          <line x1="12" y1="20" x2="36" y2="20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <line x1="12" y1="27" x2="30" y2="27" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="12" y1="32" x2="24" y2="32" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="36" cy="30" r="3" className="fill-emerald-400 dark:fill-emerald-500" />
          <circle cx="36" cy="30" r="1" className="fill-white dark:fill-stone-900" />
        </svg>
      </Illustration>
      <p className="text-stone-500 dark:text-stone-400 font-medium text-sm mb-1">Belum ada transaksi</p>
      <p className="text-stone-300 dark:text-stone-600 text-xs mb-5">Mulai catat pemasukan atau pengeluaran pertama kamu</p>
      <Link
        href="/transactions/new"
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-medium rounded-xl shadow-sm hover:shadow-md active:scale-[0.97] transition-all duration-200"
      >
        + Tambah Transaksi
      </Link>
    </div>
  );
}

export function EmptyFiltered({ onClear }: { onClear?: () => void }) {
  return (
    <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200/80 dark:border-stone-800 p-8 sm:p-12 text-center shadow-sm animate-fade-in-up">
      <Illustration>
        <svg viewBox="0 0 48 48" className="w-12 h-12 text-stone-300 dark:text-stone-600">
          <circle cx="20" cy="20" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
          <line x1="27" y1="27" x2="36" y2="36" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </Illustration>
      <p className="text-stone-500 dark:text-stone-400 font-medium text-sm mb-1">Tidak ditemukan</p>
      <p className="text-stone-300 dark:text-stone-600 text-xs mb-5">Tidak ada transaksi yang cocok dengan filter</p>
      {onClear && (
        <button
          onClick={onClear}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-600 dark:text-stone-400 text-sm font-medium rounded-xl transition-all duration-200 active:scale-[0.97]"
        >
          Hapus Filter
        </button>
      )}
    </div>
  );
}

export function EmptyChart() {
  return (
    <div className="bg-white/80 dark:bg-stone-900/80 backdrop-blur-xl rounded-2xl border border-stone-200/80 dark:border-stone-800 p-6 shadow-sm shadow-lg shadow-black/5 dark:shadow-black/20 animate-fade-in-up [animation-delay:0.3s]">
      <div className="flex items-center gap-2 mb-6">
        <svg className="w-4 h-4 text-stone-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="12" width="4" height="8" rx="1" />
          <rect x="10" y="6" width="4" height="14" rx="1" />
          <rect x="17" y="9" width="4" height="11" rx="1" />
        </svg>
        <h2 className="text-[11px] font-semibold text-stone-400 dark:text-stone-500 uppercase tracking-widest">
          Transaksi Per Bulan
        </h2>
      </div>
      <div className="flex flex-col items-center justify-center py-14 text-center animate-fade-in">
        <div className="relative w-16 h-16 mb-4">
          <svg className="w-full h-full text-stone-200 dark:text-stone-700" viewBox="0 0 64 64" fill="none">
            <rect x="6" y="34" width="10" height="20" rx="2" className="fill-current" />
            <rect x="20" y="24" width="10" height="30" rx="2" className="fill-current" />
            <rect x="34" y="28" width="10" height="26" rx="2" className="fill-current" />
            <rect x="48" y="18" width="10" height="36" rx="2" className="fill-current" />
            <line x1="6" y1="54" x2="58" y2="54" stroke="currentColor" strokeWidth="1.5" />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-6 h-6 text-stone-400 dark:text-stone-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 5v14M5 12h14" strokeLinecap="round" />
            </svg>
          </div>
        </div>
        <p className="text-sm text-stone-400 dark:text-stone-500 font-medium">Belum ada data transaksi</p>
        <p className="text-xs text-stone-300 dark:text-stone-600 mt-1">Tambahkan transaksi untuk melihat grafik</p>
      </div>
    </div>
  );
}

export function EmptyDebts() {
  return (
    <div className="text-center py-12 text-stone-400 dark:text-stone-500 animate-fade-in-up">
      <Illustration>
        <svg viewBox="0 0 48 48" className="w-12 h-12 text-stone-300 dark:text-stone-600">
          <path d="M12 28c0-4 4-8 8-8h8c4 0 8 4 8 8v4H12v-4z" stroke="currentColor" strokeWidth="2" fill="none" />
          <circle cx="24" cy="16" r="5" stroke="currentColor" strokeWidth="2" fill="none" />
        </svg>
      </Illustration>
      <p className="text-sm font-medium">Belum ada catatan utang</p>
      <p className="text-xs mt-1">Klik Tambah untuk mencatat utang</p>
    </div>
  );
}

export function EmptyBudgets() {
  return (
    <div className="text-center py-12 text-stone-400 dark:text-stone-500 animate-fade-in-up">
      <Illustration>
        <svg viewBox="0 0 48 48" className="w-12 h-12 text-stone-300 dark:text-stone-600">
          <circle cx="24" cy="24" r="16" stroke="currentColor" strokeWidth="2" fill="none" strokeDasharray="4 3" />
          <path d="M24 8v16l10 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </Illustration>
      <p className="text-sm font-medium">Belum ada anggaran</p>
      <p className="text-xs mt-1">Klik Tambah untuk membuat anggaran kategori</p>
    </div>
  );
}
