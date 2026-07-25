import { NextRequest, NextResponse } from "next/server";

/**
 * Shared guard for internal/admin-only API routes (payment lookups, order
 * recovery, debug/test endpoints). Requires header: x-admin-token: <ADMIN_API_TOKEN>
 */
export function requireAdmin(req: NextRequest): NextResponse | null {
  const expected = process.env.ADMIN_API_TOKEN;
  if (!expected) {
    console.error("[adminAuth] ADMIN_API_TOKEN is not configured — denying all admin requests");
    return NextResponse.json({ error: "Admin API not configured" }, { status: 503 });
  }
  const provided = req.headers.get("x-admin-token");
  if (provided !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}
