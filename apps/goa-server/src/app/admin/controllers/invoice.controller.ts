import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiTags,
  ApiUnauthorizedResponse
} from '@nestjs/swagger';
import { User } from '@prisma/client';
import { GetUser } from '../../auth/decorator';
import { JwtGuard } from '../../auth/guard';
import {
  CompleteAllInvoiceDto,
  CompleteInvoiceDto,
  ExportInvoiceTableDto,
  FiltersDto,
  GetSidePanel200Dto,
  Invoice401,
  InvoiceDto401,
  InvoiceTableDto,
  SearchInvoiceIdFilter201,
  SearchTutorIdFilter201,
  SearchTutorNameFilter201,
  SendAllInvoiceDto,
  SendInvoiceDto,
  Common201Dto
} from '../dtos/invoice.dto';
import { InvoiceService } from '../services/invoice.service';
@UseGuards(JwtGuard)
@ApiTags('Admin Invoice Controller Endpoint')
@Controller('invoice')
@ApiBearerAuth() // Swagger decorater to identify this module is protected with bearer token
export class InvoiceController {
  constructor(private invoiceService: InvoiceService) {}

  // Get Side Panel Data - Start __________________________________
  @Get('/get-side-panel')
  @ApiCreatedResponse({
    status: 201,
    description: 'Get Side Panel',
    type: GetSidePanel200Dto
  })
  @ApiUnauthorizedResponse({
    //if not a valid
    status: 401,
    description: 'Invalid ',
    type: InvoiceDto401
  })
  getSidePanelData() {
    return this.invoiceService.getInvoicingBatch();
  }
  // Get Side Panel Data - End __________________________________

  // Get Draft and Send table Data - Start __________________________________
  @Post('/get-invoice-table-data')
  @ApiUnauthorizedResponse({
    //if not a valid token
    status: 403,
    description: 'Unauthorized',
    type: Invoice401
  })
  @ApiBody({ type: InvoiceTableDto })
  getInvoiceTableData(@Body() invoiceTableDto: InvoiceTableDto) {
    return this.invoiceService.getInvoiceTable(invoiceTableDto);
  }
  // Get Draft and Send table Data - End __________________________________

  //  Complete  Invoice - Start __________________________________
  @Post('/complete-invoice')
  @ApiCreatedResponse({
    status: 201,
    type: Common201Dto
  })
  @ApiUnauthorizedResponse({
    //if not a valid token
    status: 401,
    description: 'Unauthorized',
    type: Invoice401
  })
  @ApiBody({ type: CompleteInvoiceDto })
  async CompleteInvoiceByinvoiceId(
    @Body() details: CompleteInvoiceDto,
    @GetUser() user: User
  ) {
    return this.invoiceService.CompleteInvoice(details, user);
  }
  //  Complete  Invoice - End __________________________________

  // Complete  All  Invoice - Start __________________________________
  @Post('/complete-all-invoice')
  @ApiCreatedResponse({
    status: 201,
    type: Common201Dto
  })
  @ApiUnauthorizedResponse({
    //if not a valid token
    status: 401,
    description: 'Unauthorized',
    type: Invoice401
  })
  @ApiBody({ type: CompleteAllInvoiceDto })
  async CompleteAllInvoiceByinvoiceBatchId(
    @Body() details: CompleteAllInvoiceDto,
    @GetUser() user: User
  ) {
    return this.invoiceService.completeAllInvoice(details, user);
  }
  // Complete  All Invoice  - End __________________________________

  // Send Invoice - Start __________________________________
  @Post('/send-invoice')
  @ApiCreatedResponse({
    status: 201,
    type: Common201Dto
  })
  @ApiUnauthorizedResponse({
    //if not a valid token
    status: 401,
    description: 'Unauthorized',
    type: Invoice401
  })
  @ApiBody({ type: SendInvoiceDto })
  async sendInvoiceByInvoiceId(
    @Body() details: SendInvoiceDto,
    @GetUser() user: User
  ) {
    return this.invoiceService.sendInvoice(details, user);
  }
  // Send Invoice - End __________________________________

  // Send All Invoice  - Start __________________________________
  @Post('/send-all-invoice')
  @ApiCreatedResponse({
    status: 201,
    type: Common201Dto
  })
  @ApiUnauthorizedResponse({
    //if not a valid token
    status: 401,
    description: 'Unauthorized',
    type: Invoice401
  })
  @ApiBody({ type: SendAllInvoiceDto })
  async sendAllInvoiceByInvoiceBatchId(
    @Body() details: SendAllInvoiceDto,
    @GetUser() user: User
  ) {
    return this.invoiceService.sendAllInvoice(details, user);
  }
  // Send All Invoice  - End __________________________________

  // Complete Table Data load  - Start __________________________________
  @Post('/complete-table')
  @ApiCreatedResponse({
    status: 201,
    type: Common201Dto
  })
  @ApiUnauthorizedResponse({
    //if not a valid
    status: 401,
    description: 'Invalid ',
    type: Invoice401
  })
  @ApiBody({ type: FiltersDto })
  getTimeOffReq(@Body() dto: FiltersDto) {
    return this.invoiceService.getCompleteInvoice(dto);
  }
  // Complete Table Data load  - End __________________________________

  // Search Tutor ID  - Start __________________________________
  @Get('search-tutor-id')
  @ApiCreatedResponse({
    description: 'The resource was returned successfully',
    type: SearchTutorIdFilter201
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized Request',
    type: Invoice401
  })
  @ApiNotFoundResponse({ description: 'Resource not found' })
  async tutorIdStatus(
    @Query('filter') filter: number,
    @Query('country') country: string
  ) {
    return await this.invoiceService.getTutorID({ filter, country });
  }
  // Search Tutor ID  - End __________________________________

  // Search Tutor Name - Start __________________________________
  @Get('search-tutor-name')
  @ApiCreatedResponse({
    description: 'The resource was returned successfully',
    type: SearchTutorNameFilter201
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized Request',
    type: Invoice401
  })
  @ApiNotFoundResponse({ description: 'Resource not found' })
  async tutorNameStatus(
    @Query('tutorName') filter: string,
    @Query('country') country: string
  ) {
    return await this.invoiceService.getTutorName({ filter, country });
  }
  // Search Tutor Name - End __________________________________

  // Search Invoice ID - Start __________________________________
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
  invoiceIdS(@Param('invoiceId') filter: number) {
    return this.invoiceService.getInvoiceID(filter);
  }
  // Search Invoice ID - End __________________________________

  // Get Invoice details  - Start __________________________________
  @Get('/get-invoice-details')
  @ApiCreatedResponse({ status: 201, type: ExportInvoiceTableDto })
  @ApiUnauthorizedResponse({
    //if not a valid token
    status: 403,
    description: 'Unauthorized',
    type: Invoice401
  })
  getInvoiceDetailsData(@Query('id') id: number) {
    return this.invoiceService.getInvoicedetails(+id);
  }
  // Get Invoice details  - End __________________________________

  // Get Export Invoice details - Start __________________________________
  @Post('/get-invoice-export-table-data')
  @ApiCreatedResponse({ status: 201, type: ExportInvoiceTableDto })
  @ApiUnauthorizedResponse({
    //if not a valid token
    status: 403,
    description: 'Unauthorized',
    type: Invoice401
  })
  @ApiBody({ type: ExportInvoiceTableDto })
  getExportInvoiceTableData(@Body() dto: ExportInvoiceTableDto) {
    return this.invoiceService.getExportInvoiceTable(dto);
  }
  // Get Export Invoice details - End __________________________________
}
