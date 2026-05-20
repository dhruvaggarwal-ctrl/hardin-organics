"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

interface TrackingActivity {
  date: string;
  status: string;
  activity: string;
  location: string;
}

interface TrackingInfo {
  currentStatus: string;
  statusType?: string;
  origin: string | null;
  destination: string | null;
  pickupDate: string | null;
  deliveredDate: string | null;
  scheduledDeliveryDate: string | null;
  activities: TrackingActivity[];
}

interface OrderData {
  orderId: string;
  customerName: string;
  status: string;
  createdAt: string;
  city: string;
  items: Array<{ name: string; quantity: number; price: number }>;
  totalAmount: number;
  waybill: string | null;
  tracking: TrackingInfo | null;
}

// ── Stepper config ─────────────────────────────────────────────────────────────
const STEPS = [
  {
    key: "confirmed",
    label: "Confirmed",
    sublabel: "Order placed",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    key: "shipped",
    label: "Shipped",
    sublabel: "On its way",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0" />
      </svg>
    ),
  },
  {
    key: "out_for_delivery",
    label: "Out for Delivery",
    sublabel: "Arriving today",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    key: "delivered",
    label: "Delivered",
    sublabel: "Enjoy!",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
];

function getStepIndex(status: string): number {
  const s = (status || "").toLowerCase().replace(/ /g, "_");
  if (s.includes("deliver") && !s.includes("out")) return 3;
  if (s.includes("out") || s.includes("out_for")) return 2;
  if (s.includes("ship") || s.includes("transit") || s.includes("dispatch")) return 1;
  return 0;
}

