import { PartialType } from '@nestjs/mapped-types';
import { CreateReadSessionEvaluationDatumDto } from './create-read-session-evaluation-datum.dto';

export class UpdateReadSessionEvaluationDatumDto extends PartialType(CreateReadSessionEvaluationDatumDto) {}
