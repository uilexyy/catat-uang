import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const debts = await prisma.debt.findMany({
      orderBy: { date: "desc" },
    });
    return NextResponse.json(debts.map((d) => ({ ...d, amount: Number(d.amount) })));
  } catch {
    return NextResponse.json({ error: "Gagal memuat utang" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { person, amount, description, date, dueDate, notes } = body;

    if (!person || !amount || amount <= 0) {
      return NextResponse.json({ error: "Nama orang dan jumlah harus diisi" }, { status: 400 });
    }

    const debt = await prisma.debt.create({
      data: {
        person,
        amount,
        description: description || "",
        date: date ? new Date(date) : new Date(),
        dueDate: dueDate ? new Date(dueDate) : null,
        notes: notes || "",
      },
    });

    return NextResponse.json(debt, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Gagal menambah utang" }, { status: 500 });
  }
}