function formatDate(d: string) {
  try {
    return new Date(d).toLocaleString("en-IN", {
      day: "numeric", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  } catch { return d; }
}

function formatShortDate(d: string) {
  try {
    return new Date(d).toLocaleDateString("en-IN", {
      day: "numeric", month: "short", year: "numeric",
    });
  } catch { return d; }
}

// ── Not Found ──────────────────────────────────────────────────────────────────
function NotFound({ orderId }: { orderId: string }) {
  return (
    <div className="min-h-screen bg-[#F5F0E8] flex flex-col items-center justify-center px-4 py-16">
      <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-xl">
        <div className="w-16 h-16 bg-[#F5F0E8] rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-[#6B6B6B]" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-[#1C1C1C] mb-2">Order Not Found</h2>
        <p className="text-[#6B6B6B] text-sm mb-6 leading-relaxed">
          We couldn&apos;t find an order with ID <strong className="text-[#1C1C1C] font-mono">{orderId}</strong>.
          Double-check the ID or contact support.
        </p>
        <Link
          href="/account/dashboard"
          className="block w-full bg-[#2D5016] text-white font-bold py-3.5 rounded-2xl hover:bg-[#3D6B20] transition-colors text-sm"
        >
          Go to My Account
        </Link>
        <a
          href={`https://wa.me/919650595027?text=${encodeURIComponent("Hi! I need help finding my order.")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full mt-2 border border-[#EDE6D6] text-[#6B6B6B] font-semibold py-3.5 rounded-2xl hover:border-[#2D5016] hover:text-[#2D5016] transition-all text-sm"
        >
          WhatsApp Support
        </a>
      </div>
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────────
const POLL_INTERVAL_MS = 15_000; // refresh every 15 seconds while page is open

export default function TrackPage() {
  const params = useParams();
  const orderId = (params?.orderId as string) ?? "";
  const [data, setData] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);

  async function fetchStatus(isInitial = false) {
    try {
      const r = await fetch(`/api/track/${orderId}`);
      if (r.status === 404) { setNotFound(true); setLoading(false); return; }
      if (!r.ok) throw new Error("error");
      const d = await r.json();
      setData(d);
      setLastRefreshed(new Date());
      if (isInitial) setLoading(false);
    } catch {
      if (isInitial) { setNotFound(true); setLoading(false); }
    }
  }

  useEffect(() => {
    if (!orderId) return;
    fetchStatus(true);

    // Poll every 15 seconds — stops automatically when order is delivered/cancelled
    const timer = setInterval(() => {
      setData((current) => {
        const done = current?.status === "delivered" || current?.status === "cancelled";
        if (!done) fetchStatus(false);
        return current;
      });
    }, POLL_INTERVAL_MS);

    return () => clearInterval(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F0E8] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-[#2D5016] border-t-transparent animate-spin" />
          <p className="text-sm text-[#6B6B6B] font-medium">Fetching your order…</p>
        </div>
      </div>
    );
  }

  if (notFound || !data) return <NotFound orderId={orderId} />;

  const rawStatus = data.tracking?.currentStatus || data.status;
  const stepIdx = getStepIndex(rawStatus);
  const isCancelled = data.status === "cancelled";
  const isDelivered = stepIdx === 3;
  const hasShipped = stepIdx >= 1;
  const progressPct = (stepIdx / 3) * 100;
  const firstName = data.customerName.split(" ")[0];

  // Hero badge colour
  const heroBg = isCancelled
    ? "bg-red-500"
    : isDelivered
    ? "bg-[#2D5016]"
    : "bg-[#2D5016]";

  const statusLabel = isCancelled
    ? "Cancelled"
    : STEPS[stepIdx]?.label ?? "Confirmed";

  const statusSublabel = isCancelled
    ? "This order was cancelled."
    : isDelivered
    ? "Your order has been delivered!"
    : !hasShipped
    ? "We're packing your order — it'll ship within 24 hours."
    : `In transit to ${data.city || "your address"}`;

  return (
    <div className="min-h-screen bg-[#F5F0E8]">
      {/* ── Banner ── */}
      <div className={`${heroBg} pt-12 pb-28 px-4 text-center relative overflow-hidden`}>
        <div className="absolute inset-0 opacity-[0.06] pointer-events-none select-none">
          {["🌿", "✨", "🌿", "✨", "🌿"].map((e, i) => (
            <span key={i} className="absolute text-5xl" style={{ left: `${8 + i * 21}%`, top: `${15 + (i % 2) * 45}%` }}>{e}</span>
          ))}
        </div>

        <Link href="/account/dashboard" className="absolute top-4 left-4 text-white/60 hover:text-white text-sm flex items-center gap-1 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          My Orders
        </Link>

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
          className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 ring-2 ring-white/30"
        >
          {isDelivered ? (
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          ) : isCancelled ? (
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0" />
            </svg>
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <p className="text-white/60 text-xs uppercase tracking-widest mb-0.5">Order Status</p>
          <h1 className="text-2xl md:text-3xl font-bold text-white font-display">{statusLabel}</h1>
          <p className="text-white/70 text-sm mt-1">
            Hey <span className="text-white font-semibold">{firstName}</span> — {statusSublabel}
          </p>
        </motion.div>
      </div>

      {/* ── Cards ── */}
      <div className="max-w-lg mx-auto px-4 -mt-16 pb-16 relative z-10 space-y-4">

        {/* ── Progress card ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-white rounded-3xl shadow-xl overflow-hidden"
        >
          {/* Order ID strip */}
          <div className="bg-[#F5F0E8] px-5 py-3.5 flex items-center justify-between border-b border-[#EDE6D6]">
            <div>
              <p className="text-[10px] text-[#6B6B6B] uppercase tracking-widest">Order ID</p>
              <p className="font-mono font-bold text-[#1C1C1C] text-sm tracking-wide mt-0.5">{data.orderId}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-[#6B6B6B] uppercase tracking-widest">Placed</p>
              <p className="text-xs font-medium text-[#1C1C1C] mt-0.5">{formatShortDate(data.createdAt)}</p>
            </div>
          </div>

          {/* Live refresh indicator */}
          {!isCancelled && !isDelivered && (
            <div className="flex items-center justify-center gap-1.5 py-2 bg-green-50 border-b border-green-100">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <p className="text-[10px] text-green-700 font-medium">
                Live · Auto-refreshes every 15s
                {lastRefreshed && (
                  <span className="text-green-500 ml-1">
                    · Updated {lastRefreshed.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                  </span>
                )}
              </p>
            </div>
          )}

          {/* Stepper */}
          {!isCancelled && (
            <div className="px-6 pt-6 pb-5">
              <div className="relative flex items-start justify-between">
                {/* Background track */}
                <div className="absolute top-5 left-5 right-5 h-0.5 bg-[#EDE6D6]" />
                {/* Animated progress */}
                <motion.div
                  className="absolute top-5 left-5 h-0.5 bg-[#2D5016] origin-left"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: progressPct / 100 }}
                  transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
                  style={{ right: "1.25rem", transformOrigin: "left" }}
                />

                {STEPS.map((step, i) => {
                  const done = i < stepIdx;
                  const active = i === stepIdx;
                  return (
                    <div key={step.key} className="flex flex-col items-center gap-2 z-10 flex-1">
                      <motion.div
                        initial={{ scale: 0.7, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.3 + i * 0.1 }}
                        className={`w-10 h-10 rounded-full flex items-center justify-center border-2 shadow-sm transition-all ${
                          done
                            ? "bg-[#2D5016] border-[#2D5016] text-white"
                            : active
                            ? "bg-[#2D5016] border-[#2D5016] text-white ring-4 ring-[#2D5016]/20"
                            : "bg-white border-[#EDE6D6] text-[#C4C4C4]"
                        }`}
                      >
                        {done ? (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          step.icon
                        )}
                      </motion.div>
                      <p className={`text-[10px] font-semibold text-center leading-tight px-0.5 ${
                        i <= stepIdx ? "text-[#2D5016]" : "text-[#BBBBBB]"
                      }`}>
                        {step.label}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Courier / ETA row */}
          {!isCancelled && (
            <div className="border-t border-[#F0EBE0] mx-5 mb-5 pt-4 space-y-2">
              {/* Not yet shipped */}
              {!hasShipped && (
                <div className="flex items-center gap-2.5 bg-amber-50 rounded-xl px-4 py-3">
                  <svg className="w-4 h-4 text-amber-600 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-xs text-amber-800 font-medium">
                    Your order is being packed — tracking details will appear once shipped.
                  </p>
                </div>
              )}

              {/* Waybill + ETA */}
              {hasShipped && (
                <div className="grid grid-cols-2 gap-3">
                  {data.waybill && (
                    <div className="bg-[#F5F0E8] rounded-xl p-3">
                      <p className="text-[10px] text-[#6B6B6B] uppercase tracking-widest">Waybill</p>
                      <p className="font-mono text-xs font-bold text-[#1C1C1C] mt-0.5 break-all">{data.waybill}</p>
                    </div>
                  )}
                  {data.tracking?.scheduledDeliveryDate && !isDelivered && (
                    <div className="bg-[#F5F0E8] rounded-xl p-3">
                      <p className="text-[10px] text-[#6B6B6B] uppercase tracking-widest">Expected</p>
                      <p className="text-xs font-bold text-[#1C1C1C] mt-0.5">{formatShortDate(data.tracking.scheduledDeliveryDate)}</p>
                    </div>
                  )}
                  {isDelivered && data.tracking?.deliveredDate && (
                    <div className="bg-green-50 rounded-xl p-3 col-span-2">
                      <p className="text-[10px] text-green-700 uppercase tracking-widest">Delivered on</p>
                      <p className="text-xs font-bold text-green-800 mt-0.5">{formatDate(data.tracking.deliveredDate)}</p>
                    </div>
                  )}
                </div>
              )}

              {/* External tracking link */}
              {data.waybill && (
                <a
                  href={`https://www.delhivery.com/track/package/${data.waybill}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 text-xs text-[#2D5016] font-semibold hover:underline pt-1"
                >
                  View on Delhivery
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              )}
            </div>
          )}
        </motion.div>

        {/* ── Tracking timeline ── */}
        {data.tracking && data.tracking.activities.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="bg-white rounded-3xl shadow-sm overflow-hidden"
          >
            <div className="px-5 py-4 border-b border-[#F0EBE0]">
              <h2 className="font-bold text-[#1C1C1C] text-sm">Shipment Updates</h2>
            </div>
            <div className="px-5 py-4 space-y-0">
              {data.tracking.activities.map((a, i) => (
                <div key={i} className="flex gap-3">
                  {/* Timeline spine */}
                  <div className="flex flex-col items-center pt-0.5">
                    <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${i === 0 ? "bg-[#2D5016]" : "bg-[#D6CEC0]"}`} />
                    {i < data.tracking!.activities.length - 1 && (
                      <div className="w-px flex-1 bg-[#EDE6D6] my-1.5 min-h-[1.5rem]" />
                    )}
                  </div>
                  {/* Content */}
                  <div className={`pb-4 flex-1 min-w-0 ${i === data.tracking!.activities.length - 1 ? "pb-0" : ""}`}>
                    <p className={`text-sm font-semibold leading-snug ${i === 0 ? "text-[#1C1C1C]" : "text-[#6B6B6B]"}`}>
                      {a.activity}
                    </p>
                    {a.location && (
                      <div className="flex items-center gap-1 mt-0.5">
                        <svg className="w-3 h-3 text-[#9B9B9B] shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="text-xs text-[#9B9B9B]">{a.location}</span>
                      </div>
                    )}
                    <p className="text-xs text-[#BBBBBB] mt-0.5">{formatDate(a.date)}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── Order summary ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-3xl shadow-sm overflow-hidden"
        >
          <div className="px-5 py-4 border-b border-[#F0EBE0]">
            <h2 className="font-bold text-[#1C1C1C] text-sm">Order Summary</h2>
          </div>
          <div className="px-5 py-4 space-y-3">
            {data.items.map((item, i) => (
              <div key={i} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-[#F5F0E8] flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4 text-[#6B6B6B]" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[#1C1C1C] truncate">{item.name}</p>
                    <p className="text-xs text-[#9B9B9B]">Qty: {item.quantity}</p>
                  </div>
                </div>
                <span className="text-sm font-bold text-[#1C1C1C] shrink-0">₹{item.price * item.quantity}</span>
              </div>
            ))}

            <div className="border-t border-[#F0EBE0] pt-3 flex justify-between items-center">
              <span className="text-sm font-bold text-[#1C1C1C]">Total Paid</span>
              <span className="text-base font-bold text-[#2D5016]">₹{data.totalAmount}</span>
            </div>
          </div>
        </motion.div>

        {/* ── Help ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="grid grid-cols-2 gap-3"
        >
          <a
            href={`https://wa.me/919650595027?text=${encodeURIComponent(`Hi! I have a query about order ${data.orderId}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-[#25D366] text-white font-bold py-3.5 rounded-2xl text-sm hover:bg-[#1fba58] transition-colors"
          >
            <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Need Help?
          </a>
          <Link
            href="/shop"
            className="flex items-center justify-center gap-2 bg-[#2D5016] text-white font-bold py-3.5 rounded-2xl text-sm hover:bg-[#3D6B20] transition-colors"
          >
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            Shop Again
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
