import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  Flexiuser201Dto,
  Flexiuser400Dto,
  FlexiuserResponseDto,
  FlexiUserSubmitDto
} from './user.dto';
import { Unauthorized401Dto } from '../../user/dtos/bad-request.dto';
import { UserService } from './user.service';

@ApiTags('GRA Flexi User Controller')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  @ApiOperation({ summary: 'Submit User' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        tspId: {
          type: 'number',
          example: '1001',
          description: 'tsp Id'
        },
        email: {
          type: 'string',
          example: 'sithira@gmail.com',
          description: 'User Email'
        },
        firstName: {
          type: 'string',
          example: 'Sithira',
          description: 'User First Name'
        },
        lastName: {
          type: 'string',
          example: 'Sanjitha',
          description: 'User Last Name'
        },
        flexCanId: {
          type: 'string',
          example: '12ab',
          description: 'Flex ID'
        },
        skipCreatingAccount: {
          type: 'boolean',
          example: 'true',
          description: 'Active Status'
        }
      }
    }
  })
  @ApiResponse({
    status: 200,
    description: 'Successful',
    type: FlexiuserResponseDto
  })
  @ApiResponse({
    status: 403,
    description: 'Fobidden',
    type: Flexiuser400Dto
  })
  async flexiquizCreateUser(@Body() newUser: FlexiUserSubmitDto) {
    return this.userService.createFlexiquizUser(newUser);
  }

  @UseGuards(JwtAuthGuard)
  @Get('flexiquiz-jwt')
  @ApiOperation({ summary: 'Get Flexi Quiz' })
  @ApiResponse({
    status: 200,
    description: 'Successful',
    type: Flexiuser201Dto
  })
  @ApiResponse({
    status: 403,
    description: 'Fobidden',
    type: Unauthorized401Dto
  })
  async flexiquizJWT(@Request() req: any) {
    return this.userService.createFlexiquizJWT(req.user.userId);
  }

  @Post('create-user-and-assign-exam')
  async createUserAndAssignExam(@Body() data: FlexiUserSubmitDto) {
    return this.userService.createUserAndAssignExam(data);
  }
}
