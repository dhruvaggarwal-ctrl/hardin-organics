import { NextRequest, NextResponse } from "next/server";
import { readFileSync } from "fs";
import path from "path";

interface StockEntry { stock: number; threshold: number; }

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const filePath = path.join(process.cwd(), "data", "stock.json");
    const data = JSON.parse(readFileSync(filePath, "utf-8")) as Record<string, StockEntry>;
    const entry = data[slug];
    if (!entry) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({
      slug,
      stock: entry.stock,
      isOutOfStock: entry.stock === 0,
      isLowStock: entry.stock > 0 && entry.stock <= entry.threshold,
    });
  } catch {
    return NextResponse.json({ error: "Failed to read stock" }, { status: 500 });
  }
}
