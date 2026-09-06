"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Gavel, Mail, Lock, User, ArrowRight, Phone } from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      // Step 1: Signup
      await apiFetch('/auth/signup', {
        method: 'POST',
        body: JSON.stringify(formData),
      });

      // Step 2: Login automatically
      const loginData = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      });

      login(loginData.access_token, loginData.user);
    } catch (err: any) {
      setError(err.message || "Failed to create account");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#fafafa] flex items-center justify-center p-4">
      <div className="absolute inset-0 z-0 opacity-5">
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary rounded-full blur-[120px] translate-x-1/2 translate-y-1/2" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-[32px] shadow-2xl p-10 relative z-10 border border-gray-100"
      >
        <div className="flex flex-col items-center mb-10">
          <Link href="/" className="mb-6">
            <img src="/logo.jpg" alt="Midlex LLP" className="h-28 w-auto object-contain" />
          </Link>
          <h1 className="text-3xl font-bold text-primary mb-2">Create Account</h1>
          <p className="text-gray-500 text-center">Join Midlex LLP for premium legal services</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-bold border border-red-100">
              {error}
            </div>
          )}
          <div>
            <label className="block text-sm font-bold text-primary mb-2">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                style={{ color: '#000000', backgroundColor: '#ffffff', WebkitTextFillColor: '#000000' }}
                className="w-full bg-white border border-gray-300 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-slate-900 font-semibold"
                placeholder="John Doe"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-primary mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                style={{ color: '#000000', backgroundColor: '#ffffff', WebkitTextFillColor: '#000000' }}
                className="w-full bg-white border border-gray-300 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-slate-900 font-semibold"
                placeholder="john@example.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-primary mb-2">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                style={{ color: '#000000', backgroundColor: '#ffffff', WebkitTextFillColor: '#000000' }}
                className="w-full bg-white border border-gray-300 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-slate-900 font-semibold"
                placeholder="+234 800 000 0000"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-primary mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                style={{ color: '#000000', backgroundColor: '#ffffff', WebkitTextFillColor: '#000000' }}
                className="w-full bg-white border border-gray-300 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-slate-900 font-semibold"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-xl shadow-primary/20 disabled:opacity-50"
          >
            {isSubmitting ? "Creating Account..." : "Create Account"} <ArrowRight size={20} />
          </motion.button>
        </form>

        <div className="mt-8 text-center text-gray-600">
          Already have an account?{" "}
          <Link href="/login" className="text-secondary font-bold hover:underline">Sign In</Link>
        </div>
      </motion.div>
    </main>
  );
}
