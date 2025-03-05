import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ProgressService } from './progress.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetProgress200Dto } from './progress.dto';
import { BadRequest400Dto, UnauthorizedDto, Forbidden403Dto } from '../app.dto';

@UseGuards(JwtAuthGuard)
@ApiTags('HRIS: Fetch Candidate Progress')
@Controller('fetch-candidate-progress')
export class ProgressController {
  constructor(private progressService: ProgressService) {}

  @Get()
  @ApiOperation({ summary: 'Fetch Candidate Progress' })
  @ApiResponse({
    status: 200,
    description: 'Success: Fetch Candidate Progress',
    type: GetProgress200Dto
  })
  @ApiResponse({
    status: 400,
    description: 'Failed: Bad Request',
    type: BadRequest400Dto
  })
  @ApiResponse({
    status: 401,
    description: 'Failed: Unauthorized',
    type: UnauthorizedDto
  })
  @ApiResponse({
    status: 403,
    description: 'Failed: Forbidden',
    type: Forbidden403Dto
  })
  async progress(@Request() req: any) {
    return this.progressService.getProgress(req.user.userId);
  }
}
