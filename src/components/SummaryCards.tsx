import { Wallet, TrendingUp, TrendingDown } from "lucide-react";
import { formatRupiah } from "@/lib/format";

interface SummaryCardsProps {
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpense: number;
}

export default function SummaryCards({ totalBalance, monthlyIncome, monthlyExpense }: SummaryCardsProps) {
  const cards = [
    {
      label: "Total Saldo",
      value: totalBalance,
      icon: Wallet,
      valueClass: totalBalance >= 0 ? "text-blue-600" : "text-rose-600",
      iconBg: "bg-blue-100 text-blue-600",
      delay: "",
    },
    {
      label: "Pemasukan Bulan Ini",
      value: monthlyIncome,
      icon: TrendingUp,
      valueClass: "text-emerald-600",
      iconBg: "bg-emerald-100 text-emerald-600",
      delay: "[animation-delay:0.1s]",
    },
    {
      label: "Pengeluaran Bulan Ini",
      value: monthlyExpense,
      icon: TrendingDown,
      valueClass: "text-rose-600",
      iconBg: "bg-rose-100 text-rose-600",
      delay: "[animation-delay:0.2s]",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className={`bg-white/80 dark:bg-stone-900/80 backdrop-blur-xl rounded-2xl border border-stone-200/80 dark:border-stone-800 p-5 shadow-sm shadow-lg shadow-black/5 dark:shadow-black/5 hover:shadow-xl hover:-translate-y-0.5 active:scale-[0.98] animate-fade-in-up ${card.delay}`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-semibold text-stone-400 dark:text-stone-500 uppercase tracking-widest">{card.label}</span>
              <div className={`w-9 h-9 rounded-xl ${card.iconBg} flex items-center justify-center`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <p className={`text-2xl font-bold tracking-tight ${card.valueClass}`}>
              {formatRupiah(card.value)}
            </p>
          </div>
        );
      })}
    </div>
  );
}
