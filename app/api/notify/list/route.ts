import { NextRequest, NextResponse } from "next/server";
import { readFileSync, existsSync } from "fs";
import path from "path";

export async function GET(req: NextRequest) {
  const secret = new URL(req.url).searchParams.get("secret");
  if (secret !== "hardin2025") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const filePath = path.join(process.cwd(), "data", "notify-list.json");
    if (!existsSync(filePath)) return NextResponse.json({});
    const list = JSON.parse(readFileSync(filePath, "utf-8")) as Array<{ productSlug: string }>;
    const grouped: Record<string, unknown[]> = {};
    for (const entry of list) {
      if (!grouped[entry.productSlug]) grouped[entry.productSlug] = [];
      grouped[entry.productSlug].push(entry);
    }
    return NextResponse.json(grouped);
  } catch {
    return NextResponse.json({ error: "Failed to read" }, { status: 500 });
  }
}
