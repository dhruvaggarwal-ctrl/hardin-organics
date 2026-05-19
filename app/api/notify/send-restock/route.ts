import { NextRequest, NextResponse } from "next/server";
import { readFileSync, writeFileSync, existsSync } from "fs";
import path from "path";
import nodemailer from "nodemailer";

interface Subscriber {
  email: string;
  mobile: string | null;
  productSlug: string;
  productName: string;
  subscribedAt: string;
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const secret = url.searchParams.get("secret");
  const slug = url.searchParams.get("slug");

  if (secret !== "hardin2025") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!slug) return NextResponse.json({ error: "Missing slug" }, { status: 400 });

  try {
    const filePath = path.join(process.cwd(), "data", "notify-list.json");
    if (!existsSync(filePath)) return NextResponse.json({ message: "No subscribers" });

    const list: Subscriber[] = JSON.parse(readFileSync(filePath, "utf-8"));
    const targets = list.filter((e) => e.productSlug === slug);
    if (targets.length === 0) return NextResponse.json({ message: "No subscribers for this product" });

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: false,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });

    const productName = targets[0].productName;
    const productUrl = `https://hardinorganics.com/product/${slug}`;

    let sent = 0;
    for (const sub of targets) {
      try {
        await transporter.sendMail({
          from: `"Hardin Organics" <${process.env.SMTP_USER}>`,
          to: sub.email,
          subject: `${productName} is back in stock! 🌿`,
          html: `
            <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px;background:#F5F0E8;border-radius:16px">
              <h2 style="color:#1C1C1A;font-size:22px;margin-bottom:8px">${productName} is back! 🎉</h2>
              <p style="color:#6B6B6B;line-height:1.6">Great news — the product you were waiting for is back in stock at Hardin Organics. Shop now before it sells out again.</p>
              <a href="${productUrl}" style="display:inline-block;background:#A0522D;color:#fff;padding:14px 28px;border-radius:50px;text-decoration:none;font-weight:700;margin-top:20px;font-size:15px">Shop Now →</a>
              <p style="color:#999;font-size:11px;margin-top:32px">You received this because you signed up for restock alerts at hardinorganics.com. <a href="https://hardinorganics.com" style="color:#A0522D">Unsubscribe</a></p>
            </div>
          `,
        });
        sent++;
      } catch { /* skip failed individual emails */ }
    }

    // Remove notified subscribers
    const remaining = list.filter((e) => e.productSlug !== slug);
    writeFileSync(filePath, JSON.stringify(remaining, null, 2));

    return NextResponse.json({ sent, total: targets.length });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
