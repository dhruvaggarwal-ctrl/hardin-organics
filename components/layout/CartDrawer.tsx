"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { products } from "@/data/products";
import { RazorpayButton } from "@/components/checkout/RazorpayButton";

export function CartDrawer() {
  const {
    items, isDrawerOpen, closeDrawer,
    removeFromCart, updateQuantity, addToCart,
    subtotal, amountToFreeShipping, freeShippingThreshold,
  } = useCart();

  const shippingProgress = Math.min(100, (subtotal / freeShippingThreshold) * 100);
  const upsellProduct = products.find((p) => !items.some((i) => i.product.id === p.id));

  if (!isDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-black/40" onClick={closeDrawer} />
      <div className="relative ml-auto w-full max-w-[400px] h-full bg-white flex flex-col shadow-2xl animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2 className="text-xl font-bold text-[#1C1C1C]">
            Your Cart ({items.reduce((s, i) => s + i.quantity, 0)})
          </h2>
          <button onClick={closeDrawer} className="text-2xl text-[#6B6B6B] hover:text-[#1C1C1C]">×</button>
        </div>

        {/* Free shipping bar */}
        <div className="px-4 py-3 bg-[#F5F0E8]">
          {amountToFreeShipping > 0 ? (
            <p className="text-xs text-[#2D5016] font-medium mb-1.5">
              Add <strong>₹{amountToFreeShipping}</strong> more for FREE shipping!
            </p>
          ) : (
            <p className="text-xs text-[#2D5016] font-medium mb-1.5">
              You&apos;ve unlocked FREE shipping!
            </p>
          )}
          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#2D5016] rounded-full transition-all duration-500"
              style={{ width: `${shippingProgress}%` }}
            />
          </div>
        </div>

        {/* Cart items */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <p className="text-[#6B6B6B]">Your cart is empty</p>
              <Link
                href="/shop"
                onClick={closeDrawer}
                className="bg-[#2D5016] text-white px-6 py-3 rounded-full font-medium hover:bg-[#3D6B20] transition-colors"
              >
                Shop Now
              </Link>
            </div>
          ) : (
            <>
              {items.map((item) => (
                <div key={`${item.product.id}-${item.selectedSize}`} className="flex gap-3 pb-4 border-b border-gray-100">
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-[#EDE6D6] shrink-0">
                    <Image
                      src={item.product.images[0]}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm text-[#1C1C1C] leading-tight">{item.product.name}</h4>
                    <p className="text-xs text-[#6B6B6B] mt-0.5">{item.selectedSize}</p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.selectedSize, item.quantity - 1)}
                          className="px-3 py-1 text-[#1C1C1C] hover:bg-gray-100 transition-colors font-medium"
                        >−</button>
                        <span className="px-3 py-1 text-sm font-medium border-x border-gray-200">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.selectedSize, item.quantity + 1)}
                          className="px-3 py-1 text-[#1C1C1C] hover:bg-gray-100 transition-colors font-medium"
                        >+</button>
                      </div>
                      <span className="font-bold text-[#1C1C1C]">₹{item.price * item.quantity}</span>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.product.id, item.selectedSize)}
                      className="text-xs text-red-500 hover:text-red-700 mt-1"
                    >Remove</button>
                  </div>
                </div>
              ))}

              {/* Upsell */}
              {upsellProduct && (
                <div className="bg-[#F5F0E8] rounded-xl p-3 border border-[#EDE6D6]">
                  <p className="text-xs font-bold text-[#2D5016] mb-2">Customers Also Love</p>
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-[#EDE6D6] shrink-0">
                      <Image src={upsellProduct.images[0]} alt={upsellProduct.name} fill className="object-cover" sizes="48px" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-[#1C1C1C]">{upsellProduct.name}</p>
                      <p className="text-xs text-[#6B6B6B]">₹{upsellProduct.price}</p>
                    </div>
                    <button
                      onClick={() => addToCart(upsellProduct, upsellProduct.sizes[0].label, upsellProduct.price)}
                      className="text-xs bg-[#2D5016] text-white px-3 py-1.5 rounded-lg hover:bg-[#3D6B20] transition-colors font-medium"
                    >Add</button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-4 border-t border-gray-100 space-y-3">
            <div className="flex justify-between text-sm text-[#6B6B6B]">
              <span>Subtotal</span>
              <span className="font-medium text-[#1C1C1C]">₹{subtotal}</span>
            </div>
            <div className="flex justify-between text-sm text-[#6B6B6B]">
              <span>Shipping</span>
              <span className={subtotal >= freeShippingThreshold ? "text-green-600 font-medium" : "font-medium text-[#1C1C1C]"}>
                {subtotal >= freeShippingThreshold ? "FREE" : "₹60"}
              </span>
            </div>
            <div className="flex justify-between font-bold text-base pt-2 border-t border-gray-100">
              <span>Total</span>
              <span>₹{subtotal >= freeShippingThreshold ? subtotal : subtotal + 60}</span>
            </div>
            <div onClick={closeDrawer}>
              <RazorpayButton amount={subtotal >= freeShippingThreshold ? subtotal : subtotal + 60} />
            </div>
            <button onClick={closeDrawer} className="block w-full text-center text-sm text-[#6B6B6B] hover:text-[#1C1C1C]">
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
