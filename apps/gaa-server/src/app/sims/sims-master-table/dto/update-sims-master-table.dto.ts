import { PartialType } from '@nestjs/swagger';
import { CreateSimsMasterTableDto } from './create-sims-master-table.dto';

export class UpdateSimsMasterTableDto extends PartialType(CreateSimsMasterTableDto) {}
