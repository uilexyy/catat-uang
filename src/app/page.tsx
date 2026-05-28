import { prisma } from "@/lib/prisma";
import { LayoutDashboard } from "lucide-react";
import SummaryCards from "@/components/SummaryCards";
import DebtSummaryCards from "@/components/DebtSummaryCards";
import Chart from "@/components/Chart";
import BudgetProgress from "@/components/BudgetProgress";

export default async function DashboardPage() {
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

  const chartData = chartRaw.map((r) => ({
    month: r.month,
    income: Number(r.income),
    expense: Number(r.expense),
  }));

  const debtAgg = await prisma.debt.groupBy({
    by: ["isPaid"],
    _sum: { amount: true },
  });
  const totalDebt = Number(debtAgg.find((d) => !d.isPaid)?._sum?.amount ?? 0);
  const totalPaid = Number(debtAgg.find((d) => d.isPaid)?._sum?.amount ?? 0);

  return (
    <div className="space-y-4 sm:space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
          <LayoutDashboard className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-blue-600" />
        </div>
        <div className="min-w-0">
          <h1 className="text-base sm:text-lg font-bold text-stone-800 dark:text-stone-200 truncate">Dashboard</h1>
          <p className="text-xs text-stone-400 dark:text-stone-500">Ringkasan keuangan kamu</p>
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
