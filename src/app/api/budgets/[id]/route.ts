import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { category, type, amount, month, year } = body;

    const existing = await prisma.budget.findUnique({ where: { id: Number(id) } });
    if (!existing) {
      return NextResponse.json({ error: "Anggaran tidak ditemukan" }, { status: 404 });
    }

    const budget = await prisma.budget.update({
      where: { id: Number(id) },
      data: {
        ...(category !== undefined && { category }),
        ...(type !== undefined && { type }),
        ...(amount !== undefined && { amount }),
        ...(month !== undefined && { month }),
        ...(year !== undefined && { year }),
      },
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
    });
  } catch (error) {
    console.error("PUT /api/budgets/[id] error:", error);
    return NextResponse.json({ error: "Gagal memperbarui anggaran" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const existing = await prisma.budget.findUnique({ where: { id: Number(id) } });
    if (!existing) {
      return NextResponse.json({ error: "Anggaran tidak ditemukan" }, { status: 404 });
    }

    await prisma.budget.delete({ where: { id: Number(id) } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/budgets/[id] error:", error);
    return NextResponse.json({ error: "Gagal menghapus anggaran" }, { status: 500 });
  }
}
