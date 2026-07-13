import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { paginationSchema } from '@shared/schemas/common.schema';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * List all users with pagination (ADMIN only).
   * Returns non-sensitive user fields.
   */
  async findAll(query: Record<string, any>) {
    const { page, limit, sortBy, sortOrder } = paginationSchema.parse(query);
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.user.findMany({
        skip,
        take: limit,
        orderBy: { [sortBy || 'createdAt']: sortOrder },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          mfaEnabled: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: { projects: true },
          },
        },
      }),
      this.prisma.user.count(),
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
}
