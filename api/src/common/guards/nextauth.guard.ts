import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { jwtVerify } from 'jose';

/**
 * Validates the NextAuth session token passed in the Authorization header.
 * Verifies the JWT signature using NEXTAUTH_SECRET and checks expiration.
 */
@Injectable()
export class NextAuthGuard implements CanActivate {
  private readonly secret: Uint8Array;

  constructor() {
    const secretStr = process.env.NEXTAUTH_SECRET;
    if (!secretStr) {
      throw new Error('NEXTAUTH_SECRET environment variable is not set');
    }
    this.secret = new TextEncoder().encode(secretStr);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or invalid authorization header');
    }

    const token = authHeader.split(' ')[1];

    try {
      const { payload } = await jwtVerify(token, this.secret, {
        clockTolerance: 15, // 15 seconds clock tolerance
      });

      // Check expiration explicitly (jose checks it, but be defensive)
      if (payload.exp && Date.now() >= payload.exp * 1000) {
        throw new UnauthorizedException('Token has expired');
      }

      // Attach verified user info to the request
      (request as any).user = {
        id: payload.sub || payload.id,
        email: payload.email,
        role: payload.role || 'CLIENT',
        name: payload.name,
      };

      return true;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
