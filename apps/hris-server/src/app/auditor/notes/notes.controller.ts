import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Request,
  UseGuards
} from '@nestjs/common';
import { AccessGuard, Accesses } from '../../auth/access.guard';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import {
  AddNoteByAuditor200Dto,
  AddNoteByAuditorDto,
  AddNoteDto,
  AuditorFetchNotes200Dto,
  UpdateNote200Dto,
  UpdateNoteDto
} from './notes.dto';
import { NotesService } from './notes.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  BadRequest400Dto,
  Forbidden403Dto,
  UnauthorizedDto
} from '../../app.dto';

@UseGuards(JwtAuthGuard)
@ApiTags('HRIS: Auditor Notes actions')
@Controller('notes')
export class NotesController {
  constructor(private notesService: NotesService) {}

  @Accesses('HR_IT', 'AUDITOR', 'HR_ADMIN', 'HR_USER')
  @UseGuards(AccessGuard)
  @Post('by-candidate')
  @ApiOperation({ summary: 'Auditor add notes' })
  @ApiBody({ type: AddNoteByAuditorDto })
  @ApiResponse({
    status: 201,
    description: 'Success: Auditor add notes',
    type: AddNoteByAuditor200Dto
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
  async addNoteByAuditor(
    @Body() body: AddNoteByAuditorDto,
    @Request() req: any
  ) {
    return this.notesService.addNoteByAuditor(body, req.user.userId);
  }

  @Post()
  async addNote(@Body() body: AddNoteDto, @Request() req: any) {
    return this.notesService.addNote(body, req.user.userId);
  }

  @Accesses('HR_IT', 'AUDITOR', 'HR_ADMIN', 'HR_USER')
  @UseGuards(AccessGuard)
  @Get()
  @ApiOperation({ summary: 'Auditor fetch all notes' })
  @ApiResponse({
    status: 200,
    description: 'Success: Auditor fetch all notes',
    type: AuditorFetchNotes200Dto
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
  async fetchNotes(@Request() req: any) {
    return this.notesService.fetchNotes(req.user.userId);
  }

  @Get('/:candidate-id')
  async fetchNotesByCandidate(@Param('candidate-id') candidateId: number) {
    return this.notesService.fetchNotesByCandidate(candidateId);
  }

  @Accesses('HR_IT', 'AUDITOR', 'HR_ADMIN', 'HR_USER')
  @UseGuards(AccessGuard)
  @Put()
  @ApiOperation({ summary: 'Auditor update exisiting notes' })
  @ApiBody({ type: UpdateNoteDto })
  @ApiResponse({
    status: 201,
    description: 'Success: Auditor update exisiting notes',
    type: UpdateNote200Dto
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
  async updateNots(@Body() data: UpdateNoteDto) {
    return this.notesService.updateNote(data);
  }
}
