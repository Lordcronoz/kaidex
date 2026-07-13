import {
  Controller,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuditLogsService } from './audit-logs.service';
import { NextAuthGuard } from '../../common/guards/nextauth.guard';
import { RbacGuard } from '../../common/guards/rbac.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('audit-logs')
@UseGuards(NextAuthGuard, RbacGuard)
export class AuditLogsController {
  constructor(private readonly auditLogsService: AuditLogsService) {}

  /**
   * GET /api/v1/audit-logs
   * List all audit log entries (ADMIN only).
   */
  @Get()
  @Roles('ADMIN')
  findAll(@Query() query: Record<string, any>) {
    return this.auditLogsService.findAll(query);
  }
}
