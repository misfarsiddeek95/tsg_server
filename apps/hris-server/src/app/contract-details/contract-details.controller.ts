import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

import { ContractDetailsService } from './contract-details.service';
import {
  ContractDetailsDto,
  ContractDetails200Dto,
  HrisCreateContractDto,
  HrisCreateContract200Dto,
  UpdateAdminApprovalStatusContractDto,
  UpdateAdminApprovalStatusContract200Dto,
  UpdateActivationStatusDto,
  UpdateActivationStatus200Dto,
  FetchContractNumbers200Dto
} from './contract-details.dto';
import { AccessGuard, Accesses } from '../auth/access.guard';
import { BadRequest400Dto, Forbidden403Dto, UnauthorizedDto } from '../app.dto';

@UseGuards(JwtAuthGuard)
@ApiTags('HRIS Table: Contract Details')
@Controller('contract-details')
export class ContractDetailsController {
  constructor(private contractService: ContractDetailsService) {}

  @Accesses('HR_ADMIN', 'HR_USER')
  @UseGuards(AccessGuard)
  @ApiBearerAuth()
  @Get()
  @ApiOperation({ summary: 'Fetch Contract Details Table Data' })
  @ApiResponse({
    status: 200,
    description: 'Success: Fetch Contract Details Table Data',
    type: ContractDetails200Dto
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
  fetchTableContractDetails(@Query() query: ContractDetailsDto) {
    return this.contractService.fetchTableContractDetails(query);
  }

  @Accesses('HR_ADMIN', 'HR_USER')
  @UseGuards(AccessGuard)
  @ApiBearerAuth()
  @Post('/create-contracts')
  @ApiOperation({ summary: 'Contact Contracts' })
  @ApiBody({ type: HrisCreateContractDto })
  @ApiResponse({
    status: 201,
    description: 'Success: Fetch Contract Details Table Data',
    type: HrisCreateContract200Dto
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
  createContracts(@Body() data: HrisCreateContractDto, @Request() req: any) {
    return this.contractService.createContracts(data, req.user.userId);
  }

  @Accesses('HR_ADMIN', 'HR_USER')
  @UseGuards(AccessGuard)
  @ApiBearerAuth()
  @Put('/update-admin-approval-status')
  @ApiOperation({ summary: 'Update Approval Status Contract' })
  @ApiBody({ type: UpdateAdminApprovalStatusContractDto })
  @ApiResponse({
    status: 200,
    description: 'Success: Update Approval Status Contract',
    type: UpdateAdminApprovalStatusContract200Dto
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
  updateProfileStatus(
    @Body() data: UpdateAdminApprovalStatusContractDto,
    @Request() req: any
  ) {
    return this.contractService.updateAdminApprovalStatus(
      data,
      req.user.userId
    );
  }

  @Accesses('HR_ADMIN', 'HR_USER')
  @UseGuards(AccessGuard)
  @ApiBearerAuth()
  @Put('/update-activation-status')
  @ApiOperation({ summary: 'Activate HRIS tutor profile' })
  @ApiBody({ type: UpdateActivationStatusDto })
  @ApiResponse({
    status: 200,
    description: 'Success: Activate HRIS tutor profile',
    type: UpdateActivationStatus200Dto
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
  updateActivationStatus(
    @Body() data: UpdateActivationStatusDto,
    @Request() req: any
  ) {
    return this.contractService.updateActivationStatus(data, req.user.userId);
  }

  @ApiBearerAuth()
  @Get('/get-contract-numbers')
  @ApiOperation({ summary: 'Get Contract Numbers list' })
  @ApiResponse({
    status: 200,
    description: 'Success: Get Contract Numbers list',
    type: FetchContractNumbers200Dto
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
  getContractNumbers() {
    return this.contractService.getContractNumbers();
  }
}
