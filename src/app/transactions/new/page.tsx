import { Plus } from "lucide-react";
import TransactionForm from "@/components/TransactionForm";

export default function NewTransactionPage() {
  return (
    <div className="max-w-lg mx-auto">
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl shadow-lg mb-5 sm:mb-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.08]">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1.5" fill="white" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dots)" />
          </svg>
        </div>
        <div className="relative p-5">
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
        <svg className="absolute bottom-0 left-0 w-full h-4 text-stone-50 dark:text-stone-950" viewBox="0 0 1200 16" preserveAspectRatio="none" fill="currentColor">
          <path d="M0,16 C300,0 600,16 900,0 C1050,-5 1200,8 1200,8 L1200,16 L0,16 Z" />
        </svg>
      </div>
      <div className="bg-white dark:bg-stone-900/80 backdrop-blur-xl rounded-2xl border border-stone-200/80 dark:border-stone-800 p-5 sm:p-6 shadow-sm">
        <TransactionForm />
      </div>
    </div>
  );
}
