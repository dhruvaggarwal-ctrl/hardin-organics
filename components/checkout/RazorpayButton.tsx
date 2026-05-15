"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";

interface RazorpayButtonProps {
  amount: number;        // final amount in ₹ (after shipping, discount)
  className?: string;
  label?: string;
}

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Razorpay: any;
  }
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (document.getElementById("razorpay-script")) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.id = "razorpay-script";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export function RazorpayButton({ amount, className = "", label = "Proceed to Checkout" }: RazorpayButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { items, clearCart } = useCart();
  const router = useRouter();

  const handleCheckout = async () => {
    setLoading(true);
    setError("");

    try {
      // 1. Load Razorpay script
      const loaded = await loadRazorpayScript();
      if (!loaded) throw new Error("Failed to load payment gateway. Please try again.");

      // 2. Create order on server
      const orderRes = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          receipt: `order_${Date.now()}`,
        }),
      });

      if (!orderRes.ok) throw new Error("Could not initiate payment. Please try again.");
      const { orderId, amount: orderAmount, currency } = await orderRes.json();

      // 3. Build item description
      const description = items.map((i) => `${i.product.name} ×${i.quantity}`).join(", ");

      // 4. Open Razorpay modal
      await new Promise<void>((resolve, reject) => {
        const rzp = new window.Razorpay({
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          order_id: orderId,
          amount: orderAmount,
          currency,
          name: "Hardin Organics",
          description,
          image: "/images/charcoal-1.png",
          theme: { color: "#2D5016" },
          prefill: {},
          handler: async (response: {
            razorpay_payment_id: string;
            razorpay_order_id: string;
            razorpay_signature: string;
          }) => {
            // 5. Verify payment server-side
            const verifyRes = await fetch("/api/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const { verified } = await verifyRes.json();
            if (!verified) {
              reject(new Error("Payment verification failed. Please contact support."));
              return;
            }

            // 6. Success — clear cart and redirect
            clearCart();
            router.push(`/order-success?paymentId=${response.razorpay_payment_id}&orderId=${response.razorpay_order_id}`);
            resolve();
          },
          modal: {
            ondismiss: () => {
              setLoading(false);
              resolve();
            },
          },
        });

        rzp.on("payment.failed", (response: { error: { description: string } }) => {
          reject(new Error(response.error?.description || "Payment failed. Please try again."));
        });

        rzp.open();
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleCheckout}
        disabled={loading || amount <= 0}
        className={`w-full bg-[#C4622D] text-white font-bold py-4 rounded-xl text-base transition-all duration-300 hover:bg-[#D4734A] hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${className}`}
      >
        {loading ? (
          <>
            <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Opening Payment...
          </>
        ) : (
          <>
            {label} — ₹{amount}
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </>
        )}
      </button>

      {/* Razorpay trust badge */}
      <div className="flex items-center justify-center gap-2 mt-3 text-xs text-[#6B6B6B]">
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
        </svg>
        Secured by Razorpay · UPI · Cards · NetBanking · COD
      </div>

      {error && (
        <p className="mt-3 text-sm text-red-600 text-center bg-red-50 rounded-xl p-3">{error}</p>
      )}
    </div>
  );
}
