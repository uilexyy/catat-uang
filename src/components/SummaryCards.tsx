"use client";

import { useEffect, useRef, useState } from "react";
import { Wallet, TrendingUp, TrendingDown } from "lucide-react";
import { formatRupiah } from "@/lib/format";

interface SummaryCardsProps {
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpense: number;
}

function AnimatedNumber({ value, className }: { value: number; className: string }) {
  const [display, setDisplay] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const duration = 600;
    const start = performance.now();

    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(value * eased));
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }, [value]);

  return <p className={className}>{formatRupiah(display)}</p>;
}

export default function SummaryCards({ totalBalance, monthlyIncome, monthlyExpense }: SummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {/* Total Saldo — hero card */}
      <div className="sm:col-span-3 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-5 sm:p-6 shadow-lg shadow-blue-500/20 animate-fade-in-up">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-semibold text-blue-200 uppercase tracking-widest">Total Saldo</span>
          <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
            <Wallet className="w-4 h-4 text-white" />
          </div>
        </div>
        <AnimatedNumber
          value={totalBalance}
          className={`text-3xl sm:text-4xl font-bold tracking-tight ${totalBalance >= 0 ? "text-white" : "text-rose-200"}`}
        />
        <div className="mt-4 h-1 w-20 rounded-full bg-white/20" />
      </div>

      {/* Pemasukan */}
      <div className="bg-white/80 dark:bg-stone-900/80 backdrop-blur-xl rounded-2xl border border-stone-200/80 dark:border-stone-800 p-5 shadow-sm shadow-lg shadow-black/5 dark:shadow-black/5 hover:shadow-xl hover:-translate-y-0.5 active:scale-[0.98] animate-fade-in-up [animation-delay:0.1s]">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-semibold text-stone-400 dark:text-stone-500 uppercase tracking-widest">Pemasukan Bulan Ini</span>
          <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>
        <AnimatedNumber value={monthlyIncome} className="text-2xl font-bold tracking-tight text-emerald-600" />
      </div>

      {/* Pengeluaran */}
      <div className="sm:col-span-2 bg-white/80 dark:bg-stone-900/80 backdrop-blur-xl rounded-2xl border border-stone-200/80 dark:border-stone-800 p-5 shadow-sm shadow-lg shadow-black/5 dark:shadow-black/5 hover:shadow-xl hover:-translate-y-0.5 active:scale-[0.98] animate-fade-in-up [animation-delay:0.2s]">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-semibold text-stone-400 dark:text-stone-500 uppercase tracking-widest">Pengeluaran Bulan Ini</span>
          <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
            <TrendingDown className="w-4 h-4" />
          </div>
        </div>
        <AnimatedNumber value={monthlyExpense} className="text-2xl font-bold tracking-tight text-rose-600" />
      </div>
    </div>
  );
}
