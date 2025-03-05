import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsString
} from 'class-validator';

export class InvoiceDto {
  @IsArray()
  @IsNotEmpty()
  @ApiProperty({ type: {}, description: 'date' })
  date: { datefrom: string; dateto: string };

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: {}, description: 'country' })
  country: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: {}, description: 'Tutoring country' })
  tutoring_country: string;

  @IsArray()
  @IsNotEmpty()
  @ApiProperty({ type: [], description: 'Tier Type' })
  tier_type: any;
}

export class Invoice401 {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: 'number', example: '401' })
  token: number;

  @ApiProperty({ type: 'string', example: 'Unauthorized' })
  message: string;
}

export class InvoiceTableDto {
  @IsNotEmpty()
  // @IsNumber()
  @ApiProperty({ type: Number, description: 'Invoice Batch  ID', example: 1 })
  invoicing_batch_Id: number;

  @IsArray()
  // @IsNotEmpty()
  @ApiProperty({
    type: [],
    description: 'Tutor name',
    example: ['Tester1', 'Tester2']
  })
  tutor_name: any;

  @IsArray()
  // @IsNotEmpty()
  @ApiProperty({
    type: [],
    description: 'Business Unit State',
    example: ['Uk', 'US']
  })
  business_unit: any;

  @IsArray()
  // @IsNotEmpty()
  @ApiProperty({ type: [], description: 'tutor id', example: [17, 18] })
  tutor_id: any;

  @IsArray()
  // @IsNotEmpty()
  @ApiProperty({ type: [], description: 'invoice  id', example: ['0012035'] })
  invoice_Id: any;

  @IsArray()
  // @IsNotEmpty()
  @ApiProperty({ type: [], description: 'invoice State', example: ['Send'] })
  invoice_status: any;

  @IsArray()
  // @IsNotEmpty()
  @ApiProperty({ type: [], description: 'tire State', example: ['Tire1'] })
  tire_status: any;

  @IsArray()
  // @IsNotEmpty()
  @ApiProperty({ type: [], description: 'edited  State', example: ['none'] })
  edited_status: any;

  @IsNotEmpty()
  // @IsNumber()
  @ApiProperty({ type: Number, description: 'skip', example: 0 })
  skip: number;

  @IsNotEmpty()
  // @IsNumber()
  @ApiProperty({ type: Number, description: 'take', example: 10 })
  take: number;

  @IsNotEmpty()
  // @IsNumber()
  @ApiProperty({ type: Number, description: 'max Earning', example: 200000 })
  maxEarning: number;

  @IsNotEmpty()
  // @IsNumber()
  @ApiProperty({ type: Number, description: 'min Earning', example: 10000 })
  minEarning: number;
}

export class ExportInvoiceTableDto {
  @IsArray()
  @IsNotEmpty()
  // @IsNumber()
  @ApiProperty({ type: [], description: 'Invoice ID', example: [8292] })
  invoiceIds: any;

  @IsNumber()
  // @IsNotEmpty()
  @ApiProperty({ type: Number, description: 'Batch ID ', example: 2 })
  invoiceBatchId: number;

  @IsNotEmpty()
  // @IsNumber()
  @ApiProperty({ type: Number, description: 'Status', example: 1 })
  status: number;

  @IsArray()
  // @IsNotEmpty()
  @ApiProperty({
    type: [],
    description: 'date',
    example: ['datefrom:2023-12-14', 'dateto:2024-01-14']
  })
  date: { datefrom: string; dateto: string };

  @IsArray()
  @ApiProperty({ type: [], description: 'Tutor name', example: ['tester17'] })
  tutor_name: any;

  @IsArray()
  @ApiProperty({
    type: [],
    description: 'Business Unit State',
    example: ['US']
  })
  business_unit: any;

  @IsArray()
  @ApiProperty({ type: [], description: 'tutor id', example: [100017] })
  tutor_id: any;

  @IsArray()
  @ApiProperty({ type: [], description: 'invoice  id', example: [8902] })
  invoice_Id: any;

  @IsArray()
  @ApiProperty({ type: [], description: 'invoice State', example: ['send'] })
  invoice_status: any;

  @IsArray()
  @ApiProperty({ type: [], description: 'tire State' })
  tire_status: any;

  @IsArray()
  @ApiProperty({ type: [], description: 'edited  State' })
  edited_status: any;

