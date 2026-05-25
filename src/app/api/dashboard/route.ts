import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const grouped = await prisma.transaction.groupBy({
      by: ["type"],
      _sum: { amount: true },
    });

    const totalIncome = Number(grouped.find((g) => g.type === "income")?._sum?.amount ?? 0);
    const totalExpense = Number(grouped.find((g) => g.type === "expense")?._sum?.amount ?? 0);
    const totalBalance = totalIncome - totalExpense;

    const now = new Date();
    const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const monthlyGrouped = await prisma.transaction.groupBy({
      by: ["type"],
      where: { date: { gte: firstOfMonth } },
      _sum: { amount: true },
    });

    const monthlyIncome = Number(monthlyGrouped.find((g) => g.type === "income")?._sum?.amount ?? 0);
    const monthlyExpense = Number(monthlyGrouped.find((g) => g.type === "expense")?._sum?.amount ?? 0);

    const twelveMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 11, 1);

    const chartRaw = await prisma.$queryRaw<{ month: string; income: bigint; expense: bigint }[]>`
      SELECT
        TO_CHAR(date, 'YYYY-MM') as month,
        COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) as income,
        COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) as expense
      FROM transactions
      WHERE date >= ${twelveMonthsAgo}
      GROUP BY TO_CHAR(date, 'YYYY-MM')
      ORDER BY month ASC
    `;

    const monthlyChart = chartRaw.map((r) => ({
      month: r.month,
      income: Number(r.income),
      expense: Number(r.expense),
    }));

    return NextResponse.json({
      total_balance: totalBalance,
      monthly_income: monthlyIncome,
      monthly_expense: monthlyExpense,
      monthly_chart: monthlyChart,
    });
  } catch (error) {
    console.error("GET /api/dashboard error:", error);
    return NextResponse.json({ error: "Gagal mengambil data dashboard" }, { status: 500 });
  }
}
