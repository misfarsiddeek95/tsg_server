import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('app')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getData() {
    return this.appService.getData();
  }

  @Get('/type-of-leave')
  getTypeOfLeave() {
    return this.appService.getTypeOfLeave();
  }
}
