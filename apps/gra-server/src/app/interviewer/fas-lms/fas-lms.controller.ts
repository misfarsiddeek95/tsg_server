import { Body, Controller, Get, UseGuards, Post, Query } from '@nestjs/common';
import { UserService } from '../../user/services/user.service';
import { LmsService } from './fas-lms.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';
import {
  TalentlMS200Dto,
  TalentlMS404Dto,
  TalentlMS401Dto,
  TalentLmsDto
} from './fas-lms.dto';

@ApiTags('FAS LMS Controller')
@Controller('fas-master-view')
export class LmsController {
  constructor(private LmsService: LmsService) {}

  @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard)
  @Get('/getlms')
  @ApiOperation({ summary: 'Fetch Table Data' })
  @ApiResponse({ status: 200, type: TalentlMS200Dto })
  @ApiResponse({ status: 404, type: TalentlMS404Dto })
  @ApiResponse({ status: 401, type: TalentlMS401Dto })
  GetTalentLMS(@Query() query: TalentLmsDto) {
    return this.LmsService.getlms(query);
  }
  @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard)
  @Post('/importcsv')
  @ApiOperation({ summary: 'Fetch Table Data' })
  @ApiResponse({ status: 200, type: TalentlMS200Dto })
  @ApiResponse({ status: 404, type: TalentlMS404Dto })
  @ApiResponse({ status: 401, type: TalentlMS401Dto })
  async ImportCSV(@Body() query: any) {
    return this.LmsService.importcsv(query);
  }
}
