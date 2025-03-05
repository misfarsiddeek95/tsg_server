import {
  Body,
  Controller,
  Request,
  Patch,
  Post,
  UseGuards,
  Get,
  Query,
  Param
} from '@nestjs/common';
import { EducationService } from '../services/education.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import {
  CreateEducation400Dto,
  CreateEducationDto,
  Geteducation200Dto,
  submiteducation201Dto,
  submiteducation400Dto,
  submiteducation401Dto
} from '../dtos/education.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';

// interface EduDetailsDto {
//   olSyllabus?: string;
//   olMaths?: string;
//   olEnglish?: string;
//   alSyllabus?: string;
//   alSubject1?: string;
//   alSubject1Result?: string;
//   alSubject2?: string;
//   alSubject2Result?: string;
// }
@ApiTags('Education  Controller')
@Controller('user')
export class EducationController {
  constructor(private educationService: EducationService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('/education')
  @ApiOperation({ summary: 'Get Education Details' })
  @ApiResponse({
    status: 200,
    type: Geteducation200Dto
  })
  @ApiResponse({
    status: 400,
    type: submiteducation401Dto
  })
  @ApiResponse({
    status: 401,
    type: submiteducation400Dto
  })
  @ApiResponse({
    status: 201,
    type: submiteducation201Dto
  })
  getEducationDetails(@Request() req: any) {
    return this.educationService.getEducationDetails(req.user);
  }
  // getEducationDetails() {
  //   return {
  //     name: 'Gishan'
  //   };
  // }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('/education')
  @ApiOperation({ summary: 'Submit Education Level' })
  // @ApiBody({
  //   schema: {
  //     type: 'object',
  //     properties: {
  //       olState: {
  //         type: 'string',
  //         example: 'Pass',
  //         description: 'OL Status'
  //       },
  //       olSyllabus: {
  //         type: 'string',
  //         example: 'Srilankan',
  //         description: 'OL Syllabus'
  //       },
  //       olMaths: {
  //         type: 'string',
  //         example: 'A',
  //         description: 'OL Maths'
  //       },
  //       candidateId: {
  //         type: 'string',
  //         example: 'NS001',
  //         description: 'Maths'
  //       },
  //       olEnglish: {
  //         type: 'string',
  //         example: 'B',
  //         description: 'English'
  //       },
  //       alSyllabus: {
  //         type: 'string',
  //         example: 'Maths',
  //         description: 'Stream'
  //       },
  //       alEnglish: {
  //         type: 'string',
  //         example: 'A',
  //         description: 'AL English'
  //       },
  //       other: {
  //         type: 'string',
  //         example: 'None',
  //         description: 'Other'
  //       }
  //     }
  //   }
  // })
  @ApiResponse({
    status: 400,
    type: submiteducation401Dto
  })
  @ApiResponse({
    status: 401,
    type: submiteducation400Dto
  })
  @ApiResponse({
    status: 201,
    type: submiteducation201Dto
  })
  postEducationDetails(
    @Body() educationDetails: CreateEducationDto,
    @Request() req: any
  ) {
    return this.educationService.educationDetails(req.user, educationDetails);
    // return educationDetails;
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('/stem-testing/:id')
  @ApiResponse({
    status: 401,
    type: CreateEducation400Dto
  })
  stemTesting(@Param('id') id: string) {
    return this.educationService.checkSTEM({ userId: +id });
    // return educationDetails;
  }
}
