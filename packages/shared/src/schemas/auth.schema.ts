import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const mfaSetupResponseSchema = z.object({
  secret: z.string(),
  otpauthUrl: z.string(),
});

export type MfaSetupResponse = z.infer<typeof mfaSetupResponseSchema>;

export const mfaVerifySchema = z.object({
  token: z.string().length(6, 'Token must be 6 digits'),
});

export type MfaVerifyInput = z.infer<typeof mfaVerifySchema>;
