import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const userId = getUserId(request);
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    const budgets = await prisma.budget.findMany({
      where: { userId, month, year, type: "expense" },
      orderBy: { category: "asc" },
    });

    if (budgets.length === 0) {
      return NextResponse.json([]);
    }

    const categories = budgets.map((b) => b.category);

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const spent = await prisma.transaction.groupBy({
      by: ["category"],
      where: {
        userId,
        type: "expense",
        category: { in: categories },
        date: { gte: startDate, lte: endDate },
      },
      _sum: { amount: true },
    });

    const spentMap: Record<string, number> = {};
    for (const s of spent) {
      spentMap[s.category] = Number(s._sum.amount);
    }

    const result = budgets.map((b) => ({
      id: b.id,
      category: b.category,
      budgeted: Number(b.amount),
      spent: spentMap[b.category] || 0,
      percentage: Number(b.amount) > 0 ? Math.round(((spentMap[b.category] || 0) / Number(b.amount)) * 100) : 0,
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error("GET /api/budgets/usage error:", error);
    return NextResponse.json({ error: "Gagal mengambil data penggunaan anggaran" }, { status: 500 });
  }
}
