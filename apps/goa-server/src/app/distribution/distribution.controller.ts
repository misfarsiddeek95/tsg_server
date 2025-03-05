import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  Res,
  UseGuards
} from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
import { DistributionService } from './distribution.service';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiQuery,
  ApiTags,
  ApiBody,
  ApiUnauthorizedResponse
} from '@nestjs/swagger';
import {
  BookedDetails,
  DistributionRequestDto,
  LaunchedDetails
} from './dtos/distribution.dto';
import { AvailabilityCountDTO } from './dtos/availability.dto';
import { PrismaService } from '../prisma/prisma.service';

@Controller('distribution')
export class DistributionController {
  constructor(
    private readonly distributionService: DistributionService,
    private prisma: PrismaService
  ) {}

  @Post('availability-count')
  async getAvailabilityCountForEffectiveDateAndSlot(
    @Body() availablitiyPayload: AvailabilityCountDTO
  ) {
    return await this.distributionService.getAvailabilityCountForSlots(
      availablitiyPayload.date_of_week_start,
      availablitiyPayload.tutor_phase,
      availablitiyPayload.type
    );
  }

  // @UseGuards(JwtGuard)
  @Post('reserving')
  async reservingTutors(@Body() distributionRequest: DistributionRequestDto) {
    // console.log(JSON.stringify(distributionRequest));
    return this.distributionService.reservingTutors(distributionRequest);
  }

  // @Get('booking')
  // bookingTutors(@Query('uuid') uuid: string) {
  //   return this.distributionService.booking(uuid);
  // }

  @Delete('reservation-remove')
  removeReservedTutors(@Query('uuid') uuid: string) {
    return this.distributionService.removeReservedTutors(uuid);
  }

  @Post('booked-details')
  bookedDetails(@Body() bookedDetails: any) {
    //BookedDetails
    console.log('bookedDetails' + JSON.stringify(bookedDetails));
    return this.distributionService.bookedDetails(bookedDetails);
  }

  @Post('launched-details')
  launchedDetails(@Body() launchedDetails: LaunchedDetails) {
    return this.distributionService.launchedDetails(launchedDetails);
  }

  @Post('day-light-saving-test')
  daylightSavingTesingFunction(@Body() data: any) {
    return this.distributionService.daylightSavingTesingFunction(data);
  }

  @Post('swap-tms')
  swapTms(@Body() data: any) {
    return this.distributionService.swapTMS(
      data.date,
      data.tspId,
      data.swapCategory,
      data.reason,
      data.type
    );
  }

  @Post('swap-change-availability')
  swapChangeAvailability(@Body() data: any) {
    /**
     * Type----
     * 1 - swapChangeAvailability
     * 2 - swapChangeAvailabilityRequest(Tutor)
     */

    if (data.type == 1) {
      return this.distributionService.swapChangeAvailability(
        data.startDateProp,
        data.endDateProp,
        data.tspIdList,
        data.slotStatus,
        data.swapCategory,
        data.reason
      );
    } else if (data.type == 2) {
      return this.distributionService.swapChangeAvailabilityRequest(
        data.effectiveDate,
        data.tutorId,
        data.slotArr,
        data.swapCategory,
        data.reason
      );
    }
  }

  @Post('swap-timeoff')
  async swapTimeOff(@Body() data: any) {
    if (data.type == 1) {
      return this.distributionService.swapTimeOff(
        data.timeOffDate,
        data.tutorId,
        data.slotArr,
        data.swapCategory,
        data.reason
      );
    } else if (data.type == 2) {
      const response = await this.prisma.gOATimeOffDetails.findMany({
        where: {
          time_off_id: data.timeOffRefId
        },
        select: {
          slot_id: true,
          hour_status: true
        }
      });

      const slotArr = response.map((i) => ({
        slotId: i.slot_id,
        hourStatus: i.hour_status
      }));

      return this.distributionService.swapTimeOff(
        data.timeOffDate,
        data.tutorId,
        slotArr,
        data.swapCategory,
        data.reason
      );
    } else if (data.type == 3) {
      const responseTslUser = await this.prisma.tslUser.findFirst({
        where: {
          tsp_id: data.tspId
        },
        select: {
          tsl_id: true
        }
      });

      const slotArr = data.slotIds.map((slotId) => ({
        slotId: slotId,
        hourStatus: null
      }));

      return this.distributionService.swapTimeOff(
        data.timeOffDate,
        responseTslUser.tsl_id, //tutorId
        slotArr,
        data.swapCategory,
        data.reason
      );
    }
  }

  @Post('swap-session')
  swapSession(@Body() data: any) {
    return this.distributionService.swapSession(
      data.startDate,
      data.endDate,
      data.oldTutorId,
      data.newTutorId,
      data.slotId,
      data.swapCategory,
      data.reason,
      data.type
    );
  }

  @Post('swap-session-find-tutor')
  swapSessionFindTutor(@Body() data: any) {
    return this.distributionService.swapSessionFindTutor(
      data.startDate,
      data.endDate,
      data.oldTutorId,
      data.slotId,
      data.type
    );
  }

  @Get('tutor-details/:tutorId')
  findTutorDetails(@Param('tutorId') tutorId: string) {
    return this.distributionService.findTutorDetails(Number(tutorId));
  }

  @Get('cancel-session/:sessionId')
  sessionCancelation(@Param('sessionId') sessionId: string) {
    return this.distributionService.sessionCancelation(Number(sessionId));
  }

  @Post('distribution-logic-test')
  async distributionLogicTest(@Body() data: any) {
    const { monday, friday } =
      await this.distributionService.getWeekMondayAndFriday(data.startDate);

    const goaSlot = await this.prisma.gOASlot.findFirst({
      where: {
        id: data.slotId
      },
      select: {
        time_range_id: true
      }
    });

    const startDateString = data.startDate;
    const endDateString = data.endDate;
    const hourState = data.hourState; // Ex:  OH , HH
    const tutorPhase = data.tutorPhase; //Ex:  Primary,  Secondary
    const weeklyStartDate = monday;
    const weeklyEndDate = friday;
    const slotId = data.slotId;
    const timeRangeId = goaSlot.time_range_id;
    const numberOfStudents = data.numberOfStudents;
    const isCoverTutors = data.isCoverTutors;

    console.log('data:' + JSON.stringify(data));

    return this.distributionService.tutorDistribution(
      startDateString, //Date should be string and YYYY-MM-DD format
      endDateString, //Date should be string and YYYY-MM-DD format
      hourState, // Ex:  OH , HH
      tutorPhase, //Ex:  Primary,  Secondary
      new Date(weeklyStartDate), //Date should be string and YYYY-MM-DD format
      new Date(weeklyEndDate), //Date should be string and YYYY-MM-DD format
      slotId, // Ex: 1, 2, ... 40
      timeRangeId, // Ex: 1, 2, 3, 4, 5, 6, 7, 8// timeRangeId
      numberOfStudents, //Ex: 10
      isCoverTutors // true or false
    );
  }
}
