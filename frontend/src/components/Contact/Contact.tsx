"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import { apiFetch } from "@/lib/api";

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    serviceNeeded: "Corporate Advisory",
    message: "",
  });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSent(false);

    try {
      await apiFetch("/public/inquiries", {
        method: "POST",
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone || undefined,
          serviceNeeded: form.serviceNeeded || undefined,
          message: form.message,
        }),
      });
      setSent(true);
      setForm({
        name: "",
        email: "",
        phone: "",
        serviceNeeded: "Corporate Advisory",
        message: "",
      });
    } catch (err: any) {
      setError(err?.message || "Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-primary relative overflow-hidden">
      {/* Decorative patterns */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-secondary/5 -skew-x-12 transform translate-x-1/2" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-white mb-6">Let's Discuss Your Legal Strategy</h2>
              <p className="text-white/60 text-lg mb-10 leading-relaxed">
                Whether you're a business seeking advisory or an individual in need of 
                advocacy, our doors in Benin City are always open.
              </p>
            </motion.div>

            <div className="space-y-8">
              {[
                { title: "Email Us", value: "midlexllp@gmail.com", icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
                { title: "Call Us", value: "0703 456 9498", icon: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" },
                { title: "Visit Us", value: "Owa Street, Off Wire Road, Benin City", icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z" }
              ].map((item, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-5"
                >
                  <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-secondary">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-white font-bold">{item.title}</h4>
                    <p className="text-white/60">{item.value}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div>
              <h4 className="text-white font-bold mb-6">Follow Us</h4>
              <div className="flex flex-wrap gap-4">
                {[
                  { name: "Instagram", href: "https://www.instagram.com/midlexllp/", icon: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069z" },
                  { name: "Facebook", href: "https://www.facebook.com/people/Midlex-LLP/100094930886471/", icon: "M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" },
                  { name: "LinkedIn", href: "https://ng.linkedin.com/company/leges-prudentia-ilc", icon: "M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" },
                  { name: "YouTube", href: "https://www.youtube.com/channel/UCoh3dV0miPq5eM0mtylh5zw", icon: "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z" },
                  { name: "TikTok", href: "https://www.tiktok.com/@midlexllp", icon: "M12.525.02c1.31 0 2.59.33 3.72.95.07.04.1.14.07.21l-.73 1.58c-.04.09-.16.12-.25.07-1.4-.78-3.04-.98-4.58-.56-2.58.71-4.22 3.33-3.66 5.92.56 2.59 3.1 4.3 5.7 3.82 2.05-.38 3.55-2.02 3.82-3.97l.01-.1V0h2.04c.03 2.11 1.34 3.96 3.32 4.71.09.04.13.16.08.25l-.76 1.41c-.04.08-.14.11-.23.08-2.61-.98-4.39-3.48-4.44-6.28v11.8c0 4.41-3.58 7.99-7.99 7.99s-7.99-3.58-7.99-7.99 3.58-7.99 7.99-7.99c.34 0 .67.02 1 .07V5.04C6.27 5.37 3.52 8.35 3.52 11.97c0 4.69 3.8 8.49 8.49 8.49s8.49-3.8 8.49-8.49V0h-8v.02z" }
                ].map((social, i) => (
                  <a 
                    key={i} 
                    href={social.href} 
                    target="_blank" 
                    rel="noreferrer"
                    className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-white hover:bg-secondary transition-all hover:scale-110"
                    title={social.name}
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d={social.icon} />
                    </svg>
                  </a>
                ))}
              </div>
            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white p-10 rounded-[40px] shadow-2xl"
          >
            <form 
              onSubmit={submit}
              className="space-y-6"
            >
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-primary mb-2">Full Name</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    style={{ color: "#000000", WebkitTextFillColor: "#000000", backgroundColor: "#ffffff" }}
                    className="w-full px-6 py-4 bg-white border-2 border-slate-300 text-slate-900 font-bold rounded-2xl focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary transition-all placeholder:text-gray-400"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-primary mb-2">Email Address</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    style={{ color: "#000000", WebkitTextFillColor: "#000000", backgroundColor: "#ffffff" }}
                    className="w-full px-6 py-4 bg-white border-2 border-slate-300 text-slate-900 font-bold rounded-2xl focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary transition-all placeholder:text-gray-400"
                    placeholder="john@example.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-primary mb-2">Phone (optional)</label>
                <input
                  type="text"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  style={{ color: "#000000", WebkitTextFillColor: "#000000", backgroundColor: "#ffffff" }}
                  className="w-full px-6 py-4 bg-white border-2 border-slate-300 text-slate-900 font-bold rounded-2xl focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary transition-all placeholder:text-gray-400"
                  placeholder="+234 ..."
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-primary mb-2">Service Needed</label>
                <select
                  value={form.serviceNeeded}
                  onChange={(e) => setForm({ ...form, serviceNeeded: e.target.value })}
                  style={{ color: "#000000", WebkitTextFillColor: "#000000", backgroundColor: "#ffffff" }}
                  className="w-full px-6 py-4 bg-white border-2 border-slate-300 text-slate-900 font-bold rounded-2xl focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary transition-all appearance-none"
                >
                  <option>Corporate Advisory</option>
                  <option>Litigation & Dispute Resolution</option>
                  <option>Property & Real Estate</option>
                  <option>Intellectual Property</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-primary mb-2">Message</label>
                <textarea
                  rows={4}
                  required
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  style={{ color: "#000000", WebkitTextFillColor: "#000000", backgroundColor: "#ffffff" }}
                  className="w-full px-6 py-4 bg-white border-2 border-slate-300 text-slate-900 font-bold rounded-2xl focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary transition-all placeholder:text-gray-400"
                  placeholder="Tell us about your case..."
                />
              </div>

              {error && (
                <div className="p-4 bg-red-50 text-red-700 rounded-2xl border border-red-100 font-bold text-sm">
                  {error}
                </div>
              )}
              {sent && (
                <div className="p-4 bg-green-50 text-green-700 rounded-2xl border border-green-100 font-bold text-sm">
                  Message sent. Our team will contact you shortly.
                </div>
              )}

              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full py-5 bg-secondary text-white font-bold rounded-2xl hover:bg-secondary/90 transition-all shadow-lg shadow-secondary/30 active:scale-[0.98] disabled:opacity-60"
              >
                {isSubmitting ? "Sending..." : "Request Consultation"}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
