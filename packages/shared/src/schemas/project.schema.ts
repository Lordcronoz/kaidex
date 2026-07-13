import { z } from 'zod';

export const createProjectSchema = z.object({
  userId: z.string().cuid('Invalid user ID'),
  title: z
    .string()
    .min(2, 'Title must be at least 2 characters')
    .max(200, 'Title must be less than 200 characters'),
  description: z
    .string()
    .max(5000, 'Description must be less than 5000 characters')
    .optional(),
  status: z.enum(['DRAFT', 'IN_PROGRESS', 'REVIEW', 'COMPLETED', 'ARCHIVED']).default('DRAFT'),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;

export const updateDeliverableSchema = z.object({
  completed: z.boolean(),
});

export type UpdateDeliverableInput = z.infer<typeof updateDeliverableSchema>;
