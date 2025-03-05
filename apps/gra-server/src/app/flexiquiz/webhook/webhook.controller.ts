import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';
import {
  GetaExamDetailusingID200Dto,
  GetaExamDetailusingID400Dto,
  GetAllExamDetails200Dto,
  GetAllExamDetails400Dto,
  GetCandidateExamDetailsbyCandiateID400Dto,
  GetExamdetailsbytspId200Dto,
  GetExamdetailsbytspId400Dto,
  submitexam400Dto,
  WebhookSubmitMainDto
} from './webhook.dto';
import { WebhookService } from './webhook.service';

@ApiTags('GRA Flexiquiz webhook Controller')
@Controller('webhook')
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @Post()
  @ApiOperation({ summary: 'Submit Exam' })
  // @ApiBody({
  //   schema: {
  //     type: 'object',
  //     properties: {
  //       event_id: {
  //         type: 'string',
  //         example: 'UCT101xx',
  //         description: 'Event Id'
  //       },
  //       event_type: {
  //         type: 'string',
  //         example: 'Exam',
  //         description: 'Event type'
  //       },
  //       delivery_attempt: {
  //         type: 'string',
  //         example: 'two',
  //         description: 'Delivery attempt'
  //       },
  //       event_date: {
  //         type: 'string',
  //         example: '02/04/2022',
  //         description: 'Event date'
  //       },
  //       deta: {
  //         type: 'string',
  //         example: '123sdd',
  //         description: 'Data'
  //       }
  //     }
  //   }
  // })
  @ApiResponse({
    status: 400,
    type: submitexam400Dto
  })
  addNewQuizSubmition(@Body() webHookData: any) {
    return this.webhookService.addNewWebhookResponse(webHookData);
  }

  @Get('all')
  @ApiOperation({ summary: 'Get All Exam Details' })
  @ApiResponse({
    status: 400,
    type: GetAllExamDetails400Dto
  })
  @ApiResponse({
    status: 200,
    type: GetAllExamDetails200Dto
  })
  getAllExamDetails() {
    return this.webhookService.getAllExamDetailsService();
  }

  @Get('/id/:id')
  @ApiOperation({ summary: 'Get a Exam Detail using ID' })
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'enter unique id',
    required: true
  })
  // })
  @ApiResponse({
    status: 400,
    type: GetaExamDetailusingID400Dto
  })
  @ApiResponse({
    status: 200,
    type: GetaExamDetailusingID200Dto
  })
  getExamDetailsById(@Param('id') id: string) {
    return this.webhookService.getExamDetailByIdService(parseInt(id));
  }

  @Get('tsp-id/:tspId')
  @ApiOperation({ summary: 'Get Exam Details by tspId' })
  @ApiParam({
    name: 'tspId',
    type: 'integer',
    description: 'enter unique id',
    required: true
  })

  // })
  @ApiResponse({
    status: 200,
    type: GetExamdetailsbytspId200Dto
  })
  @ApiResponse({
    status: 400,
    type: GetExamdetailsbytspId400Dto
  })
  getExamDetailsByTspId(@Param('tspId') tspId: string) {
    return this.webhookService.getExamDetailsByTspIdService(parseInt(tspId));
  }

  @Get('/candidate-exam/:id')
  @ApiOperation({ summary: 'Get Candidate Exam Details by Candiate ID' })
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'enter unique id',
    required: true
  })
  @ApiResponse({
    status: 400,
    type: GetCandidateExamDetailsbyCandiateID400Dto
  })
  @ApiResponse({
    status: 200,
    type: GetCandidateExamDetailsbyCandiateID400Dto
  })
  getCandidateExamIdDetails(@Param('id') id: string) {
    return this.webhookService.getCandidateExamIdDetailsService(parseInt(id));
  }
}
