import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { requestContext, RequestUser } from './request-context';

/**
 * Wraps each incoming request in an AsyncLocalStorage context
 * so downstream services (e.g. PrismaService RLS) can access
 * the authenticated user without explicit parameter passing.
 */
@Injectable()
export class RequestContextMiddleware implements NestMiddleware {
  use(req: Request, _res: Response, next: NextFunction) {
    const user = (req as any).user as RequestUser | undefined;

    if (user) {
      requestContext.run(user, () => next());
    } else {
      // No user context yet (pre-auth); run without context
      next();
    }
  }
}
