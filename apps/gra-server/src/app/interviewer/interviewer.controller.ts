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
import {
  CallLogDto,
  CallLogsDto,
  ExistCalllog400Dto,
  ExistsCalllog201Dto,
  ExistsPhoneInterview201Dto,
  InterviewerQueryDto,
  PhoneInterviewDto,
  UpdatePhoneInterviewDto,
  UserDetailsResponseDto
} from './interviewer.dto';
import { InterviewerService } from './interviewer.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiProperty,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';
import { Accesses, AccessGuard } from '../auth/access.guard';

class UnauthorizedResponseDto {
  @ApiProperty({
    example: 401
  })
  statusCode: number;

  @ApiProperty({
    example: 'Unauthorized'
  })
  message: string;
}

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('GRA Interviewer Controller')
@Controller('interviewer')
export class InterviewerController {
  constructor(private interviewer: InterviewerService) {}

  @Get('candidate-details')
  @ApiOperation({ summary: 'Get Candidate Details' })
  @ApiResponse({
    status: 200,
    description: 'Response when user found',
    type: UserDetailsResponseDto
  })
  @ApiResponse({
    status: 401,
    type: UnauthorizedResponseDto
  })
  async getCandidateDetails(@Query() query: InterviewerQueryDto) {
    return this.interviewer.getCandidateDetails(query.candidateTspId);
  }

  @Get('candidate-details-by-booking-status')
  @ApiOperation({ summary: 'Get Booking Details' })
  @ApiResponse({
    status: 200,
    description: 'Response when user found',
    type: UserDetailsResponseDto
  })
  @ApiResponse({
    status: 401,
    type: UnauthorizedResponseDto
  })
  async getCandidateDetailsBookingStatus(
    @Query() query: InterviewerQueryDto,
    @Request() req: any
  ) {
    return this.interviewer.getCandidateDetailsByBookingStatus(
      query.bookingStatusId,
      query.status,
      query.piDataId,
      +req.user.userId
    );
  }

