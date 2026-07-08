import { z } from 'zod';

/** Standard pagination query params */
export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type PaginationInput = z.infer<typeof paginationSchema>;

/** Standard ID param */
export const idSchema = z.object({
  id: z.string().cuid(),
});

export type IdInput = z.infer<typeof idSchema>;
