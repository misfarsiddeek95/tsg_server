import { PartialType } from '@nestjs/swagger';
import { CreateSimsUserAccessDto } from './create-sims-user-access.dto';

export class UpdateSimsUserAccessDto extends PartialType(CreateSimsUserAccessDto) {}
