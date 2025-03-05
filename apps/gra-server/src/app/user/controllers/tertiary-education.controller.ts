import {
  Body,
  Controller,
  Request,
  Patch,
  Post,
  UseGuards,
  Get,
  Param
} from '@nestjs/common';
import { TertiaryEducationService } from '../services/tertiary-education.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { CreateTertiaryEducationDto } from '../dtos/tertiary-education.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('GRA Tertiary-Education Controller')
@Controller('user')
export class TertiaryEducationController {
  constructor(private tertiaryEducationService: TertiaryEducationService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('/tertiary?userId=:userId')
  @ApiOperation({ summary: 'Get Tertiary Education Details' })
  getTertiaryEducationDetails(@Request() @Param('userId') userID:string,req: any) {
    return this.tertiaryEducationService.getTertiaryEducationDetails(req.user);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('/tertiary')
  @ApiOperation({ summary: 'Post Tertiary Education Details' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        hqCourseType: {
          type: 'String',
          example: 'primary Matchs',
          description: 'Course Type'
        },
        hqMainInst: {
          type: 'String',
          example: 'Abcd',
          description: 'Main Inst'
        },
        hqFieldStudy: {
          type: 'Date',
          example: 'maths',
          description: 'feild of study'
        },
        hqStartDate: {
          type: 'date',
          example: '02/08/2022',
          description: 'Start Date'
        },
        hqCompletationDate: {
          type: 'date',
          example: '02/012/2022',
          description: 'End Date'
        },
        hasMathStat: {
          type: 'boolean',
          example: 'true',
          description: 'math stat'
        }
      }
    }
  })
  postTertiaryEducationDetails(
    @Body() tertiaryEducationDetails: CreateTertiaryEducationDto,
    @Request() req: any
  ) {
    return this.tertiaryEducationService.tertiaryEducationDetails(
      req.user,
      tertiaryEducationDetails
    );
    // return tertiaryEducationDetails;
  }
}
