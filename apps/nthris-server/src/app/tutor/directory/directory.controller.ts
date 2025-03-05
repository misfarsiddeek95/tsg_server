import { Controller, Get, UseGuards, Param, Post, Body } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiTags,
  ApiOkResponse
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { DirectoryService } from './directory.service';
import {
  DirectorySearchDto,
  NontutorDetailDto,
  NontutorDto
} from './directory.dto';
import { Common401Dto, CommonErrorDto } from '../../common/common.dto';

@UseGuards(JwtAuthGuard)
@ApiTags('Non Tutor Directory Endpoint')
@Controller('tutor/directory')
@ApiBearerAuth()
export class TutorDirectoryController {
  constructor(private directoryService: DirectoryService) {}

  @Post()
  @ApiOperation({ summary: 'Fetch Non Tutor List' })
  @ApiOkResponse({ type: NontutorDto, isArray: true })
  @ApiBadRequestResponse({ description: 'Bad Request', type: CommonErrorDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized', type: Common401Dto })
  userList(@Body() params: DirectorySearchDto) {
    return this.directoryService.userList(params);
  }

  @Get(':tspId')
  @ApiOperation({ summary: 'Fetch Non Tutor Details' })
  @ApiOkResponse({ type: NontutorDetailDto })
  @ApiBadRequestResponse({ description: 'Bad Request', type: CommonErrorDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized', type: Common401Dto })
  userDetail(@Param('tspId') tspId: number) {
    return this.directoryService.userDetail(Number(tspId));
  }
}
