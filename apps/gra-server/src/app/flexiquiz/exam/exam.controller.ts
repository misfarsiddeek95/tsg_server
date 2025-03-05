import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import {
  AssignForUser200Dto,
  Automaticassign201Dto,
  CandidateExam201Dto,
  Exam400Dto,
  ExamAll200Dto,
  ExamSubmit201Dto,
  ExamSubmitDetailsDto,
  ExamSubmitMainDto,
  GetExamByFlexiQuizId201Dto,
  GetExamById201Dto,
  GetExamStatus200Dto,
  Manualyassign201Dto,
  UserExamResults200Dto,
  UserExamResults401Dto,
  UserExamResults404Dto,
  UserExamResultsDto
} from './exam.dto';
import { Unauthorized401Dto } from '../../user/dtos/bad-request.dto';
import { ExamService } from './exam.service';

@ApiTags('GRA Flexiquiz Exam Controller')
@Controller('exam')
export class ExamController {
  constructor(private readonly examService: ExamService) {}

  /**
   * Add a new exam
   * @param newExamData
   * @returns
   */

  @Post('submit')
  @ApiOperation({
    summary: 'Submit Exam',
    description: 'This is our exam controller'
  })
  @ApiResponse({
    status: 201,
    type: ExamSubmit201Dto
  })
  @ApiResponse({
    status: 400,
    type: Exam400Dto
  })
  async addNewExam(@Body() newExamData: ExamSubmitMainDto) {
    //service call
    return this.examService.addNewExamService(newExamData);
  }

  /**
   * Get the all exams
   * @returns
   */
  @Get('all')
  @ApiOperation({ summary: 'Get All Exams Details' })
  @ApiResponse({
    status: 200,
    type: ExamAll200Dto
  })
  async getAllExams() {
    //service call
    return this.examService.getAllExams();
  }

  @Post('candidate-exam-details')
  @ApiOperation({ summary: 'Candidate Exams Details' })
  @ApiResponse({
    status: 201,
    type: CandidateExam201Dto
  })
  @ApiResponse({
    status: 400,
    type: Exam400Dto
  })
  async getAllCandidateExamDetail(
    @Body()
    {
      take,
      skip,
      candidateName,
      mobileNo,
      email,
      score,
      outcome
    }: ExamSubmitDetailsDto
  ) {
    return this.examService.getAllCandidateExamDetail(
      take,
      skip,
      candidateName,
      mobileNo,
      email,
      score,
      outcome
    );
  }

