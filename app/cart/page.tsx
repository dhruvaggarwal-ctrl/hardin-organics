"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { products } from "@/data/products";
import { ProductCard } from "@/components/ui/ProductCard";
import { RazorpayButton } from "@/components/checkout/RazorpayButton";

export default function CartPage() {
  const {
    items, removeFromCart, updateQuantity,
    subtotal, freeShippingThreshold, amountToFreeShipping,
    clearCart,
  } = useCart();

  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState("");

  const shipping = subtotal >= freeShippingThreshold ? 0 : 60;
  const discount = couponApplied ? Math.floor(subtotal * 0.1) : 0;
  const total = subtotal + shipping - discount;
  const shippingProgress = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  const handleCoupon = () => {
    if (coupon.toUpperCase() === "WELCOME10" || coupon.toUpperCase() === "HARDIN10") {
      setCouponApplied(true);
      setCouponError("");
    } else {
      setCouponError("Invalid coupon code. Try WELCOME10");
    }
  };

  const upsellProducts = products.filter((p) => !items.some((i) => i.product.id === p.id)).slice(0, 2);

  return (
    <div className="min-h-screen bg-[#F5F0E8] py-10">
      <div className="max-w-7xl mx-auto px-4">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-bold text-[#1C1C1C] mb-8 font-display"
        >
          Your Cart ({items.reduce((s, i) => s + i.quantity, 0)} items)
        </motion.h1>

        {items.length === 0 ? (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-[#1C1C1C] mb-4">
              Your cart is empty
            </h2>
            <p className="text-[#6B6B6B] mb-8">Discover our bestselling organic soaps</p>
            <Link
              href="/shop"
              className="bg-[#2D5016] text-white font-bold px-8 py-4 rounded-full hover:bg-[#3D6B20] transition-colors"
            >
              Shop Now
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart items */}
            <div className="lg:col-span-2 space-y-4">
              {/* Free shipping bar */}
              <div className="bg-white rounded-2xl p-4 shadow-sm">
                {amountToFreeShipping > 0 ? (
                  <p className="text-sm text-[#2D5016] font-medium mb-2">
                    Add <strong>₹{amountToFreeShipping}</strong> more for FREE shipping!
                  </p>
                ) : (
                  <p className="text-sm text-[#2D5016] font-bold mb-2">You&apos;ve unlocked FREE shipping!</p>
                )}
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-[#2D5016] rounded-full transition-all duration-500" style={{ width: `${shippingProgress}%` }} />
                </div>
              </div>

              {/* Items */}
              {items.map((item) => (
                <motion.div
                  key={`${item.product.id}-${item.selectedSize}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl p-5 shadow-sm flex gap-4"
                >
                  <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-[#EDE6D6] shrink-0">
                    <Image
                      src={item.product.images[0]}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold text-[#1C1C1C]">{item.product.name}</h3>
                        <p className="text-sm text-[#6B6B6B]">{item.selectedSize}</p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.product.id, item.selectedSize)}
                        className="text-gray-400 hover:text-red-500 transition-colors text-lg"
                      >
                        ×
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.selectedSize, item.quantity - 1)}
                          className="px-4 py-2 hover:bg-gray-50 font-bold text-[#1C1C1C]"
                        >−</button>
                        <span className="px-4 py-2 font-semibold border-x border-gray-200">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.selectedSize, item.quantity + 1)}
                          className="px-4 py-2 hover:bg-gray-50 font-bold text-[#1C1C1C]"
                        >+</button>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-lg text-[#1C1C1C]">₹{item.price * item.quantity}</div>
                        <div className="text-xs text-[#6B6B6B]">₹{item.price} each</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Upsell */}
              {upsellProducts.length > 0 && (
                <div className="bg-white rounded-2xl p-5 shadow-sm">
                  <h3 className="font-bold text-[#1C1C1C] mb-4">Customers Also Bought</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {upsellProducts.map((p) => (
                      <ProductCard key={p.id} product={p} />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Order summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-24">
                <h2 className="text-xl font-bold text-[#1C1C1C] mb-5">
                  Order Summary
                </h2>

                <div className="space-y-3 mb-5">
                  <div className="flex justify-between text-sm text-[#6B6B6B]">
                    <span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
                    <span className="text-[#1C1C1C] font-medium">₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between text-sm text-[#6B6B6B]">
                    <span>Shipping</span>
                    <span className={shipping === 0 ? "text-green-600 font-medium" : "text-[#1C1C1C] font-medium"}>
                      {shipping === 0 ? "FREE" : `₹${shipping}`}
                    </span>
                  </div>
                  {couponApplied && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Coupon (WELCOME10)</span>
                      <span>−₹{discount}</span>
                    </div>
                  )}
                </div>

                {/* Coupon */}
                <div className="mb-5">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={coupon}
                      onChange={(e) => setCoupon(e.target.value)}
                      placeholder="Coupon code"
                      disabled={couponApplied}
                      className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#2D5016] disabled:bg-gray-50"
                    />
                    <button
                      onClick={handleCoupon}
                      disabled={couponApplied}
                      className="bg-[#2D5016] text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-[#3D6B20] transition-colors disabled:opacity-50"
                    >
                      Apply
                    </button>
                  </div>
                  {couponError && <p className="text-red-500 text-xs mt-1">{couponError}</p>}
                  {couponApplied && <p className="text-green-600 text-xs mt-1">✓ Coupon applied! You saved ₹{discount}</p>}
                </div>

                <div className="border-t border-gray-100 pt-4 mb-5">
                  <div className="flex justify-between font-bold text-xl">
                    <span>Total</span>
                    <span>₹{total}</span>
                  </div>
                  {shipping === 0 && (
                    <div className="text-xs text-green-600 mt-1">✓ Includes FREE shipping</div>
                  )}
                </div>

                <RazorpayButton amount={total} />

                <button onClick={clearCart} className="block w-full text-center text-sm text-[#6B6B6B] hover:text-red-500 transition-colors">
                  Clear Cart
                </button>

                {/* Trust */}
                <div className="mt-5 pt-5 border-t border-gray-100 space-y-2">
                  {["Secure Payment", "Free shipping above ₹399", "100% Natural", "COD Available"].map((t) => (
                    <div key={t} className="flex items-center gap-2 text-xs text-[#6B6B6B]">{t}</div>
                  ))}
                </div>

                {/* Payment icons */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {["UPI", "Razorpay", "Visa", "Mastercard", "COD"].map((p) => (
                    <span key={p} className="text-xs border border-gray-200 text-[#6B6B6B] px-2 py-1 rounded">{p}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
