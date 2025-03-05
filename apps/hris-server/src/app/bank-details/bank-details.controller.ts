import { Accesses, AccessGuard } from '../auth/access.guard';
import {
  Body,
  Controller,
  Request,
  Get,
  Post,
  UseGuards,
  Query
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BadRequest400Dto, UnauthorizedDto, Forbidden403Dto } from '../app.dto';
import {
  BankSubmitDetailsDto,
  AuditorBankSubmitDetails,
  FetchBankBranchesDto,
  BankBranchesDto,
  FetchBankDetailsDto,
  BankDetails200Response,
  AuditorBankDetails200Response
} from './bank-details.dto';
import { BankDetailsService } from './bank-details.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@ApiTags('HRIS Bank Details')
@Controller('bank-details')
export class BankDetailsController {
  BankDetailsService: any;
  constructor(private bankDetails: BankDetailsService) {}

  @Get()
  @ApiOperation({ summary: 'Tutor: Fetch Bank Details' })
  @ApiResponse({
    status: 200,
    description: 'Success: Tutor: Fetch Bank Details',
    type: FetchBankDetailsDto
  })
  @ApiResponse({
    status: 400,
    description: 'Failed: Bad Request',
    type: BadRequest400Dto
  })
  @ApiResponse({
    status: 401,
    description: 'Failed: Unauthorized',
    type: UnauthorizedDto
  })
  async fetchDetails(@Request() req) {
    return this.bankDetails.fetchDetails(req.user.userId);
  }

  @Post()
  @ApiOperation({ summary: 'Tutor: Submit Bank Details' })
  @ApiBody({ type: BankSubmitDetailsDto })
  @ApiResponse({
    status: 201,
    description: 'Success: Tutor: Submit Bank Details',
    type: BankDetails200Response
  })
  @ApiResponse({
    status: 400,
    description: 'Failed: Bad Request',
    type: BadRequest400Dto
  })
  @ApiResponse({
    status: 401,
    description: 'Failed: Unauthorized',
    type: UnauthorizedDto
  })
  async submitDetails(@Request() req, @Body() body: BankSubmitDetailsDto) {
    return this.bankDetails.submitDetails(req.user.userId, body);
  }

  @Accesses('AUDITOR', 'HR_ADMIN', 'HR_USER')
  @UseGuards(AccessGuard)
  @Post('/auditor')
  @ApiOperation({ summary: 'Auditor: Submit Bank Details' })
  @ApiBody({ type: AuditorBankSubmitDetails })
  @ApiResponse({
    status: 201,
    description: 'Success: Auditor: Submit Bank Details',
    type: AuditorBankDetails200Response
  })
  @ApiResponse({
    status: 400,
    description: 'Failed: Bad Request',
    type: BadRequest400Dto
  })
  @ApiResponse({
    status: 401,
    description: 'Failed: Unauthorized',
    type: UnauthorizedDto
  })
  @ApiResponse({
    status: 403,
    description: 'Failed: Forbidden',
    type: Forbidden403Dto
  })
  async auditorSubmitDetails(
    @Request() req,
    @Body() body: AuditorBankSubmitDetails
  ) {
    return this.bankDetails.auditorSubmitDetails(req.user.userId, body);
  }

  @Get('bank-branches')
  @ApiOperation({ summary: 'Fetch Bank Branch Details' })
  @ApiResponse({
    status: 200,
    description: 'Success: Fetch Bank Branch Details',
    type: BankBranchesDto
  })
  @ApiResponse({
    status: 400,
    description: 'Failed: Bad Request',
    type: BadRequest400Dto
  })
  @ApiResponse({
    status: 401,
    description: 'Failed: Unauthorized',
    type: UnauthorizedDto
  })
  async fetchBankBranches(@Query() bankName: FetchBankBranchesDto) {
    return this.bankDetails.fetchBankBranches(bankName);
  }
}
