import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { PrismaService } from '../../prisma/prisma.service';

/**
 * Automatically logs all mutating API calls (POST/PUT/PATCH/DELETE) to the audit_logs table.
 */
@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private prisma: PrismaService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const method = request.method;

    // Only log mutating operations
    if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
      return next.handle();
    }

    const user = request.user;
    if (!user) {
      return next.handle();
    }

    const handler = context.getHandler().name;
    const controller = context.getClass().name;
    const action = this.methodToAction(method);

    return next.handle().pipe(
      tap(async (responseData) => {
        try {
          await this.prisma.auditLog.create({
            data: {
              userId: user.id,
              action,
              target: controller.replace('Controller', ''),
              targetId: responseData?.id || request.params?.id || 'unknown',
              metadata: {
                handler,
                method,
                body: this.sanitizeBody(request.body),
                params: request.params,
              },
              ipAddress: request.ip || request.headers['x-forwarded-for']?.toString(),
            },
          });
        } catch (error) {
          // Don't fail the request if audit logging fails — log and continue
          console.error('Audit log failed:', error);
        }
      }),
    );
  }

  private methodToAction(method: string): string {
    switch (method) {
      case 'POST': return 'CREATE';
      case 'PUT':
      case 'PATCH': return 'UPDATE';
      case 'DELETE': return 'DELETE';
      default: return method;
    }
  }

  private sanitizeBody(body: any): any {
    if (!body) return null;
    const sanitized = { ...body };
    // Never log passwords or secrets
    delete sanitized.password;
    delete sanitized.passwordHash;
    delete sanitized.mfaSecret;
    delete sanitized.token;
    return sanitized;
  }
}
