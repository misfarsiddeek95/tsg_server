import { Body, Controller, Get, UseGuards, Post, Query } from '@nestjs/common';
import { UserService } from '../../user/services/user.service';
import { PiListService } from './pi-list.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';
import {
  FlexiListDto,
  PiList201Dto,
  PiList400Dto,
  PiListUnauthorized401Dto
} from './pi-list.dto';

@ApiTags('GRA Pi-List Controller')
@Controller()
export class PiListController {
  constructor(private piListService: PiListService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('/pi-list')
  @ApiOperation({ summary: 'Submit PI-List' })
  @ApiResponse({
    status: 201,
    type: PiList201Dto
  })
  @ApiResponse({
    status: 400,
    type: PiList400Dto
  })
  @ApiResponse({
    status: 401,
    type: PiListUnauthorized401Dto
  })
  getCandidatesList(
    @Query()
    {
      take,
      skip,
      export2Csv,
      tspId,
      candiName,
      candiEmail,
      finalOutcome,
      mobileNo,
      startDate,
      endDate
    }: FlexiListDto
  ) {
    return this.piListService.getPiList(
      take,
      skip,
      export2Csv,
      tspId,
      candiName,
      candiEmail,
      finalOutcome,
      mobileNo,
      startDate,
      endDate
    );
  }

  // @Get('export')
  // exportPhoneInterviewMaster(
  //   @Query() query: Omit<FlexiListDto, 'take' | 'skip'>
  // ) {
  //   return this.piListService.exportPhoneInterviewMaster(query);
  // }
}
