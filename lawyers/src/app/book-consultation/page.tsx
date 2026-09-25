"use client";

import { useState } from "react";
import MarketingShell from "@/components/marketing/MarketingShell";
import { apiFetch } from "@/lib/api";

export default function BookConsultationPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [error, setError] = useState<string>("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    practiceArea: "Real Estate",
    urgency: "Normal",
    message: "",
  });

  const onChange = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("idle");
    setError("");
    setIsSubmitting(true);

    try {
      // This endpoint may not exist yet in the backend. If it doesn't, we show a friendly error
      // and you can wire it to your inquiries endpoint later.
      await apiFetch("/public/inquiries", {
        method: "POST",
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          practiceArea: form.practiceArea,
          urgency: form.urgency,
          message: form.message,
        }),
      });
      setStatus("success");
      setForm({ name: "", email: "", phone: "", practiceArea: "Real Estate", urgency: "Normal", message: "" });
    } catch (err: unknown) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Failed to submit. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MarketingShell>
      <section className="py-20 bg-[#fafafa]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-primary mb-6">Book a Consultation</h1>
          <p className="text-lg text-gray-600">
            Share a brief overview of your matter. We’ll review and get back to you with the next steps.
          </p>

          <form onSubmit={handleSubmit} className="mt-12 bg-white border border-gray-100 rounded-3xl p-8 shadow-sm space-y-5">
            {status === "success" && (
              <div className="p-4 rounded-2xl bg-green-50 border border-green-100 text-green-700 text-sm font-semibold">
                Submitted successfully. We’ll contact you shortly.
              </div>
            )}
            {status === "error" && (
              <div className="p-4 rounded-2xl bg-red-50 border border-red-100 text-red-700 text-sm font-semibold">
                {error}
              </div>
            )}

            <div className="grid sm:grid-cols-2 gap-4">
              <input
                className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-secondary/20"
                placeholder="Full name"
                value={form.name}
                onChange={onChange("name")}
                required
              />
              <input
                className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-secondary/20"
                placeholder="Email address"
                type="email"
                value={form.email}
                onChange={onChange("email")}
                required
              />
              <input
                className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-secondary/20"
                placeholder="Phone number"
                value={form.phone}
                onChange={onChange("phone")}
              />
              <select
                className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-secondary/20"
                value={form.practiceArea}
                onChange={onChange("practiceArea")}
              >
                <option>Real Estate</option>
                <option>Corporate</option>
                <option>Litigation</option>
              </select>
            </div>

            <select
              className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-secondary/20"
              value={form.urgency}
              onChange={onChange("urgency")}
            >
              <option>Normal</option>
              <option>Urgent (24-48hrs)</option>
            </select>

            <textarea
              className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-secondary/20 min-h-[140px]"
              placeholder="Briefly describe your matter..."
              value={form.message}
              onChange={onChange("message")}
              required
            />

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary text-white py-4 rounded-2xl font-bold disabled:opacity-50"
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>

            <p className="text-xs text-gray-500 leading-relaxed">
              Note: This form is for general intake only and does not create a solicitor-client relationship until confirmed.
            </p>
          </form>
        </div>
      </section>
    </MarketingShell>
  );
}
