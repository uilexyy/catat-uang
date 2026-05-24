import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const perPage = Math.min(50, Math.max(1, parseInt(searchParams.get("per_page") || "10")));
    const type = searchParams.get("type");
    const category = searchParams.get("category");
    const month = searchParams.get("month");
    const year = searchParams.get("year");
    const search = searchParams.get("search");

    const where: Record<string, unknown> = {};

    if (type && (type === "income" || type === "expense")) {
      where.type = type;
    }

    if (category) {
      where.category = category;
    }

    if (month || year) {
      const dateWhere: Record<string, unknown> = {};
      if (month) dateWhere.month = parseInt(month);
      if (year) dateWhere.year = parseInt(year);

      where.date = dateWhere;
    }

    if (search) {
      where.description = { contains: search };
    }

    const [data, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        orderBy: [{ date: "desc" }, { createdAt: "desc" }],
        take: perPage,
        skip: (page - 1) * perPage,
      }),
      prisma.transaction.count({ where }),
    ]);

    const totalPages = Math.max(1, Math.ceil(total / perPage));

    const serialized = data.map((tx) => ({
      ...tx,
      amount: Number(tx.amount),
      date: tx.date instanceof Date ? tx.date.toISOString().split("T")[0] : String(tx.date),
      created_at: tx.createdAt instanceof Date ? tx.createdAt.toISOString() : String(tx.createdAt),
      updated_at: tx.updatedAt instanceof Date ? tx.updatedAt.toISOString() : String(tx.updatedAt),
    }));

    return NextResponse.json({
      data: serialized,
      pagination: { page, per_page: perPage, total, total_pages: totalPages },
    });
  } catch (error) {
    console.error("GET /api/transactions error:", error);
    return NextResponse.json({ error: "Gagal mengambil data transaksi" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, amount, category, description, date } = body;

    if (!type || !["income", "expense"].includes(type)) {
      return NextResponse.json({ error: "Jenis transaksi harus income atau expense" }, { status: 400 });
    }

    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      return NextResponse.json({ error: "Jumlah harus angka positif" }, { status: 400 });
    }

    if (!category || typeof category !== "string" || category.trim() === "") {
      return NextResponse.json({ error: "Kategori wajib diisi" }, { status: 400 });
    }

    if (!date) {
      return NextResponse.json({ error: "Tanggal wajib diisi" }, { status: 400 });
    }

    const transaction = await prisma.transaction.create({
      data: {
        type,
        amount: Number(amount),
        category: category.trim(),
        description: description || null,
        date: new Date(date),
      },
    });

    return NextResponse.json({ id: transaction.id }, { status: 201 });
  } catch (error) {
    console.error("POST /api/transactions error:", error);
    return NextResponse.json({ error: "Gagal menyimpan transaksi" }, { status: 500 });
  }
}
