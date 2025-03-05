import { Body, Controller, Post } from '@nestjs/common';

@Controller('hook')
export class HookController {
  @Post('/email-status')
  reminderEmail(@Body() body: any) {
    console.log('reminder email', body);
  }
}
