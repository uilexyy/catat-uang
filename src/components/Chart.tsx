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

export default function Chart({ data }: ChartProps) {
  if (data.length === 0) {
    return <EmptyChart />;
  }

  return (
    <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200/80 dark:border-stone-800 p-6 shadow-sm dark:shadow-none animate-fade-in-up [animation-delay:0.3s]">
      <div className="flex items-center gap-2 mb-6">
        <BarChart3 className="w-4 h-4 text-stone-400 dark:text-stone-500" />
        <h2 className="text-[11px] font-semibold text-stone-400 dark:text-stone-500 uppercase tracking-widest">
          Transaksi Per Bulan
        </h2>
      </div>

        <ResponsiveContainer width="100%" height={300}>
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
            <Tooltip
              formatter={(value) => formatRupiah(typeof value === "number" ? value : 0)}
              contentStyle={{
                borderRadius: "12px",
                border: "1px solid #e7e5e4",
                boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                padding: "8px 12px",
              }}
              labelStyle={{ fontSize: "11px", color: "#78716c" }}
            />
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
