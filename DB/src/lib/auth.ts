/**
 * Auth utilities for DB dashboard.
 * Email-allowlist gated access using signed cookies.
 */

import { prisma } from "./db";

/** Emails allowed to access this dashboard — from env, comma-separated */
function getAllowedEmails(): Set<string> {
  const raw = process.env.ALLOWED_EMAILS ?? "";
  return new Set(
    raw
      .split(",")
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean),
  );
}

export function isEmailAllowed(email: string): boolean {
  const allowed = getAllowedEmails();
  // If no allowlist configured, deny all — fail closed
  if (allowed.size === 0) return false;
  return allowed.has(email.toLowerCase());
}

/** Simple HMAC-SHA256 signing for session cookies */
async function hmacSign(payload: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  const sigHex = Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return `${payload}.${sigHex}`;
}

async function hmacVerify(
  signedValue: string,
  secret: string,
): Promise<string | null> {
  const dotIndex = signedValue.lastIndexOf(".");
  if (dotIndex === -1) return null;
  const payload = signedValue.slice(0, dotIndex);
  const expected = await hmacSign(payload, secret);
  // Constant-time compare not critical here (non-crypto secret, low stakes)
  if (expected === signedValue) return payload;
  return null;
}

export interface SessionData {
  userId: string;
  email: string;
  name: string | null;
  role: string;
  expiresAt: number; // epoch ms
}

const SESSION_COOKIE = "kaidex_db_session";
const SESSION_TTL_MS = 8 * 60 * 60 * 1000; // 8 hours

function getSecret(): string {
  const s = process.env.SESSION_SECRET;
  if (!s) throw new Error("SESSION_SECRET env var not set");
  return s;
}

export async function createSessionCookie(user: {
  id: string;
  email: string;
  name: string | null;
  role: string;
}): Promise<string> {
  const session: SessionData = {
    userId: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    expiresAt: Date.now() + SESSION_TTL_MS,
  };
  const payload = btoa(JSON.stringify(session));
  const signed = await hmacSign(payload, getSecret());
  // Returns the Set-Cookie header value
  return `${SESSION_COOKIE}=${signed}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${SESSION_TTL_MS / 1000}`;
}

export async function parseSessionFromCookie(
  cookieHeader: string | null,
): Promise<SessionData | null> {
  if (!cookieHeader) return null;

  // Parse cookie string
  const cookies = Object.fromEntries(
    cookieHeader.split(";").map((c) => {
      const [key, ...rest] = c.trim().split("=");
      return [key, rest.join("=")];
    }),
  );

  const raw = cookies[SESSION_COOKIE];
  if (!raw) return null;

  const payload = await hmacVerify(raw, getSecret());
  if (!payload) return null;

  try {
    const session: SessionData = JSON.parse(atob(payload));
    if (session.expiresAt < Date.now()) return null;
    // Re-check allowlist on every request
    if (!isEmailAllowed(session.email)) return null;
    return session;
  } catch {
    return null;
  }
}

export function clearSessionCookie(): string {
  return `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
}

/**
 * Validate login credentials against Prisma users table.
 * Returns user data if valid + email is in allowlist, null otherwise.
 */
export async function validateLogin(
  email: string,
  password: string,
): Promise<{
  id: string;
  email: string;
  name: string | null;
  role: string;
} | null> {
  if (!isEmailAllowed(email)) return null;

  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (!user) return null;

  // bcrypt compare — dynamic import since bcryptjs is ESM-compatible
  const bcrypt = await import("bcryptjs");
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return null;

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  };
}
