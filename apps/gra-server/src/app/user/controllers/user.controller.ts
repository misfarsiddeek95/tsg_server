import {
  Body,
  Controller,
  Request,
  Post,
  UseGuards,
  Get,
  Param
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import {
  AdminUserDetails201Dto,
  CandidateNamesInBookingStatusTableBookedRequestDto,
  CandidateNamesInBookingStatusTableBookedResponseDto,
  CandidateNamesinBookingAll201Dto,
  CheckNic200Dto,
  InterviewerNamesInBookingStatusTableBookedRequestDto,
  InterviewerNamesInBookingStatusTableBookedResponseDto,
  PostUserDetails201Dto,
  PostUserDetails400Dto,
  UpdateUserDetailsDto,
  UserDetailsDto,
  UserDetailsResponseDto
} from '../dtos/user.dto';
import {
  CandidateNameInBooking201Dto,
  CandidateNameInBooking400Dto,
  CreateBookingStatusDto
} from '../dtos/booking-status.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiProperty,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';
import { BadRequest400Dto, Unauthorized401Dto } from '../dtos/bad-request.dto';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('GRA Main User Controller')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('/user-details')
  @ApiOperation({
    summary: 'Add User Details'
  })
  @ApiResponse({
    status: 201,
    type: PostUserDetails201Dto
  })
  @ApiResponse({
    status: 400,
    type: PostUserDetails400Dto
  })
  @ApiResponse({
    status: 401,
    type: Unauthorized401Dto
  })
  updateUserDetails(@Body() userDetails: UserDetailsDto, @Request() req: any) {
    return this.userService.userDetails(req.user, userDetails);
  }

  @Get('/user-details')
  @ApiOperation({
    summary: 'Get User Details'
  })
  @ApiResponse({
    status: 200,
    description: 'Response when user found',
    type: UserDetailsResponseDto
  })
  @ApiResponse({
    status: 401,
    description: 'Failed: Unauthorized',
    type: Unauthorized401Dto
  })
  getUserDetails(@Request() req: any) {
    return this.userService.getUserDetails(req.user);
  }

  @Post('/interviewer-names-in-booking-status-table-all')
  interviewerNamesInBookingStatusTableAll(
    @Body() data: any,
    @Request() req: any
  ) {
    return this.userService.interviewerNamesInBookingStatusTableAll(data);
  }

  @Post('/interviewer-names-in-user-table-all')
  @ApiResponse({
    status: 201
    // type: InterviewerNamesAll201Dto
  })
  @ApiResponse({
    status: 401,
    type: Unauthorized401Dto
  })
  getUserLevelThreeAll(@Request() req: any) {
    return this.userService.getUserLevelThreeAll(req.user);
  }

  @Post('/candidate-names-in-user-table-all')
  candidateNamesInUserTableAll(@Request() req: any) {
    return this.userService.candidateNamesInUserTableAll(req.user);
  }

  @Post('/candidate-names-in-booking-status-table-all')
  @ApiResponse({
    status: 201,
    type: CandidateNamesinBookingAll201Dto
  })
  @ApiResponse({
    status: 401,
    type: Unauthorized401Dto
  })
  candidateNamesInBookingStatusTableAll(@Request() req: any) {
    return this.userService.candidateNamesInBookingStatusTableAll(req.user);
  }

  @Post('/candidate-names-in-booking-status-table-booked')
  @ApiOperation({
    summary: 'APSS: admin: candidate names in booking status table booked'
  })
  @ApiResponse({
    status: 201,
    description: 'Success: candidate names in booking status table booked',
    type: CandidateNamesInBookingStatusTableBookedResponseDto
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
  candidateNamesInBookingStatusTableBooked(
    @Body() getUserLevelTwo: CandidateNamesInBookingStatusTableBookedRequestDto,
    @Request() req: any
  ) {
    return this.userService.candidateNamesInBookingStatusTableBooked(
      getUserLevelTwo
    );
  }

  @Post('/interviewer-names-in-booking-status-table-booked')
  @ApiOperation({
    summary: 'APSS: admin: interviewer names in booking status table booked'
  })
  @ApiResponse({
    status: 201,
    description: 'Success: interviewer names in booking status table booked',
    type: InterviewerNamesInBookingStatusTableBookedResponseDto
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
  interviewerNamesInBookingStatusTableBooked(
    @Body()
    getUserLevelThree: InterviewerNamesInBookingStatusTableBookedRequestDto,
    @Request() req: any
  ) {
    return this.userService.interviewerNamesInBookingStatusTableBooked(
      getUserLevelThree
    );
  }

  @Post('/admin-user-details')
  @ApiResponse({
    status: 201,
    type: AdminUserDetails201Dto
  })
  @ApiResponse({
    status: 400,
    type: CandidateNameInBooking400Dto
  })
  @ApiResponse({
    status: 401,
    type: Unauthorized401Dto
  })
  adminUpdateUserDetails(@Body() userDetails: UpdateUserDetailsDto) {
    return this.userService.adminUpdateUserDetails(userDetails);
  }

  @Get('check-nic/:nic')
  @ApiResponse({
    status: 200,
    type: CheckNic200Dto
  })
  checkNIC(@Param('nic') nic: string) {
    return this.userService.checkNIC(nic);
  }
}
