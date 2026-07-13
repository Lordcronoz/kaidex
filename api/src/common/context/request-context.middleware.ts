import { Injectable, NestMiddleware } from '@nestjs/common';
import { requestContext, RequestUser } from './request-context';

/**
 * Wraps each incoming request in an AsyncLocalStorage context
 * so downstream services (e.g. PrismaService RLS) can access
 * the authenticated user without explicit parameter passing.
 */
@Injectable()
export class RequestContextMiddleware implements NestMiddleware {
  use(req: any, _res: any, next: any) {
    const user = req.user as RequestUser | undefined;

    if (user) {
      requestContext.run(user, () => next());
    } else {
      // No user context yet (pre-auth); run without context
      next();
    }
  }
}
