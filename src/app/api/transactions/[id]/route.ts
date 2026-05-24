import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
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

    const existing = await prisma.transaction.findUnique({ where: { id: parseInt(id) } });
    if (!existing) {
      return NextResponse.json({ error: "Transaksi tidak ditemukan" }, { status: 404 });
    }

    await prisma.transaction.update({
      where: { id: parseInt(id) },
      data: {
        type,
        amount: Number(amount),
        category: category.trim(),
        description: description || null,
        date: new Date(date),
      },
    });

    return NextResponse.json({ message: "Transaksi berhasil diperbarui" });
  } catch (error) {
    console.error("PUT /api/transactions/[id] error:", error);
    return NextResponse.json({ error: "Gagal memperbarui transaksi" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const existing = await prisma.transaction.findUnique({ where: { id: parseInt(id) } });
    if (!existing) {
      return NextResponse.json({ error: "Transaksi tidak ditemukan" }, { status: 404 });
    }

    await prisma.transaction.delete({ where: { id: parseInt(id) } });

    return NextResponse.json({ message: "Transaksi berhasil dihapus" });
  } catch (error) {
    console.error("DELETE /api/transactions/[id] error:", error);
    return NextResponse.json({ error: "Gagal menghapus transaksi" }, { status: 500 });
  }
}
