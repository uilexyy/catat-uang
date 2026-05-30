import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const userId = getUserId(request);
    const budgets = await prisma.budget.findMany({ where: { userId }, orderBy: [{ year: "desc" }, { month: "desc" }, { category: "asc" }] });
    return NextResponse.json(budgets.map((b) => ({
      id: b.id,
      category: b.category,
      type: b.type,
      amount: Number(b.amount),
      month: b.month,
      year: b.year,
      created_at: b.createdAt,
      updated_at: b.updatedAt,
    })));
  } catch (error) {
    console.error("GET /api/budgets error:", error);
    return NextResponse.json({ error: "Gagal mengambil data anggaran" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const userId = getUserId(request);
    const body = await request.json();
    const { category, type, amount, month, year } = body;

    if (!category || !type || !amount || !month || !year) {
      return NextResponse.json({ error: "Semua field harus diisi" }, { status: 400 });
    }
    if (type !== "income" && type !== "expense") {
      return NextResponse.json({ error: "Tipe harus income atau expense" }, { status: 400 });
    }
    if (Number(amount) <= 0) {
      return NextResponse.json({ error: "Jumlah harus angka positif" }, { status: 400 });
    }
    if (month < 1 || month > 12) {
      return NextResponse.json({ error: "Bulan tidak valid" }, { status: 400 });
    }

    const budget = await prisma.budget.create({
      data: { userId, category, type, amount, month, year },
    });

    return NextResponse.json({
      id: budget.id,
      category: budget.category,
      type: budget.type,
      amount: Number(budget.amount),
      month: budget.month,
      year: budget.year,
      created_at: budget.createdAt,
      updated_at: budget.updatedAt,
    }, { status: 201 });
  } catch (error) {
    console.error("POST /api/budgets error:", error);
    return NextResponse.json({ error: "Gagal menyimpan anggaran" }, { status: 500 });
  }
}
