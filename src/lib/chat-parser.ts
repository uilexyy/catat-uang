export interface ParsedChat {
  type: "income" | "expense";
  amount: number;
  category: string;
  description: string;
  date: string;
}

const expenseKeywords: Record<string, string[]> = {
  Makanan: [
    "makan", "minum", "kopi", "nasi", "mie", "mi ", "ayam", "soto", "sate",
    "bakso", "gorengan", "jajan", "cemilan", "restoran", "warteg", "kafe",
    "gofood", "grab food", "shopeefood", "makanan", "sarapan", "makan siang",
    "makan malam", "catering", "boba", "teh", "jus",
  ],
  Transport: [
    "bensin", "solar", "bbm", "tol", "parkir", "taksi", "grab", "gojek",
    "angkot", "bus", "krl", "mrt", "lrt", "ojek", "transport", "bahan bakar",
    "premi", "pertalite", "pertamax",
  ],
  Belanja: [
    "belanja", "alfamart", "indomaret", "supermarket", "minimarket",
    "pasar", "sembako", "baju", "sepatu", "tas", "kosmetik", "skincare",
    "fashion", "pakaian", "deterjen", "shampoo", "sabun",
  ],
  Hiburan: [
    "nonton", "film", "bioskop", "game", "steam", "netflix", "spotify",
    "youtube", "musik", "hobi", "liburan", "wisata", "tiket", "konser",
    "playstation", "ps", "mobile legend", "pubg", "voucher game",
  ],
  Tagihan: [
    "listrik", "air", "pdam", "bpjs", "pajak", "pulsa", "paket data",
    "wifi", "indihome", "telkom", "asuransi", "cicilan", "kpr", "kredit",
    "tagihan", "bayar listrik", "bayar air",
  ],
  Kesehatan: [
    "dokter", "klinik", "rumah sakit", "obat", "apotek", "vitamin",
    "berobat", "checkup", "lab", "kesehatan",
  ],
  Pendidikan: [
    "kursus", "les", "bimbel", "buku", "kuliah", "spp", "uang sekolah",
    "belajar", "privat", "tugas", "skripsi",
  ],
};

const incomeKeywords: Record<string, string[]> = {
  Gaji: ["gaji", "honor", "upah", "pendapatan", "penghasilan"],
  Freelance: ["freelance", "proyek", "project", "orderan", "job"],
  Investasi: ["investasi", "saham", "reksadana", "dividen", "crypto", "kripto"],
  Hadiah: ["hadiah", "kado", "doorprize", "rejeki", "rezeki"],
  Lainnya: ["transfer", "kiriman", "bonus", "thr", "hasil", "dapat"],
};

function parseNumber(text: string): number | null {
  const cleaned = text
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/rp\s*/gi, "")
    .replace(/,/g, ".")
    .trim();

  if (!cleaned) return null;

  const withSuffix = /(\d+(?:\.\d+)?)\s*(rb|ribu|k\b|jt|juta|jtan)\b/i;
  const m = withSuffix.exec(cleaned);
  if (m) {
    const base = parseFloat(m[1]);
    const suffix = m[2].toLowerCase();
    if (suffix === "rb" || suffix === "ribu" || suffix === "k") return base * 1000;
    if (suffix === "jt" || suffix === "juta" || suffix === "jtan") return base * 1000000;
  }

  const threeDigitBlock = cleaned.match(/(\d{1,3}(?:\.\d{3})+(?:\.\d{1,2})?)/);
  if (threeDigitBlock) {
    const raw = threeDigitBlock[1];
    const afterLastDot = raw.split(".").pop()!;
    if (afterLastDot.length === 3) {
      return parseInt(raw.replace(/\./g, ""), 10);
    }
  }

  const plainNum = cleaned.match(/(\d+(?:\.\d+)?)/);
  if (plainNum) {
    return parseFloat(plainNum[1]);
  }

  if (/(?:ratus|ratusan)\s*ribu/i.test(cleaned)) return 100000;
  if (/\bgocap\b/i.test(cleaned)) return 50;
  if (/\bgopek\b/i.test(cleaned)) return 100;
  if (/\bcepek\b/i.test(cleaned)) return 100;
  if (/\bban\b/i.test(cleaned)) return 10000;

  return null;
}

function parseDate(text: string): string {
  const today = new Date();
  const lower = text.toLowerCase();

  if (/\bkemarin\b/.test(lower)) {
    const d = new Date(today);
    d.setDate(d.getDate() - 1);
    return d.toISOString().split("T")[0];
  }

  if (/\b(tadi|lusa|besok)\b/.test(lower)) return today.toISOString().split("T")[0];

  const dateMatch = text.match(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})/);
  if (dateMatch) {
    const d = dateMatch[1].padStart(2, "0");
    const m = dateMatch[2].padStart(2, "0");
    let y = dateMatch[3];
    y = y.length === 2 ? `20${y}` : y;
    return `${y}-${m}-${d}`;
  }

  return today.toISOString().split("T")[0];
}

function matchCategory(
  text: string,
  keywords: Record<string, string[]>,
): string | null {
  const lower = text.toLowerCase();
  for (const [cat, words] of Object.entries(keywords)) {
    for (const word of words) {
      if (lower.includes(word)) return cat;
    }
  }
  return null;
}

function isExpenseIndicators(text: string): boolean | null {
  const lower = text.toLowerCase();
  const expenseVerbs = [
    "beli", "bayar", "belanja", "makan", "minum", "nonton", "iseng",
    "keluar", "keluarin", "habis", "tambah", "isi", "ngopi",
  ];
  const incomeVerbs = [
    "gaji", "masuk", "terima", "transfer", "kirim", "dapat", "hasil",
    "honor", "freelance", "bonus", "thr", "pendapatan",
    "nerima", "masukin", "top up", "topup", "deposit",
  ];

  for (const v of expenseVerbs) {
    if (new RegExp(`\\b${v}\\b`).test(lower)) return true;
  }
  for (const v of incomeVerbs) {
    if (new RegExp(`\\b${v}\\b`).test(lower)) return false;
  }

  return null;
}

export function parseChatMessage(message: string): ParsedChat | null {
  const text = message.trim();
  if (!text) return null;

  const amount = parseNumber(text);
  if (!amount || amount <= 0) return null;

  const date = parseDate(text);

  const typeHint = isExpenseIndicators(text);
  const isIncome =
    typeHint === false ||
    (typeHint === null &&
      (!!matchCategory(text, incomeKeywords) ||
        /\b(gaji|honor|masuk|pendapatan|freelance)\b/i.test(text)));

  const type: "income" | "expense" = isIncome ? "income" : "expense";

  let category: string;
  if (type === "expense") {
    category = matchCategory(text, expenseKeywords) || "Lainnya";
  } else {
    category = matchCategory(text, incomeKeywords) || "Lainnya";
  }

  const cleanDesc = text
    .replace(/\brp\b/gi, "")
    .replace(/\b(?:hari ini|kemarin|tadi|besok)\b/gi, "")
    .replace(/\d{1,2}[\-\/]\d{1,2}[\-\/]\d{2,4}/g, "")
    .replace(/\d+(?:[\.\,]\d+)*(?:\s*(?:rb|ribu|k|jt|juta|ratus))?/gi, "")
    .replace(/\s+/g, " ")
    .replace(/\brp\b/gi, "")
    .trim();

  const description = cleanDesc || text;

  return { type, amount, category, description, date };
}
