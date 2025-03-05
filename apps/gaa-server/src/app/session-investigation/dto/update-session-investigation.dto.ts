import { PartialType } from '@nestjs/mapped-types';
import { CreateSessionInvestigationDto } from './create-session-investigation.dto';

export class UpdateSessionInvestigationDto extends PartialType(CreateSessionInvestigationDto) {}
