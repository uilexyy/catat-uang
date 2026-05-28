export function formatRupiah(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDate(dateStr: string): string {
  const clean = dateStr.includes("T") ? dateStr.split("T")[0] : dateStr;
  return new Date(clean + "T00:00:00").toLocaleString("id", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
