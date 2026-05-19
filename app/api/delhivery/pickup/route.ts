/**
 * POST /api/delhivery/pickup
 * Creates a pickup request with Delhivery for today/tomorrow.
 * Call this manually (or via cron) after orders are ready to ship.
 *
 * Body: { date?: "YYYY-MM-DD", time?: "HH:MM", count?: number }
 * Secured by ?secret=hardin2025 query param.
 */
import { NextRequest, NextResponse } from "next/server";

const DELHIVERY_API = "https://track.delhivery.com";

function getHeaders() {
  const token = process.env.DELHIVERY_API_TOKEN;
  if (!token) throw new Error("DELHIVERY_API_TOKEN not set");
  return {
    "Content-Type": "application/json",
    Authorization: `Token ${token}`,
  };
}

export async function POST(req: NextRequest) {
  // Simple secret guard
  const secret = req.nextUrl.searchParams.get("secret");
  if (secret !== "hardin2025") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json().catch(() => ({}));

    // Default: today, slot 14:00, 1 package
    const today = new Date();
    const pickupDate = body.date || today.toISOString().slice(0, 10);
    const pickupTime = body.time || "14:00:00";
    const count = body.count || 1;

    const pickupName = process.env.DELHIVERY_PICKUP_NAME || "Primary";

    const payload = {
      pickup_time: pickupTime,
      pickup_date: pickupDate,
      pickup_location: pickupName,
      expected_package_count: count,
    };

    const res = await fetch(`${DELHIVERY_API}/fm/request/new/`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });

    const text = await res.text();
    let data: unknown;
    try { data = JSON.parse(text); } catch { data = text; }

    if (!res.ok) {
      console.error("[Delhivery] Pickup request failed:", res.status, text);
      return NextResponse.json({ success: false, status: res.status, data }, { status: 502 });
    }

    return NextResponse.json({ success: true, data });
  } catch (e) {
    console.error("[Delhivery] Pickup request error:", e);
    return NextResponse.json({ success: false, error: String(e) }, { status: 500 });
  }
}
