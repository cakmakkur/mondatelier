export default function formatPrice(price: number | null): string {
  if (!price) return "";
  return price.toLocaleString("de-DE", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}
