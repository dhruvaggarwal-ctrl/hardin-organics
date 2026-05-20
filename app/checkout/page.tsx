"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { pixelInitiateCheckout } from "@/lib/pixel";

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

function Field({ label, required, error, children }: {
  label: string; required?: boolean; error?: string; children: React.ReactNode;
}) {
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

function Input({ value, onChange, placeholder, type = "text", error, maxLength }: {
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
  // Prevents the "cart empty → redirect to shop" effect from firing during checkout submission
  const completingOrder = useRef(false);

  const LS_KEY = "hardin_checkout_details";
  const [form, setForm] = useState<FormData>(() => {
    const empty: FormData = { customerName: "", mobile: "", email: "", addressLine1: "", addressLine2: "", city: "", state: "", pincode: "" };
    if (typeof window === "undefined") return empty;
    try {
      const saved = localStorage.getItem(LS_KEY);
      return saved ? { ...empty, ...JSON.parse(saved) } : empty;
    } catch { return empty; }
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [paymentFailed, setPaymentFailed] = useState<{ message: string; canRetry: boolean } | null>(null);
  const [pincodeLoading, setPincodeLoading] = useState(false);
  const [pincodeStatus, setPincodeStatus] = useState<"idle" | "ok" | "error">("idle");

  // ── Pincode autofill via India Post API ──────────────────────────────────────
  useEffect(() => {
    const pin = form.pincode.trim();
    if (pin.length !== 6) {
      if (pincodeStatus !== "idle") setPincodeStatus("idle");
      return;
    }
    let cancelled = false;
    setPincodeLoading(true);
    setPincodeStatus("idle");

    fetch(`https://api.postalpincode.in/pincode/${pin}`)
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        const post = data?.[0];
        if (post?.Status === "Success" && post.PostOffice?.length > 0) {
          const po = post.PostOffice[0];
          setForm((prev) => ({
            ...prev,
            city: po.District || po.Name || prev.city,
            state: INDIAN_STATES.includes(po.State) ? po.State : prev.state,
          }));
          // Clear city/state errors if autofilled
          setErrors((prev) => ({ ...prev, city: undefined, state: undefined }));
          setPincodeStatus("ok");
        } else {
          setPincodeStatus("error");
        }
      })
      .catch(() => { if (!cancelled) setPincodeStatus("error"); })
      .finally(() => { if (!cancelled) setPincodeLoading(false); });

    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.pincode]);

  // Coupon state
  const [couponInput, setCouponInput] = useState("");
  const [couponApplied, setCouponApplied] = useState<{ code: string; type: "percent" | "fixed"; value: number; label: string } | null>(null);
  const [couponError, setCouponError] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);

  const discountedSubtotal = subtotal - discount;
  const couponDiscount = couponApplied
    ? couponApplied.type === "percent"
      ? Math.round(discountedSubtotal * couponApplied.value / 100)
      : Math.min(couponApplied.value, discountedSubtotal)
    : 0;
  const afterCoupon = discountedSubtotal - couponDiscount;
  const shipping = afterCoupon >= 399 ? 0 : 60;
  const total = afterCoupon + shipping;

  async function applyCoupon() {
    if (!couponInput.trim()) return;
    setCouponLoading(true);
    setCouponError("");
    try {
      const res = await fetch("/api/coupon/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponInput.trim(), orderType: "regular" }),
      });
      const data = await res.json();
      if (data.valid) {
        setCouponApplied({ code: data.code, type: data.type, value: data.value, label: data.label });
        setCouponInput("");
      } else {
        setCouponError(data.message);
      }
    } catch {
      setCouponError("Could not validate coupon. Try again.");
    } finally {
      setCouponLoading(false);
    }
  }

  function removeCoupon() {
    setCouponApplied(null);
    setCouponError("");
    setCouponInput("");
  }

  useEffect(() => {
    // Don't redirect when we're the ones clearing the cart after a successful order
    if (items.length === 0 && !completingOrder.current) router.replace("/shop");
  }, [items, router]);

  // Persist form to localStorage so it survives page refreshes and return visits
  useEffect(() => {
    try { localStorage.setItem(LS_KEY, JSON.stringify(form)); } catch { /* ignore */ }
  }, [form]);

  // Auto-populate from saved profile on mount
  useEffect(() => {
    fetch("/api/account/profile")
      .then((r) => r.ok ? r.json() : null)
      .then((profile) => {
        if (!profile) return;
        setForm((prev) => ({
          ...prev,
          customerName: profile.name || prev.customerName,
          mobile: profile.mobile || prev.mobile,
          addressLine1: profile.address?.addressLine1 || prev.addressLine1,
          addressLine2: profile.address?.addressLine2 || prev.addressLine2,
          city: profile.address?.city || prev.city,
          state: profile.address?.state || prev.state,
          pincode: profile.address?.pincode || prev.pincode,
        }));
      })
      .catch(() => {/* not logged in — ignore */});
  }, []);

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

  async function handlePay() {
    if (!validate()) return;
    setLoading(true);
    setSubmitError("");
    setPaymentFailed(null);
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

            const saveRes = await fetch("/api/orders/save", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                ...form,
                items: orderItems,
                subtotal, discount,
                couponCode: couponApplied?.code ?? null,
                couponDiscount,
                shipping, totalAmount: total,
                paymentMethod: "Razorpay",
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                status: "paid",
              }),
            });
            const saveData = await saveRes.json();
            const hoOrderId = saveData.orderId || `HO-${Date.now()}`;

            completingOrder.current = true;
            clearCart();
            const itemsParam = encodeURIComponent(
              JSON.stringify(
                items.map((i) => ({
                  n: i.product.name,
                  q: i.quantity,
                  p: i.price,
                  img: i.product.images[0] ?? "",
                  size: i.selectedSize,
                }))
              )
            );
            router.push(
              `/order-confirmation?orderId=${hoOrderId}&method=paid` +
              `&name=${encodeURIComponent(form.customerName)}&mobile=${form.mobile}&total=${total}` +
              `&shipping=${shipping}` +
              `&items=${itemsParam}`
            );
            resolve();
          },
          modal: {
            ondismiss: () => { setLoading(false); resolve(); },
          },
        });

        rzp.on("payment.failed", (r: { error: { description: string; reason?: string } }) => {
          const msg = r.error?.description || "Payment could not be processed.";
          reject(Object.assign(new Error(msg), { isPaymentFailure: true }));
        });

        pixelInitiateCheckout({
          value: total,
          numItems: items.reduce((s, i) => s + i.quantity, 0),
          contentIds: items.map((i) => i.product.id),
        });
        rzp.open();
      });
    } catch (err) {
      const isPaymentFailure = (err as { isPaymentFailure?: boolean })?.isPaymentFailure === true;
      const message = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      if (isPaymentFailure) {
        setPaymentFailed({ message, canRetry: true });
      } else {
        setSubmitError(message);
      }
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
          {/* ── LEFT: Delivery Address ── */}
          <div className="space-y-5">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-[#1C1C1C] mb-5">Delivery Address</h2>
              <div className="space-y-4">

                <Field label="Full Name" required error={errors.customerName}>
                  <Input value={form.customerName} onChange={set("customerName")} placeholder="Rahul Sharma" error={!!errors.customerName} />
                </Field>

                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Mobile Number" required error={errors.mobile}>
                    <Input
                      value={form.mobile}
                      onChange={(v) => set("mobile")(v.replace(/\D/g, "").slice(0, 10))}
                      placeholder="9876543210" type="tel" error={!!errors.mobile} maxLength={10}
                    />
                  </Field>
                  <Field label="Email" error={errors.email}>
                    <Input value={form.email} onChange={set("email")} placeholder="rahul@email.com" type="email" />
                  </Field>
                </div>

                <Field label="Address Line 1" required error={errors.addressLine1}>
                  <Input value={form.addressLine1} onChange={set("addressLine1")} placeholder="House / Flat No., Street Name" error={!!errors.addressLine1} />
                </Field>

                <Field label="Address Line 2" error={errors.addressLine2}>
                  <Input value={form.addressLine2} onChange={set("addressLine2")} placeholder="Landmark, Colony, Area" />
                </Field>

                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="City" required error={errors.city}>
                    <Input value={form.city} onChange={set("city")} placeholder="Gurgaon" error={!!errors.city} />
                  </Field>
                    <Field label="Pincode" required error={errors.pincode}>
                    <div className="relative">
                      <Input
                        value={form.pincode}
                        onChange={(v) => {
                          set("pincode")(v.replace(/\D/g, "").slice(0, 6));
                          setPincodeStatus("idle");
                        }}
                        placeholder="122001" error={!!errors.pincode} maxLength={6}
                      />
                      {/* Status indicator */}
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        {pincodeLoading && (
                          <svg className="animate-spin w-4 h-4 text-[#2D5016]" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                          </svg>
                        )}
                        {!pincodeLoading && pincodeStatus === "ok" && (
                          <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                          </svg>
                        )}
                        {!pincodeLoading && pincodeStatus === "error" && (
                          <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                          </svg>
                        )}
                      </div>
                    </div>
                    {pincodeStatus === "ok" && !errors.pincode && (
                      <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                        City & state auto-filled
                      </p>
                    )}
                    {pincodeStatus === "error" && !errors.pincode && (
                      <p className="text-xs text-amber-600 mt-1">Pincode not found — please fill city & state manually</p>
                    )}
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

            {/* Generic error (network, verification, etc.) */}
            {submitError && !paymentFailed && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
                {submitError}
              </div>
            )}

            {/* Payment failure — retry flow */}
            {paymentFailed && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-red-800 text-sm">Payment Failed</p>
                    <p className="text-red-700 text-xs mt-0.5 leading-relaxed">{paymentFailed.message}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handlePay}
                    disabled={loading}
                    className="flex items-center justify-center gap-1.5 bg-red-600 text-white font-bold py-2.5 rounded-xl text-sm hover:bg-red-700 transition-colors disabled:opacity-60"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                    </svg>
                    Retry Payment
                  </button>
                  <a
                    href={`https://wa.me/919650595027?text=${encodeURIComponent("Hi! My payment failed while placing an order. Please help.")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 border border-red-200 text-red-700 font-semibold py-2.5 rounded-xl text-sm hover:bg-red-100 transition-colors"
                  >
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    Need Help?
                  </a>
                </div>
              </div>
            )}

            <button
              onClick={handlePay}
              disabled={loading || !!paymentFailed}
              className="w-full bg-[#A0522D] text-white font-bold py-4 rounded-xl text-base hover:bg-[#8B4513] transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
                  Pay ₹{total} Securely
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </>
              )}
            </button>

            <p className="text-center text-xs text-[#6B6B6B] flex items-center justify-center gap-1.5">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
              </svg>
              Secured by Razorpay · UPI · Cards · NetBanking · Wallets
            </p>
          </div>

          {/* ── RIGHT: Order Summary ── */}
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

            {/* Coupon */}
            <div className="border-t border-gray-100 pt-4">
              {couponApplied ? (
                <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-green-600 shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="text-xs font-bold text-green-700">{couponApplied.code}</p>
                      <p className="text-xs text-green-600">{couponApplied.label} applied</p>
                    </div>
                  </div>
                  <button onClick={removeCoupon} className="text-xs text-gray-400 hover:text-red-500 transition-colors underline">Remove</button>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => { setCouponInput(e.target.value.toUpperCase()); setCouponError(""); }}
                      onKeyDown={(e) => e.key === "Enter" && applyCoupon()}
                      placeholder="Coupon code"
                      className="flex-1 px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#2D5016] uppercase placeholder-normal placeholder:normal-case"
                    />
                    <button
                      onClick={applyCoupon}
                      disabled={couponLoading || !couponInput.trim()}
                      className="px-4 py-2.5 bg-[#2D5016] text-white text-sm font-semibold rounded-xl hover:bg-[#3D6B20] disabled:opacity-50 transition-colors whitespace-nowrap"
                    >
                      {couponLoading ? "..." : "Apply"}
                    </button>
                  </div>
                  {couponError && <p className="text-xs text-red-500">{couponError}</p>}
                </div>
              )}
            </div>

            <div className="pt-4 space-y-2.5">
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
              {couponDiscount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-green-600 font-medium">Coupon ({couponApplied?.code})</span>
                  <span className="text-green-600 font-bold">−₹{couponDiscount}</span>
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
              Estimated delivery: 4–6 business days
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
