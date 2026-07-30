/**
 * Auth middleware for TanStack Start.
 * Checks session cookie on every request. Redirects to /login if invalid.
 */

import { createMiddleware } from "@tanstack/react-start";
import { parseSessionFromCookie, type SessionData } from "./auth";

// Module-level store for current request session (per-request via async context)
let currentSession: SessionData | null = null;

export function getCurrentSession(): SessionData | null {
  return currentSession;
}

export const authMiddleware = createMiddleware().server(async ({ next }) => {
  // TanStack Start provides the Request in the server context
  // We need to get the cookie header from the incoming request
  const request = (globalThis as any).__request as Request | undefined;
  const cookieHeader = request?.headers?.get("cookie") ?? null;

  const session = await parseSessionFromCookie(cookieHeader);
  currentSession = session;

  const url = request ? new URL(request.url) : null;
  const pathname = url?.pathname ?? "/";

  // Public routes that don't need auth
  const publicPaths = ["/login", "/api/login", "/api/logout"];
  const isPublic = publicPaths.some((p) => pathname.startsWith(p));

  if (!session && !isPublic) {
    // Redirect to login
    return new Response(null, {
      status: 302,
      headers: { Location: "/login" },
    });
  }

  return next();
});
