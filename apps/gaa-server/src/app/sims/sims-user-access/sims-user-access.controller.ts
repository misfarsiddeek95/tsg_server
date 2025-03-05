// Importing required modules from NestJS and the service
import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { SimsUserAccessService } from './sims-user-access.service';
import {
  GetSimsUserAccessDto,
  getSimsUserAccess201ResponseDto,
  getSimsUserAccess400ResponseDto
} from './dto/create-sims-user-access.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';


@ApiTags('GAA SIMS User Access Level')
@Controller('sims-user-access')
export class SimsUserAccessController {
  // Constructor to inject SimsUserAccessService
  constructor(private readonly simsUserAccessService: SimsUserAccessService) {}

  //Get User Access Level
  @UseGuards(JwtAuthGuard)
  @Post('/get-the-user-access-level')
  @ApiOperation({ summary: 'Get the User Access Level' })
  @ApiResponse({
    status: 201,
    type: getSimsUserAccess201ResponseDto
  })
  @ApiResponse({
    status: 400,
    type: getSimsUserAccess400ResponseDto
  })
  getUserAccessLevel(@Body() getSimsUserAccessDto: GetSimsUserAccessDto) {
    return this.simsUserAccessService.getUserAccessLevelService(
      getSimsUserAccessDto
    );
  }
}
