"use client";

import { useEffect, useState } from "react";

export interface StockInfo {
  stock: number;
  isOutOfStock: boolean;
  isLowStock: boolean;
}

export function useStock(slug: string) {
  const [info, setInfo] = useState<StockInfo | null>(null);
  useEffect(() => {
    fetch(`/api/stock/${slug}`)
      .then((r) => r.json())
      .then((data: StockInfo) => setInfo(data))
      .catch(() => {});
  }, [slug]);
  return info;
}
