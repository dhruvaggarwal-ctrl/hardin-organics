"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { products, Product } from "@/data/products";
import { COUPONS, PENDING_COUPON_KEY } from "@/lib/pricing";

interface Props {
  currentProductId: string;
}

export function CompleteYourRoutine({ currentProductId }: Props) {
  const { addToCart } = useCart();
  const other = products.find((p) => p.id !== currentProductId)!;

  // Bundle card data — derived from the catalog + the shared STARTERDUO16 coupon
  // so this can't silently drift from the real product prices again.
  const current = products.find((p) => p.id === currentProductId)!;
  const starterCoupon = COUPONS.STARTERDUO16;
  const bundleOriginal = current.price + other.price;
  const bundlePrice = Math.round(bundleOriginal * (1 - starterCoupon.value / 100));
  const bundle = {
    name: "Starter Duo",
    subtitle: "Both soaps — best value",
    price: bundlePrice,
    originalPrice: bundleOriginal,
    savings: bundleOriginal - bundlePrice,
  };

  const CrossSellCard = ({ product, isFree = false }: { product: Product; isFree?: boolean }) => (
    <div className="bg-[#F5F0E8] rounded-2xl overflow-hidden border border-[#EDE6D6] flex flex-col">
      <div className="relative aspect-square bg-[#EDE6D6]">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 50vw, 300px"
        />
      </div>
      <div className="p-4 flex flex-col gap-3 flex-1">
        <div>
          <h4 className="font-bold text-sm text-[#1C1C1C] leading-tight">{product.name}</h4>
          <p className="text-xs text-[#6B6B6B] mt-1">{product.tagline}</p>
        </div>
        <div className="flex items-center gap-2 mt-auto">
          <span className="font-bold text-[#1C1C1C]">₹{product.price}</span>
        </div>
        <button
          onClick={() => addToCart(product, product.sizes[0].label, product.price)}
          className="w-full bg-[#2D5016] text-white text-sm font-bold py-2.5 rounded-xl hover:bg-[#3D6B20] transition-colors"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );

  const BundleCard = () => (
    <div className="bg-[#2D5016] rounded-2xl overflow-hidden flex flex-col">
      <div className="flex justify-center gap-2 p-4 bg-white/10">
        <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-[#EDE6D6]">
          <Image src="/images/charcoal-1.png" alt="Charcoal Soap" fill className="object-contain p-1" sizes="64px" />
        </div>
        <span className="text-white/70 text-lg self-center">+</span>
        <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-[#EDE6D6]">
          <Image src="/images/haldi-1.png" alt="Haldi Soap" fill className="object-contain p-1" sizes="64px" />
        </div>
      </div>
      <div className="p-4 flex flex-col gap-3 flex-1">
        <div>
          <span className="text-xs text-[#D4A017] font-bold uppercase tracking-wide">Best Value</span>
          <h4 className="font-bold text-sm text-white leading-tight mt-1">{bundle.name}</h4>
          <p className="text-xs text-white/70 mt-1">{bundle.subtitle}</p>
        </div>
        <div className="flex items-center gap-2 mt-auto">
          <span className="font-bold text-white text-lg">₹{bundle.price}</span>
          <span className="text-white/50 line-through text-sm">₹{bundle.originalPrice}</span>
          <span className="text-xs bg-[#D4A017] text-[#1C1C1C] font-bold px-2 py-0.5 rounded-full">
            Save ₹{bundle.savings}
          </span>
        </div>
        <button
          onClick={() => {
            const charcoal = products.find((p) => p.id === "charcoal-soap")!;
            const haldi = products.find((p) => p.id === "saffron-haldi-chandan")!;
            addToCart(charcoal, charcoal.sizes[0].label, charcoal.price);
            addToCart(haldi, haldi.sizes[0].label, haldi.price);
            try { localStorage.setItem(PENDING_COUPON_KEY, "STARTERDUO16"); } catch { /* ignore */ }
          }}
          className="w-full bg-[#D4A017] text-[#1C1C1C] text-sm font-bold py-2.5 rounded-xl hover:bg-[#E8B52A] transition-colors"
        >
          Add Bundle to Cart →
        </button>
      </div>
    </div>
  );

  return (
    <section className="mt-16 pt-10 border-t border-[#EDE6D6]">
      <h2
        className="text-2xl md:text-3xl font-bold text-[#1C1C1C] mb-2 font-display"
      >
        Complete Your Routine
      </h2>
      <p className="text-[#6B6B6B] text-sm mb-7">Customers who bought this also added:</p>

      <div className="grid grid-cols-2 gap-4">
        <CrossSellCard product={other} />
        <BundleCard />
      </div>

      <Link
        href="/shop"
        className="block text-center text-sm text-[#2D5016] font-semibold mt-5 hover:underline"
      >
        Buy both together and save ₹50 →
      </Link>
    </section>
  );
}
