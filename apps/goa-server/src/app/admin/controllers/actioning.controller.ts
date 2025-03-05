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
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiTags,
  ApiUnauthorizedResponse
} from '@nestjs/swagger';
import { JwtGuard } from '../../auth/guard';
import { ActioningService } from '../services/actioning.service';
import {
  ConcernsDto,
  PaymentConcernsTableDto,
  Status201,
  Status401
} from '../dtos/actioning.dto';
import { GetUser } from '../../auth/decorator';
import { User } from '@prisma/client';

@UseGuards(JwtGuard)
@ApiTags('Admin Actioning Controller Endpoint')
@Controller('actioning')
export class ActioningController {
  constructor(private actioningService: ActioningService) {}

  //Get Payment Concerns Table Data - Start __________________________________
  @Post('/get-payment-concerns-table-data')
  @ApiUnauthorizedResponse({
    //if not a valid token
    status: 403,
    description: 'Unauthorized',
    type: Status401
  })
  @ApiBody({ type: PaymentConcernsTableDto })
  getInvoiceTableData(@Body() dto: PaymentConcernsTableDto) {
    return this.actioningService.getPaymentConcernsTable(dto);
  }
  //Get Payment Concerns Table Data  - End __________________________________

  
  // Concerns Request  - Start __________________________________
  @Post('/concerns-req')
  @ApiCreatedResponse({ description: 'concerns request', type: Status201 })
  @ApiUnauthorizedResponse({
    //if not a valid token
    status: 403,
    description: 'Unauthorized',
    type: Status401
  })
  @ApiBody({ type: ConcernsDto })
  async CancelByReqId(@Body() details: ConcernsDto, @GetUser() user: User) {
    return this.actioningService.ConcernRequest(details, user);
  }
  // Concerns Request  - End __________________________________


  // Search Tutor Name - Start __________________________________
  @Get('search-tutor-name')
  @ApiCreatedResponse({
    description: 'The resource was returned successfully',
    type: Status201
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized Request',
    type: Status401
  })
  @ApiNotFoundResponse({ description: 'Resource not found' })
  async tutorNameStatus(@Query('tutorName') filter: string) {
    return await this.actioningService.getTutorName({ filter });
  }
  // Search Tutor Name - End __________________________________


  // Search Tutor ID - Start __________________________________
  @Get('search-tutor-id')
  @ApiCreatedResponse({
    description: 'The resource was returned successfully',
    type: Status201
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized Request',
    type: Status401
  })
  @ApiNotFoundResponse({ description: 'Resource not found' })
  async tutorIdStatus(@Query('tutorId') filter: number) {
    return await this.actioningService.getTutorID({ filter });
  }
  // Search Tutor ID - End __________________________________


  //Search Concern ID - Start __________________________________
  @Get('search-concern-id/:filter')
  @ApiCreatedResponse({
    description: 'The resource was returned successfully',
    type: Status201
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized Request',
    type: Status401
  })
  @ApiNotFoundResponse({ description: 'Resource not found' })
  invoiceIdS(@Param('concernId') filter: number) {
    return this.actioningService.getConcerneID(filter);
  }
  // Search Concern ID - End __________________________________
}
