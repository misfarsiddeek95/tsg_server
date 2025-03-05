import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsString
} from 'class-validator';

export class Invoice401 {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: 'number', example: '401' })
  token: number;

  @ApiProperty({ type: 'string', example: 'Unauthorized' })
  message: string;
}

export class InvoiceListDto {
  @IsArray()
  // @IsNotEmpty()
  @ApiProperty({
    type: [],
    description: 'invoice  id',
    example: [830021, 12546]
  })
  invoice_Id: any;

  @IsString()
  // @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'invoice State',
    example: 'test type'
  })
  invoice_type: any;

  @IsObject()
  // @IsNotEmpty()
  @ApiProperty({
    type: {},
    description: 'date',
    example: { startDate: '2023-12-14', endDate: '2024-01-14' }
  })
  date: { startDate: string; endDate: string };

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ type: Number, description: 'tire State', example: 1 })
  tire_status: number;

  @IsNotEmpty()
  // @IsNumber()
  @ApiProperty({ type: Number, description: 'skip', example: 0 })
  skip: number;

  @IsNotEmpty()
  // @IsNumber()
  @ApiProperty({ type: Number, description: 'take', example: 10 })
  take: number;
}

export class InvoiceDetails {
  @IsNotEmpty()
  // @IsNumber()
  @ApiProperty({ type: Number, description: 'Invoice ID', example: 12450358 })
  invoice_id: number;
}

export class SearchInvoiceIdFilter201 {
  @IsNotEmpty()
  @ApiProperty({ type: Number, example: 8902 })
  invoice_id: number;
}
