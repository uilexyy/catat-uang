import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { LayoutDashboard } from "lucide-react";
import SummaryCards from "@/components/SummaryCards";
import DebtSummaryCards from "@/components/DebtSummaryCards";
import Chart from "@/components/Chart";
import BudgetProgress from "@/components/BudgetProgress";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  const userId = session.userId;

  const grouped = await prisma.transaction.groupBy({
    by: ["type"],
    where: { userId },
    _sum: { amount: true },
  });

  const totalIncome = Number(grouped.find((g) => g.type === "income")?._sum?.amount ?? 0);
  const totalExpense = Number(grouped.find((g) => g.type === "expense")?._sum?.amount ?? 0);
  const totalBalance = totalIncome - totalExpense;

  const now = new Date();
  const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const monthlyGrouped = await prisma.transaction.groupBy({
    by: ["type"],
    where: { date: { gte: firstOfMonth }, userId },
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
    WHERE date >= ${twelveMonthsAgo} AND user_id = ${userId}
    GROUP BY TO_CHAR(date, 'YYYY-MM')
    ORDER BY month ASC
  `;

  const chartData = chartRaw.map((r) => ({
    month: r.month,
    income: Number(r.income),
    expense: Number(r.expense),
  }));

  const debtAgg = await prisma.debt.groupBy({
    by: ["isPaid"],
    where: { userId },
    _sum: { amount: true },
  });
  const totalDebt = Number(debtAgg.find((d) => !d.isPaid)?._sum?.amount ?? 0);
  const totalPaid = Number(debtAgg.find((d) => d.isPaid)?._sum?.amount ?? 0);

  return (
    <div className="space-y-4 sm:space-y-5">
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl p-5 shadow-lg">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
            <LayoutDashboard className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">Dashboard</h1>
            <p className="text-sm text-blue-100">Ringkasan keuangan kamu</p>
          </div>
        </div>
      </div>

      <div className="animate-fade-in-up">
        <SummaryCards
          totalBalance={totalBalance}
          monthlyIncome={monthlyIncome}
          monthlyExpense={monthlyExpense}
        />
      </div>
      <div className="animate-fade-in-up [animation-delay:0.15s]">
        <DebtSummaryCards totalDebt={totalDebt} totalPaid={totalPaid} />
      </div>
      <div className="animate-fade-in-up [animation-delay:0.2s]">
        <BudgetProgress />
      </div>
      <div className="animate-fade-in-up [animation-delay:0.25s]">
        <Chart data={chartData} />
      </div>
    </div>
  );
}
