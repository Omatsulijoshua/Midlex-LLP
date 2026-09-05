"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Mail } from "lucide-react";

import { apiFetch } from "@/lib/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [resetUrl, setResetUrl] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setResetUrl("");
    setIsSubmitting(true);

    try {
      const data = await apiFetch("/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      setMessage(data.message || "Password reset instructions have been sent.");
      if (data.resetUrl) setResetUrl(data.resetUrl);
    } catch (err: any) {
      setError(err.message || "Failed to request password reset");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#fafafa] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-[32px] shadow-2xl p-10 border border-gray-100"
      >
        <div className="flex flex-col items-center mb-10">
          <Link href="/" className="mb-6">
            <img src="/logo.jpg" alt="Midlex LLP" className="h-28 w-auto object-contain" />
          </Link>
          <h1 className="text-3xl font-bold text-primary mb-2">Reset Password</h1>
          <p className="text-gray-500 text-center">Enter your email to receive a reset link.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-bold border border-red-100">
              {error}
            </div>
          )}
          {message && (
            <div className="p-4 bg-green-50 text-green-700 rounded-2xl text-sm font-bold border border-green-100">
              {message}
            </div>
          )}
          {resetUrl && (
            <Link
              href={resetUrl}
              className="block p-4 bg-amber-50 text-amber-700 rounded-2xl text-sm font-bold border border-amber-100 break-words hover:underline"
            >
              Open reset link
            </Link>
          )}

          <div>
            <label className="block text-sm font-bold text-primary mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                placeholder="name@example.com"
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
            {isSubmitting ? "Sending..." : "Send Reset Link"} <ArrowRight size={20} />
          </motion.button>
        </form>

        <div className="mt-8 text-center text-gray-600">
          Remembered it?{" "}
          <Link href="/login" className="text-secondary font-bold hover:underline">
            Sign in
          </Link>
        </div>
      </motion.div>
    </main>
  );
}
