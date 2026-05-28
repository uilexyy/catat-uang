import { Plus } from "lucide-react";
import TransactionForm from "@/components/TransactionForm";

export default function NewTransactionPage() {
  return (
    <div className="max-w-lg mx-auto">
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl p-5 shadow-lg mb-5 sm:mb-6">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
            <Plus className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">Tambah Transaksi</h1>
            <p className="text-sm text-blue-100">Catat pemasukan atau pengeluaran baru</p>
          </div>
        </div>
      </div>
      <div className="bg-white dark:bg-stone-900/80 backdrop-blur-xl rounded-2xl border border-stone-200/80 dark:border-stone-800 p-5 sm:p-6 shadow-sm">
        <TransactionForm />
      </div>
    </div>
  );
}
