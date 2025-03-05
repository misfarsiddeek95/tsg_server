import {
  Body,
  Controller,
  Request,
  Get,
  Post,
  Query,
  UseGuards
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

import { RecruitmentMasterService } from './recruitment-master.service';
import {
  AssignToBatchDto,
  CreateNewBatchDto,
  RecruitmentMasterDto,
  UpdateCandidateTrainingStatusDto
} from './recruitment-master.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Accesses, AccessGuard } from '../auth/access.guard';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('Recruitment Master')
@Controller('recruitment-master')
export class RecruitmentMasterController {
  constructor(private RecruitmentMaster: RecruitmentMasterService) {}

  @Accesses('AP_INT', 'AP_AD')
  @UseGuards(AccessGuard)
  @Post('fetch-recruitment-master')
  @ApiOperation({
    summary: 'Non-tutor: Fetch initial assessment history table'
  })
  fetchRecruitmentMaster(
    @Body()
    { take, skip, tspId, candiName, startDate, endDate }: RecruitmentMasterDto
  ) {
    return this.RecruitmentMaster.fetchRecruitmentMaster(
      take,
      skip,
      tspId,
      candiName,
      startDate,
      endDate
    );
  }

  @Accesses('AP_INT', 'AP_AD')
  @UseGuards(AccessGuard)
  @Get('fetch-batch-list')
  @ApiOperation({
    summary: 'Non-tutor: Fetch tutor batch list'
  })
  fetchBatchList() {
    return this.RecruitmentMaster.fetchBatchList();
  }

  @Accesses('AP_AD')
  @UseGuards(AccessGuard)
  @Post('assign-to-batch')
  @ApiOperation({
    summary: 'Non-tutor: Assign or Update candidate to batch'
  })
  assignToBatch(@Body() data: AssignToBatchDto, @Request() req: any) {
    return this.RecruitmentMaster.assignToBatch(data, req.user.userId);
  }

  @Accesses('AP_AD')
  @UseGuards(AccessGuard)
  @Post('create-new-batch')
  @ApiOperation({
    summary: 'Non-tutor: Create new batch'
  })
  createNewBatch(@Body() data: CreateNewBatchDto, @Request() req: any) {
    return this.RecruitmentMaster.createNewBatch(data, req.user.userId);
  }

  @Accesses('AP_AD')
  @UseGuards(AccessGuard)
  @Post('update-candidate-training-status')
  @ApiOperation({
    summary: 'Non-tutor: Update candidate training status'
  })
  updateCandidateTrainingStatus(
    @Body() data: UpdateCandidateTrainingStatusDto,
    @Request() req: any
  ) {
    return this.RecruitmentMaster.updateCandidateTrainingStatus(
      data,
      req.user.userId
    );
  }

  // @Accesses('AP_INT', 'AP_AD')
  // @UseGuards(AccessGuard)
  // @Get('export-recruitment-master')
  // @ApiOperation({
  //   summary: 'Non-tutor: Export initial assessment history table'
  // })
  // exportRecruitmentMaster(
  //   @Query() query: Omit<RecruitmentMasterDto, 'take' | 'skip'>
  // ) {
  //   return this.RecruitmentMaster.exportRecruitmentMaster(query);
  // }

  @Get('test')
  async testCron() {
    return this.RecruitmentMaster.test();
  }
}
