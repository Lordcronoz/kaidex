import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ContactService } from './contact.service';

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async submit(@Body() body: { name: string; email: string; company?: string; message: string }) {
    return this.contactService.handleSubmission(body);
  }
}
