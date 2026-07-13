import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '../generated/client';
import { requestContext } from '../common/context/request-context';

/** Models that have a `userId` column and should be scoped per-client */
const RLS_SCOPED_MODELS = new Set(['Project', 'Invoice', 'AuditLog']);

/** Read operations that should be scoped */
const READ_OPS = new Set(['findFirst', 'findMany', 'findUnique', 'count', 'aggregate', 'groupBy']);

/**
 * PrismaService wraps PrismaClient with Row Level Security.
 * 
 * Uses Prisma v6 $extends API to automatically scope CLIENT queries.
 * Extends PrismaClient so all model accessors are available with proper types.
 */
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({
      log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
    });
  }

  /**
   * Returns an extended client with RLS applied based on the current request context.
   * Services should call this for queries that need RLS scoping.
   */
  withRLS() {
    return this.$extends({
      query: {
        $allOperations({ model, operation, args, query }: any) {
          const user = requestContext.getStore();

          // Only apply RLS to CLIENT users
          if (!user || user.role !== 'CLIENT' || !model) {
            return query(args);
          }

          // Standard userId-scoped models (Project, Invoice, AuditLog)
          if (RLS_SCOPED_MODELS.has(model)) {
            args.where = { ...args.where, userId: user.id };
            return query(args);
          }

          // Messages: scope to sender OR receiver
          if (model === 'Message' && READ_OPS.has(operation)) {
            args.where = {
              ...args.where,
              OR: [
                { senderId: user.id },
                { receiverId: user.id },
              ],
            };
            return query(args);
          }

          // Deliverables: scope via parent project's userId
          if (model === 'Deliverable' && READ_OPS.has(operation)) {
            args.where = {
              ...args.where,
              project: { userId: user.id },
            };
            return query(args);
          }

          return query(args);
        },
      },
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
