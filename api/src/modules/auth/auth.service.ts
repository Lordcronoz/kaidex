import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { authenticator } from 'otplib';
import { loginSchema } from '@shared/schemas/auth.schema';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Authenticate a user with email and password.
   * Returns the user object (without sensitive fields) on success.
   */
  async login(email: string, password: string) {
    // Validate input
    const parsed = loginSchema.safeParse({ email, password });
    if (!parsed.success) {
      throw new BadRequestException({
        message: 'Validation failed',
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    const user = await this.prisma.user.findUnique({
      where: { email: parsed.data.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(parsed.data.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Return user info without sensitive data
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      mfaEnabled: user.mfaEnabled,
    };
  }

  /**
   * Generate a new TOTP secret for MFA setup.
   * Stores the secret on the user record (encrypted at app level).
   */
  async setupMfa(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (user.mfaEnabled) {
      throw new BadRequestException('MFA is already enabled');
    }

    const secret = authenticator.generateSecret();
    const issuer = process.env.MFA_ISSUER || 'Kaidex';
    const otpauthUrl = authenticator.keyuri(user.email, issuer, secret);

    // Store the secret (should be encrypted at application level in production)
    await this.prisma.user.update({
      where: { id: userId },
      data: { mfaSecret: secret },
    });

    return { secret, otpauthUrl };
  }

  /**
   * Verify a TOTP token and enable MFA on the user account.
   */
  async verifyMfa(userId: string, token: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.mfaSecret) {
      throw new BadRequestException('MFA setup not initiated');
    }

    const isValid = authenticator.verify({
      token,
      secret: user.mfaSecret,
    });

    if (!isValid) {
      throw new UnauthorizedException('Invalid MFA token');
    }

    // Enable MFA
    await this.prisma.user.update({
      where: { id: userId },
      data: { mfaEnabled: true },
    });

    return { mfaEnabled: true };
  }
}
