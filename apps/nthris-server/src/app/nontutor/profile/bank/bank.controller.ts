import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
  Request
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiQuery,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiOkResponse,
  ApiOperation
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';
import { BankService } from './bank.service';
import {
  BankDataAuditDto,
  BankBranchesDto,
  BankDataDto,
  FetchBankBranchesDto,
  FetchBankDataDto
} from './bank.dto';
import {
  Common401Dto,
  CommonErrorDto,
  NTDto
} from '../../../common/common.dto';

@UseGuards(JwtAuthGuard)
@ApiTags('Profile Controller Endpoint')
@Controller('nontutor/profile')
@ApiBearerAuth()
export class BankController {
  constructor(private bankService: BankService) {}

  @ApiOperation({ summary: 'Fetch Bank Details' })
  @ApiOkResponse({ description: 'OK Response', type: FetchBankDataDto })
  @ApiBadRequestResponse({ description: 'Bad Request', type: CommonErrorDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized', type: Common401Dto })
  @Get('/bank-data')
  async fetchBankDetails(@Request() req) {
    return this.bankService.fetchBankDetails(req.user.userId);
  }

  @ApiOperation({ summary: 'Fetch Non Tutor Bank Details' })
  @ApiQuery({
    name: 'nonTutorId',
    description: 'Non Tutor Id',
    required: true,
    type: NTDto
  })
  @ApiOkResponse({ description: 'OK Response', type: FetchBankDataDto })
  @ApiBadRequestResponse({ description: 'Bad Request', type: CommonErrorDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized', type: Common401Dto })
  @Get('/bank-data-audit')
  async fetchBankDetailsNT(@Query() query: NTDto) {
    return this.bankService.fetchBankDetails(Number(query.nonTutorId));
  }

  @ApiOperation({ summary: 'Save Bank Details' })
  @ApiBody({ type: BankDataDto, description: 'Bank data' })
  @ApiCreatedResponse({
    description: 'Created Response',
    type: FetchBankDataDto
  })
  @ApiBadRequestResponse({ description: 'Bad Request', type: CommonErrorDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized', type: Common401Dto })
  @Post('/bank-data')
  async saveBankDetails(@Request() req, @Body() body: BankDataDto) {
    return this.bankService.saveBankDetails(req.user.userId, body);
  }

  @ApiOperation({ summary: 'Fetch Bank Branch Details' })
  @ApiQuery({
    name: 'bankName',
    description: 'Bank Name',
    required: true,
    type: FetchBankBranchesDto
  })
  @ApiOkResponse({ description: 'OK Response', type: BankBranchesDto })
  @ApiBadRequestResponse({ description: 'Bad Request', type: CommonErrorDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized', type: Common401Dto })
  @Get('bank-branches')
  async fetchBankBranches(@Query() bankName: FetchBankBranchesDto) {
    return this.bankService.fetchBankBranches(bankName);
  }

  @ApiOperation({ summary: 'Auditor: Submit Bank Details' })
  @ApiBody({ type: BankDataAuditDto, description: 'Bank data audit' })
  @ApiCreatedResponse({
    description: 'Created Response',
    type: FetchBankDataDto
  })
  @ApiBadRequestResponse({ description: 'Bad Request', type: CommonErrorDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized', type: Common401Dto })
  @Post('/bank-data-audit')
  async auditorSubmitDetails(@Request() req, @Body() body: BankDataAuditDto) {
    return this.bankService.auditorSubmitDetails(req.user.userId, body);
  }
}
