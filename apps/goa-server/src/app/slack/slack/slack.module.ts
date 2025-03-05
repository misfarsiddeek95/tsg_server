import { Global, Module } from '@nestjs/common';
import { SlackController } from './slack.controller';
import { SlackService } from './slack.service';

@Global()
@Module({
  controllers: [SlackController],
  providers: [SlackService],
  exports: [SlackService]
})
export class SlackModule {}
