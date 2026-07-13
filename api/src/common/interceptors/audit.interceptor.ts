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
 * For UPDATE and DELETE operations, captures before/after snapshots of the target record.
 */
@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private prisma: PrismaService) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
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
    const target = controller.replace('Controller', '');
    const targetId = request.params?.id || request.params?.delId || 'unknown';

    // Capture "before" snapshot for UPDATE and DELETE operations
    let beforeSnapshot: any = null;
    if ((action === 'UPDATE' || action === 'DELETE') && targetId !== 'unknown') {
      beforeSnapshot = await this.fetchRecord(target, targetId);
    }

    return next.handle().pipe(
      tap(async (responseData) => {
        try {
          // Capture "after" snapshot for UPDATE operations
          let afterSnapshot: any = null;
          if (action === 'UPDATE' && targetId !== 'unknown') {
            afterSnapshot = await this.fetchRecord(target, targetId);
          } else if (action === 'CREATE' && responseData?.id) {
            afterSnapshot = responseData;
          }

          await this.prisma.auditLog.create({
            data: {
              userId: user.id,
              action,
              target,
              targetId: responseData?.id || targetId,
              metadata: {
                handler,
                method,
                body: this.sanitizeBody(request.body),
                params: request.params,
                before: beforeSnapshot ? this.sanitizeBody(beforeSnapshot) : null,
                after: afterSnapshot ? this.sanitizeBody(afterSnapshot) : null,
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

  /**
   * Attempt to fetch the current state of a record for before/after comparison.
   * Falls back gracefully if the model/record doesn't exist.
   */
  private async fetchRecord(target: string, id: string): Promise<any> {
    try {
      const modelName = target.charAt(0).toLowerCase() + target.slice(1);
      const model = (this.prisma as any)[modelName];
      if (model && typeof model.findUnique === 'function') {
        return await model.findUnique({ where: { id } });
      }
    } catch {
      // Model might not exist or ID might be invalid — fail silently
    }
    return null;
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
