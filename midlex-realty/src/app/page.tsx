"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  KeyRound,
  MapPin,
  Search,
  ShieldCheck,
  SlidersHorizontal,
} from "lucide-react";
import PropertyCard from "@/components/PropertyCard";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { getProperties } from "@/lib/api";
import { PropertyListing } from "@/lib/types";

export default function RealtyMarketplace() {
  const [properties, setProperties] = useState<PropertyListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [purpose, setPurpose] = useState("ALL");
  const [category, setCategory] = useState("ALL");
  const [location, setLocation] = useState("ALL");
  const [price, setPrice] = useState("ALL");

  useEffect(() => {
    getProperties()
      .then(setProperties)
      .finally(() => setLoading(false));
  }, []);

  const locations = useMemo(
    () => Array.from(new Set(properties.map((item) => item.location))),
    [properties],
  );
  const filtered = useMemo(
    () =>
      properties.filter((property) => {
        const text =
          `${property.title} ${property.location} ${property.description}`.toLowerCase();
        if (query && !text.includes(query.toLowerCase())) return false;
        if (
          purpose !== "ALL" &&
          !property.offerTypes.includes(purpose as "SALE" | "RENT" | "LEASE")
        )
          return false;
        if (category !== "ALL" && property.category !== category) return false;
        if (location !== "ALL" && property.location !== location) return false;
        if (price === "UNDER_100" && property.price >= 100000000) return false;
        if (
          price === "100_250" &&
          (property.price < 100000000 || property.price > 250000000)
        )
          return false;
        if (price === "ABOVE_250" && property.price <= 250000000) return false;
        return true;
      }),
    [properties, query, purpose, category, location, price],
  );

  return (
    <div className="min-h-screen bg-[#fffdf7]">
      <SiteHeader />
      <main>
        <section className="relative isolate overflow-hidden bg-[#052f1c] text-white">
          <img
            src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2000&q=88"
            alt="Luxury Midlex property"
            className="absolute inset-0 -z-20 h-full w-full object-cover opacity-30"
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#042d1a] via-[#073d22]/95 to-[#073d22]/45" />
          <div className="mx-auto grid min-h-[690px] max-w-7xl items-center gap-12 px-5 py-20 lg:grid-cols-[1.12fr_.88fr] lg:px-8">
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#ddb849]/40 bg-[#ddb849]/10 px-4 py-2 text-xs font-black uppercase tracking-[.18em] text-[#f2d77d]">
                <ShieldCheck size={16} /> Legally verified property marketplace
              </span>
              <h1 className="mt-7 text-5xl font-black leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
                Find a property worth{" "}
                <span className="text-[#ddb849]">calling yours.</span>
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-7 text-emerald-50/75 sm:text-lg">
                Browse verified homes, development land and commercial
                investments. Save your favourites, compare options and request
                an inspection with legal support built in.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#marketplace"
                  className="flex items-center gap-2 rounded-xl bg-[#ddb849] px-6 py-4 text-sm font-black text-[#073d22] hover:bg-[#efca60]"
                >
                  Browse properties <ArrowRight size={18} />
                </a>
                <Link
                  href="/contact"
                  className="rounded-xl border border-white/25 bg-white/10 px-6 py-4 text-sm font-black text-white hover:bg-white/15"
                >
                  Speak with an adviser
                </Link>
              </div>
              <div className="mt-10 flex flex-wrap gap-7 text-xs font-bold text-emerald-100/70">
                <span className="flex items-center gap-2">
                  <CheckCircle2 size={17} className="text-[#ddb849]" /> Title
                  checks
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle2 size={17} className="text-[#ddb849]" />{" "}
                  Inspection support
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle2 size={17} className="text-[#ddb849]" />{" "}
                  Conveyancing
                </span>
              </div>
            </div>
            <div className="rounded-[32px] border border-white/15 bg-white/10 p-5 shadow-2xl backdrop-blur-xl sm:p-7">
              <p className="text-xs font-black uppercase tracking-[.18em] text-[#f2d77d]">
                Start your search
              </p>
              <h2 className="mt-2 text-2xl font-black">
                What are you looking for?
              </h2>
              <div className="mt-6 space-y-3">
                <label className="flex items-center gap-3 rounded-xl bg-white p-4 text-slate-700">
                  <Search size={19} className="text-[#a87835]" />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Property, estate or location"
                    className="w-full border-0 bg-transparent text-sm outline-none"
                  />
                </label>
                <select
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  className="w-full rounded-xl bg-white p-4 text-sm font-bold text-slate-700"
                >
                  <option value="ALL">Buy, rent or lease</option>
                  <option value="SALE">Properties to buy</option>
                  <option value="RENT">Properties to rent</option>
                  <option value="LEASE">Properties to lease</option>
                </select>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-xl bg-white p-4 text-sm font-bold text-slate-700"
                >
                  <option value="ALL">All property types</option>
                  <option value="RESIDENTIAL">Residential homes</option>
                  <option value="LUXURY">Luxury properties</option>
                  <option value="LAND">Land and plots</option>
                  <option value="COMMERCIAL">Commercial property</option>
                </select>
                <select
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full rounded-xl bg-white p-4 text-sm font-bold text-slate-700"
                >
                  <option value="ALL">Any budget</option>
                  <option value="UNDER_100">Under ₦100 million</option>
                  <option value="100_250">₦100m – ₦250m</option>
                  <option value="ABOVE_250">Above ₦250 million</option>
                </select>
                <a
                  href="#marketplace"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#ddb849] p-4 text-sm font-black text-[#073d22]"
                >
                  Show {filtered.length || properties.length} properties{" "}
                  <ArrowRight size={17} />
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-emerald-950/10 bg-white">
          <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-emerald-950/10 px-5 py-7 md:grid-cols-4">
            <div className="px-5">
              <p className="text-2xl font-black text-[#073d22]">100%</p>
              <p className="text-xs font-bold text-slate-500">
                Legal-first process
              </p>
            </div>
            <div className="px-5">
              <p className="text-2xl font-black text-[#073d22]">24–48h</p>
              <p className="text-xs font-bold text-slate-500">
                Inspection scheduling
              </p>
            </div>
            <div className="px-5">
              <p className="text-2xl font-black text-[#073d22]">Edo+</p>
              <p className="text-xs font-bold text-slate-500">
                Growing coverage
              </p>
            </div>
            <div className="px-5">
              <p className="text-2xl font-black text-[#073d22]">End-to-end</p>
              <p className="text-xs font-bold text-slate-500">
                Legal conveyancing
              </p>
            </div>
          </div>
        </section>

        <section
          id="marketplace"
          className="mx-auto max-w-7xl px-5 py-20 lg:px-8"
        >
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="text-xs font-black uppercase tracking-[.2em] text-[#a87835]">
                Property marketplace
              </p>
              <h2 className="mt-2 text-4xl font-black tracking-tight text-[#073d22]">
                Properties selected for you
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500">
                Open a listing to see the complete image gallery,
                specifications, documents and inspection options.
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-emerald-950/10 bg-white px-4 py-2 text-xs font-bold text-slate-500">
              <SlidersHorizontal size={15} /> {filtered.length} results
            </div>
          </div>
          <div className="mt-8 grid gap-3 rounded-2xl border border-emerald-950/10 bg-white p-3 md:grid-cols-2 xl:grid-cols-[1fr_190px_190px_190px]">
            <label className="flex items-center gap-3 rounded-xl bg-slate-50 px-4">
              <Search size={17} className="text-[#a87835]" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-transparent py-3 text-sm outline-none"
                placeholder="Search listings"
              />
            </label>
            <select
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="rounded-xl bg-slate-50 px-4 py-3 text-sm font-bold"
            >
              <option value="ALL">All purposes</option>
              <option value="SALE">For sale</option>
              <option value="RENT">For rent</option>
              <option value="LEASE">For lease</option>
            </select>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="rounded-xl bg-slate-50 px-4 py-3 text-sm font-bold"
            >
              <option value="ALL">All locations</option>
              {locations.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="rounded-xl bg-slate-50 px-4 py-3 text-sm font-bold"
            >
              <option value="ALL">All types</option>
              <option value="RESIDENTIAL">Residential</option>
              <option value="LUXURY">Luxury</option>
              <option value="LAND">Land</option>
              <option value="COMMERCIAL">Commercial</option>
            </select>
          </div>
          {loading ? (
            <div className="mt-10 grid gap-7 md:grid-cols-2 xl:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div
                  key={item}
                  className="h-[480px] animate-pulse rounded-[28px] bg-emerald-950/5"
                />
              ))}
            </div>
          ) : filtered.length ? (
            <div className="mt-10 grid gap-7 md:grid-cols-2 xl:grid-cols-3">
              {filtered.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div className="mt-10 rounded-[28px] border border-dashed border-emerald-900/20 bg-white p-14 text-center">
              <Search className="mx-auto text-[#a87835]" />
              <h3 className="mt-4 text-xl font-black text-[#073d22]">
                No matching property yet
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                Try another filter or ask us to source a property for you.
              </p>
              <Link
                href="/contact"
                className="mt-5 inline-block rounded-xl bg-[#073d22] px-5 py-3 text-xs font-black text-white"
              >
                Send a property brief
              </Link>
            </div>
          )}
        </section>

        <section id="services" className="bg-[#edf4ee] py-20">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <div className="text-center">
              <p className="text-xs font-black uppercase tracking-[.2em] text-[#a87835]">
                More than a listing website
              </p>
              <h2 className="mt-3 text-4xl font-black text-[#073d22]">
                Property, protected by legal expertise
              </h2>
            </div>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {[
                [
                  Building2,
                  "Sales and acquisitions",
                  "Property sourcing, verified listings, negotiation and transaction support.",
                ],
                [
                  KeyRound,
                  "Property management",
                  "Tenant screening, leasing, rent administration and maintenance coordination.",
                ],
                [
                  ShieldCheck,
                  "Title and conveyancing",
                  "Registry searches, deed drafting, perfection and transaction due diligence.",
                ],
              ].map(([Icon, title, text]) => {
                const C = Icon as typeof Building2;
                return (
                  <div
                    key={String(title)}
                    className="rounded-[28px] border border-emerald-950/10 bg-white p-8"
                  >
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#073d22] text-[#ddb849]">
                      <C />
                    </div>
                    <h3 className="mt-6 text-xl font-black text-[#073d22]">
                      {String(title)}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-slate-500">
                      {String(text)}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
          <div className="overflow-hidden rounded-[36px] bg-[#073d22] p-8 text-white sm:p-12">
            <div className="grid items-center gap-8 lg:grid-cols-[1fr_auto]">
              <div>
                <p className="text-xs font-black uppercase tracking-[.2em] text-[#ddb849]">
                  Can’t find the right property?
                </p>
                <h2 className="mt-3 max-w-2xl text-3xl font-black sm:text-4xl">
                  Tell us your budget, preferred area and property type.
                </h2>
                <p className="mt-4 max-w-xl text-sm leading-6 text-emerald-100/70">
                  Our Realty team will source suitable options and coordinate
                  title checks and inspections.
                </p>
              </div>
              <Link
                href="/contact"
                className="rounded-xl bg-[#ddb849] px-7 py-4 text-center text-sm font-black text-[#073d22]"
              >
                Submit your property brief
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
