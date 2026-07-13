import {
  Controller,
  Get,
  Post,
  Query,
  Body,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { NextAuthGuard } from '../../common/guards/nextauth.guard';
import { RbacGuard } from '../../common/guards/rbac.guard';
import { AuditInterceptor } from '../../common/interceptors/audit.interceptor';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('invoices')
@UseGuards(NextAuthGuard, RbacGuard)
@UseInterceptors(AuditInterceptor)
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  /**
   * GET /api/v1/invoices
   * Paginated invoice list with optional status filter.
   */
  @Get()
  findAll(@Query() query: Record<string, any>) {
    return this.invoicesService.findAll(query);
  }

  /**
   * POST /api/v1/invoices
   * Create a new invoice (ADMIN only).
   */
  @Post()
  @Roles('ADMIN')
  create(@Body() body: Record<string, any>) {
    return this.invoicesService.create(body);
  }
}
