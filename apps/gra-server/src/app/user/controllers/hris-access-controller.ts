import { Body, Controller, Request, Post, UseGuards } from '@nestjs/common';
import { FetchHrisAccessLevel } from '../services/hris-access.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { GetHrisAccess201Dto, GetHrisAccessDto } from '../dtos/hris-access.dto';
import {
  BadRequest400Dto,
  Forbidden403Dto,
  Unauthorized401Dto
} from '../dtos/bad-request.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('HRIS Access Controller')
@Controller('user')
export class FetchAccessLevel {
  constructor(private allBookingSlotService: FetchHrisAccessLevel) {}

  @Post('/get-hris-access-level')
  @ApiOperation({ summary: 'Fetch HRIS Access' })
  @ApiResponse({
    status: 201,
    description: 'Success: Fetch HRIS Access',
    type: GetHrisAccess201Dto
  })
  @ApiResponse({
    status: 400,
    description: 'Failed: Bad Request',
    type: BadRequest400Dto
  })
  @ApiResponse({
    status: 401,
    description: 'Failed: Unauthorized',
    type: Unauthorized401Dto
  })
  @ApiResponse({
    status: 403,
    description: 'Failed: Forbidden',
    type: Forbidden403Dto
  })
  getInterviewSlot(
    @Body() hrisAccessLevel: GetHrisAccessDto,
    @Request() req: any
  ) {
    return this.allBookingSlotService.getHrisAccess(hrisAccessLevel);
  }
}
