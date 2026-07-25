import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

if (!process.env.AUTH_SECRET) {
  throw new Error(
    "AUTH_SECRET env var is not set. Refusing to start with a hardcoded fallback " +
    "secret, since anyone reading the source could forge customer session tokens."
  );
}
const SECRET = new TextEncoder().encode(process.env.AUTH_SECRET);
export const COOKIE_NAME = "hardin_session";
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60; // 7 days

export interface SessionPayload {
  customerId: string;
  mobile?: string;
  email?: string;
}

export async function signSession(payload: SessionPayload): Promise<string> {
  return new SignJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(SECRET);
}

export async function verifySession(): Promise<SessionPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;
    const { payload } = await jwtVerify(token, SECRET);
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export async function setSessionCookie(jwt: string) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, jwt, {
    httpOnly: true,
    sameSite: "strict",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
    secure: process.env.NODE_ENV === "production",
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
