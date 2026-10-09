export type PropertyOfferType = "SALE" | "RENT" | "LEASE";

export type PropertyListing = {
  id: string;
  slug: string;
  title: string;
  description: string;
  price: number;
  location: string;
  category: string;
  offerTypes: PropertyOfferType[];
  bedrooms: number;
  bathrooms: number;
  sizeSqm?: number | null;
  images: string[];
  features: string[];
  status: string;
  featured: boolean;
  createdAt?: string;
};

export type PropertyForm = Omit<PropertyListing, "id" | "createdAt">;
