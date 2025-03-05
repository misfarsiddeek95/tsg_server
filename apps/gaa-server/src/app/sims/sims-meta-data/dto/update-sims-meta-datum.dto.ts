import { PartialType } from '@nestjs/swagger';
import { CreateSimsMetaDatumDto } from './create-sims-meta-datum.dto';

export class UpdateSimsMetaDatumDto extends PartialType(CreateSimsMetaDatumDto) {}
