import { PartialType } from '@nestjs/swagger';
import { CreateSimsEmailDto } from './create-sims-email.dto';

export class UpdateSimsEmailDto extends PartialType(CreateSimsEmailDto) {}
