import {
  Controller,
  Get,
  Post,
  Query,
  Body,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { NextAuthGuard } from '../../common/guards/nextauth.guard';
import { RbacGuard } from '../../common/guards/rbac.guard';
import { AuditInterceptor } from '../../common/interceptors/audit.interceptor';
import { Request } from 'express';

@Controller('messages')
@UseGuards(NextAuthGuard, RbacGuard)
@UseInterceptors(AuditInterceptor)
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  /**
   * GET /api/v1/messages
   * Fetch message thread for the authenticated user.
   */
  @Get()
  findAll(@Req() req: Request, @Query() query: Record<string, any>) {
    const user = (req as any).user;
    return this.messagesService.findAll(user.id, query);
  }

  /**
   * POST /api/v1/messages
   * Send a message from the authenticated user.
   */
  @Post()
  create(@Req() req: Request, @Body() body: Record<string, any>) {
    const user = (req as any).user;
    return this.messagesService.create(user.id, body);
  }
}
