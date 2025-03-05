import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import {
  Body,
  Controller,
  Request,
  Get,
  UseGuards,
  Post,
  Query
} from '@nestjs/common';
import { UserService } from '../../user/services/user.service';
import { MasterViewService } from './master-view.service';

import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';
import {
  BatchDto,
  DemoAssesment200Dto,
  DemoAssesment401Dto,
  DemoAssesment404Dto,
  FinalOutcomeDto,
  MasterViewDto
} from './master-view.dto';

@ApiTags('FAS Master View Controller')
@Controller('fas-master-view')
export class MasterViewController {
  constructor(private MasterViewService: MasterViewService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('/getmasterview')
  @ApiOperation({ summary: 'Fetch Table Data' })
  @ApiResponse({ status: 200, type: DemoAssesment200Dto })
  @ApiResponse({ status: 404, type: DemoAssesment404Dto })
  @ApiResponse({ status: 401, type: DemoAssesment401Dto })
  GetMasterView(@Query() query: MasterViewDto) {
    return this.MasterViewService.getmasterview(query);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('/update-final-decision')
  @ApiOperation({ summary: 'update final decision' })
  setFinalDecision(@Request() req, @Body() details: FinalOutcomeDto) {
    // console.log('checking control', details);
    return this.MasterViewService.setFinalDecision(req.user.userId, details);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('/send-final-emails')
  @ApiOperation({ summary: 'sendFinalEmails' })
  sendFinalEmails(@Request() req, @Body() details: BatchDto) {
    // console.log('checking control', details);
    return this.MasterViewService.sendFinalEmails(req.user.userId, details);
  }

  @Get('export')
  exportFinalAssesments(@Query() query: Omit<MasterViewDto, 'take' | 'skip'>) {
    return this.MasterViewService.exportFinalAssesments(query);
  }
}
