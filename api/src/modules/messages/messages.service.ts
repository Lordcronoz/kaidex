import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { sendMessageSchema } from '@shared/schemas/message.schema';
import { paginationSchema } from '@shared/schemas/common.schema';

@Injectable()
export class MessagesService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Fetch message thread for the authenticated user.
   * RLS middleware automatically scopes to sender/receiver.
   * Optional `withUserId` query param to filter specific conversation.
   */
  async findAll(userId: string, query: Record<string, any>) {
    const { page, limit } = paginationSchema.parse(query);
    const skip = (page - 1) * limit;

    const where: Record<string, any> = {
      OR: [
        { senderId: userId },
        { receiverId: userId },
      ],
    };

    // If filtering to a specific conversation partner
    if (query.withUserId) {
      where.OR = [
        { senderId: userId, receiverId: query.withUserId },
        { senderId: query.withUserId, receiverId: userId },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.message.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'asc' },
        include: {
          sender: { select: { id: true, name: true, email: true, role: true } },
          receiver: { select: { id: true, name: true, email: true, role: true } },
        },
      }),
      this.prisma.message.count({ where }),
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
   * Send a new message from the authenticated user.
   */
  async create(senderId: string, body: Record<string, any>) {
    const parsed = sendMessageSchema.safeParse(body);
    if (!parsed.success) {
      throw new BadRequestException({
        message: 'Validation failed',
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    return this.prisma.message.create({
      data: {
        senderId,
        receiverId: parsed.data.receiverId,
        content: parsed.data.content,
      },
      include: {
        sender: { select: { id: true, name: true, email: true, role: true } },
        receiver: { select: { id: true, name: true, email: true, role: true } },
      },
    });
  }
}
