import { type ReactNode } from "react";
import Link from "next/link";

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: { label: string; href: string };
}

const gradients = {
  blue: { from: "#3b82f6", to: "#6366f1" },
  rose: { from: "#f43f5e", to: "#e11d48" },
  emerald: { from: "#10b981", to: "#34d399" },
  amber: { from: "#f59e0b", to: "#d97706" },
  violet: { from: "#8b5cf6", to: "#6366f1" },
};

function Illustration({ children, accent = "blue" }: { children: ReactNode; accent?: keyof typeof gradients }) {
  const g = gradients[accent];
  return (
    <div className="relative w-28 h-28 sm:w-32 sm:h-32 mx-auto mb-5">
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 120 120" fill="none">
        <defs>
          <linearGradient id={`bg-${accent}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={g.from} stopOpacity="0.08" />
            <stop offset="100%" stopColor={g.to} stopOpacity="0.16" />
          </linearGradient>
          <linearGradient id={`ring-${accent}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={g.from} stopOpacity="0.15" />
            <stop offset="100%" stopColor={g.to} stopOpacity="0.3" />
          </linearGradient>
        </defs>
        <circle cx="60" cy="60" r="56" fill={`url(#bg-${accent})`} />
        <circle cx="60" cy="60" r="56" stroke={`url(#ring-${accent})`} strokeWidth="2" strokeDasharray="6 4" />
        <circle cx="60" cy="60" r="44" className="fill-stone-50 dark:fill-stone-800/50" />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}

function WalletIcon() {
  return (
    <svg viewBox="0 0 48 48" className="w-10 h-10" fill="none">
      <defs>
        <linearGradient id="walletBody" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#6366f1" stopOpacity="0.4" />
        </linearGradient>
        <linearGradient id="walletAccent" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>
      </defs>
      <rect x="6" y="12" width="36" height="24" rx="3" stroke="url(#walletAccent)" strokeWidth="2" fill="url(#walletBody)" />
      <rect x="26" y="20" width="16" height="8" rx="2" stroke="url(#walletAccent)" strokeWidth="2" fill="url(#walletBody)" />
      <circle cx="32" cy="24" r="2" className="fill-blue-500" />
      <line x1="6" y1="20" x2="18" y2="20" stroke="url(#walletAccent)" strokeWidth="2" strokeLinecap="round" />
      <line x1="6" y1="28" x2="14" y2="28" stroke="url(#walletAccent)" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 48 48" className="w-10 h-10" fill="none">
      <defs>
        <linearGradient id="searchStroke" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>
      </defs>
      <circle cx="20" cy="20" r="10" stroke="url(#searchStroke)" strokeWidth="2.5" fill="url(#searchStroke)" fillOpacity="0.08" />
      <line x1="27" y1="27" x2="36" y2="36" stroke="url(#searchStroke)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="12" y1="12" x2="14" y2="14" stroke="url(#searchStroke)" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg viewBox="0 0 48 48" className="w-10 h-10" fill="none">
      <defs>
        <linearGradient id="chartEmerald" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#34d399" />
        </linearGradient>
        <linearGradient id="chartBlue" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#60a5fa" />
        </linearGradient>
        <linearGradient id="chartRose" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f43f5e" />
          <stop offset="100%" stopColor="#fb7185" />
        </linearGradient>
      </defs>
      <rect x="6" y="28" width="8" height="14" rx="1.5" stroke="url(#chartEmerald)" strokeWidth="2" fill="url(#chartEmerald)" fillOpacity="0.15" />
      <rect x="18" y="18" width="8" height="24" rx="1.5" stroke="url(#chartBlue)" strokeWidth="2" fill="url(#chartBlue)" fillOpacity="0.15" />
      <rect x="30" y="22" width="8" height="20" rx="1.5" stroke="url(#chartRose)" strokeWidth="2" fill="url(#chartRose)" fillOpacity="0.15" />
      <line x1="4" y1="44" x2="44" y2="44" stroke="#a8a29e" strokeWidth="1.5" strokeLinecap="round" className="stroke-stone-300 dark:stroke-stone-600" />
      <circle cx="34" cy="14" r="8" stroke="url(#chartBlue)" strokeWidth="2" fill="url(#chartBlue)" fillOpacity="0.08" />
      <line x1="34" y1="11" x2="34" y2="17" stroke="url(#chartBlue)" strokeWidth="2" strokeLinecap="round" />
      <line x1="31" y1="14" x2="37" y2="14" stroke="url(#chartBlue)" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function PersonIcon() {
  return (
    <svg viewBox="0 0 48 48" className="w-10 h-10" fill="none">
      <defs>
        <linearGradient id="personStroke" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f43f5e" />
          <stop offset="100%" stopColor="#e11d48" />
        </linearGradient>
      </defs>
      <circle cx="24" cy="16" r="8" stroke="url(#personStroke)" strokeWidth="2" fill="url(#personStroke)" fillOpacity="0.1" />
      <path d="M10 38c0-8 6-14 14-14s14 6 14 14" stroke="url(#personStroke)" strokeWidth="2" fill="url(#personStroke)" fillOpacity="0.06" strokeLinecap="round" />
      <circle cx="24" cy="16" r="3" fill="#e11d48" fillOpacity="0.3" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 48 48" className="w-10 h-10" fill="none">
      <defs>
        <linearGradient id="clockStroke" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
      </defs>
      <circle cx="24" cy="24" r="16" stroke="url(#clockStroke)" strokeWidth="2" fill="url(#clockStroke)" fillOpacity="0.08" />
      <path d="M24 12v12l8 4" stroke="url(#clockStroke)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="24" cy="24" r="2.5" fill="#f59e0b" fillOpacity="0.4" />
    </svg>
  );
}

export function EmptyTransactions() {
  return (
    <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200/80 dark:border-stone-800 p-8 sm:p-12 text-center shadow-sm animate-fade-in-up">
      <Illustration accent="blue">
        <WalletIcon />
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
      <Illustration accent="violet">
        <SearchIcon />
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
    <div className="bg-white/80 dark:bg-stone-900/80 backdrop-blur-xl rounded-2xl border border-stone-200/80 dark:border-stone-800 p-6 shadow-sm shadow-lg shadow-black/5 dark:shadow-black/5 animate-fade-in-up [animation-delay:0.3s]">
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
        <div className="relative w-20 h-20 mb-4">
          <ChartIcon />
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
      <Illustration accent="rose">
        <PersonIcon />
      </Illustration>
      <p className="text-sm font-medium">Belum ada catatan utang</p>
      <p className="text-xs mt-1">Klik Tambah untuk mencatat utang</p>
    </div>
  );
}

export function EmptyBudgets() {
  return (
    <div className="text-center py-12 text-stone-400 dark:text-stone-500 animate-fade-in-up">
      <Illustration accent="amber">
        <ClockIcon />
      </Illustration>
      <p className="text-sm font-medium">Belum ada anggaran</p>
      <p className="text-xs mt-1">Klik Tambah untuk membuat anggaran kategori</p>
    </div>
  );
}
