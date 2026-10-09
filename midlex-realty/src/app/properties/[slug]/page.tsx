"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Bath,
  BedDouble,
  Check,
  Heart,
  MapPin,
  Maximize2,
  Phone,
  ShieldCheck,
} from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { useCart } from "@/context/CartContext";
import { formatPrice, getProperty } from "@/lib/api";
import { PropertyListing } from "@/lib/types";

export default function PropertyDetailsPage() {
  const { slug } = useParams<{ slug: string }>();
  const [property, setProperty] = useState<PropertyListing | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const { add, remove, contains } = useCart();
  useEffect(() => {
    getProperty(slug)
      .then(setProperty)
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading)
    return (
      <>
        <SiteHeader />
        <div className="mx-auto min-h-[70vh] max-w-7xl animate-pulse px-5 py-12">
          <div className="h-[550px] rounded-[32px] bg-emerald-950/5" />
        </div>
        <SiteFooter />
      </>
    );
  if (!property)
    return (
      <>
        <SiteHeader />
        <main className="mx-auto min-h-[65vh] max-w-4xl px-5 py-24 text-center">
          <h1 className="text-3xl font-black text-[#073d22]">
            Property not found
          </h1>
          <Link
            href="/#marketplace"
            className="mt-6 inline-block rounded-xl bg-[#073d22] px-6 py-3 font-bold text-white"
          >
            Return to marketplace
          </Link>
        </main>
        <SiteFooter />
      </>
    );
  const saved = contains(property.id);
  const images = property.images.length
    ? property.images
    : [
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85",
      ];

  return (
    <div className="min-h-screen bg-[#fffdf7]">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
        <Link
          href="/#marketplace"
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-[#073d22]"
        >
          <ArrowLeft size={17} /> Back to marketplace
        </Link>
        <div className="mt-7 grid gap-4 lg:grid-cols-[1fr_260px]">
          <button
            className="relative h-[520px] overflow-hidden rounded-[30px] bg-slate-100"
            onClick={() => setActiveImage((activeImage + 1) % images.length)}
          >
            <img
              src={images[activeImage]}
              alt={`${property.title} view ${activeImage + 1}`}
              className="h-full w-full object-cover"
            />
            <span className="absolute bottom-4 right-4 rounded-full bg-black/65 px-4 py-2 text-xs font-bold text-white">
              {activeImage + 1} / {images.length} · Click for next
            </span>
          </button>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-1">
            {images.slice(0, 4).map((image, index) => (
              <button
                key={image}
                onClick={() => setActiveImage(index)}
                className={`h-32 overflow-hidden rounded-2xl border-2 lg:h-[122px] ${index === activeImage ? "border-[#ddb849]" : "border-transparent"}`}
              >
                <img
                  src={image}
                  alt="Property gallery"
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_380px]">
          <div>
            <div className="flex flex-wrap gap-2">
              {(property.offerTypes?.length
                ? property.offerTypes
                : ["SALE"]
              ).map((type) => (
                <span
                  key={type}
                  className="rounded-full bg-[#ddb849]/25 px-3 py-1 text-[10px] font-black uppercase text-[#8a6428]"
                >
                  {type === "SALE"
                    ? "For sale"
                    : type === "RENT"
                      ? "For rent"
                      : "For lease"}
                </span>
              ))}
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-[10px] font-black uppercase text-[#073d22]">
                {property.category}
              </span>
              <span className="rounded-full bg-[#ddb849]/20 px-3 py-1 text-[10px] font-black uppercase text-[#8a6428]">
                {property.status}
              </span>
            </div>
            <h1 className="mt-4 text-4xl font-black leading-tight text-[#073d22]">
              {property.title}
            </h1>
            <p className="mt-3 flex items-center gap-2 text-sm font-bold text-slate-500">
              <MapPin size={17} className="text-[#a87835]" />{" "}
              {property.location}
            </p>
            <div className="mt-7 flex flex-wrap gap-6 rounded-2xl border border-emerald-950/10 bg-white p-5 text-sm font-bold text-slate-600">
              {property.bedrooms > 0 && (
                <span className="flex items-center gap-2">
                  <BedDouble className="text-[#a87835]" /> {property.bedrooms}{" "}
                  bedrooms
                </span>
              )}
              {property.bathrooms > 0 && (
                <span className="flex items-center gap-2">
                  <Bath className="text-[#a87835]" /> {property.bathrooms}{" "}
                  bathrooms
                </span>
              )}
              {property.sizeSqm && (
                <span className="flex items-center gap-2">
                  <Maximize2 className="text-[#a87835]" />{" "}
                  {property.sizeSqm.toLocaleString()} sqm
                </span>
              )}
            </div>
            <section className="mt-9">
              <h2 className="text-2xl font-black text-[#073d22]">
                About this property
              </h2>
              <p className="mt-4 text-base leading-7 text-slate-600">
                {property.description}
              </p>
            </section>
            <section className="mt-9">
              <h2 className="text-2xl font-black text-[#073d22]">
                Features and documents
              </h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {property.features.map((feature) => (
                  <p
                    key={feature}
                    className="flex items-center gap-3 rounded-xl bg-emerald-50 p-4 text-sm font-bold text-[#174c31]"
                  >
                    <Check size={17} className="text-[#a87835]" /> {feature}
                  </p>
                ))}
              </div>
            </section>
            <div className="mt-9 rounded-2xl border border-[#ddb849]/30 bg-[#fff8df] p-6">
              <div className="flex gap-4">
                <ShieldCheck className="shrink-0 text-[#a87835]" />
                <div>
                  <h3 className="font-black text-[#073d22]">
                    Legal verification support
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Midlex can coordinate registry searches, document review,
                    deed drafting and transaction perfection. Buyers should
                    complete independent due diligence before payment.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <aside className="h-fit rounded-[28px] border border-emerald-950/10 bg-white p-7 shadow-xl lg:sticky lg:top-28">
            <p className="text-xs font-black uppercase tracking-[.18em] text-[#a87835]">
              Asking price
            </p>
            <p className="mt-2 text-3xl font-black text-[#073d22]">
              {formatPrice(property.price)}
            </p>
            <p className="mt-2 text-xs text-slate-500">
              Subject to offer and executed contract.
            </p>
            <button
              onClick={() => (saved ? remove(property.id) : add(property))}
              className={`mt-6 flex w-full items-center justify-center gap-2 rounded-xl px-5 py-4 text-sm font-black ${saved ? "border border-[#073d22] bg-emerald-50 text-[#073d22]" : "bg-[#073d22] text-white"}`}
            >
              <Heart size={18} fill={saved ? "currentColor" : "none"} />{" "}
              {saved ? "Saved to shortlist" : "Add to saved properties"}
            </button>
            <Link
              href={`/contact?property=${encodeURIComponent(property.title)}`}
              className="mt-3 block rounded-xl bg-[#ddb849] px-5 py-4 text-center text-sm font-black text-[#073d22]"
            >
              Request inspection
            </Link>
            <a
              href="tel:+2348158075936"
              className="mt-3 flex items-center justify-center gap-2 rounded-xl border border-emerald-950/10 px-5 py-4 text-sm font-black text-[#073d22]"
            >
              <Phone size={17} /> Call Realty team
            </a>
            <div className="mt-6 border-t border-slate-100 pt-5 text-xs leading-5 text-slate-500">
              <p className="font-black text-[#073d22]">Property reference</p>
              <p className="mt-1 uppercase">{property.slug}</p>
            </div>
          </aside>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
