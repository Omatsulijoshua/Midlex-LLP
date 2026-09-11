import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Gavel, Mail, Lock, User, ArrowRight, Phone, MapPin, Building, FileText, FileEdit } from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    secondaryPhone: "",
    city: "",
    address: "",
    password: "",
    caseTitle: "",
    caseDescription: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      // Step 1: Signup with full client profile & initial case details
      const response = await apiFetch('/auth/signup', {
        method: 'POST',
        body: JSON.stringify(formData),
      });

      // Step 2: Auto-login
      if (response.access_token && response.user) {
        login(response.access_token, response.user);
      } else {
        const loginData = await apiFetch('/auth/login', {
          method: 'POST',
          body: JSON.stringify({ email: formData.email, password: formData.password }),
        });
        login(loginData.access_token, loginData.user);
      }
    } catch (err: any) {
      setError(err.message || "Failed to create account");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#fafafa] flex items-center justify-center p-4 py-12">
      <div className="absolute inset-0 z-0 opacity-5">
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary rounded-full blur-[120px] translate-x-1/2 translate-y-1/2" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl bg-white rounded-[32px] shadow-2xl p-8 sm:p-12 relative z-10 border border-gray-100"
      >
        <div className="flex flex-col items-center mb-8">
          <Link href="/" className="mb-4">
            <img src="/logo.jpg" alt="Midlex LLP" className="h-24 w-auto object-contain" />
          </Link>
          <h1 className="text-3xl font-bold text-primary mb-1 text-center">Client Registration</h1>
          <p className="text-gray-500 text-center text-sm">Register your account & file your legal matter with Midlex LLP</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-bold border border-red-100">
              {error}
            </div>
          )}

          {/* Personal & Contact Information */}
          <div className="space-y-4">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2">
              1. Personal & Contact Information
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-primary mb-1.5">Full Name *</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    style={{ color: '#000000', backgroundColor: '#ffffff', WebkitTextFillColor: '#000000' }}
                    className="w-full bg-white border border-gray-300 rounded-2xl py-3.5 pl-11 pr-4 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-slate-900 font-semibold text-sm"
                    placeholder="e.g. Chief Anthony Osagie"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-primary mb-1.5">Email Address *</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    style={{ color: '#000000', backgroundColor: '#ffffff', WebkitTextFillColor: '#000000' }}
                    className="w-full bg-white border border-gray-300 rounded-2xl py-3.5 pl-11 pr-4 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-slate-900 font-semibold text-sm"
                    placeholder="anthony@example.com"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-primary mb-1.5">Primary Phone Number *</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    style={{ color: '#000000', backgroundColor: '#ffffff', WebkitTextFillColor: '#000000' }}
                    className="w-full bg-white border border-gray-300 rounded-2xl py-3.5 pl-11 pr-4 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-slate-900 font-semibold text-sm"
                    placeholder="+234 803 000 0000"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-primary mb-1.5">Secondary Phone Number (Optional)</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary" size={18} />
                  <input
                    type="tel"
                    value={formData.secondaryPhone}
                    onChange={(e) => setFormData({...formData, secondaryPhone: e.target.value})}
                    style={{ color: '#000000', backgroundColor: '#ffffff', WebkitTextFillColor: '#000000' }}
                    className="w-full bg-white border border-gray-300 rounded-2xl py-3.5 pl-11 pr-4 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-slate-900 font-semibold text-sm"
                    placeholder="+234 805 111 2222 (Optional)"
                  />
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-primary mb-1.5">Location (City) *</label>
                <div className="relative">
                  <Building className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                    style={{ color: '#000000', backgroundColor: '#ffffff', WebkitTextFillColor: '#000000' }}
                    className="w-full bg-white border border-gray-300 rounded-2xl py-3.5 pl-11 pr-4 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-slate-900 font-semibold text-sm"
                    placeholder="e.g. Benin City"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-primary mb-1.5">Password *</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    style={{ color: '#000000', backgroundColor: '#ffffff', WebkitTextFillColor: '#000000' }}
                    className="w-full bg-white border border-gray-300 rounded-2xl py-3.5 pl-11 pr-4 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-slate-900 font-semibold text-sm"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-primary mb-1.5">Physical Address *</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  style={{ color: '#000000', backgroundColor: '#ffffff', WebkitTextFillColor: '#000000' }}
                  className="w-full bg-white border border-gray-300 rounded-2xl py-3.5 pl-11 pr-4 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-slate-900 font-semibold text-sm"
                  placeholder="e.g. No. 12 Airport Road, GRA, Benin City"
                  required
                />
              </div>
            </div>
          </div>

          {/* Initial Case Registration */}
          <div className="space-y-4 pt-2">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2">
              2. Initial Case Matter Registration
            </h2>

            <div>
              <label className="block text-xs font-bold text-primary mb-1.5">Case Title *</label>
              <div className="relative">
                <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary" size={18} />
                <input
                  type="text"
                  value={formData.caseTitle}
                  onChange={(e) => setFormData({...formData, caseTitle: e.target.value})}
                  style={{ color: '#000000', backgroundColor: '#ffffff', WebkitTextFillColor: '#000000' }}
                  className="w-full bg-white border border-gray-300 rounded-2xl py-3.5 pl-11 pr-4 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-slate-900 font-semibold text-sm"
                  placeholder="e.g. Land Title Dispute at Okada Property"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-primary mb-1.5">Explain Case Matter Details *</label>
              <div className="relative">
                <FileEdit className="absolute left-4 top-4 text-secondary" size={18} />
                <textarea
                  rows={4}
                  value={formData.caseDescription}
                  onChange={(e) => setFormData({...formData, caseDescription: e.target.value})}
                  style={{ color: '#000000', backgroundColor: '#ffffff', WebkitTextFillColor: '#000000' }}
                  className="w-full bg-white border border-gray-300 rounded-2xl py-3.5 pl-11 pr-4 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-slate-900 font-semibold text-sm"
                  placeholder="Please describe your legal issue, key facts, parties involved, and expected resolution..."
                  required
                />
              </div>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-xl shadow-primary/20 disabled:opacity-50 text-base"
          >
            {isSubmitting ? "Registering & Filing Case..." : "Register Client Account & File Case"} <ArrowRight size={20} />
          </motion.button>
        </form>

        <div className="mt-8 text-center text-gray-600 text-sm">
          Already registered?{" "}
          <Link href="/login" className="text-secondary font-bold hover:underline">Sign In Here</Link>
        </div>
      </motion.div>
    </main>
  );
}
