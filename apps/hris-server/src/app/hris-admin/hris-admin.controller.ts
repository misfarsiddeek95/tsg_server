import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards
} from '@nestjs/common';
import { HrisAdminService } from './hris-admin.service';
import {
  AdminApprovalDto,
  ProfileStatusDto,
  Error400Dto,
  HrisAdminDto,
  HrisContractDto,
  Succes200Dto
} from './hris-admin.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

//THIS API IS NOT IN USE YET
@UseGuards(JwtAuthGuard)
@ApiTags('HRIS Admin Controller')
@Controller('hris-admin')
export class HrisAdminController {
  constructor(private readonly hrisAdminService: HrisAdminService) {}
  @ApiOperation({
    summary: 'Insert / Update entry job requisition data.'
  })
  @ApiResponse({
    status: 400,
    type: Error400Dto
  })
  @ApiResponse({
    status: 200,
    type: Succes200Dto
  })
  @Post('entry-job-requisition')
  async create(@Body() hrisAdminDto: HrisAdminDto) {
    return await this.hrisAdminService.create(hrisAdminDto);
  }

  @ApiResponse({
    status: 400,
    type: Error400Dto
  })
  @ApiResponse({
    status: 200,
    type: Succes200Dto
  })
  @Post('contract-details-entry')
  async createContract(@Body() hrisContractDto: HrisContractDto) {
    // const isUpdate = false; // set isUpdate flag to false to create a new contract
    return await this.hrisAdminService.createContract(hrisContractDto);
  }

  @Put(':tspId/status')
  async updateProfileStatus(
    @Param('tspId') tspId: string,
    @Body() profileStatusDto: ProfileStatusDto
  ): Promise<{ success: boolean }> {
    await this.hrisAdminService.updateProfileStatus(tspId, profileStatusDto);
    return { success: true };
  }

  @Put(':id/approval')
  async updateApproval(
    @Param('id') id: string,
    @Body() adminApprovalDto: AdminApprovalDto
  ): Promise<{ success: boolean }> {
    await this.hrisAdminService.updateApproval(id, adminApprovalDto);
    return { success: true };
  }
}
