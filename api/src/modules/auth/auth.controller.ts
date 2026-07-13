import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { NextAuthGuard } from '../../common/guards/nextauth.guard';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * POST /api/v1/auth/login
   * Public endpoint — authenticates user with email and password.
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body.email, body.password);
  }

  /**
   * POST /api/v1/auth/mfa/setup
   * Protected — generates a TOTP secret for the authenticated user.
   */
  @Post('mfa/setup')
  @UseGuards(NextAuthGuard)
  @HttpCode(HttpStatus.OK)
  async setupMfa(@Req() req: Request) {
    const user = (req as any).user;
    return this.authService.setupMfa(user.id);
  }

  /**
   * POST /api/v1/auth/mfa/verify
   * Protected — verifies the TOTP token and enables MFA.
   */
  @Post('mfa/verify')
  @UseGuards(NextAuthGuard)
  @HttpCode(HttpStatus.OK)
  async verifyMfa(
    @Req() req: Request,
    @Body() body: { token: string },
  ) {
    const user = (req as any).user;
    return this.authService.verifyMfa(user.id, body.token);
  }
}
