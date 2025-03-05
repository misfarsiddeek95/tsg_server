// Importing required modules and dependencies
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  UseGuards
} from '@nestjs/common';
import { SessionInvestigationService } from './session-investigation.service';
import { UpdateSessionInvestigationDto } from './dto/update-session-investigation.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('session-investigation')
export class SessionInvestigationController {
  constructor(
    private readonly sessionInvestigationService: SessionInvestigationService
  ) {}

  // Get a session investigation by ID
  @UseGuards(JwtAuthGuard)
  @Get('find/:id')
  findOne(@Param('id') id: string) {
    return this.sessionInvestigationService.findOne(+id);
  }

  // Update session investigation details
  @Patch('update-session-investigation')
  @UseGuards(JwtAuthGuard)
  async updateSessionInvestigation(
    @Body() updateSessionInvestigationDto: UpdateSessionInvestigationDto
  ) {
    return await this.sessionInvestigationService.updateSessionInvestigation(
      updateSessionInvestigationDto
    );
  }

  // Update session evaluation status
  @Patch('session-status')
  @UseGuards(JwtAuthGuard)
  async updateSessionEvaluationStatus(@Body() updatePostDto: any) {
    return await this.sessionInvestigationService.updateSessionInvestigationStatusService(
      updatePostDto
    );
  }

  // Create an evaluation for a session
  @Post('/create-evaluation')
  @UseGuards(JwtAuthGuard)
  async createEvaluation(@Body() createEvaluationDto: any) {
    return this.sessionInvestigationService.createEvaluationService(
      createEvaluationDto
    );
  }

  // Get filtered sessions
  @Get('/filterdSessions')
  @UseGuards(JwtAuthGuard)
  async sessions(
    @Body()
    @Query('skip')
    skip: string,
    @Query('take') take: string,
    @Query('searchFilter') searchFilter: any,
    @Query('tutorId') tutorId: any
  ) {
    // Extracting values from the searchFilter
    const { teaching_span, sessionDate, ...rest } = JSON.parse(searchFilter);
    // Extracting the non-empty criteria from the rest of the search filter
    const restWhere = Object.entries(rest)
      .filter(([key, value]: any) => value.length > 0)
      .map(([key, values]: any) => {
        // For each criterion, create an OR condition for multiple values
        return {
          OR: values.map((v) => {
            // Check if the value is a string (name) or a numeric ID (tspId)
            if (isNaN(v.name)) {
              // If it's a string, perform a case-insensitive search using "contains"
              return {
                [key]: { contains: v.name }
              };
            } else {
              // If it's a numeric ID, use it directly
              return {
                [key]: v.tspId
              };
            }
          })
        };
      });

    // Extract session date from the provided search filter
    const date = sessionDate.startDate
      ? {
          // If start date is provided, create a date range filter
          session_date: {
            gte: new Date(sessionDate.startDate),
            lt: new Date(sessionDate.endDate)
          }
        }
      : {};

    // Extract teaching span from the provided search filter
    const time =
      teaching_span.max > 0
        ? {
            // If max teaching span is provided, create a range filter
            teaching_span: {
              gte: teaching_span.min,
              lt: teaching_span.max
            }
          }
        : {};

    // Construct the final 'where' clause for querying sessions
    const where = {
      tutor_id: parseInt(tutorId),
      // Session investigation status should be either 1 or 5
      session_investigation_status: { in: [1, 5] },
      // Combine the criteria for dynamic filtering
      AND: [...restWhere, date, time]
    };

    // Call the 'allSessions' method of the service with the constructed query parameters
    return this.sessionInvestigationService.allSessions({
      // Adjust pagination parameters (subtracting 1 from skip for 0-based indexing)
      skip: Number(skip) - 1,
      take: Number(take),
      where: where
    });
  }

  // Update the investigation status of a session
  @Patch('update-investigation-status')
  @UseGuards(JwtAuthGuard)
  async updateEvaluationStatus(@Body() updateSessionStatusUpdate: any) {
    // Call the service method to update the investigation status
    const data =
      await this.sessionInvestigationService.updateInvestigationStatus(
        updateSessionStatusUpdate
      );
    // Prepare the response data with additional information
    const returnData = {
      ...data,
      status_type: updateSessionStatusUpdate.statusType
    };
    // Return the updated data
    return returnData;
  }

  // Update the editable count for a session
  @Patch('update-editable-count')
  @UseGuards(JwtAuthGuard)
  async updateEditableCount(@Body() updateEditableCount: any) {
    return await this.sessionInvestigationService.updateEditableCount(
      updateEditableCount
    );
  }

  // Delete a session from evaluation
  @Patch('session-del')
  @UseGuards(JwtAuthGuard)
  async deleteSessionFromEvaluation(@Body() updatePostDto: any) {
    return await this.sessionInvestigationService.deleteSessionFromEvaluationService(
      updatePostDto
    );
  }

  // Add a new session
  @Post('/add-session')
  @UseGuards(JwtAuthGuard)
  async addSession(@Body() data: any) {
    return this.sessionInvestigationService.addSession(data);
  }

  // Save data using SIMS
  @Post('sims-save')
  @UseGuards(JwtAuthGuard)
  simsSave(@Body() data: any) {
    return this.sessionInvestigationService.simsSave(data);
  }
}
