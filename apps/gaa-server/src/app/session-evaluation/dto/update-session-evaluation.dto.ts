import { PartialType } from '@nestjs/mapped-types';
import {
  CreateSessionEvaluationDto,
  EditableCountDto,
  EmailFlagStatusDto,
  SessionStatusUpdate
} from './create-session-evaluation.dto';

export class UpdateSessionEvaluationDto extends PartialType(
  CreateSessionEvaluationDto
) {}
export class UpdateSessionStatusUpdate extends PartialType(
  SessionStatusUpdate
) {}

export class UpdateEmailFlagStatusDto extends PartialType(EmailFlagStatusDto) {}

export class UpdateEditableCountDto extends PartialType(EditableCountDto) {}
