import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";

export const ADMIN_COOKIE = "ksic_admin_session";

function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD || "05012005";
}

function getSessionSecret(): string {
  return process.env.ADMIN_SESSION_SECRET || getAdminPassword();
}

export function createAdminSessionToken(): string {
  const password = getAdminPassword();
  return createHmac("sha256", getSessionSecret())
    .update(`admin:${password}`)
    .digest("hex");
}

export function verifyAdminPassword(password: string): boolean {
  const expected = getAdminPassword();
  const a = Buffer.from(password);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function isValidAdminToken(token: string | undefined): boolean {
  if (!token) return false;
  const expected = createAdminSessionToken();
  const a = Buffer.from(token);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export async function requireAdmin(): Promise<boolean> {
  const jar = await cookies();
  return isValidAdminToken(jar.get(ADMIN_COOKIE)?.value);
}
