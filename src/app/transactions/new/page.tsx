import { Plus } from "lucide-react";
import TransactionForm from "@/components/TransactionForm";

export default function NewTransactionPage() {
  return (
    <div className="max-w-lg mx-auto">
      <div className="flex items-center gap-3 mb-5 sm:mb-6">
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
          <Plus className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-blue-600" />
        </div>
        <div className="min-w-0">
          <h1 className="text-base sm:text-lg font-bold text-stone-800 truncate">Tambah Transaksi</h1>
          <p className="text-xs text-stone-400">Catat pemasukan atau pengeluaran baru</p>
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-stone-200/80 p-5 sm:p-6 shadow-sm">
        <TransactionForm />
      </div>
    </div>
  );
}
