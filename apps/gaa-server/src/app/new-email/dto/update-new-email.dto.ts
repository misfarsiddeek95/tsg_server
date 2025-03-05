import { PartialType } from '@nestjs/mapped-types';
import { CreateNewEmailDto } from './create-new-email.dto';

export class UpdateNewEmailDto extends PartialType(CreateNewEmailDto) {}
