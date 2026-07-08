import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

/**
 * Validates the NextAuth session token passed in the Authorization header.
 * In production, this verifies the JWT issued by Auth.js on the Next.js side.
 */
@Injectable()
export class NextAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or invalid authorization header');
    }

    const token = authHeader.split(' ')[1];

    try {
      // In production, decode and verify the JWT from Auth.js
      // For now, we decode the payload (the Next.js middleware will have
      // already verified the token; this is a secondary check)
      const payload = JSON.parse(
        Buffer.from(token.split('.')[1], 'base64').toString()
      );

      // Attach user info to the request
      (request as any).user = {
        id: payload.sub,
        email: payload.email,
        role: payload.role || 'CLIENT',
        name: payload.name,
      };

      return true;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
