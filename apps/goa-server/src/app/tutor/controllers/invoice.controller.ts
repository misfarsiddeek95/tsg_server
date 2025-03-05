import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiTags,
  ApiUnauthorizedResponse
} from '@nestjs/swagger';
import { JwtGuard } from '../../auth/guard';
import { InvoiceService } from '../services/invoice.service';
import {
  Invoice401,
  InvoiceDetails,
  InvoiceListDto,
  SearchInvoiceIdFilter201
} from '../dtos/invoice.dto';
import { GetUser } from '../../auth/decorator';
import { User } from '@prisma/client';

@UseGuards(JwtGuard)
@ApiTags('Tutor Controller Endpoint')
@Controller('tutor/invoice')
export class InvoiceController {
  constructor(private invoiceService: InvoiceService) {}

  // Get Draft and Send table Data
  @Post('/get-invoice')
  @ApiUnauthorizedResponse({
    //if not a valid token
    status: 403,
    description: 'Unauthorized',
    type: Invoice401
  })
  @ApiBody({ type: InvoiceListDto })
  getInvoiceTableData(@Body() dto: InvoiceListDto, @GetUser() user: User) {
    return this.invoiceService.getInvoices(dto, user);
  }

  @Post('/get-invoice-details')
  @ApiUnauthorizedResponse({
    //if not a valid token
    status: 403,
    description: 'Unauthorized',
    type: Invoice401
  })
  getInvoiceDetailsData(@Body() dto: InvoiceDetails) {
    return this.invoiceService.getInvoicedetails(dto);
  }

  // Search Invoice ID

  @Get('search-invoice-id/:filter')
  @ApiCreatedResponse({
    description: 'The resource was returned successfully',
    type: SearchInvoiceIdFilter201
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized Request',
    type: Invoice401
  })
  @ApiNotFoundResponse({ description: 'Resource not found' })
  invoiceIdS(@Param('filter') filter: number, @GetUser() user: User) {
    return this.invoiceService.getInvoiceID(filter, user);
  }
}
