import { Controller, Get } from '@nestjs/common';

@Controller('flexiquiz')
export class FlexiquizController {
  @Get()
  getHello(): string {
    return 'Path found';
  }
}
