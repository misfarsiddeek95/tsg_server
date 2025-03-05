import { Body, Controller, Request, Get, Post, Query, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import {
  ExistingFasRecord200DTO,
  ExistingFasRecord401DTO,
  ExistingFasRecord404DTO,
  FinalAssessment200Dto,
  FinalAssessment201Dto,
  FinalAssessment400Dto,
  FinalAssessment401Dto,
  FinalAssessment404Dto,
  FinalAssessmentFetchDto,
  FinalAssessmentFormDto
} from './fas.dto';
import { FasService } from './fas.service';

@ApiTags('GRA Final Assessment Controller')
@Controller('fas')
export class FasController {
  constructor(private fasService: FasService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('/fetch-fas')
  @ApiOperation({ summary: 'Get FAS Data' })
  @ApiResponse({
    status: 200,
    type: FinalAssessment200Dto
  })
  @ApiResponse({
    status: 404,
    type: FinalAssessment404Dto
  })
  @ApiResponse({
    status: 401,
    type: FinalAssessment401Dto
  })
  getFinalAssessment(@Query() { bookingStatusId }: FinalAssessmentFetchDto) {
    return this.fasService.getFAS(+bookingStatusId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('/submit-fas')
  @ApiOperation({ summary: 'Submit FAS Form' })
  @ApiResponse({
    status: 201,
    type: FinalAssessment201Dto
  })
  @ApiResponse({
    status: 400,
    type: FinalAssessment400Dto
  })
  @ApiResponse({
    status: 401,
    type: FinalAssessment401Dto
  })
  submitFinalAssessment(@Request() req, @Body() body: FinalAssessmentFormDto) {
    return this.fasService.submitFAS(req.user.userId, body);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('/get-existing-fas-record')
  @ApiOperation({ summary: 'Get Existing FAS Record' })
  @ApiResponse({
    status: 200,
    type: ExistingFasRecord200DTO
  })
  @ApiResponse({
    status: 404,
    type: ExistingFasRecord404DTO
  })
  @ApiResponse({
    status: 401,
    type: ExistingFasRecord401DTO
  })
  getExistingFasRecord(
    @Query() { bookingStatusId, userId, demoId }: FinalAssessmentFetchDto
  ) {
    return this.fasService.getCompletedFAS(+bookingStatusId, +userId, +demoId);
  }
}
