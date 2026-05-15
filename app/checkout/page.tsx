"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  interface Window { Razorpay: any; }
}

const INDIAN_STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa",
  "Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala",
  "Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland",
  "Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura",
  "Uttar Pradesh","Uttarakhand","West Bengal","Andaman and Nicobar Islands",
  "Chandigarh","Dadra and Nagar Haveli and Daman and Diu","Delhi",
  "Jammu and Kashmir","Ladakh","Lakshadweep","Puducherry",
];

interface FormData {
  customerName: string;
  mobile: string;
  email: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pincode: string;
}
type FormErrors = Partial<Record<keyof FormData, string>>;

function loadRazorpay(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") { resolve(false); return; }
    if (document.getElementById("rzp-sdk")) { resolve(true); return; }
    const s = document.createElement("script");
    s.id = "rzp-sdk";
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

function Field({
  label, required, error, children,
}: { label: string; required?: boolean; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-[#1C1C1C] mb-1.5">
        {label}{required && " *"}
        {!required && <span className="text-[#6B6B6B] font-normal"> (optional)</span>}
      </label>
      {children}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

function Input({
  value, onChange, placeholder, type = "text", error, maxLength,
}: {
  value: string; onChange: (v: string) => void; placeholder?: string;
  type?: string; error?: boolean; maxLength?: number;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      maxLength={maxLength}
      className={`w-full px-4 py-3 rounded-xl border text-sm text-[#1C1C1C] placeholder-gray-400 focus:outline-none transition-colors ${
        error ? "border-red-400 bg-red-50 focus:border-red-500" : "border-gray-200 focus:border-[#2D5016]"
      }`}
    />
  );
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, discount, clearCart } = useCart();

  const [form, setForm] = useState<FormData>({
    customerName: "", mobile: "", email: "",
    addressLine1: "", addressLine2: "",
    city: "", state: "", pincode: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [paymentMethod, setPaymentMethod] = useState<"razorpay" | "cod">("razorpay");
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const discountedSubtotal = subtotal - discount;
  const shipping = discountedSubtotal >= 399 ? 0 : 60;
  const total = discountedSubtotal + shipping;

  // Redirect to shop if cart is empty
  useEffect(() => {
    if (items.length === 0) router.replace("/shop");
  }, [items, router]);

  const set = (field: keyof FormData) => (value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => { const e = { ...prev }; delete e[field]; return e; });
  };

  function validate(): boolean {
    const e: FormErrors = {};
    if (!form.customerName.trim()) e.customerName = "Full name is required";
    if (!form.mobile.trim()) {
      e.mobile = "Mobile number is required";
    } else if (!/^[6-9]\d{9}$/.test(form.mobile.trim())) {
      e.mobile = "Enter a valid 10-digit Indian mobile number";
    }
    if (!form.addressLine1.trim()) e.addressLine1 = "Address is required";
    if (!form.city.trim()) e.city = "City is required";
    if (!form.state) e.state = "Please select your state";
    if (!form.pincode.trim()) {
      e.pincode = "Pincode is required";
    } else if (!/^\d{6}$/.test(form.pincode.trim())) {
      e.pincode = "Enter a valid 6-digit pincode";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  const orderItems = items.map((i) => ({
    id: i.product.id,
    name: i.product.name,
    quantity: i.quantity,
    price: i.price,
  }));

  async function handleCOD() {
    if (!validate()) return;
    setLoading(true);
    setSubmitError("");
    try {
      const res = await fetch("/api/orders/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          items: orderItems,
          subtotal, discount, shipping, totalAmount: total,
          paymentMethod: "COD", status: "pending",
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Failed to place order");
      clearCart();
      router.push(
        `/order-confirmation?orderId=${data.orderId}&method=cod` +
        `&name=${encodeURIComponent(form.customerName)}&mobile=${form.mobile}&total=${total}`
      );
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Failed to place order. Please try again.");
      setLoading(false);
    }
  }

  async function handleRazorpay() {
    if (!validate()) return;
    setLoading(true);
    setSubmitError("");
    try {
      const loaded = await loadRazorpay();
      if (!loaded) throw new Error("Failed to load payment gateway. Check your connection and try again.");

      const orderRes = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: total, receipt: `rcpt_${Date.now()}` }),
      });
      if (!orderRes.ok) throw new Error("Could not initiate payment. Please try again.");
      const { orderId: rzpOrderId, amount: orderAmount, currency } = await orderRes.json();

      const description = items.map((i) => `${i.product.name} ×${i.quantity}`).join(", ");

      await new Promise<void>((resolve, reject) => {
        const rzp = new window.Razorpay({
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          order_id: rzpOrderId,
          amount: orderAmount,
          currency,
          name: "Hardin Organics",
          description,
          theme: { color: "#A0522D" },
          prefill: {
            name: form.customerName,
            contact: form.mobile,
            email: form.email || undefined,
          },
          handler: async (response: {
            razorpay_payment_id: string;
            razorpay_order_id: string;
            razorpay_signature: string;
          }) => {
            // Verify signature server-side
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
            if (!verified) { reject(new Error("Payment verification failed. Please contact support.")); return; }

            // Save order with payment details
            const saveRes = await fetch("/api/orders/save", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                ...form,
                items: orderItems,
                subtotal, discount, shipping, totalAmount: total,
                paymentMethod: "Razorpay",
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                status: "paid",
              }),
            });
            const saveData = await saveRes.json();
            const hoOrderId = saveData.orderId || `HO-${Date.now()}`;

            clearCart();
            router.push(
              `/order-confirmation?orderId=${hoOrderId}&method=paid` +
              `&name=${encodeURIComponent(form.customerName)}&mobile=${form.mobile}&total=${total}`
            );
            resolve();
          },
          modal: {
            ondismiss: () => { setLoading(false); resolve(); },
          },
        });

        rzp.on("payment.failed", (r: { error: { description: string } }) => {
          reject(new Error(r.error?.description || "Payment failed. Please try again."));
        });

        rzp.open();
      });
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  if (items.length === 0) return null;

  return (
    <div className="min-h-screen bg-[#F5F0E8] py-8 md:py-12">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link href="/shop" className="inline-flex items-center gap-1 text-sm text-[#6B6B6B] hover:text-[#2D5016] mb-4 transition-colors">
            ← Back to Shop
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-[#1C1C1C] font-display">Checkout</h1>
          <p className="text-[#6B6B6B] text-sm mt-1">Secure checkout — 100% safe & encrypted</p>
        </div>

        <div className="grid md:grid-cols-[1fr_360px] gap-8 items-start">
          {/* ── LEFT COLUMN ── */}
          <div className="space-y-5">

            {/* Delivery Address */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-[#1C1C1C] mb-5">Delivery Address</h2>
              <div className="space-y-4">

                <Field label="Full Name" required error={errors.customerName}>
                  <Input
                    value={form.customerName}
                    onChange={set("customerName")}
                    placeholder="Rahul Sharma"
                    error={!!errors.customerName}
                  />
                </Field>

                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Mobile Number" required error={errors.mobile}>
                    <Input
                      value={form.mobile}
                      onChange={(v) => set("mobile")(v.replace(/\D/g, "").slice(0, 10))}
                      placeholder="9876543210"
                      type="tel"
                      error={!!errors.mobile}
                      maxLength={10}
                    />
                  </Field>
                  <Field label="Email" error={errors.email}>
                    <Input
                      value={form.email}
                      onChange={set("email")}
                      placeholder="rahul@email.com"
                      type="email"
                    />
                  </Field>
                </div>

                <Field label="Address Line 1" required error={errors.addressLine1}>
                  <Input
                    value={form.addressLine1}
                    onChange={set("addressLine1")}
                    placeholder="House / Flat No., Street Name"
                    error={!!errors.addressLine1}
                  />
                </Field>

                <Field label="Address Line 2" error={errors.addressLine2}>
                  <Input
                    value={form.addressLine2}
                    onChange={set("addressLine2")}
                    placeholder="Landmark, Colony, Area"
                  />
                </Field>

                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="City" required error={errors.city}>
                    <Input
                      value={form.city}
                      onChange={set("city")}
                      placeholder="Gurgaon"
                      error={!!errors.city}
                    />
                  </Field>
                  <Field label="Pincode" required error={errors.pincode}>
                    <Input
                      value={form.pincode}
                      onChange={(v) => set("pincode")(v.replace(/\D/g, "").slice(0, 6))}
                      placeholder="122001"
                      error={!!errors.pincode}
                      maxLength={6}
                    />
                  </Field>
                </div>

                <Field label="State" required error={errors.state}>
                  <select
                    value={form.state}
                    onChange={(e) => set("state")(e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border text-sm text-[#1C1C1C] focus:outline-none bg-white transition-colors ${
                      errors.state ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-[#2D5016]"
                    }`}
                  >
                    <option value="">Select State</option>
                    {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </Field>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-[#1C1C1C] mb-4">Payment Method</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {([
                  { value: "razorpay", label: "Pay Online", sub: "UPI · Cards · NetBanking · Wallets" },
                  { value: "cod", label: "Cash on Delivery", sub: "Pay when your order arrives" },
                ] as const).map(({ value, label, sub }) => (
                  <button
                    key={value}
                    onClick={() => setPaymentMethod(value)}
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left ${
                      paymentMethod === value
                        ? "border-[#A0522D] bg-orange-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                      paymentMethod === value ? "border-[#A0522D]" : "border-gray-300"
                    }`}>
                      {paymentMethod === value && (
                        <div className="w-2.5 h-2.5 rounded-full bg-[#A0522D]" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-[#1C1C1C] text-sm">{label}</p>
                      <p className="text-xs text-[#6B6B6B] mt-0.5">{sub}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Error */}
            {submitError && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
                {submitError}
              </div>
            )}

            {/* Submit */}
            <button
              onClick={paymentMethod === "razorpay" ? handleRazorpay : handleCOD}
              disabled={loading}
              className="w-full bg-[#A0522D] text-white font-bold py-4 rounded-xl text-base hover:bg-[#8B4513] transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  {paymentMethod === "razorpay" ? "Opening Payment..." : "Placing Order..."}
                </>
              ) : (
                <>
                  {paymentMethod === "razorpay" ? `Pay ₹${total} Securely` : `Place Order — ₹${total} COD`}
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </>
              )}
            </button>

            {paymentMethod === "razorpay" && (
              <p className="text-center text-xs text-[#6B6B6B] flex items-center justify-center gap-1.5">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
                </svg>
                Secured by Razorpay · 256-bit SSL encryption
              </p>
            )}
          </div>

          {/* ── RIGHT COLUMN: Order Summary ── */}
          <div className="bg-white rounded-2xl p-6 shadow-sm md:sticky md:top-24">
            <h2 className="text-lg font-bold text-[#1C1C1C] mb-5">Order Summary</h2>

            <div className="space-y-4 mb-5">
              {items.map((item) => (
                <div key={`${item.product.id}-${item.selectedSize}`} className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-lg overflow-hidden bg-[#EDE6D6] shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#1C1C1C] leading-tight">{item.product.name}</p>
                    <p className="text-xs text-[#6B6B6B] mt-0.5">{item.selectedSize} × {item.quantity}</p>
                  </div>
                  <span className="text-sm font-bold text-[#1C1C1C] shrink-0">₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 pt-4 space-y-2.5">
              <div className="flex justify-between text-sm text-[#6B6B6B]">
                <span>Subtotal</span>
                <span className="text-[#1C1C1C] font-medium">₹{subtotal}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-green-600 font-medium">Multi-item discount</span>
                  <span className="text-green-600 font-bold">−₹{discount}</span>
                </div>
              )}
              <div className="flex justify-between text-sm text-[#6B6B6B]">
                <span>Shipping</span>
                <span className={`font-medium ${shipping === 0 ? "text-green-600" : "text-[#1C1C1C]"}`}>
                  {shipping === 0 ? "FREE" : `₹${shipping}`}
                </span>
              </div>
              <div className="flex justify-between font-bold text-base pt-3 border-t border-gray-100">
                <span>Total</span>
                <span>₹{total}</span>
              </div>
            </div>

            <p className="text-xs text-[#6B6B6B] mt-4 text-center leading-relaxed">
              Estimated delivery: 4–6 business days<br />
              Free returns within 7 days
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
