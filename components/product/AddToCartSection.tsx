"use client";

import { useState } from "react";
import Link from "next/link";
import { StarRating } from "../ui/StarRating";
import { useCart } from "@/context/CartContext";
import { Product } from "@/data/products";
import { useStock } from "@/hooks/useStock";
import { NotifyModal } from "./NotifyModal";
import { pixelAddToCart } from "@/lib/pixel";

interface AddToCartSectionProps {
  product: Product;
}

const trustItems = [
  {
    label: "Ships in 24 hrs",
    icon: (
      <svg className="w-4 h-4 shrink-0 text-[#2D5016]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v3" strokeLinecap="round"/>
        <rect x="9" y="11" width="14" height="10" rx="2"/><circle cx="12" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
      </svg>
    ),
  },
  {
    label: "COD Available",
    icon: (
      <svg className="w-4 h-4 shrink-0 text-[#2D5016]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    label: "100% Natural Ingredients",
    icon: (
      <svg className="w-4 h-4 shrink-0 text-[#2D5016]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path d="M3 10h10a8 8 0 0 1 8 8v2M3 10l4-4M3 10l4 4" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    label: "No SLS, No Parabens",
    icon: (
      <svg className="w-4 h-4 shrink-0 text-[#2D5016]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
];

export function AddToCartSection({ product }: AddToCartSectionProps) {
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState(product.sizes[0].label);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [notifyOpen, setNotifyOpen] = useState(false);
  const stockInfo = useStock(product.slug);

  const isOutOfStock = stockInfo?.isOutOfStock ?? false;
  const isLowStock = stockInfo?.isLowStock ?? false;
  const liveStock = stockInfo?.stock ?? product.stockCount;

  const currentSize = product.sizes.find((s) => s.label === selectedSize) || product.sizes[0];
  const savings = product.originalPrice - currentSize.price;
  const savingsPct = Math.round((savings / product.originalPrice) * 100);

  const handleAddToCart = () => {
    addToCart(product, selectedSize, currentSize.price, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 3000);
    pixelAddToCart({
      productId: product.id,
      productName: product.name,
      value: currentSize.price * quantity,
    });
  };

  const handleBuyNow = () => {
    addToCart(product, selectedSize, currentSize.price, quantity);
  };

  return (
    <div className="space-y-5">
      {/* Name + tagline */}
      <div>
        <h1 className="text-2xl md:text-4xl font-bold text-[#1C1C1C] leading-tight font-display">
          {product.name}
        </h1>
        <p className="text-[#6B6B6B] mt-1">{product.tagline}</p>
      </div>

      {/* Rating */}
      <a href="#reviews" className="flex items-center gap-2 group">
        <StarRating rating={product.rating} size="md" showNumber />
        <span className="text-sm text-[#6B6B6B] group-hover:text-[#2D5016] transition-colors">
          ({product.reviewCount} verified reviews)
        </span>
      </a>

      {/* Price */}
      <div className="flex items-end gap-3">
        <span className="text-3xl md:text-4xl font-bold text-[#1C1C1C]">
          ₹{currentSize.price}
        </span>
        {currentSize.originalPrice && (
          <>
            <span className="text-xl line-through text-[#6B6B6B]">₹{currentSize.originalPrice}</span>
            <span className="bg-green-100 text-green-700 text-sm font-bold px-3 py-1 rounded-full">
              {Math.round(((currentSize.originalPrice - currentSize.price) / currentSize.originalPrice) * 100)}% off
            </span>
          </>
        )}
      </div>

      {/* Short description */}
      <p className="text-[#6B6B6B] leading-relaxed border-l-4 border-[#2D5016] pl-4 italic">
        {product.description}
      </p>

      {/* Stock status */}
      {isOutOfStock ? (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-3">
          <p className="text-sm text-[#6B6B6B] font-medium">Currently out of stock</p>
        </div>
      ) : isLowStock ? (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl p-3">
          <span className="text-red-700 text-sm font-semibold">
            Only {liveStock} left in stock! Order soon.
          </span>
        </div>
      ) : null}

      {/* Pack size selector */}
      {product.sizes.length > 1 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="font-semibold text-sm text-[#1C1C1C]">Pack Size</p>
            {currentSize.originalPrice && (
              <p className="text-xs text-green-600 font-medium">
                Save ₹{currentSize.originalPrice - currentSize.price}
              </p>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((size) => {
              const isSelected = selectedSize === size.label;
              return (
                <button
                  key={size.label}
                  onClick={() => setSelectedSize(size.label)}
                  className={`relative flex-shrink-0 flex flex-col items-center px-4 py-2.5 rounded-2xl border-2 transition-all duration-200 min-w-[80px] ${
                    isSelected
                      ? "border-[#2D5016] bg-[#2D5016] text-white shadow-md"
                      : "border-gray-200 text-[#1C1C1C] hover:border-[#2D5016] bg-white"
                  }`}
                >
                  {size.badge && (
                    <span className={`absolute -top-2.5 left-1/2 -translate-x-1/2 text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap ${
                      isSelected ? "bg-white text-[#2D5016]" : "bg-[#2D5016] text-white"
                    }`}>
                      {size.badge}
                    </span>
                  )}
                  <span className="text-sm font-bold leading-tight">{size.label}</span>
                  <span className={`text-xs mt-0.5 ${isSelected ? "text-white/80" : "text-[#6B6B6B]"}`}>
                    ₹{size.price}
                  </span>
                </button>
              );
            })}
          </div>
          {currentSize.originalPrice && (
            <p className="text-xs text-[#6B6B6B] mt-2">
              ₹{Math.round(currentSize.price / parseInt(currentSize.label.replace(/\D/g, "") || "1"))}/bar
              {" · "}
              <span className="text-green-600 font-medium">
                {Math.round(((currentSize.originalPrice - currentSize.price) / currentSize.originalPrice) * 100)}% off MRP
              </span>
            </p>
          )}
        </div>
      )}

      {/* Quantity */}
      <div>
        <p className="font-semibold text-sm text-[#1C1C1C] mb-2">Quantity:</p>
        <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden w-32">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="px-4 py-3 hover:bg-gray-100 transition-colors font-bold text-[#1C1C1C]"
          >
            −
          </button>
          <span className="flex-1 text-center font-semibold text-[#1C1C1C]">{quantity}</span>
          <button
            onClick={() => setQuantity(Math.min(product.stockCount, quantity + 1))}
            className="px-4 py-3 hover:bg-gray-100 transition-colors font-bold text-[#1C1C1C]"
          >
            +
          </button>
        </div>
      </div>

      {/* CTA buttons */}
      <div className="space-y-3 pt-2">
        {isOutOfStock ? (
          <button
            onClick={() => setNotifyOpen(true)}
            className="w-full py-4 rounded-xl font-bold text-base border-2 border-[#A0522D] text-[#A0522D] hover:bg-[#A0522D] hover:text-white transition-all duration-300"
          >
            Notify Me When Available →
          </button>
        ) : (
          <>
            <button
              onClick={handleAddToCart}
              className={`w-full py-4 rounded-xl font-bold text-base transition-all duration-300 ${
                added
                  ? "bg-green-600 text-white"
                  : "bg-[#C4622D] text-white hover:bg-[#D4734A] hover:shadow-lg"
              }`}
            >
              {added ? "✓ Added to Cart!" : `Add to Cart — ₹${currentSize.price * quantity}`}
            </button>
            <Link
              href="/checkout"
              onClick={handleBuyNow}
              className="block w-full text-center py-4 rounded-xl font-bold text-base bg-[#2D5016] text-white hover:bg-[#3D6B20] transition-all duration-300 hover:shadow-lg"
            >
              Buy Now →
            </Link>
            {product.flipkartUrl && (
              <a
                href={product.flipkartUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl border-2 border-[#2874F0] text-[#2874F0] font-semibold text-sm hover:bg-[#2874F0] hover:text-white transition-all duration-300 group"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/flipkart-logo.png"
                  alt="Flipkart"
                  width={18}
                  height={18}
                  className="shrink-0 group-hover:brightness-0 group-hover:invert transition-all duration-300"
                />
                Also available on Flipkart
              </a>
            )}
          </>
        )}
      </div>

      {/* Notify modal */}
      {notifyOpen && (
        <NotifyModal
          productSlug={product.slug}
          productName={product.name}
          onClose={() => setNotifyOpen(false)}
        />
      )}

      {/* Trust strip */}
      <div className="flex flex-wrap gap-2">
        {trustItems.map((item) => (
          <div key={item.label} className="flex items-center gap-1.5 bg-[#F5F0E8] rounded-xl px-3 py-2.5">
            {item.icon}
            <span className="text-xs font-medium text-[#1C1C1C] whitespace-nowrap">{item.label}</span>
          </div>
        ))}
      </div>

      {/* Product highlights */}
      <div className="bg-[#F5F0E8] rounded-2xl p-5 space-y-3">
        <h3 className="font-bold text-[#1C1C1C]">Why You&apos;ll Love It</h3>
        <div className="space-y-2">
          <div>
            <p className="text-xs font-bold text-[#2D5016] uppercase tracking-wider mb-1">Key Ingredients</p>
            <p className="text-sm text-[#6B6B6B]">{product.ingredients.join(" · ")}</p>
          </div>
          <div>
            <p className="text-xs font-bold text-[#2D5016] uppercase tracking-wider mb-1">Best For</p>
            <p className="text-sm text-[#6B6B6B]">{product.skinTypes.join(", ")} skin</p>
          </div>
          <div>
            <p className="text-xs font-bold text-[#2D5016] uppercase tracking-wider mb-1">Targets</p>
            <p className="text-sm text-[#6B6B6B]">{product.concerns.join(", ")}</p>
          </div>
        </div>
      </div>

      {/* Viewers nudge */}
      <div className="flex items-center gap-2 text-sm text-[#6B6B6B]">
        <span className="flex gap-0.5">
          {[...Array(3)].map((_, i) => (
            <span key={i} className="w-2 h-2 rounded-full bg-green-500 inline-block" />
          ))}
        </span>
        <span>12 people are viewing this right now</span>
      </div>

      {/* Sticky mobile add-to-cart bar */}
      <div className="fixed bottom-0 left-0 right-0 z-30 md:hidden bg-white border-t border-gray-100 px-4 py-3 flex items-center gap-3 shadow-[0_-2px_12px_rgba(0,0,0,0.08)]">
        <div className="flex-1 min-w-0 mr-2">
          <div className="font-bold text-sm text-[#1C1C1C] truncate">{product.name}</div>
          <div className="text-[#C4622D] font-bold text-sm">₹{currentSize.price}</div>
        </div>
        {isOutOfStock ? (
          <button
            onClick={() => setNotifyOpen(true)}
            className="bg-[#A0522D] text-white font-bold px-4 py-3 rounded-xl text-sm shrink-0 whitespace-nowrap"
          >
            Notify Me
          </button>
        ) : (
          <button
            onClick={handleAddToCart}
            className={`font-bold px-4 py-3 rounded-xl text-sm shrink-0 whitespace-nowrap transition-all duration-200 ${added ? "bg-green-600 text-white" : "bg-[#C4622D] text-white"}`}
          >
            {added ? "✓ Added!" : "Add to Cart →"}
          </button>
        )}
      </div>
    </div>
  );
}
