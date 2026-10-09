import { PropertyListing } from "./types";
import { starterProperties } from "@/data/properties";

export const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"
).replace(/\/$/, "");

const normalizeProperty = (property: PropertyListing): PropertyListing => ({
  ...property,
  offerTypes: property.offerTypes?.length ? property.offerTypes : ["SALE"],
});

export async function getProperties(): Promise<PropertyListing[]> {
  try {
    const response = await fetch(`${API_URL}/realty/properties`, {
      cache: "no-store",
    });
    if (!response.ok) throw new Error("Property catalogue unavailable");
    const data = await response.json();
    return Array.isArray(data) && data.length
      ? data.map(normalizeProperty)
      : starterProperties;
  } catch {
    return starterProperties;
  }
}

export async function getProperty(
  slug: string,
): Promise<PropertyListing | null> {
  try {
    const response = await fetch(
      `${API_URL}/realty/properties/${encodeURIComponent(slug)}`,
      { cache: "no-store" },
    );
    if (response.ok) return normalizeProperty(await response.json());
  } catch {}
  return starterProperties.find((property) => property.slug === slug) || null;
}

export async function submitInquiry(payload: {
  name: string;
  email: string;
  phone?: string;
  serviceNeeded: string;
  message: string;
}) {
  const response = await fetch(`${API_URL}/public/inquiries`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.message || "Your request could not be submitted.");
  }
  return response.json();
}

export function formatPrice(price: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(price);
}
