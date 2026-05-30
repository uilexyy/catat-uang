"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { getCategoryIcon } from "@/lib/category-icons";
import type { Category } from "@/lib/types";

export default function FilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentType = searchParams.get("type") || "";
  const currentCategory = searchParams.get("category") || "";
  const currentMonth = searchParams.get("month") || "";
  const currentYear = searchParams.get("year") || "";
  const currentSearch = searchParams.get("search") || "";

  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then(setCategories)
      .catch(() => {});
  }, []);

  const visibleCategories = categories.filter((cat) => {
    if (!currentType) return true;
    if (cat.type === "both") return true;
    return cat.type === currentType;
  });

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) params.set(key, value);
      else params.delete(key);
      params.set("page", "1");
      router.push(`/transactions?${params.toString()}`);
    },
    [router, searchParams]
  );

  const clearFilters = useCallback(() => {
    router.push("/transactions");
  }, [router]);

  const hasFilters = currentType || currentCategory || currentMonth || currentYear || currentSearch;

  return (
    <div className="bg-white/80 dark:bg-stone-900/80 backdrop-blur-xl rounded-2xl border border-stone-200/80 dark:border-stone-800 p-4 shadow-sm shadow-lg shadow-black/5 dark:shadow-black/5 animate-fade-in-up">
      <div className="grid grid-cols-2 sm:flex sm:flex-row sm:flex-wrap gap-2">
        <select
          value={currentType}
          onChange={(e) => updateParam("type", e.target.value)}
          className="col-span-2 sm:w-auto px-3.5 py-2.5 border border-stone-200 dark:border-stone-800 rounded-xl text-sm bg-white dark:bg-stone-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 focus:shadow-[0_0_0_4px_rgba(59,130,246,0.08)] text-stone-600 dark:text-stone-400 transition-all duration-200"
        >
          <option value="">Semua Jenis</option>
          <option value="income">Pemasukan</option>
          <option value="expense">Pengeluaran</option>
        </select>

        <select
          value={currentCategory}
          onChange={(e) => updateParam("category", e.target.value)}
          className="sm:w-auto px-3.5 py-2.5 border border-stone-200 dark:border-stone-800 rounded-xl text-sm bg-white dark:bg-stone-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 focus:shadow-[0_0_0_4px_rgba(59,130,246,0.08)] text-stone-600 dark:text-stone-400 transition-all duration-200"
        >
          <option value="">Semua Kategori</option>
          {visibleCategories.map((cat) => (
            <option key={cat.id} value={cat.name}>{getCategoryIcon(cat.name)} {cat.name}</option>
          ))}
        </select>

        <select
          value={currentMonth}
          onChange={(e) => updateParam("month", e.target.value)}
          className="sm:w-auto px-3.5 py-2.5 border border-stone-200 dark:border-stone-800 rounded-xl text-sm bg-white dark:bg-stone-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 focus:shadow-[0_0_0_4px_rgba(59,130,246,0.08)] text-stone-600 dark:text-stone-400 transition-all duration-200"
        >
          <option value="">Semua Bulan</option>
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i + 1} value={i + 1}>
              {new Date(0, i).toLocaleString("id", { month: "long" })}
            </option>
          ))}
        </select>

        <select
          value={currentYear}
          onChange={(e) => updateParam("year", e.target.value)}
          className="sm:w-auto px-3.5 py-2.5 border border-stone-200 dark:border-stone-800 rounded-xl text-sm bg-white dark:bg-stone-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 focus:shadow-[0_0_0_4px_rgba(59,130,246,0.08)] text-stone-600 dark:text-stone-400 transition-all duration-200"
        >
          <option value="">Semua Tahun</option>
          {Array.from({ length: 5 }, (_, i) => (
            <option key={i} value={new Date().getFullYear() - i}>
              {new Date().getFullYear() - i}
            </option>
          ))}
        </select>

        <input
          type="search"
          placeholder="Cari catatan..."
          value={currentSearch}
          onChange={(e) => updateParam("search", e.target.value)}
          className="col-span-2 sm:flex-1 min-w-0 px-3.5 py-2.5 border border-stone-200 dark:border-stone-800 rounded-xl text-sm bg-white dark:bg-stone-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 focus:shadow-[0_0_0_4px_rgba(59,130,246,0.08)] text-stone-600 dark:text-stone-400 placeholder-stone-300 dark:placeholder-stone-600 transition-all duration-200"
        />
      </div>

      {hasFilters && (
        <button
          onClick={clearFilters}
          className="mt-3 text-xs text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300 font-medium transition-colors duration-200"
        >
          ✕ Hapus filter
        </button>
      )}
    </div>
  );
}
