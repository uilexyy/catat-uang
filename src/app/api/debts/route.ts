import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const userId = getUserId(request);
    const debts = await prisma.debt.findMany({
      where: { userId },
      orderBy: { date: "desc" },
    });
    return NextResponse.json(
      debts.map((d) => ({
        id: d.id,
        person: d.person,
        amount: Number(d.amount),
        description: d.description,
        date: d.date instanceof Date ? d.date.toISOString().split("T")[0] : String(d.date),
        dueDate: d.dueDate instanceof Date ? d.dueDate.toISOString().split("T")[0] : null,
        isPaid: d.isPaid,
        paidAt: d.paidAt instanceof Date ? d.paidAt.toISOString() : null,
        notes: d.notes,
        createdAt: d.createdAt instanceof Date ? d.createdAt.toISOString() : String(d.createdAt),
        totalPaid: 0,
        remaining: Number(d.amount),
      }))
    );
  } catch (error) {
    console.error("GET /api/debts error:", error);
    return NextResponse.json({ error: "Gagal memuat utang" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const userId = getUserId(request);
    const body = await request.json();
    const { person, amount, description, date, dueDate, notes } = body;

    if (!person || !amount || amount <= 0) {
      return NextResponse.json({ error: "Nama orang dan jumlah harus diisi" }, { status: 400 });
    }

    const debt = await prisma.debt.create({
      data: {
        userId,
        person,
        amount,
        description: description || "",
        date: date ? new Date(date) : new Date(),
        dueDate: dueDate ? new Date(dueDate) : null,
        notes: notes || "",
      },
    });

    return NextResponse.json({ ...debt, amount: Number(debt.amount) }, { status: 201 });
  } catch (error) {
    console.error("POST /api/debts error:", error);
    return NextResponse.json({ error: "Gagal menambah utang" }, { status: 500 });
  }
}
