"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";

export default function LoginClient() {
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const data = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      login(data.access_token, data.user);
    } catch (err: any) {
      setError(err.message || "Invalid credentials");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!mounted) {
    return (
      <main className="min-h-screen bg-[#fafafa] flex items-center justify-center p-4" />
    );
  }

  return (
    <main className="min-h-screen bg-[#fafafa] flex items-center justify-center p-4">
      <style dangerouslySetInnerHTML={{ __html: `
        input,
        input:focus,
        input:active,
        input:hover,
        input:not(:placeholder-shown),
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus {
          color: #000000 !important;
          -webkit-text-fill-color: #000000 !important;
          background-color: #ffffff !important;
          caret-color: #000000 !important;
          opacity: 1 !important;
          font-weight: 700 !important;
        }
      ` }} />

      <div className="absolute inset-0 z-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2" />
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
          <h1 className="text-3xl font-bold text-primary mb-2">Welcome Back</h1>
          <p className="text-gray-500 text-center">Enter your credentials to access your Midlex dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-bold border border-red-100">
              {error}
            </div>
          )}
          <div>
            <label className="block text-sm font-bold text-primary mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={20} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ color: "#000000", WebkitTextFillColor: "#000000", backgroundColor: "#ffffff" }}
                className="w-full bg-white border-2 border-slate-400 text-slate-900 font-bold rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-gray-400"
                placeholder="name@example.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-primary mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={20} />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ color: "#000000", WebkitTextFillColor: "#000000", backgroundColor: "#ffffff" }}
                className="w-full bg-white border-2 border-slate-400 text-slate-900 font-bold rounded-2xl py-4 pl-12 pr-12 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-gray-400"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-primary hover:text-secondary transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-gray-600 cursor-pointer">
              <input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary" />
              Remember me
            </label>
            <Link href="/forgot-password" className="text-secondary font-bold hover:underline">
              Forgot password?
            </Link>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-xl shadow-primary/20 disabled:opacity-50"
          >
            {isSubmitting ? "Signing In..." : "Sign In"} <ArrowRight size={20} />
          </motion.button>
        </form>

        <div className="mt-8 text-center text-gray-600">
          Don't have an account?{" "}
          <Link href="/signup" className="text-secondary font-bold hover:underline">
            Create one
          </Link>
        </div>
      </motion.div>
    </main>
  );
}
