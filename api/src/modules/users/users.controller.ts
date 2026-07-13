import {
  Controller,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { NextAuthGuard } from '../../common/guards/nextauth.guard';
import { RbacGuard } from '../../common/guards/rbac.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('users')
@UseGuards(NextAuthGuard, RbacGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * GET /api/v1/users
   * List all users (ADMIN only).
   */
  @Get()
  @Roles('ADMIN')
  findAll(@Query() query: Record<string, any>) {
    return this.usersService.findAll(query);
  }
}
