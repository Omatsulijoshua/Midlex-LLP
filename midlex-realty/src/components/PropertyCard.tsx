"use client";

import Link from "next/link";
import { Bath, BedDouble, Heart, MapPin, Maximize2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/api";
import { PropertyListing } from "@/lib/types";

export default function PropertyCard({
  property,
}: {
  property: PropertyListing;
}) {
  const { add, remove, contains } = useCart();
  const saved = contains(property.id);
  return (
    <article className="group overflow-hidden rounded-[28px] border border-emerald-950/10 bg-white shadow-[0_18px_50px_rgba(5,55,31,.08)] transition hover:-translate-y-1">
      <div className="relative h-64 overflow-hidden bg-slate-100">
        <img
          src={property.images[0]}
          alt={property.title}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
        />
        <div className="absolute left-4 top-4 flex gap-2">
          {(property.offerTypes?.length ? property.offerTypes : ["SALE"]).map(
            (type) => (
              <span
                key={type}
                className="rounded-full bg-[#ddb849] px-3 py-1 text-[10px] font-black text-[#073d22]"
              >
                {type === "SALE"
                  ? "For sale"
                  : type === "RENT"
                    ? "For rent"
                    : "For lease"}
              </span>
            ),
          )}
          <span className="rounded-full bg-white/95 px-3 py-1 text-[10px] font-black uppercase text-[#073d22]">
            {property.category}
          </span>
          {property.featured && (
            <span className="rounded-full bg-[#073d22] px-3 py-1 text-[10px] font-black text-white">
              Featured
            </span>
          )}
        </div>
        <button
          onClick={() => (saved ? remove(property.id) : add(property))}
          className={`absolute right-4 top-4 rounded-full p-3 shadow-lg ${saved ? "bg-[#073d22] text-[#ddb849]" : "bg-white/95 text-[#073d22]"}`}
        >
          <Heart size={18} fill={saved ? "currentColor" : "none"} />
        </button>
      </div>
      <div className="p-6">
        <p className="flex items-center gap-1 text-xs font-bold text-slate-500">
          <MapPin size={14} className="text-[#b78e2d]" /> {property.location}
        </p>
        <Link href={`/properties/${property.slug}`}>
          <h3 className="mt-3 text-xl font-black leading-tight text-[#073d22] group-hover:text-[#a87835]">
            {property.title}
          </h3>
        </Link>
        <p className="mt-3 text-2xl font-black text-[#073d22]">
          {formatPrice(property.price)}
        </p>
        <div className="mt-5 flex flex-wrap gap-4 border-t border-slate-100 pt-4 text-xs font-bold text-slate-500">
          {property.bedrooms > 0 && (
            <span className="flex items-center gap-1">
              <BedDouble size={16} /> {property.bedrooms} beds
            </span>
          )}
          {property.bathrooms > 0 && (
            <span className="flex items-center gap-1">
              <Bath size={16} /> {property.bathrooms} baths
            </span>
          )}
          {property.sizeSqm && (
            <span className="flex items-center gap-1">
              <Maximize2 size={16} /> {property.sizeSqm.toLocaleString()} sqm
            </span>
          )}
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <Link
            href={`/properties/${property.slug}`}
            className="rounded-xl border border-emerald-900/15 px-4 py-3 text-center text-xs font-black text-[#073d22] hover:bg-emerald-50"
          >
            View details
          </Link>
          <button
            onClick={() => (saved ? remove(property.id) : add(property))}
            className="rounded-xl bg-[#073d22] px-4 py-3 text-xs font-black text-white hover:bg-[#0a5c33]"
          >
            {saved ? "Saved ✓" : "Add to saved"}
          </button>
        </div>
      </div>
    </article>
  );
}
