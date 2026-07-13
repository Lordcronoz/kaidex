import { z } from 'zod';

export const sendMessageSchema = z.object({
  receiverId: z.string().cuid('Invalid receiver ID'),
  content: z
    .string()
    .min(1, 'Message cannot be empty')
    .max(10000, 'Message must be less than 10000 characters'),
});

export type SendMessageInput = z.infer<typeof sendMessageSchema>;
