import {
  Body,
  Controller,
  Request,
  Patch,
  Post,
  UseGuards,
  Get
} from '@nestjs/common';
import { WorkEducationService } from '../services/workeducation.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { CreateWorkEducationDto } from '../dtos/workeducation.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('GRA Worked Education Controller')
@Controller('user')
export class WorkEducationController {
  constructor(private workEducationService: WorkEducationService) { }
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('/workeducation?userId=:userId')
  @ApiOperation({ summary: 'Get Worked Education Details by User' })
  getWorkEducationDetails(@Request() req: any) {
    return this.workEducationService.getWorkEducationDetails(req.user);
  }
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('/workeducation')
  @ApiOperation({ summary: 'Post Worked Education Details' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        expTeaching: {
          type: 'string',
          example: '2 years',
          description: 'Teaching Experience'
        },
        expField: {
          type: 'string',
          example: 'Maths',
          description: 'Teaching Experience feild'
        },
        expOnlineEdu: {
          type: 'string',
          example: '1 years',
          description: 'Online Teaching Experience'
        },
        expOrganization: {
          type: 'string',
          example: '1 years',
          description: 'Organization Teaching Experience'
        },
        expTutor: {
          type: 'string',
          example: '3 years',
          description: 'Teaching Experience'
        },
        expRole: {
          type: 'string',
          example: '1 years',
          description: 'Academic Admin'
        },
        expTutorDuration: {
          type: 'string',
          example: '6 months',
          description: 'Teaching Experience'
        }
      }
    }
  })
  postWorkEducationDetails(
    @Body() workEducationDetails: CreateWorkEducationDto,
    @Request() req: any
  ) {
    return this.workEducationService.workEducationDetails(
      req.user,
      workEducationDetails
    );
  }
}
