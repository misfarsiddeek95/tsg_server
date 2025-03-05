import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiTags,
  ApiUnauthorizedResponse
} from '@nestjs/swagger';
import { User } from '@prisma/client';
import { GetUser } from '../../../auth/decorator';
import { JwtGuard } from '../../../auth/guard';
import { AvailabilityService } from '../../services/availability/availability.service';
import {
  AvailabilityDto201,
  AvailabilityList201,
  GetStatus201,
  SearchBatch201,
  SearchtutorId201,
  SearchtutorId401,
  SearchtutorName201,
  UpdateHourStatus
} from '../../dtos/availability.dto';

@UseGuards(JwtGuard)
@ApiTags('Supervisor Availability Controller Endpoint')
@Controller('supervisor/availability')
@ApiBearerAuth()
export class AvailabilityController {
  constructor(private availabilityService: AvailabilityService) {}

  @Get('/list')
  @ApiCreatedResponse({
    description: 'User Details',
    type: AvailabilityList201
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: 'Invalid ',
    type: SearchtutorId401
  })
  async availability(
    @Query('skip') skip: string,
    @Query('take') take: string,
    @Query('searchFilter') searchFilter: any,
    @GetUser() user: User
  ) {
    return this.availabilityService.getAvailability({
      skip: Number(skip),
      take: Number(take),
      filter: searchFilter,
      user: user
    });
  }

  @Get('search-batch/:filter')
  @ApiCreatedResponse({
    status: 201,
    description: 'search-batch',
    type: SearchBatch201
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: 'Invalid ',
    type: SearchtutorId401
  })
  batchStatus(@Param('filter') filter: string, @GetUser() user: User) {
    return this.availabilityService.getBatch({ filter: filter, user: user });
  }

  @Get('search-tutor-name/:filter')
  @ApiCreatedResponse({
    status: 201,
    description: 'search-tutor-name',
    type: SearchtutorName201
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: 'Invalid ',
    type: SearchtutorId401
  })
  tutorNameStatus(@Param('filter') filter: string, @GetUser() user: User) {
    return this.availabilityService.getTutorName({
      filter: filter,
      user: user
    });
  }

  @Get('search-tutor-id/:filter')
  @ApiCreatedResponse({
    status: 201,
    description: 'search-tutor-id',
    type: SearchtutorId201
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: 'Invalid ',
    type: SearchtutorId401
  })
  tutorIdStatus(@Param('filter') filter: number, @GetUser() user: User) {
    return this.availabilityService.getTutorID({ filter: filter, user: user });
  }

  @Get('/get-status')
  @ApiCreatedResponse({
    status: 201,
    description: 'get-status',
    type: GetStatus201
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: 'Invalid ',
    type: SearchtutorId401
  })
  getStatus() {
    return this.availabilityService.getStatus();
  }

  @Post('/update-hour-status')
  @ApiCreatedResponse({
    status: 201,
    description: 'Get Update Hour Status',
    type: AvailabilityDto201
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: 'Invalid ',
    type: SearchtutorId401
  })
  async updateHourStatus(@Body() details: UpdateHourStatus) {
    return this.availabilityService.updateHourStatus(details);
  }
}
