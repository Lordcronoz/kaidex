import { Injectable, BadRequestException } from '@nestjs/common';
import { contactSchema } from '@shared/schemas/contact.schema';
import { foglamp } from 'foglamp';
import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';

const fog = foglamp({ hud: true });

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

    const workflowRunId = `contact-run-${Date.now()}`;

    try {
      await fog.run(
        {
          workflowName: 'contact-triage-pipeline',
          workflowRunId,
          metadata: { email: result.data.email, name: result.data.name },
        },
        async () => {
          await generateText({
            model: openai('gpt-4o-mini'),
            prompt: `Classify contact submission from ${result.data.name}: ${result.data.message}`,
            telemetry: {
              integrations: [
                fog.integration({
                  agentName: 'contact-classifier',
                  traceName: 'process-contact-submission',
                }),
              ],
            },
          });
        }
      );
    } catch {
      // SDK / LLM execution safety catch
    }

    // In production: send email, store in DB, etc.
    console.log('Contact form submission:', result.data);

    return { received: true };
  }
}