  @IsString()
  @ApiProperty({ type: String, description: 'country' })
  country: string;

  @IsString()
  @ApiProperty({ type: String, description: 'tutoring country' })
  tutoring_country: string;

  @IsNotEmpty()
  // @IsNumber()
  @ApiProperty({ type: Number, description: 'max Earning', example: 0 })
  maxEarning: number;

  @IsNotEmpty()
  // @IsNumber()
  @ApiProperty({ type: Number, description: 'min Earning', example: 0 })
  minEarning: number;
}

export class SendInvoiceDto {
  @IsArray()
  @IsNotEmpty()
  @ApiProperty({
    type: [],
    description: 'send invoice details',
    example: ['send invoice details']
  })
  send_invoice_details: any;
}
export class SendAllInvoiceDto {
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'Invoice Batch ID ',
    example: 'batch1'
  })
  invoice_batch_id: any;
}

export class CompleteInvoiceDto {
  @IsArray()
  @IsNotEmpty()
  @ApiProperty({ type: [], description: 'send invoice details' })
  complete_invoice_details: any;
}

export class CompleteAllInvoiceDto {
  @IsNotEmpty()
  @ApiProperty({
    type: Number,
    description: 'Invoice Batch ID ',
    example: 1024536
  })
  invoice_batch_id: any;
}

export class SearchTutorNameFilter201 {
  @IsNotEmpty()
  @ApiProperty({ type: Number, example: 8902 })
  tutor_name: number;
}

export class SearchTutorIdFilter201 {
  @IsNotEmpty()
  @ApiProperty({ type: Number, example: 8902 })
  tutor_id: number;
}

export class SearchInvoiceIdFilter201 {
  @IsNotEmpty()
  @ApiProperty({ type: Number, example: 8902 })
  invoice_id: number;
}

export class FiltersDto {
  @IsArray()
  @IsNotEmpty()
  @ApiProperty({
    type: [],
    description: 'date',
    example: ['datefrom:2023-11-01', 'dateto:2024-01-01']
  })
  date: { datefrom: string; dateto: string };

  @IsArray()
  @IsNotEmpty()
  @ApiProperty({ type: [], description: 'Tutor name', example: ['tester17'] })
  tutor_name: any;

  @IsArray()
  @IsNotEmpty()
  @ApiProperty({
    type: [],
    description: 'Business Unit State',
    example: ['US']
  })
  business_unit: any;

  @IsArray()
  @IsNotEmpty()
  @ApiProperty({ type: [], description: 'tutor id', example: [100017] })
  tutor_id: any;

  @IsArray()
  @IsNotEmpty()
  @ApiProperty({ type: [], description: 'invoice  id', example: [1000087] })
  invoice_Id: any;

  @IsArray()
  @IsNotEmpty()
  @ApiProperty({ type: [], description: 'invoice State', example: ['Send'] })
  invoice_status: any;

  @IsArray()
  @IsNotEmpty()
  @ApiProperty({ type: [], description: 'tire State', example: ['Tire1'] })
  tire_status: any;

  @IsArray()
  @IsNotEmpty()
  @ApiProperty({ type: [], description: 'edited  State', example: ['No'] })
  edited_status: any;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, description: 'country', example: 'SL' })
  country: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, description: 'tutoring country', example: 'UK' })
  tutoring_country: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ type: Number, description: 'skip' })
  skip: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ type: Number, description: 'take' })
  take: number;

  @IsNotEmpty()
  // @IsNumber()
  @ApiProperty({ type: Number, description: 'max Earning' })
  maxEarning: number;

  @IsNotEmpty()
  // @IsNumber()
  @ApiProperty({ type: Number, description: 'min Earning' })
  minEarning: number;
}

export class GetSidePanel200Dto {
  @IsNumber()
  @ApiProperty({ type: Number, example: 1 })
  state: number;

  @IsNumber()
  @ApiProperty({ type: Number, example: 1 })
  value: number;

  @IsNumber()
  @ApiProperty({ type: Number, example: 1 })
  batch_Id: number;

  @IsBoolean()
  @ApiProperty({ type: Boolean, example: true })
  isActive: boolean;
}

export class InvoiceDto401 {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: 'number', example: '401' })
  token: number;

  @ApiProperty({ type: 'string', example: 'Unauthorized' })
  message: string;
}
export class Common201Dto {
  @IsString()
  @ApiProperty({ type: 'string', example: 'true' })
  success: string;
}
