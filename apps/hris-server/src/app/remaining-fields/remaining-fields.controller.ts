import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RemainingFieldsService } from './remaining-fields.service';
import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AllRemainingFields200Dto } from './remaining-fields.dto';
import { BadRequest400Dto, UnauthorizedDto, Forbidden403Dto } from '../app.dto';

@UseGuards(JwtAuthGuard)
@ApiTags('HRIS: Remaining fields feature')
@Controller('remaining-fields')
export class RemainingFieldsController {
  constructor(private remainingFieldsService: RemainingFieldsService) {}

  @Get()
  @ApiOperation({ summary: 'Fetch Remaining Fields' })
  @ApiResponse({
    status: 200,
    description: 'Success: Fetch Remaining Fields',
    type: AllRemainingFields200Dto
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
  async fetchDetails(@Req() req) {
    return this.remainingFieldsService.allRemainingFields(req.user.userId);
  }
}
