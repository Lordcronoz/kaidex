import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { createInvoiceSchema } from '@shared/schemas/invoice.schema';
import { paginationSchema } from '@shared/schemas/common.schema';

@Injectable()
export class InvoicesService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * List invoices with pagination and optional status filter.
   * RLS middleware scopes CLIENT users to their own invoices.
   */
  async findAll(query: Record<string, any>) {
    const { page, limit, sortBy, sortOrder } = paginationSchema.parse(query);
    const skip = (page - 1) * limit;

    // Optional status filter
    const where: Record<string, any> = {};
    if (query.status && typeof query.status === 'string') {
      where.status = query.status.toUpperCase();
    }

    const [data, total] = await Promise.all([
      this.prisma.invoice.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy || 'createdAt']: sortOrder },
        include: {
          user: { select: { id: true, name: true, email: true } },
        },
      }),
      this.prisma.invoice.count({ where }),
    ]);

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Create a new invoice (ADMIN only).
   */
  async create(body: Record<string, any>) {
    const parsed = createInvoiceSchema.safeParse(body);
    if (!parsed.success) {
      throw new BadRequestException({
        message: 'Validation failed',
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    return this.prisma.invoice.create({
      data: {
        userId: parsed.data.userId,
        number: parsed.data.number,
        amount: parsed.data.amount,
        currency: parsed.data.currency,
        status: parsed.data.status,
        dueDate: parsed.data.dueDate,
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    });
  }
}