  @Post('calllog')
  @ApiOperation({ summary: 'Submit calllog' })
  @ApiResponse({
    status: 200,
    description: 'Response when user found',
    type: UserDetailsResponseDto
  })
  @ApiResponse({
    status: 401,
    description: 'Need to Correct Type',
    type: ExistCalllog400Dto
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        piRefId: {
          type: 'number',
          example: '1001',
          description: 'RefId Id'
        },
        bookingStatusId: {
          type: 'number',
          example: '001',
          description: 'Status Id'
        },
        callAttempt: {
          type: 'number',
          example: '011',
          description: 'Call Attempts'
        },
        piStatus: {
          type: 'number',
          example: '1',
          description: 'Status'
        },
        date: {
          type: 'string',
          example: '12/20/22',
          description: 'date'
        }
      }
    }
  })
  async addCallLog(@Body() body: CallLogDto, @Request() req: any) {
    return this.interviewer.addCallLog(body, req.user.userId);
  }

  @Post('calllogs')
  @ApiOperation({ summary: 'Submit Calllogs' })
  @ApiResponse({
    status: 200,
    description: 'Callogs will store',
    type: ExistsCalllog201Dto
  })
  @ApiResponse({
    status: 401,
    description: 'Need to Correct Type',
    type: ExistCalllog400Dto
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        piRefId: {
          type: 'number',
          example: '1001',
          description: 'Ref Id'
        },
        bookingStatusId: {
          type: 'number',
          example: '001',
          description: 'Status Id'
        },
        callLogs: {
          type: 'any',
          example: 'Sithira',
          description: 'Call logs'
        }
      }
    }
  })
  async addCallLogs(@Body() body: CallLogsDto, @Request() req: any) {
    return this.interviewer.addCallLogs(body, req.user.userId);
  }

  @Post('submit-phone-interview')
  @ApiOperation({ summary: 'Submit Phone Interview' })
  @ApiResponse({
    status: 200,
    description: 'Details can submit',
    type: ExistsPhoneInterview201Dto
  })
  @ApiResponse({
    status: 401,
    description: 'Need to Correct Type',
    type: ExistCalllog400Dto
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        piRefId: {
          type: 'number',
          example: '1001',
          description: 'Ref Id'
        },
        bookingStatusId: {
          type: 'number',
          example: '001',
          description: 'Booking ID'
        },
        finalOutcome: {
          type: 'string',
          example: 'Good',
          description: 'Final Outcome'
        },
        finalReason: {
          type: 'string',
          example: 'Complete',
          description: 'Final Reason'
        },
        finalReasonOther: {
          type: 'string',
          example: 'Bad',
          description: 'Final Reason Other'
        },
        grammar: {
          type: 'number',
          example: '1',
          description: 'Grammar Status'
        },
        languageOther: {
          type: 'string',
          example: 'Good',
          description: 'Language Other'
        },
        languageReason: {
          type: 'string',
          example: 'Not Complete',
          description: 'Language Reason'
        },
        mathOther: {
          type: 'string',
          example: 'None',
          description: 'Maths'
        },
        mathReason: {
          type: 'string',
          example: 'Done',
          description: 'Math Reason'
        },
        educationQualification: {
          type: 'string',
          example: 'Bsc',
          description: 'Qualification'
        },
        overallComments: {
          type: 'string',
          example: 'Good',
          description: 'Final Comment'
        },
        pronounciation: {
          type: 'number',
          example: '1',
          description: 'Pronunciation Status'
        },
        sentenceFormation: {
          type: 'number',
          example: '1',
          description: 'Formation'
        },
        simpleMathematics: {
          type: 'number',
          example: '1',
          description: 'Mathematics '
        },
        callAttempt: {
          type: 'number',
          example: '011',
          description: 'Call Attempts'
        },
        piStatus: {
          type: 'number',
          example: '1',
          description: 'Status'
        },
        date: {
          type: 'string',
          example: '12/20/22',
          description: 'date'
        }
      }
    }
  })
  async submitPhoneInterview(
    @Body() body: PhoneInterviewDto,
    @Request() req: any
  ) {
    return this.interviewer.submitPhoneInterview(body, req.user.userId);
  }

  @Post('update-phone-interview')
  @ApiOperation({ summary: 'Update Phone Interview' })
  @ApiResponse({
    status: 200,
    description: 'Details can update',
    type: ExistsPhoneInterview201Dto
  })
  @ApiResponse({
    status: 401,
    description: 'Need to Correct Type',
    type: ExistCalllog400Dto
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        piRefId: {
          type: 'number',
          example: '1001',
          description: 'Ref Id'
        },
        finalOutcome: {
          type: 'string',
          example: 'Good',
          description: 'Final Outcome'
        },
        finalReason: {
          type: 'string',
          example: 'Complete',
          description: 'Final Reason'
        },
        finalReasonOther: {
          type: 'string',
          example: 'Bad',
          description: 'Final Reason Other'
        },
        grammar: {
          type: 'number',
          example: '1',
          description: 'Grammar Status'
        },
        languageOther: {
          type: 'string',
          example: 'Good',
          description: 'Language Other'
        },
        languageReason: {
          type: 'string',
          example: 'Not Complete',
          description: 'Language Reason'
        },
        mathOther: {
          type: 'string',
          example: 'None',
          description: 'Maths'
        },
        mathReason: {
          type: 'string',
          example: 'Done',
          description: 'Math Reason'
        },
        educationQualification: {
          type: 'string',
          example: 'Bsc',
          description: 'Qualification'
        },
        overallComments: {
          type: 'string',
          example: 'Good',
          description: 'Final Comment'
        },
        pronounciation: {
          type: 'number',
          example: '1',
          description: 'Pronunciation Status'
        },
        sentenceFormation: {
          type: 'number',
          example: '1',
          description: 'Formation'
        },
        simpleMathematics: {
          type: 'number',
          example: '1',
          description: 'Mathematics '
        }
      }
    }
  })
  async updatePhoneInterview(
    @Body() body: UpdatePhoneInterviewDto,
    @Request() req: any
  ) {
    return this.interviewer.updatePhoneInterview(body, req.user.userId);
  }

  @Accesses('AP_INT', 'AP_AD')
  @UseGuards(AccessGuard)
  @Post('mark-booking-completed')
  @ApiOperation({ summary: 'Non-tutor: Mark booking completed' })
  async markBookingCompleted(@Request() req, @Body() body: any) {
    return this.interviewer.markBookingCompleted(body, req.user.userId);
  }
}
