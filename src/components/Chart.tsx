"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { BarChart3 } from "lucide-react";
import { formatRupiah } from "@/lib/format";
import { EmptyChart } from "./EmptyState";

interface ChartData {
  month: string;
  income: number;
  expense: number;
}

interface ChartProps {
  data: ChartData[];
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white/95 dark:bg-stone-900/95 backdrop-blur-xl border border-stone-200 dark:border-stone-800 rounded-xl px-3 py-2.5 shadow-lg shadow-black/5 dark:shadow-black/5 animate-fade-in">
      <p className="text-[11px] font-semibold text-stone-500 dark:text-stone-400 mb-1.5">{label}</p>
      {payload.map((entry: any) => (
        <div key={entry.name} className="flex items-center gap-2 text-xs">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-stone-500 dark:text-stone-400">{entry.name}</span>
          <span className="font-semibold text-stone-700 dark:text-stone-300">
            {formatRupiah(typeof entry.value === "number" ? entry.value : 0)}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function Chart({ data }: ChartProps) {
  if (data.length === 0) {
    return <EmptyChart />;
  }

  return (
    <div className="bg-white/80 dark:bg-stone-900/80 backdrop-blur-xl rounded-2xl border border-stone-200/80 dark:border-stone-800 p-6 shadow-sm shadow-lg shadow-black/5 dark:shadow-black/5 animate-fade-in-up [animation-delay:0.3s]">
      <div className="flex items-center gap-2 mb-6">
        <BarChart3 className="w-4 h-4 text-stone-400 dark:text-stone-500" />
        <h2 className="text-[11px] font-semibold text-stone-400 dark:text-stone-500 uppercase tracking-widest">
          Transaksi Per Bulan
        </h2>
      </div>

        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 11, fill: "#a8a29e" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#a8a29e" }}
              tickFormatter={(v: number) => `Rp${(v / 1000).toFixed(0)}k`}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }}
              iconType="circle"
            />
            <Bar
              dataKey="income"
              name="Pemasukan"
              fill="#059669"
              radius={[4, 4, 0, 0]}
              maxBarSize={28}
              animationBegin={0}
              animationDuration={900}
            />
            <Bar
              dataKey="expense"
              name="Pengeluaran"
              fill="#e11d48"
              radius={[4, 4, 0, 0]}
              maxBarSize={28}
              animationBegin={200}
              animationDuration={900}
            />
          </BarChart>
        </ResponsiveContainer>
    </div>
  );
}
