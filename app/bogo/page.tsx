"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { products } from "@/data/products";

// ─── Countdown ────────────────────────────────────────────────────────────────
const OFFER_DURATION_HOURS = 24;
const SS_KEY = "hardin_bogo_expiry"; // sessionStorage — resets on browser close (intentional)

function getEndTime(): number {
  if (typeof window === "undefined") return Date.now() + OFFER_DURATION_HOURS * 3600 * 1000;
  const stored = sessionStorage.getItem(SS_KEY);
  if (stored) {
    const end = parseInt(stored, 10);
    if (end > Date.now()) return end;
  }
  const end = Date.now() + OFFER_DURATION_HOURS * 3600 * 1000;
  sessionStorage.setItem(SS_KEY, String(end));
  return end;
}

function useCountdown() {
  const [timeLeft, setTimeLeft] = useState({ h: 23, m: 59, s: 59, expired: false });
  const endRef = useRef<number>(0);
  useEffect(() => {
    endRef.current = getEndTime();
    const tick = () => {
      const diff = Math.max(0, endRef.current - Date.now());
      setTimeLeft({
        h: Math.floor(diff / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
        expired: diff === 0,
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return timeLeft;
}

// ─── Razorpay ─────────────────────────────────────────────────────────────────
declare global {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  interface Window { Razorpay: any; }
}

function loadRazorpay(): Promise<boolean> {
  return new Promise((resolve) => {
    if (document.getElementById("rzp-sdk")) { resolve(true); return; }
    const s = document.createElement("script");
    s.id = "rzp-sdk";
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

// ─── Form types ───────────────────────────────────────────────────────────────
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
  customerName: string; mobile: string; email: string;
  addressLine1: string; addressLine2: string;
  city: string; state: string; pincode: string;
}
type FormErrors = Partial<Record<keyof FormData, string>>;

// ─── Reusable field components ─────────────────────────────────────────────────
function Field({ label, required, error, children }: {
  label: string; required?: boolean; error?: string; children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-[#1C1C1C] mb-1.5">
        {label}{required && " *"}
        {!required && <span className="text-gray-400 font-normal"> (optional)</span>}
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
      type={type} value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder} maxLength={maxLength}
      className={`w-full px-4 py-3 rounded-xl border text-sm text-[#1C1C1C] placeholder-gray-400 focus:outline-none transition-colors bg-white ${
        error ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-[#8B1A1A]"
      }`}
    />
  );
}

// ─── Reviews ──────────────────────────────────────────────────────────────────
const REVIEWS = [
  { name: "Priya S.", city: "Delhi", text: "Ordered BOGO, gifted one to my mom. Both of us love it. Skin feels baby soft.", stars: 5 },
  { name: "Kavya R.", city: "Bangalore", text: "Can't believe I got 2 soaps for ₹149. The charcoal one cleared my skin in a week.", stars: 5 },
  { name: "Rohit M.", city: "Mumbai", text: "Wife forced me to order. Now she's reordered 3 times. Says it's the best soap she's used.", stars: 5 },
];

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function BogoPage() {
  const { h, m, s, expired } = useCountdown();
  const router = useRouter();

  const charcoal = products.find((p) => p.id === "charcoal-soap")!;
  const haldi = products.find((p) => p.id === "saffron-haldi-chandan")!;

  const BOGO_PRICE = 149;
  const ORIGINAL_PRICE = 298;
  const SAVINGS = ORIGINAL_PRICE - BOGO_PRICE;

  const [form, setForm] = useState<FormData>({
    customerName: "", mobile: "", email: "",
    addressLine1: "", addressLine2: "",
    city: "", state: "", pincode: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");

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

  async function handleCheckout() {
    if (!validate()) {
      // Scroll to first error
      document.getElementById("address-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    setLoading(true);
    setSubmitError("");
    try {
      const loaded = await loadRazorpay();
      if (!loaded) throw new Error("Failed to load payment gateway. Please try again.");

      const orderRes = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: BOGO_PRICE, receipt: `bogo_${Date.now()}` }),
      });
      if (!orderRes.ok) throw new Error("Could not initiate payment. Please try again.");
      const { orderId: rzpOrderId, amount: orderAmount, currency } = await orderRes.json();

      await new Promise<void>((resolve, reject) => {
        const rzp = new window.Razorpay({
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          order_id: rzpOrderId,
          amount: orderAmount,
          currency,
          name: "Hardin Organics",
          description: "BOGO: Activated Charcoal + Saffron Haldi Chandan Soap",
          theme: { color: "#8B1A1A" },
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
            // Verify
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
            if (!verified) { reject(new Error("Payment verification failed.")); return; }

            // Save order
            const saveRes = await fetch("/api/orders/save", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                ...form,
                items: [
                  { id: charcoal.id, name: charcoal.name, quantity: 1, price: BOGO_PRICE },
                  { id: haldi.id, name: haldi.name, quantity: 1, price: 0 },
                ],
                subtotal: BOGO_PRICE,
                discount: 0,
                shipping: 0,
                totalAmount: BOGO_PRICE,
                orderType: "BOGO",
                paymentMethod: "Razorpay",
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                status: "paid",
              }),
            });
            const saveData = await saveRes.json();
            const hoOrderId = saveData.orderId || `HO-${Date.now()}`;

            router.push(
              `/order-confirmation?orderId=${hoOrderId}&method=paid` +
              `&name=${encodeURIComponent(form.customerName)}&mobile=${form.mobile}&total=${BOGO_PRICE}`
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

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div className="min-h-screen bg-[#F5F0E8] font-sans">

      {/* Sticky urgency bar */}
      <div className="sticky top-0 z-50 bg-[#8B1A1A] text-white py-2.5 text-center">
        <div className="flex items-center justify-center gap-3 text-sm font-semibold">
          {expired ? (
            <span>This offer has ended.</span>
          ) : (
            <>
              <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z"/>
              </svg>
              <span>OFFER ENDS IN&nbsp;</span>
              <span className="font-mono bg-white/20 px-2 py-0.5 rounded text-base tracking-widest">
                {pad(h)}:{pad(m)}:{pad(s)}
              </span>
              <span className="hidden sm:inline">— Don&apos;t miss out</span>
            </>
          )}
        </div>
      </div>

      {/* Hero banner */}
      <div className="w-full">
        {/* Desktop */}
        <Image
          src="/images/bogo-page-banner.jpg"
          alt="Buy One Get One Free — Hardin Organics BOGO Sale"
          width={2000}
          height={694}
          className="hidden md:block w-full h-auto object-cover"
          priority
          quality={100}
          sizes="100vw"
        />
        {/* Mobile */}
        <Image
          src="/images/bogo-page-banner-mobile.jpg"
          alt="Buy One Get One Free — Hardin Organics BOGO Sale"
          width={1145}
          height={1374}
          className="block md:hidden w-full h-auto object-cover"
          priority
          sizes="100vw"
        />
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-5">

        {/* Products */}
        <div className="grid grid-cols-2 gap-4">
          {[charcoal, haldi].map((product, i) => (
            <div key={product.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[#EDE6D6]">
              <div className="relative aspect-square bg-[#EDE6D6]">
                <Image src={product.images[0]} alt={product.name} fill className="object-cover"
                  sizes="(max-width: 640px) 50vw, 300px" />
                <div className={`absolute top-2 right-2 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ${i === 1 ? "bg-[#8B1A1A]" : "bg-[#2D5016]"}`}>
                  {i === 1 ? "FREE" : "You Pay"}
                </div>
              </div>
              <div className="p-3 text-center">
                <p className="text-xs font-semibold text-[#1C1C1C] leading-tight">{product.name}</p>
                <div className="flex items-center justify-center gap-1.5 mt-1">
                  {i === 1 ? (
                    <><span className="text-xs text-gray-400 line-through">₹{product.price}</span>
                    <span className="text-sm font-bold text-[#8B1A1A]">FREE</span></>
                  ) : (
                    <span className="text-sm font-bold text-[#2D5016]">₹{product.price}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order summary */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#EDE6D6]">
          <h2 className="font-bold text-[#1C1C1C] mb-3 text-sm uppercase tracking-wide">Your Order</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-[#6B6B6B]">Activated Charcoal Soap (100g)</span>
              <span className="font-medium">₹149</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6B6B6B]">Saffron Haldi Chandan Soap (100g)</span>
              <span className="font-bold text-[#8B1A1A]">FREE</span>
            </div>
            <div className="flex justify-between text-xs text-[#6B6B6B]">
              <span>Shipping</span>
              <span className="text-[#2D5016] font-medium">FREE</span>
            </div>
            <div className="border-t border-gray-100 pt-2 flex justify-between font-bold text-lg">
              <span>Total</span>
              <div className="text-right">
                <span className="text-[#2D5016]">₹{BOGO_PRICE}</span>
                <div className="text-xs text-gray-400 font-normal line-through">₹{ORIGINAL_PRICE}</div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Address form ── */}
        <div id="address-form" className="bg-white rounded-2xl p-5 shadow-sm border border-[#EDE6D6]">
          <h2 className="font-bold text-[#1C1C1C] mb-1 text-base">Delivery Address</h2>
          <p className="text-xs text-[#6B6B6B] mb-5">Where should we deliver your soaps?</p>

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
                <Input
                  value={form.pincode}
                  onChange={(v) => set("pincode")(v.replace(/\D/g, "").slice(0, 6))}
                  placeholder="122001" error={!!errors.pincode} maxLength={6}
                />
              </Field>
            </div>

            <Field label="State" required error={errors.state}>
              <select
                value={form.state}
                onChange={(e) => set("state")(e.target.value)}
                className={`w-full px-4 py-3 rounded-xl border text-sm text-[#1C1C1C] focus:outline-none bg-white transition-colors ${
                  errors.state ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-[#8B1A1A]"
                }`}
              >
                <option value="">Select State</option>
                {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </Field>
          </div>
        </div>

        {/* Error */}
        {submitError && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
            {submitError}
          </div>
        )}

        {/* CTA */}
        {expired ? (
          <Link href="/shop" className="block w-full bg-[#2D5016] text-white font-bold py-5 rounded-2xl text-lg text-center hover:bg-[#3D6B20] transition-colors">
            See Current Offers →
          </Link>
        ) : (
          <button
            onClick={handleCheckout}
            disabled={loading}
            className="w-full bg-[#8B1A1A] hover:bg-[#A02020] text-white font-bold py-5 rounded-2xl text-lg transition-all duration-200 hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            {loading ? (
              <>
                <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                </svg>
                Opening Payment...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
                Claim My Free Soap — Pay ₹{BOGO_PRICE}
              </>
            )}
          </button>
        )}

        {/* Reassurance row */}
        <div className="grid grid-cols-3 gap-3 text-center">
          {[
            { icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z", label: "100% Secure" },
            { icon: "M5 12h14M5 12l4-4m-4 4 4 4", label: "Free Delivery" },
            { icon: "M3 10h10a8 8 0 0 1 8 8v2M3 10l4-4M3 10l4 4", label: "Easy Returns" },
          ].map((item) => (
            <div key={item.label} className="bg-white rounded-xl p-3 border border-[#EDE6D6]">
              <svg className="w-5 h-5 mx-auto mb-1.5 text-[#2D5016]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path d={item.icon}/>
              </svg>
              <p className="text-xs text-[#6B6B6B] font-medium">{item.label}</p>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-[#6B6B6B]">
          Secured by Razorpay · UPI · Cards · NetBanking · Wallets
        </p>

        {/* Social proof */}
        <div className="pt-3">
          <p className="text-center text-xs uppercase tracking-widest text-[#6B6B6B] font-semibold mb-4">
            What customers are saying
          </p>
          <div className="space-y-3">
            {REVIEWS.map((r) => (
              <div key={r.name} className="bg-white rounded-xl p-4 border border-[#EDE6D6]">
                <div className="flex items-center gap-0.5 mb-1.5">
                  {Array.from({ length: r.stars }).map((_, i) => (
                    <svg key={i} className="w-3.5 h-3.5 text-[#D4A017]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  ))}
                </div>
                <p className="text-sm text-[#1C1C1C] leading-relaxed mb-1">&ldquo;{r.text}&rdquo;</p>
                <p className="text-xs text-[#6B6B6B]">{r.name} · {r.city}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-white rounded-2xl p-5 border border-[#EDE6D6] space-y-4">
          <h3 className="font-bold text-[#1C1C1C] text-sm uppercase tracking-wide">Common Questions</h3>
          {[
            { q: "Is this offer real?", a: "Yes. Buy any 1 soap and we'll ship both to you. No tricks, no fine print. The offer expires when the timer hits zero." },
            { q: "Both soaps in one delivery?", a: "Absolutely. Both soaps are packed together and shipped within 24 hours of ordering." },
            { q: "What if I don't like it?", a: "We offer a 7-day hassle-free return policy. Not satisfied? Just WhatsApp us." },
          ].map((item) => (
            <div key={item.q}>
              <p className="text-sm font-semibold text-[#1C1C1C] mb-1">{item.q}</p>
              <p className="text-sm text-[#6B6B6B] leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>

        {/* Final CTA repeat */}
        <div className="text-center">
          {expired ? (
            <Link href="/shop" className="block w-full bg-[#2D5016] text-white font-bold py-5 rounded-2xl text-lg text-center hover:bg-[#3D6B20] transition-colors">
              See Current Offers →
            </Link>
          ) : (
            <>
              <button
                onClick={handleCheckout}
                disabled={loading}
                className="w-full bg-[#8B1A1A] hover:bg-[#A02020] text-white font-bold py-5 rounded-2xl text-lg transition-all duration-200 hover:shadow-xl disabled:opacity-70"
              >
                {loading ? "Opening Payment..." : `Claim My Free Soap — Pay ₹${BOGO_PRICE}`}
              </button>
              <p className="text-xs text-[#6B6B6B] mt-2">
                Offer expires in {pad(h)}h {pad(m)}m {pad(s)}s
              </p>
            </>
          )}
        </div>

        <p className="text-center text-xs text-[#6B6B6B] pb-4">
          &copy; {new Date().getFullYear()} Hardin Organics · All rights reserved
        </p>
      </div>
    </div>
  );
}
