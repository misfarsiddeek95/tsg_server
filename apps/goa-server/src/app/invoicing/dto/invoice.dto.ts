import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsDecimal,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  isNotEmpty,
  isNumber
} from 'class-validator';

export class GenerateInvoicesDto {
  @IsArray()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'date',
    example: { datefrom: '20223-12-14', dateto: '2024-01-14' }
  })
  date: { datefrom: string; dateto: string };

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String, description: 'country', example: 'SL' })
  country: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String, description: 'Tutoring country', example: 'UK' })
  tutoring_country: string;

  @IsArray()
  @IsNotEmpty()
  @ApiProperty({ type: [], description: 'Tier Type', example: [1] })
  tier_type: any;

  @IsNotEmpty()
  @IsDateString()
  @ApiProperty({ type: String, description: 'due date', example: '2024-01-18' })
  due_date: string;
}
class InvoceDetailsUpdateDTO {
  @IsNotEmpty()
  @IsNumber()
  detail_id: number;

  @IsNotEmpty()
  @IsNumber()
  rate_id: number;

  @IsNotEmpty()
  @IsDecimal()
  amount: number;
}

export class UpateInvoiceDTO {
  @IsArray()
  @IsNotEmpty()
  @ApiProperty({
    type: InvoceDetailsUpdateDTO,
  example: [{ detail_id: 1, rate_id: 2, amount: 30000 }]
  })
  details: InvoceDetailsUpdateDTO[];

  @IsOptional()
  @IsDateString()
  due_date: string | null;

  @IsNotEmpty()
  @ApiProperty({ type: Number, example: 1 })
  state: number;
}

export class CancelInvoicesDTO {
  @IsArray()
  @IsNotEmpty()
  @ApiProperty({ type: Number, example:[1000254,103568] })
  invoice_ids: number[];

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({type:Boolean, example:true})
  cancel_all: boolean;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({type:String,example:"Test Reason"})
  reason: string;
}

export class Common201Dto {
  @IsString()
  @ApiProperty({ type: 'string', example: 'true' })
  success: string;
}

export class Common401Dto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: 'number', example: '401' })
  token: number;

  @ApiProperty({ type: 'string', example: 'Unauthorized' })
  message: string;
}
