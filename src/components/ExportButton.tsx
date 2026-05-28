"use client";

import { useState, useRef, useEffect } from "react";
import { Download, Loader2, FileSpreadsheet, ChevronDown } from "lucide-react";

interface ExportButtonProps {
  currentParams?: string;
}

export default function ExportButton({ currentParams }: ExportButtonProps) {
  const [open, setOpen] = useState(false);
  const [exporting, setExporting] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  async function doExport(params: string) {
    setExporting(true);
    setOpen(false);
    try {
      const res = await fetch(`/api/transactions/export?${params}`);
      if (!res.ok) throw new Error();
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `transaksi_${new Date().toISOString().split("T")[0]}.xlsx`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert("Gagal mengekspor data");
    } finally {
      setExporting(false);
    }
  }

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        disabled={exporting}
        className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700 text-stone-600 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 text-xs sm:text-sm font-medium rounded-xl shadow-sm dark:shadow-none hover:shadow-md active:scale-[0.97] transition-all duration-200 disabled:opacity-50"
      >
        {exporting ? (
          <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" />
        ) : (
          <FileSpreadsheet className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600" />
        )}
        <span className="hidden sm:inline">Export</span>
        <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 shadow-xl z-50 py-1 animate-fade-in">
          <button
            type="button"
            onClick={() => doExport(currentParams || "")}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors text-left"
          >
            <Download className="w-4 h-4 text-stone-400 dark:text-stone-500" />
            <div>
              <p className="font-medium">Export dengan filter</p>
              <p className="text-[11px] text-stone-400 dark:text-stone-500">Sesuai filter saat ini</p>
            </div>
          </button>
          <button
            type="button"
            onClick={() => doExport("")}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors text-left"
          >
            <Download className="w-4 h-4 text-stone-400 dark:text-stone-500" />
            <div>
              <p className="font-medium">Export semua data</p>
              <p className="text-[11px] text-stone-400 dark:text-stone-500">Semua transaksi tanpa filter</p>
            </div>
          </button>
        </div>
      )}
    </div>
  );
}
