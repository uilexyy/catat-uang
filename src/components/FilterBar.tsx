"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export default function FilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentType = searchParams.get("type") || "";
  const currentCategory = searchParams.get("category") || "";
  const currentMonth = searchParams.get("month") || "";
  const currentYear = searchParams.get("year") || "";
  const currentSearch = searchParams.get("search") || "";

  const categories = [
    "Gaji", "Freelance", "Investasi", "Hadiah",
    "Makanan", "Transport", "Belanja", "Hiburan", "Tagihan", "Kesehatan", "Pendidikan", "Lainnya",
  ];

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
    <div className="bg-white rounded-2xl border border-stone-200/80 p-4 shadow-sm animate-fade-in-up">
      <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2">
        <select
          value={currentType}
          onChange={(e) => updateParam("type", e.target.value)}
          className="w-full sm:w-auto px-3.5 py-2.5 border border-stone-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 text-stone-600 transition-all duration-200"
        >
          <option value="">Semua Jenis</option>
          <option value="income">Pemasukan</option>
          <option value="expense">Pengeluaran</option>
        </select>

        <select
          value={currentCategory}
          onChange={(e) => updateParam("category", e.target.value)}
          className="w-full sm:w-auto px-3.5 py-2.5 border border-stone-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 text-stone-600 transition-all duration-200"
        >
          <option value="">Semua Kategori</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <select
          value={currentMonth}
          onChange={(e) => updateParam("month", e.target.value)}
          className="w-full sm:w-auto px-3.5 py-2.5 border border-stone-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 text-stone-600 transition-all duration-200"
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
          className="w-full sm:w-auto px-3.5 py-2.5 border border-stone-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 text-stone-600 transition-all duration-200"
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
          className="w-full sm:flex-1 min-w-0 px-3.5 py-2.5 border border-stone-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 text-stone-600 placeholder-stone-300 transition-all duration-200"
        />
      </div>

      {hasFilters && (
        <button
          onClick={clearFilters}
          className="mt-3 text-xs text-stone-400 hover:text-stone-600 font-medium transition-colors duration-200"
        >
          ✕ Hapus filter
        </button>
      )}
    </div>
  );
}
