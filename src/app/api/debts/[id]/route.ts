import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const debtId = parseInt(id, 10);

    if (isNaN(debtId)) {
      return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
    }

    const existing = await prisma.debt.findUnique({ where: { id: debtId } });
    if (!existing) {
      return NextResponse.json({ error: "Utang tidak ditemukan" }, { status: 404 });
    }

    const updateData: Record<string, unknown> = {};
    if (body.person !== undefined) updateData.person = body.person;
    if (body.amount !== undefined) updateData.amount = body.amount;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.date !== undefined) updateData.date = new Date(body.date);
    if (body.dueDate !== undefined) updateData.dueDate = body.dueDate ? new Date(body.dueDate) : null;
    if (body.notes !== undefined) updateData.notes = body.notes;
    if (body.isPaid !== undefined) {
      updateData.isPaid = body.isPaid;
      updateData.paidAt = body.isPaid ? new Date() : null;
    }

    const debt = await prisma.debt.update({
      where: { id: debtId },
      data: updateData,
    });

    return NextResponse.json({ ...debt, amount: Number(debt.amount) });
  } catch {
    return NextResponse.json({ error: "Gagal memperbarui utang" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const debtId = parseInt(id, 10);

    if (isNaN(debtId)) {
      return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
    }

    await prisma.debtPayment.deleteMany({ where: { debtId } });
    await prisma.debt.delete({ where: { id: debtId } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Gagal menghapus utang" }, { status: 500 });
  }
}
