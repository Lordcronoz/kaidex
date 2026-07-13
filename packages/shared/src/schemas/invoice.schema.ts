import { z } from 'zod';

export const createInvoiceSchema = z.object({
  userId: z.string().cuid('Invalid user ID'),
  number: z
    .string()
    .min(1, 'Invoice number is required')
    .max(50, 'Invoice number must be less than 50 characters'),
  amount: z.coerce
    .number()
    .positive('Amount must be positive'),
  currency: z.string().length(3, 'Currency must be a 3-letter code').default('USD'),
  status: z.enum(['DRAFT', 'SENT', 'PAID', 'OVERDUE', 'CANCELLED']).default('DRAFT'),
  dueDate: z.coerce.date().optional(),
});

export type CreateInvoiceInput = z.infer<typeof createInvoiceSchema>;