  /**
   * Get exam using it's id
   * @param id
   * @returns
   */
  @Get('by-id/:id')
  @ApiOperation({ summary: 'get exam by id' })
  @ApiResponse({
    status: 201,
    type: GetExamById201Dto
  })
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'enter unique id',
    required: true
  })
  async getByid(@Param('id') id: string) {
    //service call
    return this.examService.getById(parseInt(id));
  }

  @Get('exam-status/:id')
  @ApiOperation({ summary: 'get exam status by id' })
  @ApiResponse({
    status: 201,
    type: GetExamStatus200Dto
  })
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'enter unique id',
    required: true
  })
  async getExamStatus(@Param('id') id: string) {
    //service call
    return this.examService.getExamStatus(+id);
  }

  /**
   * Get Exam using flexiquiz id
   * eg : "e05526f8-6c3b-4879-8b73-9dc38c359f6d"
   * @param id
   * @returns
   */
  @Get('flexi-id/:id')
  @ApiOperation({
    summary: 'Get Exam using flexiquiz id',
    description: 'This is our exam controller'
  })
  @ApiResponse({
    status: 201,
    type: GetExamByFlexiQuizId201Dto
  })
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'enter unique id',
    required: true
  })
  async getByFlexiId(@Param('id') id: string) {
    //service call
    return this.examService.getByFlexiId(id);
  }

  /**
   * Get exams assigned to the user by tsp id
   * @param tspId
   * @returns
   */
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('assign-for-user')
  @ApiOperation({ summary: 'Get exams assigned to the user by tsp id' })
  @ApiResponse({
    status: 200,
    type: AssignForUser200Dto
  })
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'enter unique id',
    required: true
  })
  async getAssignedExamsForUser(@Request() req: any) {
    //service call
    return this.examService.getAssignedExamsForUserService(req.user.userId);
  }

  /**
   * Update exam is active or inactive (true/false)
   * @param id
   * @body { activeStatus }
   * @returns
   */
  @Patch('update-status/:id')
  @ApiOperation({ summary: 'Update exam is active or inactive (true/false)' })
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'enter unique id',
    required: true
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        activeStatus: {
          type: 'boolean',
          example: 'true',
          description: 'Exam active status'
        }
      }
    }
  })
  @ApiResponse({
    status: 200,
    description: 'Successful',
    type: AssignForUser200Dto
  })
  @ApiResponse({
    status: 403,
    description: 'Fobidden',
    type: Unauthorized401Dto
  })
  async updateStatus(@Param('id') id: string, @Body() { activeStatus }) {
    //service call
    return this.examService.updateActiveStatusOfExam(
      parseInt(id),
      activeStatus
    );
  }

  /**
   * Assign active exams automaticaly for the user
   * @body { tspId }
   * @returns
   */
  @Post('automatic-assign')
  @ApiOperation({ summary: 'Assign active exams automaticaly for the user' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        tspId: {
          type: 'number',
          example: 1234,
          description: 'active exam'
        }
      }
    }
  })
  @ApiResponse({
    status: 200,
    description: 'Successful',
    type: Automaticassign201Dto
  })
  @ApiResponse({
    status: 403,
    description: 'Fobidden',
    type: Exam400Dto
  })
  async flexiQuizAutomaticAssign(@Body() { tspId }) {
    //service call
    return this.examService.flexiQuizAutomaticAssignService(tspId);
  }

  /**
   * Assign exams manualy using
   * exam id eg : "e05526f8-6c3b-4879-8b73-9dc38c359f6d"
   * & tsp id
   * @body { tspId, examId }
   * @returns
   */
  @Post('manual-assign')
  @ApiOperation({ summary: 'Assign exams manualy using' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        examId: {
          type: 'string',
          example: 'xsd1234',
          description: 'exam id'
        },
        tspId: {
          type: 'number',
          example: 1234,
          description: 'tspId'
        }
      }
    }
  })
  @ApiResponse({
    status: 200,
    description: 'Successful',
    type: Manualyassign201Dto
  })
  @ApiResponse({
    status: 403,
    description: 'Fobidden',
    type: Exam400Dto
  })
  async flexiQuizManualAssign(@Body() { tspId, examId }) {
    //service call
    return this.examService.flexiQuizManualAssignService(tspId, examId);
  }

  /**
   *
   * @param candidateExamId
   * @param param1
   * @returns
   */
  @Patch('update-candidate-exam-status/:candidateExamId')
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'Enter Candidate Exam id',
    required: true
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        activeStatus: {
          type: 'boolean',
          example: 'true',
          description: 'Candidate active status'
        }
      }
    }
  })
  @ApiResponse({
    status: 200,
    description: 'Successful',
    type: AssignForUser200Dto
  })
  @ApiResponse({
    status: 403,
    description: 'Fobidden',
    type: Unauthorized401Dto
  })
  async updateCandidateExamStatus(
    @Param('candidateExamId') candidateExamId: string,
    @Body() { stateId }
  ) {
    //service call
    return this.examService.updateCandidateExamStateService(
      parseInt(stateId),
      parseInt(candidateExamId)
    );
  }

  @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard)
  @Get('user-exam-results')
  @ApiResponse({
    status: 200,
    type: UserExamResults200Dto
  })
  @ApiResponse({
    status: 404,
    type: UserExamResults404Dto
  })
  @ApiResponse({
    status: 401,
    type: UserExamResults401Dto
  })
  async getCandidateExamResults(
    @Query() { candidateExamId }: UserExamResultsDto
  ) {
    return this.examService.getCandidateExamResults(candidateExamId);
  }

  @Get('export')
  eportMathTest(@Query() query: Omit<ExamSubmitDetailsDto, 'take' | 'skip'>) {
    return this.examService.eportMathTest(query);
  }
}
