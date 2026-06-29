"use client";

import { useEffect, useState } from "react";
import { PieChart, Loader2 } from "lucide-react";
import { formatRupiah } from "@/lib/format";
import { getCategoryIcon } from "@/lib/category-icons";

interface BudgetUsage {
  id: number;
  category: string;
  budgeted: number;
  spent: number;
  percentage: number;
}

export default function BudgetProgress() {
  const [data, setData] = useState<BudgetUsage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/budgets/usage")
      .then((r) => r.ok ? r.json() : [])
      .then((d) => { if (Array.isArray(d)) setData(d); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-white/80 dark:bg-stone-900/80 backdrop-blur-xl rounded-2xl border border-stone-200/80 dark:border-stone-800 p-5 shadow-sm shadow-lg shadow-black/5 dark:shadow-black/5 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 animate-fade-in-up">
      <div className="flex items-center gap-2 mb-4">
        <PieChart className="w-4 h-4 text-stone-400 dark:text-stone-500" />
        <h2 className="text-[11px] font-semibold text-stone-400 dark:text-stone-500 uppercase tracking-widest">
          Anggaran Bulan Ini
        </h2>
      </div>
      {loading ? (
        <div className="flex items-center justify-center py-6">
          <Loader2 className="w-4 h-4 text-stone-300 dark:text-stone-600 animate-spin" />
        </div>
      ) : data.length === 0 ? (
        <p className="text-xs text-stone-400 dark:text-stone-500 text-center py-6">
          Belum ada anggaran bulan ini
        </p>
      ) : (
        <div className="space-y-3">
          {data.map((item) => {
            const overBudget = item.percentage > 100;
            const nearLimit = item.percentage >= 80 && item.percentage <= 100;
            return (
              <div key={item.id}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-stone-700 dark:text-stone-300">{getCategoryIcon(item.category)} {item.category}</span>
                  <span className={`text-xs font-semibold ${overBudget ? "text-rose-600" : nearLimit ? "text-amber-600" : "text-stone-400 dark:text-stone-500"}`}>
                    {formatRupiah(item.spent)} / {formatRupiah(item.budgeted)}
                  </span>
                </div>
                <div className="w-full h-2.5 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{
                      width: `${Math.min(item.percentage, 100)}%`,
                      background: overBudget
                        ? "linear-gradient(90deg, #fb7185, #f43f5e)"
                        : nearLimit
                          ? "linear-gradient(90deg, #fbbf24, #f59e0b)"
                          : "linear-gradient(90deg, #34d399, #10b981)",
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
