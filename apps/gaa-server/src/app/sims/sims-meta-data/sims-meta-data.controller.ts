// sims-meta-data.controller.ts
import { Controller, Get, UseGuards } from '@nestjs/common';
import { SimsMetaDataService } from './sims-meta-data.service';
import { CreateSimsMetaDatumDto } from './dto/create-sims-meta-datum.dto';
import { UpdateSimsMetaDatumDto } from './dto/update-sims-meta-datum.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResposeSimMetaData200Dto } from './dto/SimsMetaData.dto';

import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

// This Controller handles requests related to Sims Meta Data.
@ApiTags('GAA SIMS Meta Data Controller')
@Controller('sims-meta-data')
export class SimsMetaDataController {
  constructor(private readonly simsMetaDataService: SimsMetaDataService) {}

  // Endpoint to retrieve meta data
  @UseGuards(JwtAuthGuard)
  @Get('get-meta-data')
  @ApiOperation({ summary: 'Get SIMS Meta Data' })
  @ApiResponse({
    status: 200,
    type: ResposeSimMetaData200Dto
  })
  async getMetaData() {
    // eslint-disable-next-line no-useless-catch
    try {
      return await this.simsMetaDataService.getMetaData();
    } catch (error) {
      throw error; // Re-throw the error for global error handling
    }
  }
}
