import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const payments = await prisma.debtPayment.findMany({
      where: { debtId: Number(id) },
      orderBy: { date: "desc" },
    });
    return NextResponse.json(
      payments.map((p) => ({
        id: p.id,
        debtId: p.debtId,
        amount: Number(p.amount),
        date: p.date instanceof Date ? p.date.toISOString().split("T")[0] : String(p.date),
        notes: p.notes,
        created_at: p.createdAt instanceof Date ? p.createdAt.toISOString() : String(p.createdAt),
      }))
    );
  } catch (error) {
    console.error("GET /api/debts/[id]/payments error:", error);
    return NextResponse.json({ error: "Gagal mengambil riwayat pembayaran" }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { amount, date, notes } = body;

    if (!amount || Number(amount) <= 0) {
      return NextResponse.json({ error: "Jumlah pembayaran harus angka positif" }, { status: 400 });
    }

    const debt = await prisma.debt.findUnique({ where: { id: Number(id) } });
    if (!debt) {
      return NextResponse.json({ error: "Utang tidak ditemukan" }, { status: 404 });
    }

    const paymentDate = date || new Date().toISOString().split("T")[0];

    const payment = await prisma.debtPayment.create({
      data: {
        debtId: Number(id),
        amount: Number(amount),
        date: new Date(paymentDate),
        notes: notes || "",
      },
    });

    // Calculate total paid
    const allPayments = await prisma.debtPayment.findMany({ where: { debtId: Number(id) } });
    const totalPaid = allPayments.reduce((sum, p) => sum + Number(p.amount), 0);
    const debtAmount = Number(debt.amount);

    // Auto-mark as paid if fully paid
    if (totalPaid >= debtAmount && !debt.isPaid) {
      await prisma.debt.update({
        where: { id: Number(id) },
        data: { isPaid: true, paidAt: new Date() },
      });
    }

    return NextResponse.json({
      id: payment.id,
      debtId: payment.debtId,
      amount: Number(payment.amount),
      date: payment.date instanceof Date ? payment.date.toISOString().split("T")[0] : String(payment.date),
      notes: payment.notes,
      created_at: payment.createdAt instanceof Date ? payment.createdAt.toISOString() : String(payment.createdAt),
    }, { status: 201 });
  } catch (error) {
    console.error("POST /api/debts/[id]/payments error:", error);
    return NextResponse.json({ error: "Gagal mencatat pembayaran" }, { status: 500 });
  }
}
