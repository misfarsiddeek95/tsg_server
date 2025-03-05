import { Module } from '@nestjs/common';
import { SimsTicketFormService } from './sims-ticket-form.service';
import { SimsTicketFormController } from './sims-ticket-form.controller';
import { SimsEmailModule } from '../sims-email/sims-email.module';

@Module({
  controllers: [SimsTicketFormController],
  providers: [SimsTicketFormService],
  imports: [SimsEmailModule]
})
export class SimsTicketFormModule {}
