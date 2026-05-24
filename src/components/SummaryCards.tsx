import { Wallet, TrendingUp, TrendingDown } from "lucide-react";

interface SummaryCardsProps {
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpense: number;
}

function formatRupiah(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
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
            className={`bg-white rounded-2xl border border-stone-200/80 p-5 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 animate-fade-in-up ${card.delay}`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-widest">{card.label}</span>
              <div className={`w-9 h-9 rounded-xl ${card.iconBg} flex items-center justify-center`}>
                <Icon className="w-4.5 h-4.5" />
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
