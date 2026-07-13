import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Query,
  Body,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { NextAuthGuard } from '../../common/guards/nextauth.guard';
import { RbacGuard } from '../../common/guards/rbac.guard';
import { AuditInterceptor } from '../../common/interceptors/audit.interceptor';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('projects')
@UseGuards(NextAuthGuard, RbacGuard)
@UseInterceptors(AuditInterceptor)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  /**
   * GET /api/v1/projects
   * Paginated project list. CLIENT users see only their own (via RLS).
   */
  @Get()
  findAll(@Query() query: Record<string, any>) {
    return this.projectsService.findAll(query);
  }

  /**
   * GET /api/v1/projects/:id
   * Single project with deliverables.
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectsService.findOne(id);
  }

  /**
   * POST /api/v1/projects
   * Create a new project (ADMIN only).
   */
  @Post()
  @Roles('ADMIN')
  create(@Body() body: Record<string, any>) {
    return this.projectsService.create(body);
  }

  /**
   * PATCH /api/v1/projects/:id/deliverables/:delId
   * Toggle deliverable completion.
   */
  @Patch(':id/deliverables/:delId')
  toggleDeliverable(
    @Param('id') projectId: string,
    @Param('delId') deliverableId: string,
  ) {
    return this.projectsService.toggleDeliverable(projectId, deliverableId);
  }
}
