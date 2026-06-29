"use client";

import { useState, useEffect, FormEvent } from "react";
import { PieChart, Plus, X, Loader2, AlertCircle, Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/lib/toast";
import { formatRupiah } from "@/lib/format";
import { getCategoryIcon } from "@/lib/category-icons";
import { EmptyBudgets } from "@/components/EmptyState";
import type { Category, Budget } from "@/lib/types";

export default function AnggaranPage() {
  const { toast } = useToast();
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const [category, setCategory] = useState("");
  const [type, setType] = useState<"income" | "expense">("expense");
  const [amount, setAmount] = useState("");
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    Promise.all([
      fetch("/api/budgets").then((r) => r.ok ? r.json() : []),
      fetch("/api/categories").then((r) => r.ok ? r.json() : []),
    ])
      .then(([budgetsData, categoriesData]) => {
        if (Array.isArray(budgetsData)) setBudgets(budgetsData);
        if (Array.isArray(categoriesData)) setCategories(categoriesData);
      })
      .catch(() => toast("error", "Gagal memuat data"))
      .finally(() => setLoading(false));
  }, []);

  function refresh() {
    fetch("/api/budgets")
      .then((r) => r.json())
      .then(setBudgets)
      .catch(() => toast("error", "Gagal memuat data anggaran"));
  }

  function openEdit(b: Budget) {
    setEditingId(b.id);
    setCategory(b.category);
    setType(b.type);
    setAmount(String(b.amount));
    setMonth(b.month);
    setYear(b.year);
    setShowForm(true);
    setError("");
  }

  function resetForm() {
    setEditingId(null);
    setCategory("");
    setType("expense");
    setAmount("");
    setMonth(new Date().getMonth() + 1);
    setYear(new Date().getFullYear());
    setError("");
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (!category) { setError("Pilih kategori"); return; }
    if (!amount || Number(amount) <= 0) { setError("Jumlah harus angka positif"); return; }

    setSaving(true);
    try {
      const url = editingId ? `/api/budgets/${editingId}` : "/api/budgets";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, type, amount: Number(amount), month, year }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Gagal menyimpan");
      }

      toast("success", editingId ? "Anggaran diperbarui" : "Anggaran ditambahkan");
      setShowForm(false);
      resetForm();
      refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Hapus anggaran ini?")) return;
    try {
      const res = await fetch(`/api/budgets/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast("success", "Anggaran dihapus");
      refresh();
    } catch {
      toast("error", "Gagal menghapus anggaran");
    }
  }

  const expenseCategories = categories.filter((c) => c.type === "expense" || c.type === "both");
  const incomeCategories = categories.filter((c) => c.type === "income" || c.type === "both");

  const groupedByType = {
    expense: budgets.filter((b) => b.type === "expense"),
    income: budgets.filter((b) => b.type === "income"),
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl shadow-lg flex-1 min-w-0 relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.08]">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="dots-anggaran" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                  <circle cx="2" cy="2" r="1.5" fill="white" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#dots-anggaran)" />
            </svg>
          </div>
          <div className="relative p-5">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm shrink-0">
                <PieChart className="w-5 h-5 text-white" />
              </div>
              <div className="min-w-0">
                <h1 className="text-lg font-bold text-white truncate">Anggaran</h1>
                <p className="text-sm text-blue-100 truncate">Atur batas pemasukan & pengeluaran per kategori</p>
              </div>
            </div>
          </div>
          <svg className="absolute bottom-0 left-0 w-full h-4 text-stone-50 dark:text-stone-950" viewBox="0 0 1200 16" preserveAspectRatio="none" fill="currentColor">
            <path d="M0,16 C300,0 600,16 900,0 C1050,-5 1200,8 1200,8 L1200,16 L0,16 Z" />
          </svg>
        </div>
        <button
          type="button"
          onClick={() => { resetForm(); setShowForm(!showForm); }}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-medium transition-all duration-200 active:scale-95 shrink-0 self-end sm:self-center"
        >
          {showForm ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
          {showForm ? "Batal" : "Tambah"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white/80 dark:bg-stone-900/80 backdrop-blur-xl rounded-2xl border border-stone-200 dark:border-stone-800 p-4 sm:p-5 space-y-4 animate-fade-in">
          {error && (
            <div className="flex items-center gap-2 bg-rose-50 text-rose-600 text-sm px-4 py-3 rounded-xl border border-rose-200">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-stone-400 dark:text-stone-500 uppercase tracking-widest mb-1.5">Tipe</label>
              <select value={type} onChange={(e) => { setType(e.target.value as "income" | "expense"); setCategory(""); }} className="w-full px-4 py-2.5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl text-sm text-stone-700 dark:text-stone-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-200">
                <option value="expense">Pengeluaran</option>
                <option value="income">Pemasukan</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-stone-400 dark:text-stone-500 uppercase tracking-widest mb-1.5">Kategori</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-4 py-2.5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl text-sm text-stone-700 dark:text-stone-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-200">
                <option value="">Pilih kategori</option>
                {(type === "expense" ? expenseCategories : incomeCategories).map((c) => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-stone-400 dark:text-stone-500 uppercase tracking-widest mb-1.5">Jumlah</label>
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 dark:text-stone-500 text-sm">Rp</span>
                <input value={amount} onChange={(e) => setAmount(e.target.value)} type="number" min="1" placeholder="0" className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl text-sm text-stone-700 dark:text-stone-300 placeholder-stone-300 dark:placeholder-stone-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-200" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-semibold text-stone-400 dark:text-stone-500 uppercase tracking-widest mb-1.5">Bulan</label>
                <select value={month} onChange={(e) => setMonth(Number(e.target.value))} className="w-full px-4 py-2.5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl text-sm text-stone-700 dark:text-stone-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-200">
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>{new Date(0, i).toLocaleString("id", { month: "long" })}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-stone-400 dark:text-stone-500 uppercase tracking-widest mb-1.5">Tahun</label>
                <select value={year} onChange={(e) => setYear(Number(e.target.value))} className="w-full px-4 py-2.5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl text-sm text-stone-700 dark:text-stone-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-200">
                  {Array.from({ length: 5 }, (_, i) => (
                    <option key={i} value={new Date().getFullYear() - i}>{new Date().getFullYear() - i}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <button type="submit" disabled={saving} className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:bg-blue-300 text-white text-sm font-medium rounded-xl transition-all duration-200 active:scale-[0.98] disabled:cursor-not-allowed flex items-center justify-center gap-2">
            {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Menyimpan...</> : editingId ? "Simpan Perubahan" : "Tambah Anggaran"}
          </button>
        </form>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-5 h-5 text-stone-300 dark:text-stone-600 animate-spin" />
        </div>
      ) : budgets.length === 0 ? (
        <EmptyBudgets />
      ) : (
        <div className="space-y-6">
          {(["expense", "income"] as const).map((t) => {
            const list = groupedByType[t];
            if (list.length === 0) return null;
            return (
              <div key={t}>
                <h2 className="text-[11px] font-semibold text-stone-400 dark:text-stone-500 uppercase tracking-widest mb-2">
                  {t === "expense" ? "Pengeluaran" : "Pemasukan"}
                </h2>
                <div className="space-y-2">
                  {list.map((b, i) => (
                    <div key={b.id} className="bg-white/80 dark:bg-stone-900/80 backdrop-blur-xl rounded-xl border border-stone-200 dark:border-stone-800 p-4 animate-fade-in-up" style={{ animationDelay: `${i * 0.05}s` }}>
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-stone-700 dark:text-stone-300 truncate">{getCategoryIcon(b.category)} {b.category}</p>
                          <p className="text-xs text-stone-400 dark:text-stone-500">{new Date(0, b.month - 1).toLocaleString("id", { month: "long" })} {b.year}</p>
                        </div>
                        <p className={`text-sm font-bold shrink-0 ${t === "expense" ? "text-rose-600" : "text-emerald-600"}`}>
                          {formatRupiah(b.amount)}
                        </p>
                        <div className="hidden sm:flex gap-1">
                          <button type="button" onClick={() => openEdit(b)} className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-stone-50 dark:bg-stone-800 hover:bg-blue-50 flex items-center justify-center transition-colors shrink-0" title="Edit">
                            <Pencil className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-stone-400 dark:text-stone-500 hover:text-blue-500" />
                          </button>
                          <button type="button" onClick={() => handleDelete(b.id)} className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-stone-50 dark:bg-stone-800 hover:bg-rose-50 flex items-center justify-center transition-colors shrink-0" title="Hapus">
                            <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-stone-400 dark:text-stone-500 hover:text-rose-500" />
                          </button>
                        </div>
                      </div>
                      <div className="flex sm:hidden items-center justify-end gap-2 mt-3 pt-3 border-t border-stone-100 dark:border-stone-800">
                        <button type="button" onClick={() => openEdit(b)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-100 dark:bg-stone-800 hover:bg-blue-50 text-stone-500 hover:text-blue-600 text-xs font-medium transition-colors active:scale-95">
                          <Pencil className="w-3.5 h-3.5" />
                          Edit
                        </button>
                        <button type="button" onClick={() => handleDelete(b.id)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-100 dark:bg-stone-800 hover:bg-rose-50 text-stone-500 hover:text-rose-600 text-xs font-medium transition-colors active:scale-95">
                          <Trash2 className="w-3.5 h-3.5" />
                          Hapus
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
