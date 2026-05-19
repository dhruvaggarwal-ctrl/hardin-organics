"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";

interface TrackingActivity {
  date: string;
  status: string;
  activity: string;
  location: string;
}

interface TrackingInfo {
  currentStatus: string;
  courierName: string | null;
  origin: string | null;
  destination: string | null;
  deliveredDate: string | null;
  trackUrl: string | null;
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
  awbCode: string | null;
  tracking: TrackingInfo | null;
}

const STATUS_STEPS = ["confirmed", "shipped", "out_for_delivery", "delivered"];

const STATUS_LABELS: Record<string, string> = {
  pending: "Order Placed",
  paid: "Payment Confirmed",
  confirmed: "Confirmed",
  processing: "Processing",
  shipped: "Shipped",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const STATUS_COLORS: Record<string, string> = {
  pending: "text-yellow-600 bg-yellow-50",
  paid: "text-blue-600 bg-blue-50",
  confirmed: "text-blue-600 bg-blue-50",
  processing: "text-purple-600 bg-purple-50",
  shipped: "text-purple-600 bg-purple-50",
  out_for_delivery: "text-orange-600 bg-orange-50",
  delivered: "text-green-600 bg-green-50",
  cancelled: "text-red-600 bg-red-50",
};

function getStepIndex(status: string): number {
  const s = status.toLowerCase();
  if (s === "delivered") return 3;
  if (s === "out_for_delivery" || s.includes("out for")) return 2;
  if (s === "shipped" || s.includes("ship")) return 1;
  if (s === "confirmed" || s === "paid" || s === "processing") return 0;
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

export default function TrackPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = use(params);
  const [data, setData] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/track/${orderId}`)
      .then(async (r) => {
        if (!r.ok) throw new Error("not found");
        return r.json();
      })
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => { setError("Order not found"); setLoading(false); });
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F0E8] flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-4 border-[#A0522D] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-[#F5F0E8] flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-sm">
          <div className="text-5xl mb-4">🔍</div>
          <h2 className="text-xl font-bold text-[#1C1C1A] mb-2">Order Not Found</h2>
          <p className="text-[#6B6B6B] text-sm mb-6">
            We couldn&apos;t find an order with ID <strong>{orderId}</strong>.
          </p>
          <Link href="/account/dashboard" className="inline-block bg-[#A0522D] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#8B4513] transition-colors">
            Go to My Account
          </Link>
        </div>
      </div>
    );
  }

  const stepIdx = getStepIndex(data.tracking?.currentStatus || data.status);
  const isCancelled = data.status === "cancelled";
  const statusLabel = STATUS_LABELS[data.status] || data.status;
  const statusColor = STATUS_COLORS[data.status] || "text-gray-600 bg-gray-50";

  return (
    <div className="min-h-screen bg-[#F5F0E8]">
      {/* Header */}
      <div className="bg-[#2D5016] text-white py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <Link href="/account/dashboard" className="text-white/70 text-sm hover:text-white mb-4 inline-block">
            ← My Account
          </Link>
          <h1 className="text-2xl font-bold font-display">Track Your Order</h1>
          <p className="text-white/70 text-sm mt-1">{data.orderId}</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        {/* Status card */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs text-[#6B6B6B]">Placed on {formatDate(data.createdAt)}</p>
              <p className="font-bold text-[#1C1C1A] mt-0.5">{data.customerName}</p>
            </div>
            <span className={`text-xs font-bold px-3 py-1.5 rounded-full capitalize ${statusColor}`}>
              {statusLabel}
            </span>
          </div>

          {/* Progress stepper */}
          {!isCancelled && (
            <div className="relative mt-6 mb-2">
              <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200 mx-8" />
              <div
                className="absolute top-4 left-0 h-0.5 bg-[#2D5016] mx-8 transition-all duration-700"
                style={{ width: `${(stepIdx / 3) * 100}%` }}
              />
              <div className="relative flex justify-between">
                {STATUS_STEPS.map((step, i) => (
                  <div key={step} className="flex flex-col items-center gap-2">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold z-10 transition-colors ${
                        i <= stepIdx
                          ? "bg-[#2D5016] text-white"
                          : "bg-gray-200 text-gray-400"
                      }`}
                    >
                      {i < stepIdx ? "✓" : i + 1}
                    </div>
                    <span className={`text-[10px] font-medium text-center max-w-[60px] leading-tight ${i <= stepIdx ? "text-[#2D5016]" : "text-gray-400"}`}>
                      {STATUS_LABELS[step]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Courier info */}
          {data.tracking && (
            <div className="mt-5 pt-4 border-t border-gray-100 space-y-1">
              {data.tracking.courierName && (
                <p className="text-sm text-[#6B6B6B]">
                  <span className="font-medium text-[#1C1C1A]">Courier:</span> {data.tracking.courierName}
                </p>
              )}
              {data.awbCode && (
                <p className="text-sm text-[#6B6B6B]">
                  <span className="font-medium text-[#1C1C1A]">AWB:</span> {data.awbCode}
                </p>
              )}
              {data.tracking.deliveredDate && (
                <p className="text-sm text-green-600 font-medium">
                  ✓ Delivered on {formatDate(data.tracking.deliveredDate)}
                </p>
              )}
              {data.tracking.trackUrl && (
                <a
                  href={data.tracking.trackUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-2 text-xs text-[#A0522D] underline hover:text-[#8B4513]"
                >
                  Track on courier website →
                </a>
              )}
            </div>
          )}

          {/* No live tracking yet */}
          {!data.tracking && !isCancelled && (
            <p className="mt-4 text-sm text-[#6B6B6B] text-center">
              Live tracking will appear here once your order is shipped.
            </p>
          )}
        </div>

        {/* Tracking timeline */}
        {data.tracking && data.tracking.activities.length > 0 && (
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h2 className="font-bold text-[#1C1C1A] mb-4">Shipment Updates</h2>
            <div className="space-y-4">
              {data.tracking.activities.map((a, i) => (
                <div key={i} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-2.5 h-2.5 rounded-full mt-1 flex-shrink-0 ${i === 0 ? "bg-[#2D5016]" : "bg-gray-300"}`} />
                    {i < data.tracking!.activities.length - 1 && (
                      <div className="w-px flex-1 bg-gray-200 my-1" />
                    )}
                  </div>
                  <div className="pb-3">
                    <p className={`text-sm font-medium ${i === 0 ? "text-[#1C1C1A]" : "text-[#6B6B6B]"}`}>
                      {a.activity}
                    </p>
                    {a.location && (
                      <p className="text-xs text-[#6B6B6B] mt-0.5">📍 {a.location}</p>
                    )}
                    <p className="text-xs text-[#9B9B9B] mt-0.5">{formatDate(a.date)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Order summary */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h2 className="font-bold text-[#1C1C1A] mb-4">Order Summary</h2>
          <div className="space-y-2 mb-4">
            {data.items.map((item, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="text-[#6B6B6B]">{item.name} × {item.quantity}</span>
                <span className="font-medium text-[#1C1C1A]">₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-100 pt-3 flex justify-between font-bold">
            <span>Total</span>
            <span>₹{data.totalAmount}</span>
          </div>
        </div>

        {/* Help */}
        <div className="flex gap-3">
          <a
            href={`https://wa.me/919871900959?text=${encodeURIComponent(`Hi! Query about order ${data.orderId}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] text-white font-bold py-3 rounded-xl text-sm hover:bg-[#1fba58] transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            WhatsApp Support
          </a>
          <Link
            href="/shop"
            className="flex-1 flex items-center justify-center bg-[#2D5016] text-white font-bold py-3 rounded-xl text-sm hover:bg-[#3D6B20] transition-colors"
          >
            Shop Again →
          </Link>
        </div>
      </div>
    </div>
  );
}
