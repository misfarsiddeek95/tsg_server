import { PartialType } from '@nestjs/swagger';
import {
  Collaborators,
  CreateSimsTicketFormDto,
  EscalateToHRDto,
  ReplyEmail,
  ResendPrimaryEmail,
  closeTicket
} from './create-sims-ticket-form.dto';

export class UpdateSimsTicketFormDto extends PartialType(
  CreateSimsTicketFormDto
) {}

export class UpdateEscalateToHRDto extends PartialType(EscalateToHRDto) {}
export class UpdateCollaborators extends PartialType(Collaborators) {}
export class UpdateCloseTicket extends PartialType(closeTicket) {}
export class UpdateResendPrimaryEmail extends PartialType(ResendPrimaryEmail) {}
export class UpdateReplyEmail extends PartialType(ReplyEmail) {}
