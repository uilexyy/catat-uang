import { Handshake, CheckCircle2 } from "lucide-react";
import { formatRupiah } from "@/lib/format";

interface DebtSummaryCardsProps {
  totalDebt: number;
  totalPaid: number;
}

export default function DebtSummaryCards({ totalDebt, totalPaid }: DebtSummaryCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-4 sm:p-5 animate-fade-in-up">
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-8 h-8 rounded-xl bg-rose-50 flex items-center justify-center">
            <Handshake className="w-4.5 h-4.5 text-rose-500" />
          </div>
          <span className="text-[11px] font-semibold text-rose-400 uppercase tracking-widest">Total Utang</span>
        </div>
        <p className="text-lg sm:text-xl font-bold text-rose-600">{formatRupiah(totalDebt)}</p>
      </div>

      <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-4 sm:p-5 animate-fade-in-up [animation-delay:0.05s]">
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center">
            <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500" />
          </div>
          <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-widest">Terbayar</span>
        </div>
        <p className="text-lg sm:text-xl font-bold text-emerald-600">{formatRupiah(totalPaid)}</p>
      </div>
    </div>
  );
}
