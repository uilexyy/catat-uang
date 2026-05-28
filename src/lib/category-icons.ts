const icons: Record<string, string> = {
  Gaji: "💼",
  Freelance: "💻",
  Investasi: "📈",
  Hadiah: "🎁",
  Makanan: "🍔",
  Transport: "🚗",
  Belanja: "🛒",
  Hiburan: "🎬",
  Tagihan: "💡",
  Kesehatan: "💊",
  Pendidikan: "📚",
  Lainnya: "📌",
};

const defaultIcon = "📄";

export function getCategoryIcon(category: string): string {
  return icons[category] || defaultIcon;
}
