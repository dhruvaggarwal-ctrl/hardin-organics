import { NextRequest, NextResponse } from "next/server";
import { readFileSync, writeFileSync, existsSync } from "fs";
import path from "path";

interface Subscriber {
  email: string;
  mobile: string | null;
  productSlug: string;
  productName: string;
  subscribedAt: string;
}

function getFilePath() {
  return path.join(process.cwd(), "data", "notify-list.json");
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, mobile, productSlug, productName } = body as Partial<Subscriber>;
    if (!email || !productSlug || !productName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const filePath = getFilePath();
    let list: Subscriber[] = [];
    try {
      if (existsSync(filePath)) list = JSON.parse(readFileSync(filePath, "utf-8"));
    } catch { list = []; }

    // Avoid duplicate subscriptions
    const alreadySubscribed = list.some(
      (s) => s.email === email && s.productSlug === productSlug
    );
    if (!alreadySubscribed) {
      list.push({ email, mobile: mobile || null, productSlug, productName, subscribedAt: new Date().toISOString() });
      writeFileSync(filePath, JSON.stringify(list, null, 2));
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}
