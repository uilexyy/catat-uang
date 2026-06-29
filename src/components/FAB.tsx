"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Plus, X, CreditCard, Wallet, Loader2, Check, ChevronDown } from "lucide-react";
import { useToast } from "@/lib/toast";
import { getCategoryIcon } from "@/lib/category-icons";
import type { Category } from "@/lib/types";

const hiddenPaths = ["/transactions/new", "/catat-cepat", "/login", "/register"];

export default function FAB() {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<"income" | "expense">("expense");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    if (open) {
      setAmount("");
      setCategory("");
      setDescription("");
      setType("expense");
      fetch("/api/categories")
        .then((r) => r.json())
        .then(setCategories)
        .catch(() => {});
    }
  }, [open]);

  if (hiddenPaths.includes(pathname)) return null;

  const visibleCategories = categories.filter((cat) => {
    if (cat.type === "both") return true;
    return cat.type === type;
  });

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast("error", "Jumlah harus diisi dengan angka positif");
      return;
    }
    if (!category) {
      toast("error", "Pilih kategori");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          amount: Number(amount),
          category,
          description,
          date: new Date().toISOString().split("T")[0],
        }),
      });
      if (!res.ok) throw new Error();
      toast("success", "Transaksi berhasil ditambahkan");
      setOpen(false);
      router.refresh();
    } catch {
      toast("error", "Gagal menyimpan transaksi");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-24 md:bottom-6 right-4 sm:right-6 z-40 w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 active:scale-90 text-white shadow-lg hover:shadow-xl flex items-center justify-center transition-all duration-200 hover:rotate-90"
        aria-label="Tambah transaksi"
      >
        <Plus className="w-6 h-6" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-all duration-300 animate-fade-in"
            onClick={() => setOpen(false)}
          />
          <div className="relative bg-white dark:bg-stone-900 rounded-t-2xl sm:rounded-2xl p-5 w-full sm:max-w-sm shadow-2xl dark:border dark:border-stone-800 animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-stone-800 dark:text-stone-200">Transaksi Cepat</h3>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="p-1.5 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              >
                <X className="w-4 h-4 text-stone-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                {(["expense", "income"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => { setType(t); setCategory(""); }}
                    className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium border-2 transition-all duration-200 active:scale-[0.97] ${
                      type === t
                        ? t === "expense"
                          ? "bg-rose-50 dark:bg-rose-950/50 border-rose-300 dark:border-rose-700 text-rose-700 dark:text-rose-300 shadow-sm"
                          : "bg-emerald-50 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 shadow-sm"
                        : "bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-400 dark:text-stone-500 hover:border-stone-300 dark:hover:border-stone-700"
                    }`}
                  >
                    {t === "expense" ? <CreditCard className="w-4 h-4" /> : <Wallet className="w-4 h-4" />}
                    {t === "expense" ? "Keluar" : "Masuk"}
                  </button>
                ))}
              </div>

              <div className="relative group">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 dark:text-stone-500 text-sm font-medium transition-colors duration-200 group-focus-within:text-blue-500">
                  Rp
                </span>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0"
                  autoFocus
                  className="w-full pl-9 pr-3.5 py-2.5 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-sm text-stone-700 dark:text-stone-300 placeholder-stone-300 dark:placeholder-stone-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                />
              </div>

              <div className="relative">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-sm text-stone-700 dark:text-stone-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all appearance-none pr-9"
                >
                  <option value="">Pilih kategori</option>
                  {visibleCategories.map((cat) => (
                    <option key={cat.id} value={cat.name}>{getCategoryIcon(cat.name)} {cat.name}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 dark:text-stone-500 pointer-events-none" />
              </div>

              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Catatan (opsional)"
                className="w-full px-3.5 py-2.5 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-sm text-stone-700 dark:text-stone-300 placeholder-stone-300 dark:placeholder-stone-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:bg-blue-300 text-white text-sm font-medium rounded-xl shadow-sm active:scale-[0.97] transition-all duration-200 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    Simpan
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
