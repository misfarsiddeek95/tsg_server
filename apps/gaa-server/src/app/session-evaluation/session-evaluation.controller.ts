import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards
} from '@nestjs/common';
import { SessionEvaluationService } from './session-evaluation.service';
import { CreateSessionEvaluationDto } from './dto/create-session-evaluation.dto';
import {
  UpdateEditableCountDto,
  UpdateSessionEvaluationDto
} from './dto/update-session-evaluation.dto';

import { DeleteSessionStatusDto } from './dto/SessionEvaluationTable.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('session-evaluation')
export class SessionEvaluationController {
  constructor(
    private readonly sessionEvaluationService: SessionEvaluationService
  ) {}

  // Fetch all session evaluation data from the db.
  @UseGuards(JwtAuthGuard)
  @Get('get-all')
  findAll() {
    return this.sessionEvaluationService.findAll();
  }

  // Update the form data to the db table.
  @UseGuards(JwtAuthGuard)
  @Patch('update-session-evaluation')
  update(@Body() updateSessionEvaluationDto: UpdateSessionEvaluationDto) {
    return this.sessionEvaluationService.updateSessionEvaluation(
      updateSessionEvaluationDto
    );
  }

  // Update the status of the evaluation. (IN PROGRESS, COMPLETE or ABANDON)
  // @UseGuards(JwtAuthGuard)
  @Patch('update-evaluation-status')
  async updateEvaluationStatus(@Body() updateSessionStatusUpdate: any) {
    const data = await this.sessionEvaluationService.updateEvaluationStatus(
      updateSessionStatusUpdate
    );
    const returnData = {
      ...data,
      status_type: updateSessionStatusUpdate.statusType
    };
    return returnData;
  }

  // update the editable_count of the session evaluation.
  // @UseGuards(JwtAuthGuard)
  @Patch('update-editable-count')
  async updateEditableCount(
    @Body() updateEditableCount: UpdateEditableCountDto
  ) {
    return await this.sessionEvaluationService.updateEditableCount(
      updateEditableCount
    );
  }

  //-----------------------------------------------------
  //Get Relevant User by Id Controller
  @UseGuards(JwtAuthGuard)
  @Post('/session-evaluation-data')
  async getSessionEvaluationData(
    @Body()
    createReadSessionEvaluationDatumDto: any
  ) {
    const data =
      await this.sessionEvaluationService.getSessionEvaluationDataService(
        createReadSessionEvaluationDatumDto
      );
    return data;
  }

  // Get filtered session data for the session note table - controller
  @UseGuards(JwtAuthGuard)
  @Post('/filterd-essions')
  async sessions(@Body() data: any) {
    const skip = data.skip;
    const take = data.take;
    const searchFilter = data.searchFilter;
    const tutorId = data.tutorId;

    const { teaching_span, sessionDate, ...rest } = searchFilter;

    // initialize the conditions for the where clause. ----- START
    const restWhere = Object.entries(rest)
      .filter(([key, value]: any) => value.length > 0)
      .map(([key, values]: any) => {
        return {
          OR: values.map((v) => {
            if (isNaN(v.name)) {
              console.log('is String');
              return {
                [key]: { contains: v.name }
              };
            } else {
              console.log('is Number');
              return {
                [key]: v.tspId
              };
            }
          })
        };
      });
    // initialize the conditions for the where clause. ----- END

    // check the date range
    const date = sessionDate.startDate
      ? {
          session_date: {
            gte: new Date(sessionDate.startDate),
            lt: new Date(sessionDate.endDate)
          }
        }
      : {};

    // check the time range
    const time =
      teaching_span.max > 0
        ? {
            teaching_span: {
              gte: teaching_span.min,
              lt: teaching_span.max
            }
          }
        : {};

    const where = {
      tutor_id: parseInt(tutorId),
      session_evaluation_status: { in: [1, 5] },
      AND: [...restWhere, date, time]
    };

    return this.sessionEvaluationService.allSessions({
      skip: Number(skip) - 1,
      take: Number(take),
      where: where
    });
  }

  // Fetch the stored data for generate the pdf.
  @Get('get-data-for-pdf/:id/:tutorId/:type')
  getDataForPdf(
    @Param('id') id: number,
    @Param('tutorId') tutorId: number,
    @Param('type') type: string
  ) {
    const par = {
      evaluationId: Number(id),
      tutorId: Number(tutorId),
      type: type
    };
    return this.sessionEvaluationService.getDataForPdf(par);
  }

  // generate pdf
  @Post('generate-pdf')
  generatePdf(@Body() data: any) {
    return this.sessionEvaluationService.generateReportPdf(data);
  }

  //Create an Evaluation Initially Controller
  @UseGuards(JwtAuthGuard)
  @Post('/create-evaluation')
  async createEvaluation(@Body() createEvaluationDto: any) {
    return this.sessionEvaluationService.createEvaluationService(
      createEvaluationDto
    );
  }

  //Update Session table status Controller
  @UseGuards(JwtAuthGuard)
  @Patch('session-status')
  async updateSessionEvaluationStatus(@Body() updatePostDto: any) {
    return await this.sessionEvaluationService.updateSessionEvaluationStatusService(
      updatePostDto
    );
  }

  //Update Session table status Controller
  @UseGuards(JwtAuthGuard)
  @Patch('session-del')
  async deleteSessionFromEvaluation(
    @Body() updatePostDto: DeleteSessionStatusDto
  ) {
    return await this.sessionEvaluationService.deleteSessionFromEvaluationService(
      updatePostDto
    );
  }

  //Add session
  @UseGuards(JwtAuthGuard)
  @Post('/add-session')
  async addSession(@Body() data: any) {
    return this.sessionEvaluationService.addSession(data);
  }

  // get data from SES and save the data to SIMS.
  @UseGuards(JwtAuthGuard)
  @Post('sims-save')
  simsSave(@Body() data: any) {
    return this.sessionEvaluationService.simsSave(data);
  }
}
