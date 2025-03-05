import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { EducationService } from '../user/services/education.service';
import { UserService } from '../user/services/user.service';
import { WorkEducationService } from '../user/services/workeducation.service';
import { UserDetailsService } from './user-details.service';
import {
  ExistUserDetails400Dto,
  UserDetailsResponseDto
} from './user-details.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Data } from './user-details.dto';
@ApiTags('User Details Controller')
@Controller('user-details')
export class UserDetailsController {
  constructor(
    private userDetailsService: UserDetailsService,
    private userService: UserService,
    private educationService: EducationService,
    private workEducationService: WorkEducationService
  ) {}

  @Get('/user/:id')
  @ApiOperation({ summary: 'Get User Details' })
  @ApiResponse({
    status: 200,
    description: 'Successfully Completed',
    type: UserDetailsResponseDto
  })
  @ApiResponse({
    status: 403,
    description: 'User not Found',
    type: ExistUserDetails400Dto
  })
  getUserDetailsByTspId(@Param('id') tspId: string) {
    const user = {
      username: 'notDefine',
      userId: parseInt(tspId)
    };
    return this.userService.getUserDetails(user);
  }

  @Get('/education/:id')
  @ApiOperation({ summary: 'Get Education Details' })
  @ApiResponse({
    status: 200,
    description: 'Successfully Stored',
    type: UserDetailsResponseDto
  })
  @ApiResponse({
    status: 403,
    description: 'Details not Found',
    type: ExistUserDetails400Dto
  })
  getEducationDetails(@Param('id') tspId: string) {
    const user = {
      username: 'notDefine',
      userId: parseInt(tspId)
    };
    return this.educationService.getEducationDetails(user);
  }

  @Get('/workeducation/:id')
  @ApiOperation({ summary: 'Get Work Education Details' })
  @ApiResponse({
    status: 200,
    description: 'Successfully Got',
    type: UserDetailsResponseDto
  })
  @ApiResponse({
    status: 403,
    description: 'Enter Details Again',
    type: ExistUserDetails400Dto
  })
  getWorkEducationDetails(@Param('id') tspId: string) {
    const user = {
      username: 'notDefine',
      userId: parseInt(tspId)
    };
    return this.workEducationService.getWorkEducationDetails(user);
  }

  @Post('/candidate-list')
  @ApiOperation({ summary: 'Submit Candidate List' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        names: {
          type: 'string',
          example: 'Sithira',
          description: 'Name'
        },
        email: {
          type: 'string',
          example: 'Sithira@thirdspaceglobal.com',
          description: 'Email'
        },
        mobileNo: {
          type: 'number',
          example: '086545232',
          description: 'Mobile Number'
        },
        endData: {
          type: 'string',
          example: '12/3/2022',
          description: 'End Date'
        },
        tspId: {
          type: 'string',
          example: 'nd001',
          description: 'TSP ID'
        },
        country: {
          type: 'string',
          example: 'Srilanka',
          description: 'Country'
        }
      }
    }
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully Submitted',
    type: UserDetailsResponseDto
  })
  @ApiResponse({
    status: 403,
    description: '',
    type: ExistUserDetails400Dto
  })
  getCandidatesList(
    @Body()
    { take, skip, names, email, mobileNo, startDate, endDate, tspId, country }
  ) {
    return this.userDetailsService.getCandidateList(
      take,
      skip,
      names,
      email,
      mobileNo,
      startDate,
      endDate,
      tspId,
      country
    );
  }

  @Post('/new-candidate-list')
  @ApiOperation({ summary: 'Submit Candidate List' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        names: {
          type: 'string',
          example: 'Sithira',
          description: 'Name'
        },
        email: {
          type: 'string',
          example: 'Sithira@thirdspaceglobal.com',
          description: 'Email'
        },
        mobileNo: {
          type: 'number',
          example: '086545232',
          description: 'Mobile Number'
        },
        endData: {
          type: 'string',
          example: '12/3/2022',
          description: 'End Date'
        },
        tspId: {
          type: 'string',
          example: 'nd001',
          description: 'TSP ID'
        },
        country: {
          type: 'string',
          example: 'Srilanka',
          description: 'Country'
        }
      }
    }
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully Submitted',
    type: UserDetailsResponseDto
  })
  @ApiResponse({
    status: 403,
    description: '',
    type: ExistUserDetails400Dto
  })
  getNewCandidatesList(
    @Body()
    { take, skip, names, email, mobileNo, startDate, endDate, tspId, country }
  ) {
    return this.userDetailsService.getNewCandidateList(
      take,
      skip,
      names,
      email,
      mobileNo,
      startDate,
      endDate,
      tspId,
      country
    );
  }

  @Post('candidate-access-to-hris')
  @ApiOperation({ summary: 'Give Access to HRIS' })
  async giveCandidateAccessToHris(@Body() data: any) {
    return this.userDetailsService.giveCandidateAccessToHris(data);
  }

  @Get('/user-details-education/:id')
  @ApiOperation({ summary: 'Get Education User Details' })
  @ApiResponse({
    status: 200,
    description: 'Successfully Got',
    type: UserDetailsResponseDto
  })
  @ApiResponse({
    status: 403,
    description: 'Something Bad Happened',
    type: ExistUserDetails400Dto
  })
  updateUserDetails(@Param('id') tspId: string) {
    const user = {
      username: 'notDefine',
      userId: parseInt(tspId)
    };
    return this.userService.getUserDetails(user);
  }

  @Get('/search-name/:name')
  @ApiOperation({ summary: 'Get Search Name Details' })
  @ApiResponse({
    status: 200,
    description: 'Successfully find',
    type: UserDetailsResponseDto
  })
  @ApiResponse({
    status: 403,
    description: 'Error Searching',
    type: ExistUserDetails400Dto
  })
  getUserDetailsBySearchingName(@Param('name') name: string) {
    return this.userService.getUserDetailsBySearchingName(name);
  }

  @Get('export')
  exportCandidateProfiles(@Query() query: Data) {
    return this.userDetailsService.exportCandidateProfiles(query);
  }
}
