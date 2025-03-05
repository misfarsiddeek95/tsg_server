import { Controller, Get, Query, Param } from '@nestjs/common';
import { SessionsForEvaluationService } from '../../services/sessions-for-evaluation/sessions-for-evaluation.service';

@Controller('sessions-for-evaluation')
export class SessionsForEvaluationController {
  constructor(
    private sessionsForEvaluationService: SessionsForEvaluationService
  ) {}

  // Retrieve all sessions with filter and server-side pagination
  @Get('/all')
  async sessions(
    @Query('skip') skip: string,
    @Query('take') take: string,
    @Query('searchFilter') searchFilter: any
  ) {
    // Parse search filter JSON
    const { teaching_span, sessionDate, ...rest } = JSON.parse(searchFilter);
    // Filter for non-empty values in rest object
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

    // Filter for session date
    const date = sessionDate.startDate
      ? {
          session_date: {
            gte: new Date(sessionDate.startDate),
            lt: new Date(sessionDate.endDate)
          }
        }
      : {};

    // Filter for teaching span
    const time =
      teaching_span.max > 0
        ? {
            teaching_span: {
              gte: teaching_span.min,
              lt: teaching_span.max
            }
          }
        : {};

    // Combine all filters
    const where = {
      AND: [...restWhere, date, time]
    };

    // Retrieve sessions based on filters
    return this.sessionsForEvaluationService.allSessions({
      skip: Number(skip) - 1,
      take: Number(take),
      where: where
    });
  }

  // Search Touter name
  @Get('search-tuter-name/:name')
  tuterDetailsBySearchingName(@Param('name') name: string) {
    return this.sessionsForEvaluationService.getTuterDetailsBySearchingName(
      name
    );
  }

  // Search  Audio Status
  @Get('search-audio-status/:filter')
  audioStatus(@Param('filter') filter: string) {
    return this.sessionsForEvaluationService.getAudioStatus(filter);
  }

  // Search Red flag
  @Get('search-redflag/:filter')
  redflag(@Param('filter') filter: string) {
    return this.sessionsForEvaluationService.getRedflag(filter);
  }

  // Search Typed

  @Get('search-type/:filter')
  type(@Param('filter') filter: string) {
    return this.sessionsForEvaluationService.getType(filter);
  }

  // Search Programme
  @Get('search-programs/:filter')
  programmes(@Param('filter') filter: string) {
    return this.sessionsForEvaluationService.getProgrammes(filter);
  }

  // Search Learning Objective
  @Get('search-learning-objective/:filter')
  learningObjective(@Param('filter') filter: string) {
    return this.sessionsForEvaluationService.getLearningObjective(filter);
  }

  // Search Tutor ID
  @Get('search-tuterid/:filter')
  TutorID(@Param('filter') filter: number) {
    return this.sessionsForEvaluationService.getTutorID(filter);
  }

  // Search School ID
  @Get('search-schoolid/:filter')
  SchoolID(@Param('filter') filter: number) {
    return this.sessionsForEvaluationService.getSchoolID(filter);
  }

  // Search Pupil ID
  @Get('search-pupilid/:filter')
  PupilID(@Param('filter') filter: number) {
    console.log('FILTER ::', filter);
    return this.sessionsForEvaluationService.getPupilID(filter);
  }

  // Search Session ID
  @Get('search-sessionid/:filter')
  SessionID(@Param('filter') filter: number) {
    return this.sessionsForEvaluationService.getSessionID(filter);
  }

  // Search Learning Objective Suitability
  @Get('search-lOSuitability/:filter')
  LOSuitability(@Param('filter') filter: number) {
    return this.sessionsForEvaluationService.getLOSuitability(filter);
  }
}
