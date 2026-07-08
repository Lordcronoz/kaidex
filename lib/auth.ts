import type { NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

export const authConfig: NextAuthConfig = {
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // In production: call the NestJS API to validate credentials
        // For now, this is a placeholder that will be wired up in Phase 3
        const apiUrl = process.env.API_URL || 'http://localhost:4000';

        try {
          const res = await fetch(`${apiUrl}/api/v1/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: credentials?.email,
              password: credentials?.password,
            }),
          });

          if (!res.ok) return null;

          const user = await res.json();
          return user.data;
        } catch {
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 8 * 60 * 60, // 8 hours
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role || 'CLIENT';
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.id;
      }
      return session;
    },
    async authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user;
      const { pathname } = request.nextUrl;

      // Portal routes require authentication
      const isPortalRoute =
        pathname.startsWith('/client') || pathname.startsWith('/admin');

      if (isPortalRoute && !isLoggedIn) {
        return false; // Redirect to login
      }

      // Admin routes require ADMIN role
      if (pathname.startsWith('/admin') && (auth?.user as any)?.role !== 'ADMIN') {
        return false;
      }

      return true;
    },
  },
  pages: {
    signIn: '/login',
  },
};
