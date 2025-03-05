import { Module } from '@nestjs/common';
import { RemainingFieldsController } from './remaining-fields.controller';
import { RemainingFieldsService } from './remaining-fields.service';

@Module({
  controllers: [RemainingFieldsController],
  providers: [RemainingFieldsService]
})
export class RemainingFieldsModule {}
