"use client";

import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import DashboardSearchBar from "@/components/Dashboard/DashboardSearchBar";

type InquiryStatus = "NEW" | "CONTACTED" | "CONVERTED" | "CLOSED";

type Inquiry = {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  serviceNeeded?: string | null;
  message: string;
  status: InquiryStatus;
  notes?: string | null;
  createdAt: string;
};

const statusOptions: InquiryStatus[] = ["NEW", "CONTACTED", "CONVERTED", "CLOSED"];

export default function InquiriesPage() {
  const { user } = useAuth();
  const [items, setItems] = useState<Inquiry[]>([]);
  const [selected, setSelected] = useState<Inquiry | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<InquiryStatus | "ALL">("ALL");
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);

  const canAccess = user?.role === "ADMIN";

  const load = async () => {
    setIsLoading(true);
    try {
      const qs = statusFilter === "ALL" ? "" : `?status=${encodeURIComponent(statusFilter)}`;
      const data = await apiFetch(`/inquiries${qs}`);
      setItems(data);
      setSelected(null);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!canAccess) return;
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canAccess, statusFilter]);

  const counts = useMemo(() => {
    const base = { NEW: 0, CONTACTED: 0, CONVERTED: 0, CLOSED: 0 };
    for (const it of items) base[it.status] += 1;
    return base;
  }, [items]);

  const filteredItems = useMemo(() => {
    const normalizedQuery = deferredQuery.trim().toLowerCase();
    if (!normalizedQuery) return items;
    return items.filter((inq) =>
      [
        inq.name,
        inq.email,
        inq.phone,
        inq.serviceNeeded,
        inq.message,
        inq.status,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(normalizedQuery)),
    );
  }, [deferredQuery, items]);

  const updateInquiry = async (id: string, patch: Partial<Pick<Inquiry, "status" | "notes">>) => {
    const updated = await apiFetch(`/inquiries/${id}`, {
      method: "PATCH",
      body: JSON.stringify(patch),
    });
    setItems((prev) => prev.map((it) => (it.id === id ? updated : it)));
    setSelected((prev) => (prev?.id === id ? updated : prev));
  };

  if (!canAccess) return <div className="p-10">Access Denied.</div>;

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-10 bg-gray-100 rounded-2xl w-56" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 bg-gray-100 rounded-3xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-3xl font-bold text-primary">Website Inquiries</h2>
          <p className="text-gray-500 mt-1">New leads from the Contact form.</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="min-w-[320px] flex-1">
            <DashboardSearchBar
              value={query}
              onChange={setQuery}
              placeholder="Search inquiries by name, email, phone, service, or message"
              count={filteredItems.length}
              countLabel="inquiries"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-4 py-3 bg-white border border-gray-100 rounded-2xl font-bold text-primary"
          >
            <option value="ALL">All ({items.length})</option>
            {statusOptions.map((s) => (
              <option key={s} value={s}>
                {s} ({counts[s]})
              </option>
            ))}
          </select>
          <button
            onClick={load}
            className="px-6 py-3 bg-primary text-white font-bold rounded-2xl shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all"
          >
            Refresh
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-4">
          {filteredItems.map((inq, i) => (
            <motion.button
              key={inq.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              onClick={() => setSelected(inq)}
              className={`w-full text-left bg-white rounded-[28px] border p-6 transition-all ${
                selected?.id === inq.id ? "border-secondary shadow-lg shadow-secondary/10" : "border-gray-100 hover:shadow-md"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-bold text-primary">{inq.name}</p>
                  <p className="text-xs text-gray-500 mt-1">{inq.email}</p>
                </div>
                <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-gray-50 border border-gray-100 text-gray-600">
                  {inq.status}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-3 line-clamp-2">{inq.message}</p>
              <p className="text-[11px] text-gray-400 mt-3">Received {new Date(inq.createdAt).toLocaleString()}</p>
            </motion.button>
          ))}

          {filteredItems.length === 0 && (
            <div className="bg-white rounded-[40px] border border-dashed border-gray-200 p-10 text-center text-gray-500">
              {items.length === 0 ? "No inquiries found." : "No inquiries matched your search."}
            </div>
          )}
        </div>

        <div className="lg:col-span-2">
          {selected ? (
            <div className="bg-white rounded-[40px] border border-gray-100 p-10 space-y-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-bold text-primary">{selected.name}</h3>
                  <p className="text-gray-500 mt-1">{selected.email}</p>
                  {selected.phone && <p className="text-gray-500 text-sm mt-1">{selected.phone}</p>}
                  {selected.serviceNeeded && (
                    <p className="text-gray-500 text-sm mt-1">Service: {selected.serviceNeeded}</p>
                  )}
                </div>
                <select
                  value={selected.status}
                  onChange={(e) => updateInquiry(selected.id, { status: e.target.value as InquiryStatus })}
                  className="px-4 py-3 bg-white border border-gray-100 rounded-2xl font-bold text-primary"
                >
                  {statusOptions.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-6 bg-gray-50 rounded-[28px] border border-gray-100">
                <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{selected.message}</p>
              </div>

              <div>
                <label className="block text-sm font-bold text-primary mb-2">Internal Notes</label>
                <textarea
                  value={selected.notes || ""}
                  onChange={(e) => setSelected({ ...selected, notes: e.target.value })}
                  className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-secondary/20 transition-all"
                  rows={5}
                  placeholder="Add notes about the call, next steps, etc."
                />
                <div className="flex justify-end mt-4">
                  <button
                    onClick={() => updateInquiry(selected.id, { notes: selected.notes || "" })}
                    className="px-8 py-4 bg-primary text-white font-bold rounded-2xl shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all"
                  >
                    Save Notes
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full bg-white rounded-[40px] border border-dashed border-gray-200 p-10 flex items-center justify-center text-gray-500">
              Select an inquiry to view details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

