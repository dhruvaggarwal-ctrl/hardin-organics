"use client";

import { useState } from "react";
import Link from "next/link";
import { StarRating } from "../ui/StarRating";
import { useCart } from "@/context/CartContext";
import { Product } from "@/data/products";
import { useStock } from "@/hooks/useStock";
import { NotifyModal } from "./NotifyModal";

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
    label: "Full Refund if Unhappy",
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
  };

  const handleBuyNow = () => {
    addToCart(product, selectedSize, currentSize.price, quantity);
  };

  return (
    <div className="space-y-5">
      {/* Name + tagline */}
      <div>
        <h1 className="text-4xl font-bold text-[#1C1C1C] leading-tight font-display">
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
        <span className="text-4xl font-bold text-[#1C1C1C]">
          ₹{currentSize.price}
        </span>
        <span className="text-xl line-through text-[#6B6B6B]">₹{product.originalPrice}</span>
        <span className="bg-green-100 text-green-700 text-sm font-bold px-3 py-1 rounded-full">
          {savingsPct}% off — Save ₹{savings}
        </span>
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

      {/* Size selector */}
      {product.sizes.length > 1 && (
        <div>
          <p className="font-semibold text-sm text-[#1C1C1C] mb-2">Size:</p>
          <div className="flex gap-2">
            {product.sizes.map((size) => (
              <button
                key={size.label}
                onClick={() => setSelectedSize(size.label)}
                className={`px-5 py-2.5 rounded-xl border-2 text-sm font-medium transition-all duration-200 ${
                  selectedSize === size.label
                    ? "border-[#2D5016] bg-[#2D5016] text-white"
                    : "border-gray-200 text-[#1C1C1C] hover:border-[#2D5016]"
                }`}
              >
                {size.label}
                <span className="block text-xs opacity-80">₹{size.price}</span>
              </button>
            ))}
          </div>
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
              href="/cart"
              onClick={handleBuyNow}
              className="block w-full text-center py-4 rounded-xl font-bold text-base bg-[#2D5016] text-white hover:bg-[#3D6B20] transition-all duration-300 hover:shadow-lg"
            >
              Buy Now →
            </Link>
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

      {/* Trust strip — above Add to Cart */}
      <div className="overflow-x-auto scrollbar-hide -mx-1">
        <div className="flex gap-2 min-w-max px-1 pb-1">
          {trustItems.map((item) => (
            <div key={item.label} className="flex items-center gap-1.5 bg-[#F5F0E8] rounded-xl px-3 py-2.5 shrink-0">
              {item.icon}
              <span className="text-xs font-medium text-[#1C1C1C] whitespace-nowrap">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Refund guarantee */}
      <a
        href="https://wa.me/919871900959"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-start gap-2 text-xs text-[#6B6B6B] hover:text-[#2D5016] transition-colors leading-relaxed"
      >
        <svg className="w-3.5 h-3.5 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
        Not happy with your skin in 30 days? WhatsApp us. Full refund. No forms.
      </a>

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
    </div>
  );
}
