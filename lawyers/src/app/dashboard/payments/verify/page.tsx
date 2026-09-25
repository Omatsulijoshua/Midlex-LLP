"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Loader2, XCircle } from "lucide-react";
import { apiFetch } from "@/lib/api";

export default function PaymentVerifyPage() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "failed">(
    "loading",
  );
  const [paymentData, setPaymentData] = useState<any>(null);

  const reference = searchParams.get("reference") || searchParams.get("tx_ref");
  const orderNo = searchParams.get("orderNo");
  const cancelled = searchParams.get("cancelled");

  useEffect(() => {
    if (cancelled === "1") {
      setStatus("failed");
      return;
    }

    if (!reference && !orderNo) {
      setStatus("failed");
      return;
    }

    const verify = async () => {
      try {
        const query = new URLSearchParams();
        if (reference) query.set("reference", reference);
        if (orderNo) query.set("orderNo", orderNo);

        const response = await apiFetch(`/payments/verify?${query.toString()}`);
        setPaymentData(response);
        setStatus(response.status === "SUCCESS" ? "success" : "failed");
      } catch (error) {
        console.error("Verification error:", error);
        setStatus("failed");
      }
    };

    void verify();
  }, [cancelled, orderNo, reference]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white rounded-[40px] border border-gray-100 shadow-2xl p-10 text-center"
      >
        {status === "loading" && (
          <div className="space-y-6">
            <div className="flex justify-center">
              <Loader2 className="w-16 h-16 text-secondary animate-spin" />
            </div>
            <h2 className="text-2xl font-bold text-primary">
              Verifying Payment...
            </h2>
            <p className="text-gray-500">
              Please wait while we confirm your transaction with OPay.
            </p>
          </div>
        )}

        {status === "success" && (
          <div className="space-y-6">
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                <CheckCircle2 size={48} />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-primary">
              Payment Successful!
            </h2>
            <p className="text-gray-500">
              Your payment of NGN {paymentData?.amount?.toLocaleString()} has
              been verified and added to your Midlex history.
            </p>
            <Link
              href="/dashboard/payments"
              className="w-full py-4 bg-primary text-white font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-primary/90 transition-all"
            >
              View History <ArrowRight size={20} />
            </Link>
          </div>
        )}

        {status === "failed" && (
          <div className="space-y-6">
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center text-red-600">
                <XCircle size={48} />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-primary">Payment Failed</h2>
            <p className="text-gray-500">
              We could not confirm your OPay payment yet. Open your payment
              history and refresh the status if you were charged.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => window.location.reload()}
                className="w-full py-4 bg-primary text-white font-bold rounded-2xl transition-all"
              >
                Retry Verification
              </button>
              <Link
                href="/dashboard/payments"
                className="text-gray-400 font-bold hover:text-primary transition-colors"
              >
                Return to Payment History
              </Link>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
