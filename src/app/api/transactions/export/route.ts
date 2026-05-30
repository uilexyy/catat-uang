import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/auth";
import ExcelJS from "exceljs";

export async function GET(request: Request) {
  try {
    const userId = getUserId(request);
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const category = searchParams.get("category");
    const month = searchParams.get("month");
    const year = searchParams.get("year");
    const search = searchParams.get("search");

    const where: Record<string, unknown> = { userId };

    if (type === "income" || type === "expense") where.type = type;
    if (category) where.category = category;
    if (year) {
      const y = Number(year);
      where.date = {
        gte: new Date(y, month ? Number(month) - 1 : 0, 1),
        lte: new Date(y, month ? Number(month) : 11, month ? 0 : 31),
      };
    }
    if (search) {
      where.description = { contains: search };
    }

    const transactions = await prisma.transaction.findMany({
      where,
      orderBy: { date: "desc" },
    });

    const rows = transactions.map((t) => ({
      date: new Date(t.date).toLocaleDateString("id-ID"),
      type: t.type === "income" ? "Pemasukan" : "Pengeluaran",
      category: t.category,
      desc: t.description || "",
      amount: Number(t.amount),
    }));

    const totalIncome = rows.filter((r) => r.type === "Pemasukan").reduce((s, r) => s + r.amount, 0);
    const totalExpense = rows.filter((r) => r.type === "Pengeluaran").reduce((s, r) => s + r.amount, 0);
    const balance = totalIncome - totalExpense;

    const wb = new ExcelJS.Workbook();
    wb.creator = "Catat Uang";
    wb.created = new Date();

    const ws = wb.addWorksheet("Transaksi");

    // Column widths
    ws.getColumn(1).width = 5;
    ws.getColumn(2).width = 14;
    ws.getColumn(3).width = 14;
    ws.getColumn(4).width = 18;
    ws.getColumn(5).width = 45;
    ws.getColumn(6).width = 20;

    // Title row
    ws.mergeCells("A1:F1");
    const titleCell = ws.getCell("A1");
    titleCell.value = "Laporan Transaksi";
    titleCell.font = { name: "Calibri", size: 16, bold: true, color: { argb: "FF1C1917" } };
    ws.getRow(1).height = 32;

    // Subtitle row
    ws.mergeCells("A2:F2");
    const subCell = ws.getCell("A2");
    subCell.value = `Dibuat: ${new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}`;
    subCell.font = { name: "Calibri", size: 10, color: { argb: "FFA8A29E" } };
    ws.getRow(2).height = 20;

    // Empty row
    ws.getRow(3).height = 8;

    // Header row
    const headerRow = ws.getRow(4);
    const headers = ["No", "Tanggal", "Jenis", "Kategori", "Deskripsi", "Jumlah"];
    headers.forEach((h, i) => {
      const cell = headerRow.getCell(i + 1);
      cell.value = h;
      cell.font = { name: "Calibri", size: 11, bold: true, color: { argb: "FFFFFFFF" } };
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF2563EB" } };
      cell.alignment = i === 0 ? { horizontal: "center", vertical: "middle" } : i === 5 ? { horizontal: "right", vertical: "middle" } : { horizontal: "left", vertical: "middle" };
      cell.border = {
        top: { style: "thin", color: { argb: "FF1D4ED8" } },
        bottom: { style: "thin", color: { argb: "FF1D4ED8" } },
        left: { style: "thin", color: { argb: "FF1D4ED8" } },
        right: { style: "thin", color: { argb: "FF1D4ED8" } },
      };
    });
    headerRow.height = 28;

    // Data rows
    let rowIdx = 5;
    rows.forEach((r, i) => {
      const row = ws.getRow(rowIdx);
      const isIncome = r.type === "Pemasukan";

      row.getCell(1).value = i + 1;
      row.getCell(1).alignment = { horizontal: "center", vertical: "middle" };

      row.getCell(2).value = r.date;
      row.getCell(2).alignment = { horizontal: "left", vertical: "middle" };

      row.getCell(3).value = r.type;
      row.getCell(3).font = { name: "Calibri", size: 10, bold: true, color: { argb: isIncome ? "FF059669" : "FFE11D48" } };
      row.getCell(3).alignment = { horizontal: "left", vertical: "middle" };

      row.getCell(4).value = r.category;
      row.getCell(4).font = { name: "Calibri", size: 10, bold: true, color: { argb: "FF292524" } };
      row.getCell(4).alignment = { horizontal: "left", vertical: "middle" };

      row.getCell(5).value = r.desc || "—";
      row.getCell(5).font = { name: "Calibri", size: 10, color: { argb: "FF78716C" } };
      row.getCell(5).alignment = { horizontal: "left", vertical: "middle" };

      row.getCell(6).value = r.amount;
      row.getCell(6).numFmt = '#,##0';
      row.getCell(6).font = { name: "Calibri", size: 10, bold: true, color: { argb: isIncome ? "FF059669" : "FFE11D48" } };
      row.getCell(6).alignment = { horizontal: "right", vertical: "middle" };

      // Alternating row bg
      if (i % 2 === 1) {
        for (let c = 1; c <= 6; c++) {
          row.getCell(c).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF5F5F4" } };
        }
      }

      for (let c = 1; c <= 6; c++) {
        row.getCell(c).border = {
          top: { style: "thin", color: { argb: "FFE7E5E4" } },
          bottom: { style: "thin", color: { argb: "FFE7E5E4" } },
          left: { style: "thin", color: { argb: "FFE7E5E4" } },
          right: { style: "thin", color: { argb: "FFE7E5E4" } },
        };
      }

      row.height = 22;
      rowIdx++;
    });

    // Spacer row
    ws.getRow(rowIdx).height = 4;
    rowIdx++;

    // Total rows
    const totals = [
      { label: "TOTAL PEMASUKAN", value: totalIncome, color: "FF059669" },
      { label: "TOTAL PENGELUARAN", value: totalExpense, color: "FFE11D48" },
    ];

    totals.forEach((t) => {
      const row = ws.getRow(rowIdx);
      ws.mergeCells(`A${rowIdx}:E${rowIdx}`);

      const labelCell = row.getCell(1);
      labelCell.value = t.label;
      labelCell.font = { name: "Calibri", size: 11, bold: true, color: { argb: "FF292524" } };
      labelCell.alignment = { horizontal: "right", vertical: "middle" };
      labelCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF5F5F4" } };

      const valCell = row.getCell(6);
      valCell.value = t.value;
      valCell.numFmt = '#,##0';
      valCell.font = { name: "Calibri", size: 11, bold: true, color: { argb: t.color } };
      valCell.alignment = { horizontal: "right", vertical: "middle" };
      valCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF5F5F4" } };

      for (let c = 1; c <= 6; c++) {
        row.getCell(c).border = {
          top: { style: "thin", color: { argb: "FFD6D3D1" } },
          bottom: { style: "thin", color: { argb: "FFD6D3D1" } },
          left: { style: "thin", color: { argb: "FFD6D3D1" } },
          right: { style: "thin", color: { argb: "FFD6D3D1" } },
        };
      }

      row.height = 24;
      rowIdx++;
    });

    // Balance row
    const balRow = ws.getRow(rowIdx);
    ws.mergeCells(`A${rowIdx}:E${rowIdx}`);
    const balLabel = balRow.getCell(1);
    balLabel.value = "SALDO";
    balLabel.font = { name: "Calibri", size: 12, bold: true, color: { argb: "FFFFFFFF" } };
    balLabel.alignment = { horizontal: "right", vertical: "middle" };
    balLabel.fill = { type: "pattern", pattern: "solid", fgColor: { argb: balance >= 0 ? "FF2563EB" : "FFE11D48" } };

    const balVal = balRow.getCell(6);
    balVal.value = balance;
    balVal.numFmt = '#,##0';
    balVal.font = { name: "Calibri", size: 12, bold: true, color: { argb: "FFFFFFFF" } };
    balVal.alignment = { horizontal: "right", vertical: "middle" };
    balVal.fill = { type: "pattern", pattern: "solid", fgColor: { argb: balance >= 0 ? "FF2563EB" : "FFE11D48" } };

    for (let c = 1; c <= 6; c++) {
      balRow.getCell(c).border = {
        top: { style: "thin", color: { argb: balance >= 0 ? "FF1D4ED8" : "FFBE123C" } },
        bottom: { style: "thin", color: { argb: balance >= 0 ? "FF1D4ED8" : "FFBE123C" } },
        left: { style: "thin", color: { argb: balance >= 0 ? "FF1D4ED8" : "FFBE123C" } },
        right: { style: "thin", color: { argb: balance >= 0 ? "FF1D4ED8" : "FFBE123C" } },
      };
    }
    balRow.height = 28;

    const buffer = await wb.xlsx.writeBuffer();

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="laporan_transaksi_${new Date().toISOString().split("T")[0]}.xlsx"`,
      },
    });
  } catch (error) {
    console.error("GET /api/transactions/export error:", error);
    return NextResponse.json({ error: "Gagal mengekspor data" }, { status: 500 });
  }
}
