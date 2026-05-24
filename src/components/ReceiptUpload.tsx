"use client";

import { useState, useRef } from "react";
import { createWorker } from "tesseract.js";
import { Upload, Loader2, CheckCircle2, AlertCircle, X } from "lucide-react";

interface ParsedReceipt {
  amount: number | null;
  date: string | null;
  storeName: string | null;
  rawText: string;
}

interface ReceiptUploadProps {
  onDataExtracted: (data: ParsedReceipt) => void;
  onClear: () => void;
}

function parseReceiptText(text: string): ParsedReceipt {
  const lines = text.split("\n").filter(Boolean);
  const lower = text.toLowerCase();

  let amount: number | null = null;
  let date: string | null = null;
  let storeName: string | null = null;

  const amountRegex = /(?:total|jumlah|rp|grand\s*total)\s*:?\s*(?:rp\.?\s*)?([\d.,]+)/gi;
  let match;
  while ((match = amountRegex.exec(lower)) !== null) {
    const num = parseFloat(match[1].replace(/\./g, "").replace(",", "."));
    if (!isNaN(num) && num > 0) {
      amount = num;
    }
  }

  if (!amount) {
    const allNumbers = text.match(/(?:rp\.?\s*)?([\d.,]+)\s*(?:rp\.?\s*)?/gi);
    if (allNumbers) {
      const candidates = allNumbers
        .map((n) => parseFloat(n.replace(/[^\d,]/g, "").replace(/\./g, "").replace(",", ".")))
        .filter((n) => !isNaN(n) && n > 0);
      if (candidates.length > 0) {
        amount = Math.max(...candidates);
      }
    }
  }

  const dateRegex = /(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})/g;
  const dateMatch = dateRegex.exec(text);
  if (dateMatch) {
    const d = dateMatch[1].padStart(2, "0");
    const m = dateMatch[2].padStart(2, "0");
    let y = dateMatch[3];
    y = y.length === 2 ? `20${y}` : y;
    date = `${y}-${m}-${d}`;
  }

  storeName = lines[0]?.trim() || null;

  return { amount, date, storeName, rawText: text };
}

export default function ReceiptUpload({ onDataExtracted, onClear }: ReceiptUploadProps) {
  const [image, setImage] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "processing" | "done" | "error">("idle");
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    if (!file.type.startsWith("image/")) {
      setErrorMsg("File harus berupa gambar");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result as string);
    };
    reader.readAsDataURL(file);

    setStatus("processing");
    setProgress(0);
    setErrorMsg("");

    try {
      const worker = await createWorker("ind", 1, {
        logger: (m) => {
          if (m.status === "recognizing text") {
            setProgress(Math.round(m.progress * 100));
          }
        },
      });

      const { data } = await worker.recognize(file);
      await worker.terminate();

      const parsed = parseReceiptText(data.text);
      setStatus("done");
      onDataExtracted(parsed);
    } catch {
      setStatus("error");
      setErrorMsg("Gagal membaca struk. Coba upload ulang atau isi manual.");
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  function handleReset() {
    setImage(null);
    setStatus("idle");
    setProgress(0);
    setErrorMsg("");
    onClear();
  }

  if (status === "processing") {
    return (
      <div className="flex flex-col items-center gap-3 py-8 animate-fade-in">
        <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center">
          <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-stone-600">Membaca struk...</p>
          <p className="text-xs text-stone-400 mt-0.5">{progress}%</p>
        </div>
        <div className="w-48 h-1.5 bg-stone-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    );
  }

  return (
    <div>
      {!image ? (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => inputRef.current?.click()}
          className="border-2 border-dashed border-stone-200 rounded-2xl p-6 text-center cursor-pointer hover:border-blue-300 hover:bg-blue-50/30 transition-all duration-200 group"
        >
          <div className="w-12 h-12 rounded-xl bg-stone-100 group-hover:bg-blue-100 flex items-center justify-center mx-auto mb-3 transition-colors duration-200">
            <Upload className="w-5 h-5 text-stone-400 group-hover:text-blue-500 transition-colors duration-200" />
          </div>
          <p className="text-sm font-medium text-stone-500 group-hover:text-blue-600 transition-colors duration-200">
            Upload foto struk
          </p>
          <p className="text-xs text-stone-400 mt-1">atau klik untuk memilih file</p>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
          />
        </div>
      ) : (
        <div className="relative rounded-2xl overflow-hidden border border-stone-200 animate-fade-in">
          <img src={image} alt="Struk" className="w-full max-h-48 object-contain bg-stone-50" />
          <button
            type="button"
            onClick={handleReset}
            className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-white" />
          </button>
          <div className="absolute bottom-2 left-2">
            {status === "done" ? (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-500/80 text-white text-xs font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Terbaca
              </span>
            ) : status === "error" ? (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-rose-500/80 text-white text-xs font-medium">
                <AlertCircle className="w-3.5 h-3.5" />
                Gagal
              </span>
            ) : null}
          </div>
        </div>
      )}

      {errorMsg && (
        <p className="text-xs text-rose-500 mt-2 flex items-center gap-1">
          <AlertCircle className="w-3.5 h-3.5" />
          {errorMsg}
        </p>
      )}
    </div>
  );
}
