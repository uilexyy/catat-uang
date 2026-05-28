import { prisma } from "@/lib/prisma";
import { Pencil } from "lucide-react";
import TransactionForm from "@/components/TransactionForm";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditTransactionPage({ params }: PageProps) {
  const { id } = await params;
  const transaction = await prisma.transaction.findUnique({ where: { id: parseInt(id) } });

  if (!transaction) {
    notFound();
  }

  const dateStr = transaction.date instanceof Date
    ? transaction.date.toISOString().split("T")[0]
    : String(transaction.date).split("T")[0];

  return (
    <div className="max-w-lg mx-auto">
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl p-5 shadow-lg mb-5 sm:mb-6">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
            <Pencil className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">Edit Transaksi</h1>
            <p className="text-sm text-blue-100">Ubah data transaksi yang sudah ada</p>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-stone-200/80 p-5 sm:p-6 shadow-sm">
        <TransactionForm
          transactionId={transaction.id}
          initialData={{
            type: transaction.type as "income" | "expense",
            amount: Number(transaction.amount),
            category: transaction.category,
            description: transaction.description || "",
            date: dateStr,
          }}
        />
      </div>
    </div>
  );
}
