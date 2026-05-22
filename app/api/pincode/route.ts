import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const pin = req.nextUrl.searchParams.get("pin")?.trim();

  if (!pin || !/^\d{6}$/.test(pin)) {
    return NextResponse.json({ error: "Invalid pincode" }, { status: 400 });
  }

  try {
    const res = await fetch(`https://api.postalpincode.in/pincode/${pin}`, {
      signal: AbortSignal.timeout(6000),
      headers: { "Accept": "application/json" },
    });

    if (!res.ok) throw new Error(`Upstream ${res.status}`);

    const data = await res.json();
    const post = data?.[0];

    if (post?.Status === "Success" && post.PostOffice?.length > 0) {
      const po = post.PostOffice[0];
      return NextResponse.json({
        found: true,
        city: po.District || po.Name,
        state: po.State,
        postOffice: po.Name,
      });
    }

    if (post?.Status === "Error") {
      return NextResponse.json({ found: false });
    }

    // Unexpected response
    return NextResponse.json({ found: false });
  } catch {
    // External API down — return a soft 503 so the client can handle gracefully
    return NextResponse.json({ error: "Pincode service temporarily unavailable" }, { status: 503 });
  }
}
