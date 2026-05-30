import { Handshake, CheckCircle2 } from "lucide-react";
import { formatRupiah } from "@/lib/format";

interface DebtSummaryCardsProps {
  totalDebt: number;
  totalPaid: number;
}

export default function DebtSummaryCards({ totalDebt, totalPaid }: DebtSummaryCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="bg-white/80 dark:bg-stone-900/80 backdrop-blur-xl rounded-2xl border border-stone-200 dark:border-stone-800 p-4 sm:p-5 shadow-sm shadow-lg shadow-black/5 dark:shadow-black/5 hover:shadow-xl hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300 animate-fade-in-up">
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-8 h-8 rounded-xl bg-rose-50 flex items-center justify-center">
            <Handshake className="w-4 h-4 text-rose-500" />
          </div>
          <span className="text-[11px] font-semibold text-rose-400 uppercase tracking-widest">Total Utang</span>
        </div>
        <p className="text-lg sm:text-xl font-bold text-rose-600">{formatRupiah(totalDebt)}</p>
      </div>

      <div className="bg-white/80 dark:bg-stone-900/80 backdrop-blur-xl rounded-2xl border border-stone-200 dark:border-stone-800 p-4 sm:p-5 shadow-sm shadow-lg shadow-black/5 dark:shadow-black/5 hover:shadow-xl hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300 animate-fade-in-up [animation-delay:0.05s]">
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-widest">Terbayar</span>
        </div>
        <p className="text-lg sm:text-xl font-bold text-emerald-600">{formatRupiah(totalPaid)}</p>
      </div>
    </div>
  );
}
