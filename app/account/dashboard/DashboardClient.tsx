"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { products } from "@/data/products";

interface Order {
  orderId: string;
  customerName: string;
  items: Array<{ id?: string; name: string; quantity: number; price: number }>;
  totalAmount: number;
  status: string;
  createdAt: string;
  awbCode?: string;
}
interface Customer {
  id: string; mobile?: string; email?: string; name?: string; birthday?: string;
  address?: { addressLine1?: string; addressLine2?: string; city?: string; state?: string; pincode?: string };
}

const STATUS_COLORS: Record<string, string> = {
  paid: "bg-green-100 text-green-700",
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-blue-100 text-blue-700",
  shipped: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

function pad(d: string) {
  return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export function DashboardClient({ customer, orders }: { customer: Customer; orders: Order[] }) {
  const router = useRouter();
  const { addToCart } = useCart();
  const [tab, setTab] = useState("orders");
  const [profile, setProfile] = useState({ name: customer.name || "", mobile: customer.mobile || "", birthday: customer.birthday || "" });
  const [address, setAddress] = useState(customer.address || { addressLine1: "", addressLine2: "", city: "", state: "", pincode: "" });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState("");
  const [nameSet, setNameSet] = useState(!!customer.name);

  const firstName = (customer.name || customer.mobile || "Friend").split(" ")[0];

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
  }

  async function saveProfile() {
    setSaving(true);
    await fetch("/api/account/profile", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(profile) });
    setSaving(false); setSaved("profile"); setTimeout(() => setSaved(""), 3000);
    setNameSet(true);
  }

  async function saveAddress() {
    setSaving(true);
    await fetch("/api/account/address", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(address) });
    setSaving(false); setSaved("address"); setTimeout(() => setSaved(""), 3000);
    // Save to localStorage for checkout to read
    localStorage.setItem("hardin_saved_address", JSON.stringify(address));
  }

  function reorder(order: Order) {
    for (const item of order.items) {
      const product = products.find((p) => p.id === item.id || p.name === item.name);
      if (product) addToCart(product, product.sizes[0].label, product.price, item.quantity);
    }
    router.push("/cart");
  }

  // First-time name prompt
  if (!nameSet) {
    return (
      <div className="min-h-screen bg-[#F5F0E8] flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-sm p-8 max-w-sm w-full text-center">
          <div className="w-14 h-14 bg-[#F5F0E8] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-[#2D5016]" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-[#1C1C1A] mb-2">Welcome to Hardin Organics!</h2>
          <p className="text-[#6B6B6B] text-sm mb-6">What should we call you?</p>
          <input
            type="text"
            placeholder="Your name"
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm mb-4 focus:outline-none focus:border-[#A0522D]"
          />
          <button
            onClick={saveProfile}
            disabled={!profile.name.trim()}
            className="w-full bg-[#A0522D] text-white font-bold py-3 rounded-xl disabled:opacity-50"
          >
            Continue →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F0E8]">
      {/* Header */}
      <div className="bg-[#2D5016] text-white py-8 px-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div>
            <p className="text-white/70 text-sm">Welcome back,</p>
            <h1 className="text-2xl font-bold font-display flex items-center gap-2">{firstName}
              <svg className="w-5 h-5 text-green-300 inline" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 3s0 8 7 13C19 11 19 3 19 3s-7 2-14 0z" />
              </svg>
            </h1>
          </div>
          <button onClick={logout} className="text-sm text-white/70 hover:text-white transition-colors">Log out</button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="flex gap-1 bg-white rounded-xl p-1 mb-6 shadow-sm">
          {["orders", "profile", "address"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-colors capitalize ${tab === t ? "bg-[#2D5016] text-white" : "text-[#6B6B6B] hover:text-[#1C1C1A]"}`}
            >
              {t === "address" ? "Saved Address" : t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* Orders */}
        {tab === "orders" && (
          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
                <div className="w-14 h-14 bg-[#F5F0E8] rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <svg className="w-7 h-7 text-[#A0522D]" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <p className="text-[#6B6B6B] mb-4">No orders yet. Your first order is just a click away.</p>
                <Link href="/shop" className="inline-block bg-[#A0522D] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#8B4513] transition-colors">Shop Now →</Link>
              </div>
            ) : orders.map((order) => (
              <div key={order.orderId} className="bg-white rounded-2xl p-5 shadow-sm border border-[#EDE6D6]">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-bold text-[#1C1C1A] text-sm">{order.orderId}</p>
                    <p className="text-xs text-[#6B6B6B]">{pad(order.createdAt)}</p>
                  </div>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full capitalize ${STATUS_COLORS[order.status] || "bg-gray-100 text-gray-600"}`}>
                    {order.status}
                  </span>
                </div>
                <div className="space-y-1 mb-3">
                  {order.items.map((item, i) => (
                    <p key={i} className="text-sm text-[#6B6B6B]">{item.name} × {item.quantity}</p>
                  ))}
                </div>
                <p className="font-bold text-[#1C1C1A] mb-3">₹{order.totalAmount}</p>
                <div className="flex gap-2 flex-wrap">
                  <Link href={`/track/${order.orderId}`} className="text-xs bg-[#2D5016] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#3D6B20] transition-colors">Track Order →</Link>
                  <button onClick={() => reorder(order)} className="text-xs border border-[#A0522D] text-[#A0522D] px-4 py-2 rounded-lg font-medium hover:bg-[#A0522D] hover:text-white transition-colors">Reorder</button>
                  <a href={`https://wa.me/919650595027?text=${encodeURIComponent(`Hi! Query about order ${order.orderId}`)}`} target="_blank" rel="noopener noreferrer" className="text-xs border border-gray-200 text-[#6B6B6B] px-4 py-2 rounded-lg font-medium hover:border-[#25D366] hover:text-[#25D366] transition-colors">WhatsApp →</a>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Profile */}
        {tab === "profile" && (
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="font-bold text-[#1C1C1A] mb-5">Your Profile</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#1C1C1A] mb-1.5">Full Name</label>
                <input type="text" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#A0522D]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1C1C1A] mb-1.5">Mobile <span className="text-[#6B6B6B] font-normal">(read-only)</span></label>
                <input type="tel" value={customer.mobile ? `+91 ${customer.mobile}` : customer.email || ""} readOnly className="w-full px-4 py-3 border border-gray-100 rounded-xl text-sm bg-gray-50 text-[#6B6B6B]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1C1C1A] mb-1.5">Birthday <span className="text-[#6B6B6B] font-normal">(optional)</span></label>
                <input type="date" value={profile.birthday} onChange={(e) => setProfile({ ...profile, birthday: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#A0522D]" />
              </div>
              <button onClick={saveProfile} disabled={saving} className="w-full bg-[#A0522D] text-white font-bold py-3 rounded-xl hover:bg-[#8B4513] transition-colors disabled:opacity-60">
                {saved === "profile" ? "✓ Saved!" : saving ? "Saving…" : "Save Changes"}
              </button>
            </div>
          </div>
        )}

        {/* Saved Address */}
        {tab === "address" && (
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="font-bold text-[#1C1C1A] mb-5">Saved Address</h2>
            <div className="space-y-4">
              {(["addressLine1", "addressLine2", "city", "state", "pincode"] as const).map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-[#1C1C1A] mb-1.5 capitalize">{field.replace(/([A-Z])/g, " $1")}</label>
                  <input
                    type="text"
                    value={address[field] || ""}
                    onChange={(e) => setAddress({ ...address, [field]: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#A0522D]"
                  />
                </div>
              ))}
              <button onClick={saveAddress} disabled={saving} className="w-full bg-[#A0522D] text-white font-bold py-3 rounded-xl hover:bg-[#8B4513] transition-colors disabled:opacity-60">
                {saved === "address" ? "✓ Saved!" : saving ? "Saving…" : "Save Address"}
              </button>
              <p className="text-xs text-[#6B6B6B] text-center">This address will be pre-filled at checkout.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
