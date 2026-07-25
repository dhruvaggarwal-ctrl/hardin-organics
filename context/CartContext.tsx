"use client";

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import { Product } from "@/data/products";
import { FREE_SHIPPING_THRESHOLD, MULTI_ITEM_DISCOUNT } from "@/lib/pricing";

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize: string;
  price: number;
}

interface CartContextType {
  items: CartItem[];
  isDrawerOpen: boolean;
  addToCart: (product: Product, size: string, price: number, quantity?: number) => void;
  removeFromCart: (productId: string, size: string) => void;
  updateQuantity: (productId: string, size: string, quantity: number) => void;
  clearCart: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  totalItems: number;
  subtotal: number;
  discount: number;
  freeShippingThreshold: number;
  amountToFreeShipping: number;
}

const CART_KEY = "hardin_cart";

function readStorage(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CartItem[];
    // Remove items with quantity <= 0 that may have been persisted incorrectly
    return Array.isArray(parsed) ? parsed.filter((i) => i.quantity > 0) : [];
  } catch {
    // Parse error — clear and start fresh
    try { localStorage.removeItem(CART_KEY); } catch { /* noop */ }
    return [];
  }
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  // Tracks whether localStorage has been read yet (avoids SSR mismatch)
  const [hydrated, setHydrated] = useState(false);

  // Hydrate cart from localStorage on first client render
  useEffect(() => {
    const stored = readStorage();
    if (stored.length > 0) setItems(stored);
    setHydrated(true);
  }, []);

  // Persist cart to localStorage whenever items change (skip before hydration)
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(items));
    } catch {
      // Storage quota exceeded or private mode — silently ignore
    }
  }, [items, hydrated]);

  const addToCart = useCallback(
    (product: Product, size: string, price: number, quantity = 1) => {
      setItems((prev) => {
        const existing = prev.find(
          (item) => item.product.id === product.id && item.selectedSize === size
        );
        if (existing) {
          return prev.map((item) =>
            item.product.id === product.id && item.selectedSize === size
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        }
        return [...prev, { product, quantity, selectedSize: size, price }];
      });
      setIsDrawerOpen(true);
    },
    []
  );

  const removeFromCart = useCallback((productId: string, size: string) => {
    setItems((prev) =>
      prev.filter((item) => !(item.product.id === productId && item.selectedSize === size))
    );
  }, []);

  const updateQuantity = useCallback((productId: string, size: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) =>
        prev.filter((item) => !(item.product.id === productId && item.selectedSize === size))
      );
    } else {
      setItems((prev) =>
        prev.map((item) =>
          item.product.id === productId && item.selectedSize === size
            ? { ...item, quantity }
            : item
        )
      );
    }
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const openDrawer = useCallback(() => setIsDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setIsDrawerOpen(false), []);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Auto-apply multi-item discount when 2+ total items in cart
  const discount = totalItems >= 2 ? MULTI_ITEM_DISCOUNT : 0;
  const discountedSubtotal = subtotal - discount;
  const amountToFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - discountedSubtotal);

  return (
    <CartContext.Provider
      value={{
        items,
        isDrawerOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        openDrawer,
        closeDrawer,
        totalItems,
        subtotal,
        discount,
        freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
        amountToFreeShipping,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
