import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiOperation
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';
import { AuditService } from './audit.service';
import { AuditDataDto, AuditSearchDto } from './audit.dto';
import { Common401Dto, CommonErrorDto } from '../../../common/common.dto';

@UseGuards(JwtAuthGuard)
@ApiTags('Profile Audit Controller Endpoint')
@Controller('admin/profile')
@ApiBearerAuth()
export class AuditController {
  constructor(private auditService: AuditService) {}

  @ApiOperation({ summary: 'Fetch Profile Audit Details' })
  @ApiOkResponse({ description: 'OK Response', type: AuditDataDto })
  @ApiBadRequestResponse({ description: 'Bad Request', type: CommonErrorDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized', type: Common401Dto })
  @Post('/audit-data')
  fetchAuditDetails(@Body() params: AuditSearchDto) {
    return this.auditService.fetchAuditDetails(params);
  }
}
