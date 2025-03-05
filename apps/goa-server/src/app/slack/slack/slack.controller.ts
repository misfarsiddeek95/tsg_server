import { Controller, Post, Body } from '@nestjs/common';
import { SlackService } from './slack.service';

@Controller('slack')
export class SlackController {
  constructor(private readonly slackService: SlackService) {}

  @Post('notify')
  async sendNotification(
    @Body('timeRangeId') timeRangeId: number,
    @Body('hourState') hourState: string,
    @Body('sessionDate') sessionDate: string,
    @Body('tutorId') tutorId: number
  ): Promise<any> {
    return await this.slackService.sendTutorSwapNotificationSlack({
      timeRangeId,
      hourState,
      sessionDate,
      tutorId
    });
    // return 'Notification sent to Slack!';
  }
}
