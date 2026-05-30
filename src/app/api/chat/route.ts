import { NextResponse } from "next/server";
import { parseChatMessage } from "@/lib/chat-parser";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const userId = getUserId(request);
    const { message } = await request.json();
    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Pesan tidak valid" }, { status: 400 });
    }

    const parsed = parseChatMessage(message);
    if (!parsed) {
      return NextResponse.json(
        {
          error: "Maaf, aku tidak paham. Coba format: 'beli nasi 25rb', 'gaji 5jt', 'bayar listrik 350rb'",
        },
        { status: 422 },
      );
    }

    const transaction = await prisma.transaction.create({
      data: {
        userId,
        type: parsed.type,
        amount: parsed.amount,
        category: parsed.category,
        description: parsed.description,
        date: new Date(parsed.date),
      },
    });

    const label = parsed.type === "expense" ? "pengeluaran" : "pemasukan";
    const catLabel = parsed.category;
    const amountStr = `Rp${parsed.amount.toLocaleString("id-ID")}`;

    return NextResponse.json({
      success: true,
      transaction,
      reply: `Done! Mencatat ${label} **${amountStr}** — ${catLabel}${parsed.description ? ` (${parsed.description})` : ""}`,
      parsed,
    });
  } catch {
    return NextResponse.json({ error: "Gagal memproses pesan" }, { status: 500 });
  }
}
