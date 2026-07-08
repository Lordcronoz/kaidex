import { Injectable, BadRequestException } from '@nestjs/common';
import { contactSchema } from '@shared/schemas/contact.schema';

@Injectable()
export class ContactService {
  async handleSubmission(body: { name: string; email: string; company?: string; message: string }) {
    // Validate with Zod
    const result = contactSchema.safeParse(body);
    if (!result.success) {
      throw new BadRequestException({
        message: 'Validation failed',
        errors: result.error.flatten().fieldErrors,
      });
    }

    // In production: send email, store in DB, etc.
    console.log('Contact form submission:', result.data);

    return { received: true };
  }
}
