"use client";

import { useState, useEffect, FormEvent } from "react";
import { Plus, Handshake, CheckCircle2, X, Loader2, AlertCircle, Undo2, Trash2, ChevronDown, ChevronUp, Banknote, Wallet, Clock } from "lucide-react";
import { useToast } from "@/lib/toast";
import { formatRupiah, formatDate } from "@/lib/format";
import { EmptyDebts } from "@/components/EmptyState";

interface DebtPayment {
  id: number;
  debtId: number;
  amount: number;
  date: string;
  notes: string;
  created_at: string;
}

interface Debt {
  id: number;
  person: string;
  amount: number;
  description: string;
  date: string;
  dueDate: string | null;
  isPaid: boolean;
  paidAt: string | null;
  notes: string;
  totalPaid: number;
  remaining: number;
}

export default function UtangPage() {
  const { toast } = useToast();
  const [debts, setDebts] = useState<Debt[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const [person, setPerson] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [dueDate, setDueDate] = useState("");

  // Payment modal state
  const [payingDebt, setPayingDebt] = useState<Debt | null>(null);
  const [payAmount, setPayAmount] = useState("");
  const [payDate, setPayDate] = useState(new Date().toISOString().split("T")[0]);
  const [payNotes, setPayNotes] = useState("");
  const [paySaving, setPaySaving] = useState(false);
  const [payError, setPayError] = useState("");

  // Expanded payment history
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [payments, setPayments] = useState<Record<number, DebtPayment[]>>({});
  const [loadingPayments, setLoadingPayments] = useState<Record<number, boolean>>({});

  useEffect(() => {
    fetchDebts();
  }, []);

  function fetchDebts() {
    setLoading(true);
    fetch("/api/debts")
      .then((r) => {
        if (!r.ok) throw new Error("Gagal memuat data utang");
        return r.json();
      })
      .then((data) => {
        if (!Array.isArray(data)) throw new Error("Response bukan array");
        setDebts(data);
      })
      .catch(() => toast("error", "Gagal memuat data utang"))
      .finally(() => setLoading(false));
  }

  async function fetchPayments(debtId: number) {
    if (payments[debtId]) return;
    setLoadingPayments((prev) => ({ ...prev, [debtId]: true }));
    try {
      const res = await fetch(`/api/debts/${debtId}/payments`);
      const data = await res.json();
      setPayments((prev) => ({ ...prev, [debtId]: data }));
    } catch {
      toast("error", "Gagal memuat riwayat pembayaran");
    } finally {
      setLoadingPayments((prev) => ({ ...prev, [debtId]: false }));
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (!person.trim()) { setError("Nama orang harus diisi"); return; }
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) { setError("Jumlah harus diisi dengan angka positif"); return; }

    setSaving(true);
    try {
      const res = await fetch("/api/debts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          person: person.trim(),
          amount: Number(amount),
          description: description.trim(),
          date,
          dueDate: dueDate || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Gagal menambah utang");
      }

      toast("success", "Utang berhasil dicatat");
      setPerson(""); setAmount(""); setDescription(""); setDueDate("");
      setShowForm(false);
      fetchDebts();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setSaving(false);
    }
  }

  async function togglePaid(debt: Debt) {
    try {
      const res = await fetch(`/api/debts/${debt.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPaid: !debt.isPaid }),
      });

      if (!res.ok) throw new Error();
      toast("success", debt.isPaid ? "Utang dikembalikan ke belum bayar" : "Utang ditandai lunas");
      fetchDebts();
    } catch {
      toast("error", "Gagal memperbarui status utang");
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Hapus utang ini?")) return;
    try {
      const res = await fetch(`/api/debts/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast("success", "Utang berhasil dihapus");
      setExpandedId(null);
      fetchDebts();
    } catch {
      toast("error", "Gagal menghapus utang");
    }
  }

  async function handlePay(e: FormEvent) {
    e.preventDefault();
    if (!payingDebt) return;
    setPayError("");
    if (!payAmount || isNaN(Number(payAmount)) || Number(payAmount) <= 0) {
      setPayError("Jumlah pembayaran harus angka positif");
      return;
    }

    setPaySaving(true);
    try {
      const res = await fetch(`/api/debts/${payingDebt.id}/payments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Number(payAmount),
          date: payDate,
          notes: payNotes.trim(),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Gagal mencatat pembayaran");
      }

      toast("success", "Pembayaran berhasil dicatat");
      setPayAmount(""); setPayNotes(""); setPayDate(new Date().toISOString().split("T")[0]);
      setPayingDebt(null);
      setPayments((prev) => {
        const copy = { ...prev };
        delete copy[payingDebt.id];
        return copy;
      });
      setExpandedId(null);
      fetchDebts();
    } catch (err) {
      setPayError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setPaySaving(false);
    }
  }

  function toggleExpand(debt: Debt) {
    if (expandedId === debt.id) {
      setExpandedId(null);
    } else {
      setExpandedId(debt.id);
      fetchPayments(debt.id);
    }
  }

  const unpaid = debts.filter((d) => !d.isPaid);
  const paid = debts.filter((d) => d.isPaid);

  return (
    <div className="space-y-4 sm:space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div className="bg-gradient-to-r from-rose-600 to-rose-500 rounded-2xl p-5 shadow-lg flex-1">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
              <Handshake className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">Utang</h1>
              <p className="text-sm text-rose-100">Catat dan kelola utang kamu</p>
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white text-xs font-medium transition-all duration-200 active:scale-95 shrink-0"
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
              <label className="block text-[11px] font-semibold text-stone-400 dark:text-stone-500 uppercase tracking-widest mb-1.5">Nama Orang</label>
              <input value={person} onChange={(e) => setPerson(e.target.value)} placeholder="Nama pemberi utang" className="w-full px-4 py-2.5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl text-sm text-stone-700 dark:text-stone-300 placeholder-stone-300 dark:placeholder-stone-600 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-400 transition-all duration-200" />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-stone-400 dark:text-stone-500 uppercase tracking-widest mb-1.5">Jumlah</label>
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 dark:text-stone-500 text-sm">Rp</span>
                <input value={amount} onChange={(e) => setAmount(e.target.value)} type="number" min="1" placeholder="0" className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl text-sm text-stone-700 dark:text-stone-300 placeholder-stone-300 dark:placeholder-stone-600 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-400 transition-all duration-200" />
              </div>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-semibold text-stone-400 dark:text-stone-500 uppercase tracking-widest mb-1.5">Keterangan</label>
              <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Misal: Pinjaman modal usaha" className="w-full px-4 py-2.5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl text-sm text-stone-700 dark:text-stone-300 placeholder-stone-300 dark:placeholder-stone-600 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-400 transition-all duration-200" />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-stone-400 dark:text-stone-500 uppercase tracking-widest mb-1.5">Tanggal</label>
              <input value={date} onChange={(e) => setDate(e.target.value)} type="date" className="w-full px-4 py-2.5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl text-sm text-stone-700 dark:text-stone-300 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-400 transition-all duration-200" />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-stone-400 dark:text-stone-500 uppercase tracking-widest mb-1.5">Jatuh Tempo <span className="font-normal lowercase text-stone-300 dark:text-stone-600">(opsional)</span></label>
              <input value={dueDate} onChange={(e) => setDueDate(e.target.value)} type="date" className="w-full px-4 py-2.5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl text-sm text-stone-700 dark:text-stone-300 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-400 transition-all duration-200" />
            </div>
          </div>

          <button type="submit" disabled={saving} className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 disabled:bg-rose-300 text-white text-sm font-medium rounded-xl transition-all duration-200 active:scale-[0.98] disabled:cursor-not-allowed flex items-center justify-center gap-2">
            {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Menyimpan...</> : "Catat Utang"}
          </button>
        </form>
      )}

      {/* Payment modal */}
      {payingDebt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in" onClick={() => setPayingDebt(null)}>
          <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-2xl p-5 w-full max-w-md animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-full bg-rose-50 flex items-center justify-center">
                <Wallet className="w-4 h-4 text-rose-500" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-stone-700 dark:text-stone-300">Bayar Utang</h2>
                <p className="text-xs text-stone-400">{payingDebt.person} &middot; {formatRupiah(payingDebt.remaining)} sisa</p>
              </div>
            </div>

            {payError && (
              <div className="flex items-center gap-2 bg-rose-50 text-rose-600 text-sm px-4 py-3 rounded-xl border border-rose-200 mb-4">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{payError}</span>
              </div>
            )}

            <form onSubmit={handlePay} className="space-y-4">
              <div>
                <label className="block text-[11px] font-semibold text-stone-400 dark:text-stone-500 uppercase tracking-widest mb-1.5">Jumlah Bayar</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 dark:text-stone-500 text-sm">Rp</span>
                  <input value={payAmount} onChange={(e) => setPayAmount(e.target.value)} type="number" min="1" placeholder="0" className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl text-sm text-stone-700 dark:text-stone-300 placeholder-stone-300 dark:placeholder-stone-600 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-400 transition-all duration-200" />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-stone-400 dark:text-stone-500 uppercase tracking-widest mb-1.5">Tanggal Bayar</label>
                <input value={payDate} onChange={(e) => setPayDate(e.target.value)} type="date" className="w-full px-4 py-2.5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl text-sm text-stone-700 dark:text-stone-300 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-400 transition-all duration-200" />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-stone-400 dark:text-stone-500 uppercase tracking-widest mb-1.5">Catatan <span className="font-normal lowercase text-stone-300 dark:text-stone-600">(opsional)</span></label>
                <input value={payNotes} onChange={(e) => setPayNotes(e.target.value)} placeholder="Misal: Cicilan bulan ke-3" className="w-full px-4 py-2.5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl text-sm text-stone-700 dark:text-stone-300 placeholder-stone-300 dark:placeholder-stone-600 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-400 transition-all duration-200" />
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => setPayingDebt(null)} className="flex-1 py-2.5 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-500 dark:text-stone-400 text-sm font-medium rounded-xl transition-all duration-200 active:scale-[0.98]">
                  Batal
                </button>
                <button type="submit" disabled={paySaving} className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 disabled:bg-rose-300 text-white text-sm font-medium rounded-xl transition-all duration-200 active:scale-[0.98] disabled:cursor-not-allowed flex items-center justify-center gap-2">
                  {paySaving ? <><Loader2 className="w-4 h-4 animate-spin" /> Menyimpan...</> : "Bayar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-5 h-5 text-stone-300 dark:text-stone-600 animate-spin" />
        </div>
      ) : debts.length === 0 ? (
        <EmptyDebts />
      ) : (
        <div className="space-y-4">
          {unpaid.length > 0 && (
            <div>
              <h2 className="text-[11px] font-semibold text-stone-400 dark:text-stone-500 uppercase tracking-widest mb-2">
                Belum Lunas ({unpaid.length})
              </h2>
              <div className="space-y-2">
                {unpaid.map((debt, i) => (
                  <div key={debt.id}>
                    <div className="bg-white/80 dark:bg-stone-900/80 backdrop-blur-xl rounded-xl border border-stone-200 dark:border-stone-800 p-4 animate-fade-in-up" style={{ animationDelay: `${i * 0.05}s` }}>
                      <div className="flex items-center gap-3">
                        <button type="button" onClick={() => toggleExpand(debt)} className="w-9 h-9 rounded-full bg-rose-50 flex items-center justify-center shrink-0 hover:bg-rose-100 transition-colors">
                          <Handshake className="w-4 h-4 text-rose-500" />
                        </button>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-stone-700 dark:text-stone-300 truncate">{debt.person}</p>
                          <p className="text-xs text-stone-400 dark:text-stone-500 truncate">{debt.description || formatDate(debt.date)}</p>
                          {debt.totalPaid > 0 && (
                            <p className="text-[10px] text-rose-400 mt-0.5">Terbayar {formatRupiah(debt.totalPaid)}</p>
                          )}
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-sm font-bold text-rose-600">{formatRupiah(debt.amount)}</p>
                          {debt.dueDate && (
                            <p className="text-[10px] text-stone-400 dark:text-stone-500">Jatuh tempo {formatDate(debt.dueDate)}</p>
                          )}
                          {debt.remaining > 0 && (
                            <p className="text-[10px] text-rose-500 font-medium">Sisa {formatRupiah(debt.remaining)}</p>
                          )}
                        </div>
                        <div className="flex gap-1">
                          <button type="button" onClick={() => setPayingDebt(debt)} className="w-8 h-8 rounded-lg bg-rose-50 hover:bg-rose-100 flex items-center justify-center transition-colors" title="Bayar">
                            <Banknote className="w-4 h-4 text-rose-500" />
                          </button>
                          <button type="button" onClick={() => togglePaid(debt)} className="w-8 h-8 rounded-lg bg-emerald-50 hover:bg-emerald-100 flex items-center justify-center transition-colors" title="Tandai Lunas">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          </button>
                          <button type="button" onClick={() => handleDelete(debt.id)} className="w-8 h-8 rounded-lg bg-stone-50 dark:bg-stone-800 hover:bg-rose-50 flex items-center justify-center transition-colors" title="Hapus">
                            <Trash2 className="w-4 h-4 text-stone-400 dark:text-stone-500 hover:text-rose-500" />
                          </button>
                        </div>
                      </div>

                      {/* Progress bar */}
                      {debt.totalPaid > 0 && (
                        <div className="mt-3">
                          <div className="w-full h-2 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
                            <div className="h-full bg-rose-500 rounded-full transition-all duration-500" style={{ width: `${Math.min((debt.totalPaid / debt.amount) * 100, 100)}%` }} />
                          </div>
                        </div>
                      )}

                      {/* Expand button */}
                      <button type="button" onClick={() => toggleExpand(debt)} className="mt-2 flex items-center gap-1 text-[10px] text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 transition-colors">
                        {expandedId === debt.id ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        Riwayat pembayaran
                      </button>

                      {/* Payment history */}
                      {expandedId === debt.id && (
                        <div className="mt-2 pt-2 border-t border-stone-100 dark:border-stone-800 animate-fade-in">
                          {loadingPayments[debt.id] ? (
                            <div className="flex items-center gap-2 py-2 text-xs text-stone-400">
                              <Loader2 className="w-3 h-3 animate-spin" /> Memuat...
                            </div>
                          ) : (payments[debt.id] || []).length === 0 ? (
                            <p className="text-xs text-stone-400 py-2">Belum ada pembayaran</p>
                          ) : (
                            <div className="space-y-1.5">
                              {(payments[debt.id] || []).map((p) => (
                                <div key={p.id} className="flex items-center gap-2 py-1.5 px-2 rounded-lg hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors">
                                  <Clock className="w-3 h-3 text-stone-300 dark:text-stone-600 shrink-0" />
                                  <span className="text-xs text-stone-400 dark:text-stone-500 shrink-0">{formatDate(p.date)}</span>
                                  <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 shrink-0">-{formatRupiah(p.amount)}</span>
                                  {p.notes && <span className="text-[10px] text-stone-400 dark:text-stone-500 truncate">{p.notes}</span>}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {paid.length > 0 && (
            <div>
              <h2 className="text-[11px] font-semibold text-stone-400 dark:text-stone-500 uppercase tracking-widest mb-2">
                Lunas ({paid.length})
              </h2>
              <div className="space-y-2">
                {paid.map((debt, i) => (
                  <div key={debt.id} className="bg-white/80 dark:bg-stone-900/80 backdrop-blur-xl rounded-xl border border-stone-200 dark:border-stone-800 p-4 animate-fade-in-up flex items-center gap-3 opacity-60 hover:opacity-100 transition-opacity" style={{ animationDelay: `${i * 0.05}s` }}>
                    <button type="button" onClick={() => toggleExpand(debt)} className="w-9 h-9 rounded-full bg-emerald-50 flex items-center justify-center shrink-0 hover:bg-emerald-100 transition-colors">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-stone-500 dark:text-stone-400 line-through truncate">{debt.person}</p>
                      <p className="text-xs text-stone-300 dark:text-stone-600 truncate">{debt.description || formatDate(debt.date)}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold text-stone-400 dark:text-stone-500 line-through">{formatRupiah(debt.amount)}</p>
                      {debt.paidAt && <p className="text-[10px] text-emerald-500">Lunas {formatDate(debt.paidAt)}</p>}
                    </div>
                    <button type="button" onClick={() => togglePaid(debt)} className="w-8 h-8 rounded-lg bg-stone-50 dark:bg-stone-800 hover:bg-amber-50 flex items-center justify-center transition-colors" title="Kembalikan ke belum bayar">
                      <Undo2 className="w-4 h-4 text-stone-400 dark:text-stone-500 hover:text-amber-500" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
