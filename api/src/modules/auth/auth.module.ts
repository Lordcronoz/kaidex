import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { NextAuthGuard } from '../../common/guards/nextauth.guard';
import { RbacGuard } from '../../common/guards/rbac.guard';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    // Stricter rate limiting for auth endpoints: 5 attempts per minute
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 5,
    }]),
  ],
  controllers: [AuthController],
  providers: [AuthService, NextAuthGuard, RbacGuard],
  exports: [AuthService, NextAuthGuard, RbacGuard],
})
export class AuthModule {}
