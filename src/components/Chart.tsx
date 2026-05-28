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
import { BarChart3, Inbox } from "lucide-react";
import { formatRupiah } from "@/lib/format";

interface ChartData {
  month: string;
  income: number;
  expense: number;
}

interface ChartProps {
  data: ChartData[];
}

export default function Chart({ data }: ChartProps) {
  return (
    <div className="bg-white rounded-2xl border border-stone-200/80 p-6 shadow-sm animate-fade-in-up [animation-delay:0.3s]">
      <div className="flex items-center gap-2 mb-6">
        <BarChart3 className="w-4 h-4 text-stone-400" />
        <h2 className="text-[11px] font-semibold text-stone-400 uppercase tracking-widest">
          Transaksi Per Bulan
        </h2>
      </div>

      {data.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-14 text-center animate-fade-in">
          <div className="w-14 h-14 rounded-2xl bg-stone-100 flex items-center justify-center mb-4">
            <Inbox className="w-6 h-6 text-stone-300" />
          </div>
          <p className="text-sm text-stone-400 font-medium">Belum ada data transaksi</p>
          <p className="text-xs text-stone-300 mt-1">Tambahkan transaksi untuk melihat grafik</p>
        </div>
      ) : (
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
      )}
    </div>
  );
}
