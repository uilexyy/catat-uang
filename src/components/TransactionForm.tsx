"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/lib/toast";
import { CreditCard, Wallet, Loader2, AlertCircle, ArrowLeft, Camera, ChevronDown } from "lucide-react";
import ReceiptUpload from "./ReceiptUpload";
import { getCategoryIcon } from "@/lib/category-icons";
import type { Category } from "@/lib/types";

interface TransactionFormProps {
  initialData?: {
    type: "income" | "expense";
    amount: number;
    category: string;
    description: string;
    date: string;
  };
  transactionId?: number;
}

export default function TransactionForm({ initialData, transactionId }: TransactionFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const isEdit = !!transactionId;

  const [showReceipt, setShowReceipt] = useState(false);
  const [type, setType] = useState<"income" | "expense">(initialData?.type || "expense");
  const [amount, setAmount] = useState(initialData?.amount ? String(initialData.amount) : "");
  const [category, setCategory] = useState(initialData?.category || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [date, setDate] = useState(initialData?.date || new Date().toISOString().split("T")[0]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then(setCategories)
      .catch(() => {});
  }, []);

  const visibleCategories = categories.filter((cat) => {
    if (cat.type === "both") return true;
    return cat.type === type;
  });

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      setError("Jumlah harus diisi dengan angka positif");
      return;
    }
    if (!category) {
      setError("Pilih kategori");
      return;
    }
    if (!date) {
      setError("Pilih tanggal");
      return;
    }

    setLoading(true);
    try {
      const url = isEdit ? `/api/transactions/${transactionId}` : "/api/transactions";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, amount: Number(amount), category, description, date }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Gagal menyimpan transaksi");
      }

      toast("success", isEdit ? "Transaksi berhasil diperbarui" : "Transaksi berhasil ditambahkan");
      setTimeout(() => { router.push("/transactions"); router.refresh(); }, 300);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
      toast("error", err instanceof Error ? err.message : "Gagal menyimpan transaksi");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="flex items-center gap-2.5 bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 text-sm px-4 py-3 rounded-xl border border-rose-200 dark:border-rose-900 animate-fade-in">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Receipt Upload */}
      {!isEdit && (
        <div className="animate-fade-in-up">
          {!showReceipt ? (
            <button
              type="button"
              onClick={() => setShowReceipt(true)}
              className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-stone-200 dark:border-stone-800 rounded-xl text-sm font-medium text-stone-400 dark:text-stone-500 hover:border-blue-300 hover:text-blue-500 hover:bg-blue-50/30 transition-all duration-200"
            >
              <Camera className="w-4 h-4" />
              Upload Struk untuk Isi Otomatis
            </button>
          ) : (
            <div className="space-y-3 animate-fade-in">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-stone-400 dark:text-stone-500 uppercase tracking-widest">Upload Struk</span>
                <button
                  type="button"
                  onClick={() => setShowReceipt(false)}
                  className="text-xs text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300"
                >
                  Tutup
                </button>
              </div>
              <ReceiptUpload
                onDataExtracted={(data) => {
                  setType("expense");
                  if (data.amount) setAmount(String(Math.round(data.amount)));
                  if (data.date) setDate(data.date);
                  if (data.rawText) {
                    const desc = [data.storeName, data.rawText].filter(Boolean).join("\n");
                    setDescription(desc.slice(0, 500));
                  }
                  setCategory("Makanan");
                }}
                onClear={() => {
                  setShowReceipt(false);
                }}
              />
            </div>
          )}
        </div>
      )}

      <div className="animate-fade-in-up">
        <label className="block text-[11px] font-semibold text-stone-400 dark:text-stone-500 uppercase tracking-widest mb-2.5">
          Jenis
        </label>
        <div className="grid grid-cols-2 gap-2">
          {(["expense", "income"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => { setType(t); setCategory(""); }}
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-medium border-2 transition-all duration-200 active:scale-[0.97] ${
                type === t
                  ? t === "expense"
                    ? "bg-rose-50 dark:bg-rose-950/50 border-rose-300 dark:border-rose-700 text-rose-700 dark:text-rose-300 shadow-sm"
                    : "bg-emerald-50 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 shadow-sm"
                  : "bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-400 dark:text-stone-500 hover:border-stone-300 dark:hover:border-stone-700 hover:text-stone-600 dark:hover:text-stone-300"
              }`}
            >
              {t === "expense" ? <CreditCard className="w-4 h-4" /> : <Wallet className="w-4 h-4" />}
              {t === "expense" ? "Pengeluaran" : "Pemasukan"}
            </button>
          ))}
        </div>
      </div>

      <div className="animate-fade-in-up [animation-delay:0.05s]">
        <label htmlFor="amount" className="block text-[11px] font-semibold text-stone-400 dark:text-stone-500 uppercase tracking-widest mb-2">
          Jumlah
        </label>
        <div className="relative group">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 dark:text-stone-500 text-sm font-medium transition-colors duration-200 group-focus-within:text-blue-500">
            Rp
          </span>
          <input
            id="amount"
            type="number"
            min="1"
            step="1"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0"
            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl text-sm text-stone-700 dark:text-stone-300 placeholder-stone-300 dark:placeholder-stone-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-200"
          />
        </div>
      </div>

      <div className="animate-fade-in-up [animation-delay:0.1s]">
        <label htmlFor="category" className="block text-[11px] font-semibold text-stone-400 dark:text-stone-500 uppercase tracking-widest mb-2">
          Kategori
        </label>
        <div className="relative">
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-3 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl text-sm text-stone-700 dark:text-stone-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-200 appearance-none pr-10"
        >
          <option value="">Pilih kategori</option>
          {visibleCategories.map((cat) => (
            <option key={cat.id} value={cat.name}>{getCategoryIcon(cat.name)} {cat.name}</option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 dark:text-stone-500 pointer-events-none" />
        </div>
      </div>

      <div className="animate-fade-in-up [animation-delay:0.15s]">
        <label htmlFor="description" className="block text-[11px] font-semibold text-stone-400 dark:text-stone-500 uppercase tracking-widest mb-2">
          Catatan <span className="font-normal tracking-normal lowercase text-stone-300 dark:text-stone-600">(opsional)</span>
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          placeholder="Deskripsi transaksi..."
          className="w-full px-4 py-3 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl text-sm text-stone-700 dark:text-stone-300 placeholder-stone-300 dark:placeholder-stone-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-200 resize-none"
        />
      </div>

      <div className="animate-fade-in-up [animation-delay:0.2s]">
        <label htmlFor="date" className="block text-[11px] font-semibold text-stone-400 dark:text-stone-500 uppercase tracking-widest mb-2">
          Tanggal
        </label>
        <input
          id="date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full px-4 py-3 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl text-sm text-stone-700 dark:text-stone-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-200"
        />
      </div>

      <div className="flex gap-2 pt-2 animate-fade-in-up [animation-delay:0.25s]">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex items-center justify-center gap-2 flex-1 py-3 border border-stone-200 dark:border-stone-800 text-stone-400 dark:text-stone-500 text-sm font-medium rounded-xl hover:bg-stone-50 dark:hover:bg-stone-800 hover:text-stone-600 dark:hover:text-stone-300 active:scale-[0.97] transition-all duration-200"
        >
          <ArrowLeft className="w-4 h-4" />
          Batal
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex items-center justify-center gap-2 flex-1 py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:bg-blue-300 text-white text-sm font-medium rounded-xl shadow-sm hover:shadow-md active:scale-[0.97] transition-all duration-200 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Menyimpan...
            </>
          ) : (
            isEdit ? "Simpan Perubahan" : "Tambah Transaksi"
          )}
        </button>
      </div>
    </form>
  );
}
