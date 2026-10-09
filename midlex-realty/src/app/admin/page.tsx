"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Building2,
  Edit3,
  Eye,
  LogOut,
  Plus,
  Search,
  Star,
  Trash2,
  X,
} from "lucide-react";
import { API_URL, formatPrice } from "@/lib/api";
import { starterProperties } from "@/data/properties";
import { PropertyListing } from "@/lib/types";

const emptyForm = {
  title: "",
  slug: "",
  description: "",
  price: "",
  location: "",
  category: "RESIDENTIAL",
  offerTypes: ["SALE"] as string[],
  bedrooms: "0",
  bathrooms: "0",
  sizeSqm: "",
  images: "",
  features: "",
  status: "AVAILABLE",
  featured: false,
};

export default function RealtyAdminDashboard() {
  const router = useRouter();
  const [properties, setProperties] = useState<PropertyListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [modal, setModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const token = () =>
    typeof window !== "undefined"
      ? localStorage.getItem("midlex_realty_admin_token")
      : null;
  const load = useCallback(async () => {
    const auth = token();
    if (!auth) {
      router.replace("/admin/login");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/realty/properties`, {
        cache: "no-store",
      });
      if (!response.ok) throw new Error("Could not load catalogue");
      setProperties(await response.json());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load catalogue");
    } finally {
      setLoading(false);
    }
  }, [router]);
  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(
    () =>
      properties.filter((item) =>
        `${item.title} ${item.location} ${item.category} ${(item.offerTypes || ["SALE"]).join(" ")}`
          .toLowerCase()
          .includes(query.toLowerCase()),
      ),
    [properties, query],
  );
  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setError("");
    setModal(true);
  };
  const openEdit = (property: PropertyListing) => {
    setEditingId(property.id);
    setForm({
      title: property.title,
      slug: property.slug,
      description: property.description,
      price: String(property.price),
      location: property.location,
      category: property.category,
      offerTypes: property.offerTypes?.length ? property.offerTypes : ["SALE"],
      bedrooms: String(property.bedrooms),
      bathrooms: String(property.bathrooms),
      sizeSqm: String(property.sizeSqm || ""),
      images: property.images.join("\n"),
      features: property.features.join("\n"),
      status: property.status,
      featured: property.featured,
    });
    setError("");
    setModal(true);
  };
  const toggleOfferType = (offerType: string) => {
    setForm((current) => ({
      ...current,
      offerTypes: current.offerTypes.includes(offerType)
        ? current.offerTypes.filter((item) => item !== offerType)
        : [...current.offerTypes, offerType],
    }));
  };
  const save = async (event: FormEvent) => {
    event.preventDefault();
    const auth = token();
    if (!auth) return router.push("/admin/login");
    setSaving(true);
    setError("");
    try {
      const response = await fetch(
        `${API_URL}/realty/properties${editingId ? `/${editingId}` : ""}`,
        {
          method: editingId ? "PATCH" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth}`,
          },
          body: JSON.stringify({
            ...form,
            price: Number(form.price),
            bedrooms: Number(form.bedrooms),
            bathrooms: Number(form.bathrooms),
            sizeSqm: form.sizeSqm ? Number(form.sizeSqm) : null,
            images: form.images
              .split(/\r?\n|,/)
              .map((item) => item.trim())
              .filter(Boolean),
            features: form.features
              .split(/\r?\n|,/)
              .map((item) => item.trim())
              .filter(Boolean),
          }),
        },
      );
      const data = await response.json();
      if (!response.ok)
        throw new Error(
          Array.isArray(data?.message)
            ? data.message.join(", ")
            : data?.message || "Could not save listing",
        );
      setModal(false);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save listing");
    } finally {
      setSaving(false);
    }
  };
  const remove = async (id: string) => {
    if (!confirm("Remove this property listing?")) return;
    const response = await fetch(`${API_URL}/realty/properties/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token()}` },
    });
    if (response.ok)
      setProperties((current) => current.filter((item) => item.id !== id));
    else setError("Could not remove listing.");
  };
  const seed = async () => {
    const auth = token();
    if (!auth) return;
    setSaving(true);
    try {
      for (const property of starterProperties) {
        const { id, ...payload } = property;
        await fetch(`${API_URL}/realty/properties`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth}`,
          },
          body: JSON.stringify(payload),
        });
      }
      await load();
    } finally {
      setSaving(false);
    }
  };
  const logout = () => {
    localStorage.removeItem("midlex_realty_admin_token");
    localStorage.removeItem("midlex_realty_admin_user");
    router.replace("/admin/login");
  };

  return (
    <div className="min-h-screen bg-[#f4f7f3]">
      <header className="border-b border-emerald-950/10 bg-white">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 lg:px-8">
          <div className="flex items-center gap-4">
            <Image
              src="/midlex-logo.png"
              alt="Midlex"
              width={145}
              height={50}
              className="h-11 w-auto object-contain"
            />
            <div className="border-l border-slate-200 pl-4">
              <p className="font-black text-[#073d22]">REALTY ADMIN</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#a87835]">
                Property catalogue
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="hidden items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 sm:flex"
            >
              <Eye size={15} /> View website
            </Link>
            <button
              onClick={logout}
              className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-2 text-xs font-bold text-red-700"
            >
              <LogOut size={15} /> Sign out
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="text-xs font-black uppercase tracking-[.2em] text-[#a87835]">
              Inventory management
            </p>
            <h1 className="mt-2 text-4xl font-black text-[#073d22]">
              Property listings
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Create listings, galleries and availability updates.
            </p>
          </div>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 rounded-xl bg-[#073d22] px-6 py-4 text-sm font-black text-white"
          >
            <Plus size={18} /> Add property
          </button>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-4">
          <div className="rounded-2xl bg-white p-5">
            <p className="text-xs font-bold text-slate-400">Total listings</p>
            <p className="mt-2 text-3xl font-black text-[#073d22]">
              {properties.length}
            </p>
          </div>
          <div className="rounded-2xl bg-white p-5">
            <p className="text-xs font-bold text-slate-400">Available</p>
            <p className="mt-2 text-3xl font-black text-[#073d22]">
              {properties.filter((item) => item.status === "AVAILABLE").length}
            </p>
          </div>
          <div className="rounded-2xl bg-white p-5">
            <p className="text-xs font-bold text-slate-400">Featured</p>
            <p className="mt-2 text-3xl font-black text-[#073d22]">
              {properties.filter((item) => item.featured).length}
            </p>
          </div>
          <div className="rounded-2xl bg-white p-5">
            <p className="text-xs font-bold text-slate-400">Sold / reserved</p>
            <p className="mt-2 text-3xl font-black text-[#073d22]">
              {properties.filter((item) => item.status !== "AVAILABLE").length}
            </p>
          </div>
        </div>
        <div className="mt-8 flex items-center gap-3 rounded-2xl bg-white px-5">
          <Search size={18} className="text-[#a87835]" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search catalogue"
            className="w-full border-0 py-4 text-sm outline-none"
          />
        </div>
        {error && !modal && (
          <p className="mt-5 rounded-xl bg-red-50 p-4 text-sm font-bold text-red-700">
            {error}
          </p>
        )}
        {loading ? (
          <div className="mt-8 h-64 animate-pulse rounded-3xl bg-white" />
        ) : properties.length === 0 ? (
          <div className="mt-8 rounded-3xl border border-dashed border-emerald-900/20 bg-white p-14 text-center">
            <Building2 className="mx-auto text-[#a87835]" size={38} />
            <h2 className="mt-4 text-2xl font-black text-[#073d22]">
              Catalogue is ready for listings
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Add properties one by one or load the starter catalogue.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <button
                onClick={openCreate}
                className="rounded-xl bg-[#073d22] px-5 py-3 text-sm font-black text-white"
              >
                Add first property
              </button>
              <button
                onClick={seed}
                disabled={saving}
                className="rounded-xl border border-[#073d22] px-5 py-3 text-sm font-black text-[#073d22]"
              >
                Load starter catalogue
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-8 overflow-hidden rounded-3xl border border-emerald-950/10 bg-white">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left">
                <thead className="bg-[#073d22] text-white">
                  <tr>
                    <th className="p-5 text-xs">PROPERTY</th>
                    <th className="p-5 text-xs">PRICE</th>
                    <th className="p-5 text-xs">TYPE</th>
                    <th className="p-5 text-xs">STATUS</th>
                    <th className="p-5 text-xs">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((property) => (
                    <tr key={property.id}>
                      <td className="p-4">
                        <div className="flex items-center gap-4">
                          <img
                            src={property.images[0]}
                            alt=""
                            className="h-16 w-20 rounded-xl object-cover"
                          />
                          <div>
                            <p className="font-black text-[#073d22]">
                              {property.title}
                            </p>
                            <p className="mt-1 text-xs text-slate-500">
                              {property.location}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-sm font-black text-[#073d22]">
                        {formatPrice(property.price)}
                      </td>
                      <td className="p-4 text-xs font-bold text-slate-600">
                        {property.category}
                        <p className="mt-1 text-[10px] font-black text-[#a87835]">
                          {(property.offerTypes || ["SALE"]).join(" · ")}
                        </p>
                        {property.featured && (
                          <span className="ml-2 text-[#a87835]">
                            <Star
                              size={14}
                              className="inline"
                              fill="currentColor"
                            />
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        <span className="rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-black text-emerald-700">
                          {property.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <Link
                            href={`/properties/${property.slug}`}
                            className="rounded-lg bg-slate-100 p-2 text-slate-600"
                          >
                            <Eye size={16} />
                          </Link>
                          <button
                            onClick={() => openEdit(property)}
                            className="rounded-lg bg-amber-50 p-2 text-[#a87835]"
                          >
                            <Edit3 size={16} />
                          </button>
                          <button
                            onClick={() => remove(property.id)}
                            className="rounded-lg bg-red-50 p-2 text-red-600"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
      {modal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/65 p-4 backdrop-blur-sm">
          <div className="mx-auto my-8 max-w-3xl rounded-[30px] bg-white p-7 sm:p-9">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-[#a87835]">
                  Catalogue editor
                </p>
                <h2 className="mt-1 text-2xl font-black text-[#073d22]">
                  {editingId ? "Edit property" : "Add property"}
                </h2>
              </div>
              <button
                onClick={() => setModal(false)}
                className="rounded-xl bg-slate-100 p-2 text-slate-500"
              >
                <X />
              </button>
            </div>
            <form onSubmit={save} className="mt-7 grid gap-4 sm:grid-cols-2">
              <input
                required
                placeholder="Property title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="rounded-xl border border-slate-200 p-4 text-sm sm:col-span-2"
              />
              <input
                placeholder="URL slug (optional)"
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                className="rounded-xl border border-slate-200 p-4 text-sm"
              />
              <input
                required
                placeholder="Location"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className="rounded-xl border border-slate-200 p-4 text-sm"
              />
              <input
                required
                type="number"
                placeholder="Price in NGN"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="rounded-xl border border-slate-200 p-4 text-sm"
              />
              <fieldset className="rounded-xl border border-slate-200 p-4 sm:col-span-2">
                <legend className="px-2 text-xs font-black uppercase tracking-wider text-[#073d22]">
                  Listing purpose — select all that apply
                </legend>
                <div className="mt-2 grid gap-3 sm:grid-cols-3">
                  {[
                    ["SALE", "For sale / buying"],
                    ["RENT", "For rent"],
                    ["LEASE", "For lease"],
                  ].map(([value, label]) => (
                    <label
                      key={value}
                      className="flex cursor-pointer items-center gap-3 rounded-lg bg-slate-50 p-3 text-sm font-bold text-slate-700"
                    >
                      <input
                        type="checkbox"
                        checked={form.offerTypes.includes(value)}
                        onChange={() => toggleOfferType(value)}
                      />
                      {label}
                    </label>
                  ))}
                </div>
                {!form.offerTypes.length && (
                  <p className="mt-2 text-xs font-bold text-red-600">
                    Select at least one listing purpose.
                  </p>
                )}
              </fieldset>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="rounded-xl border border-slate-200 p-4 text-sm font-bold"
              >
                <option>RESIDENTIAL</option>
                <option>LUXURY</option>
                <option>LAND</option>
                <option>COMMERCIAL</option>
              </select>
              <input
                type="number"
                placeholder="Bedrooms"
                value={form.bedrooms}
                onChange={(e) => setForm({ ...form, bedrooms: e.target.value })}
                className="rounded-xl border border-slate-200 p-4 text-sm"
              />
              <input
                type="number"
                placeholder="Bathrooms"
                value={form.bathrooms}
                onChange={(e) =>
                  setForm({ ...form, bathrooms: e.target.value })
                }
                className="rounded-xl border border-slate-200 p-4 text-sm"
              />
              <input
                type="number"
                placeholder="Size in sqm"
                value={form.sizeSqm}
                onChange={(e) => setForm({ ...form, sizeSqm: e.target.value })}
                className="rounded-xl border border-slate-200 p-4 text-sm"
              />
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="rounded-xl border border-slate-200 p-4 text-sm font-bold"
              >
                <option>AVAILABLE</option>
                <option>RESERVED</option>
                <option>SOLD</option>
                <option>OFF_MARKET</option>
              </select>
              <textarea
                required
                rows={4}
                placeholder="Property description"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                className="rounded-xl border border-slate-200 p-4 text-sm sm:col-span-2"
              />
              <textarea
                required
                rows={4}
                placeholder="Image URLs — one per line"
                value={form.images}
                onChange={(e) => setForm({ ...form, images: e.target.value })}
                className="rounded-xl border border-slate-200 p-4 text-sm sm:col-span-2"
              />
              <textarea
                rows={4}
                placeholder="Features — one per line"
                value={form.features}
                onChange={(e) => setForm({ ...form, features: e.target.value })}
                className="rounded-xl border border-slate-200 p-4 text-sm sm:col-span-2"
              />
              <label className="flex items-center gap-3 rounded-xl bg-amber-50 p-4 text-sm font-bold text-[#073d22] sm:col-span-2">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) =>
                    setForm({ ...form, featured: e.target.checked })
                  }
                />{" "}
                Feature this property on the landing page
              </label>
              {error && (
                <p className="rounded-xl bg-red-50 p-4 text-sm font-bold text-red-700 sm:col-span-2">
                  {error}
                </p>
              )}
              <div className="flex justify-end gap-3 sm:col-span-2">
                <button
                  type="button"
                  onClick={() => setModal(false)}
                  className="rounded-xl px-5 py-3 text-sm font-bold text-slate-500"
                >
                  Cancel
                </button>
                <button
                  disabled={saving || !form.offerTypes.length}
                  className="rounded-xl bg-[#073d22] px-7 py-3 text-sm font-black text-white disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save property"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
