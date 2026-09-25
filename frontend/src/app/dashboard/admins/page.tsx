"use client";
import React, { useDeferredValue, useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import DashboardSearchBar from "@/components/Dashboard/DashboardSearchBar";

export default function AdminsPage() {
  const { user } = useAuth();
  const [admins, setAdmins] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", password: "" });
  const [tempPassword, setTempPassword] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);

  const loadAdmins = async () => {
    const data = await apiFetch("/users/admins");
    setAdmins(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    const run = async () => {
      try {
        if (user?.role === "ADMIN") {
          await loadAdmins();
        }
      } catch (error) {
        console.error("Error fetching admins:", error);
      } finally {
        setIsLoading(false);
      }
    };
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.role]);

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setTempPassword(null);
    try {
      const created = await apiFetch("/users/admins", {
        method: "POST",
        body: JSON.stringify(formData),
      });
      setTempPassword(created.temporaryPassword || null);
      setIsAddModalOpen(false);
      setFormData({ name: "", email: "", phone: "", password: "" });
      await loadAdmins();
    } catch (error) {
      console.error("Error adding admin:", error);
      alert("Failed to add admin");
    }
  };

  if (isLoading)
    return (
      <div className="animate-pulse space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 bg-gray-100 rounded-3xl" />
        ))}
      </div>
    );

  if (user?.role !== "ADMIN") {
    return (
      <div className="bg-white rounded-[32px] border border-gray-100 p-8 text-gray-500">
        You don&apos;t have access to this page.
      </div>
    );
  }

  const normalizedQuery = deferredQuery.trim().toLowerCase();
  const filteredAdmins = normalizedQuery
    ? admins.filter((admin) =>
        [admin.name, admin.email, admin.phone]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(normalizedQuery)),
      )
    : admins;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-3xl font-bold text-primary">Admins</h2>
          <p className="text-gray-500 mt-1">Create and manage admin accounts.</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-8 py-4 bg-primary text-white font-bold rounded-2xl shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all"
        >
          Add New Admin
        </button>
      </div>

      {tempPassword && (
        <div className="bg-white border border-gray-100 rounded-[32px] p-6">
          <p className="font-bold text-primary mb-1">Admin created</p>
          <p className="text-gray-600 text-sm">
            Temporary password: <span className="font-mono font-bold">{tempPassword}</span>
          </p>
        </div>
      )}

      <DashboardSearchBar
        value={query}
        onChange={setQuery}
        placeholder="Search admins by name, email, or phone"
        count={filteredAdmins.length}
        countLabel="admins"
      />

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredAdmins.map((admin, i) => (
          <motion.div
            key={admin.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm hover:shadow-xl transition-all"
          >
            <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary font-bold text-xl mb-6">
              {String(admin.name || "A").charAt(0)}
            </div>
            <h3 className="text-xl font-bold text-primary mb-2">{admin.name}</h3>
            <p className="text-gray-500 text-sm">{admin.email}</p>
          </motion.div>
        ))}
        {filteredAdmins.length === 0 && (
          <div className="col-span-full text-center py-20 bg-white rounded-[40px] border border-dashed border-gray-200">
            <p className="text-gray-500">
              {admins.length === 0 ? "No admins found." : "No admins matched your search."}
            </p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddModalOpen(false)}
              className="absolute inset-0 bg-primary/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-lg bg-white rounded-[40px] shadow-2xl p-10 overflow-hidden"
            >
              <h3 className="text-2xl font-bold text-primary mb-6">Add Admin</h3>
              <form onSubmit={handleAddAdmin} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-primary mb-2">Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-secondary/20 transition-all"
                    placeholder="Admin name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-primary mb-2">Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-secondary/20 transition-all"
                    placeholder="admin@example.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-primary mb-2">Phone Number</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-secondary/20 transition-all"
                    placeholder="+234 ..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-primary mb-2">Temporary Password (optional)</label>
                  <input
                    type="text"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-secondary/20 transition-all"
                    placeholder="Leave blank to auto-generate"
                  />
                </div>
                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-8 py-4 text-gray-400 font-bold hover:text-primary transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-4 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all"
                  >
                    Create Account
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

