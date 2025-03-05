import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiTags,
  ApiUnauthorizedResponse
} from '@nestjs/swagger';
import { User } from '@prisma/client';
import { GetUser } from '../auth/decorator';
import {
  CancelInvoicesDTO,
  GenerateInvoicesDto,
  UpateInvoiceDTO,
  Common201Dto,
  Common401Dto
} from './dto/invoice.dto';
import { InvoicingService } from './invoicing.service';
import { JwtGuard } from '../auth/guard';

@UseGuards(JwtGuard)
@ApiTags('Invoicing Controller')
@Controller('invoicing')
@ApiBearerAuth() // Swagger decorater to identify this module is protected with bearer token
export class InvoicingController {
  constructor(private invoicingService: InvoicingService) {}

  @Post('/generate-invoices')
  @ApiCreatedResponse({
    description: 'Success',
    status: 201,
    type: Common201Dto
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: 'Unauthorized ',
    type: Common401Dto
  })
  @ApiBody({ type: GenerateInvoicesDto })
  generateInvoices(@Body() data: GenerateInvoicesDto, @GetUser() user: User) {
    return this.invoicingService.generateInvoices(data, user);
  }

  @Get('all-tiers')
  @ApiCreatedResponse({
    description: 'Success',
    status: 201,
    type: Common201Dto
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: 'Unauthorized ',
    type: Common401Dto
  })
  getAllTiers() {
    return this.invoicingService.getAllTiers();
  }

  @Patch('edit-invoice/:id')
  @ApiCreatedResponse({
    description: 'Success',
    status: 201,
    type: Common201Dto
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: 'Unauthorized ',
    type: Common401Dto
  })
  updateInvoice(
    @Param('id') id: string,
    @Body() data: UpateInvoiceDTO,
    @GetUser() user: User
  ) {
    return this.invoicingService.updateInvoice(+id, data, user);
  }

  @Post('cancel-invoices')
  @ApiCreatedResponse({
    description: 'Success',
    status: 201,
    type: Common201Dto
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: 'Unauthorized ',
    type: Common401Dto
  })
  cancelInvoice(@Body() data: CancelInvoicesDTO, @GetUser() user: User) {
    return this.invoicingService.cancelInvoice(data, user);
  }
}
