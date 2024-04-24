import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatMoney(
  amount: number,
  locale = "en-US",
  customCurrency = "₦"
) {
  const formatter = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "USD",
  });
  const parts = formatter.formatToParts(amount);
  const currencySymbolIndex = parts.findIndex(
    (part) => part.type === "currency"
  );
  if (currencySymbolIndex !== -1) {
    parts[currencySymbolIndex].value = customCurrency;
  }
  return parts.map((part) => part.value).join("");
}

export const getDueDate = (dateToRetireAdvance: Date) =>
  (new Date(dateToRetireAdvance.toLocaleDateString("en-US")).getTime() -
    new Date(new Date().toLocaleDateString("en-US")).getTime()) /
  86_400_000;
