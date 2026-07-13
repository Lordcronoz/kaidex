import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { createProjectSchema } from '@shared/schemas/project.schema';
import { paginationSchema } from '@shared/schemas/common.schema';

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * List projects with pagination.
   * RLS middleware automatically scopes CLIENT users to their own projects.
   */
  async findAll(query: Record<string, any>) {
    const { page, limit, sortBy, sortOrder } = paginationSchema.parse(query);
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.project.findMany({
        skip,
        take: limit,
        orderBy: { [sortBy || 'createdAt']: sortOrder },
        include: {
          deliverables: true,
          _count: { select: { deliverables: true } },
        },
      }),
      this.prisma.project.count(),
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
   * Get a single project by ID, including deliverables.
   */
  async findOne(id: string) {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: {
        deliverables: { orderBy: { createdAt: 'asc' } },
        user: { select: { id: true, name: true, email: true } },
      },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return project;
  }

  /**
   * Create a new project (ADMIN only).
   */
  async create(body: Record<string, any>) {
    const parsed = createProjectSchema.safeParse(body);
    if (!parsed.success) {
      throw new BadRequestException({
        message: 'Validation failed',
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    return this.prisma.project.create({
      data: parsed.data,
      include: { deliverables: true },
    });
  }

  /**
   * Toggle a deliverable's completion status.
   */
  async toggleDeliverable(projectId: string, deliverableId: string) {
    // Verify the deliverable belongs to the project
    const deliverable = await this.prisma.deliverable.findFirst({
      where: {
        id: deliverableId,
        projectId,
      },
    });

    if (!deliverable) {
      throw new NotFoundException('Deliverable not found');
    }

    return this.prisma.deliverable.update({
      where: { id: deliverableId },
      data: { completed: !deliverable.completed },
    });
  }
}
