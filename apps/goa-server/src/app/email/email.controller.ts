import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete
} from '@nestjs/common';
import { EmailService } from './email.service';
import {
  AdminAvailabilityChangeRequest201,
  AdminTimeOffCancellationMail201,
  CreateEmailDto,
  PermanentSwapNotifiactionDto401,
  PermanentSwapNotification201,
  TutorAvailabilityChangeRequestActioned201,
  TutorChangesMadeToAvailabilityByAdmin201,
  TutorInitialAvailabilityActioned201,
  TutorSubbordinateTimeOffMail201,
  TutorTimeOffActionedMail201,
  TutorTimeOffActionedMailDto401,
  TutorTimeOffCancellationMail201,
  TutorTimeOffRequestMail201
} from './dto/create-email.dto';
import { UpdateEmailDto } from './dto/update-email.dto';
import {
  ApiCreatedResponse,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse
} from '@nestjs/swagger';

@ApiTags('Email Controller Endpoint')
@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('tutor-time-off-actioned-mail')
  @ApiCreatedResponse({
    description: 'The resource was returned successfully',
    type: TutorTimeOffActionedMail201
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized Request',
    type: TutorTimeOffActionedMailDto401
  })
  async TutorTimeOffActioned(
    @Body()
    {
      subject,
      email,
      first_name,
      date,
      requests,
      reason,
      supervisorBcc
    }: {
      subject: string;
      email: string;
      first_name: string;
      requests: any;
      date: string;
      reason: any;
      supervisorBcc: string[];
    }
  ) {
    await this.emailService.TutorTimeOffActionedService({
      subject,
      email,
      first_name,
      requests,
      date,
      reason,
      supervisorBcc
    });

    return {
      success: true,
      message: `${email} is available and otp has send to ${first_name}`,
      status: 'available'
    };
  }

  @Post('admin-time-off-request-mail')
  @ApiCreatedResponse({
    description: 'The resource was returned successfully',
    type: TutorTimeOffRequestMail201
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized Request',
    type: TutorTimeOffActionedMailDto401
  })
  async AdminTimeOffRequest(
    @Body()
    {
      subject,
      email,
      tutorName,
      tutorId,
      requests,
      supervisorBcc
    }: {
      subject: string;
      email: string;
      tutorName: string;
      tutorId: string;
      requests: any;
      supervisorBcc: string[];
    }
  ) {
    await this.emailService.AdminTimeOffRequestService({
      subject,
      email,
      supervisorBcc,
      tutorName,
      tutorId,
      requests
    });

    return {
      success: true,
      message: `${email} is available and otp has send to ${requests.slots}`,
      status: 'available'
    };
  }

  @Post('tutor-subordinate-time-off')
  @ApiCreatedResponse({
    description: 'The resource was returned successfully',
    type: TutorSubbordinateTimeOffMail201
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized Request',
    type: TutorTimeOffActionedMailDto401
  })
  async TutorSubordinateTimeOff(
    @Body()
    {
      subject,
      email,
      tutorName,
      requests,
      supervisorBcc
    }: {
      subject: string;
      email: string;
      tutorName: string;
      requests: any;
      supervisorBcc: string[];
    }
  ) {
    await this.emailService.TutorSubordinateTimeOffService({
      subject,
      email,
      tutorName,
      requests,
      supervisorBcc
    });

    return {
      success: true,
      message: `${email} is available and otp has send to ${requests.slots}`,
      status: 'available'
    };
  }

  @Post('admin-time-off-cancellation')
  @ApiCreatedResponse({
    description: 'The resource was returned successfully',
    type: AdminTimeOffCancellationMail201
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized Request',
    type: TutorTimeOffActionedMailDto401
  })
  async AdminTimeOffCancellation(
    @Body()
    {
      subject,
      email,
      tutorName,
      tutorId,
      requests,
      supervisorBcc
    }: {
      subject: string;
      email: string;
      tutorName: string;
      tutorId: string;
      requests: any;
      supervisorBcc: string[];
    }
  ) {
    await this.emailService.AdminTimeOffCancellationService({
      subject,
      email,
      supervisorBcc,
      tutorName,
      tutorId,
      requests
    });

    return {
      success: true,
      message: `${email} is available and otp has send to ${tutorName}`,
      status: 'available'
    };
  }

  @Post('tutor-time-off-cancellation')
  @ApiCreatedResponse({
    description: 'The resource was returned successfully',
    type: TutorTimeOffCancellationMail201
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized Request',
    type: TutorTimeOffActionedMailDto401
  })
  async TutorTimeOffCancellation(
    @Body()
    {
      subject,
      email,
      tutorName,
      tutorId,
      requests
    }: {
      subject: string;
      email: string;
      tutorName: string;
      tutorId: string;
      requests: any;
    }
  ) {
    await this.emailService.TutorTimeOffCancellationService({
      subject,
      email,
      tutorName,
      tutorId,
      requests
    });

    return {
      success: true,
      message: `${email} is available and otp has send to ${tutorName}`,
      status: 'available'
    };
  }

  @Post('admin-availability-change-request')
  @ApiCreatedResponse({
    description: 'The resource was returned successfully',
    type: AdminAvailabilityChangeRequest201
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized Request',
    type: TutorTimeOffActionedMailDto401
  })
  async AdminAvailabilityChangeRequest(
    @Body()
    {
      subject,
      email,
      tutorName,
      tutorId,
      currentAvailability,
      effectiveDate,
      reasonForChange,
      increasedSlots,
      decreasedSlots,
      supervisorBcc
    }: {
      subject: string;
      email: string;
      tutorName: string;
      tutorId: string;
      currentAvailability: number;
      effectiveDate: string;
      reasonForChange: string;
      increasedSlots: number;
      decreasedSlots: number;
      supervisorBcc: string[];
    }
  ) {
    await this.emailService.AdminAvailabilityChangeRequestService({
      subject,
      email,
      supervisorBcc,
      tutorName,
      tutorId,
      currentAvailability,
      effectiveDate,
      reasonForChange,
      increasedSlots,
      decreasedSlots
    });

    return {
      success: true,
      message: `${email} is available and otp has send to ${tutorName}`,
      status: 'available'
    };
  }

  @Post('tutor-availability-change-request-actioned')
  @ApiCreatedResponse({
    description: 'The resource was returned successfully',
    type: TutorAvailabilityChangeRequestActioned201
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized Request',
    type: TutorTimeOffActionedMailDto401
  })
  async TutorAvailabilityChangeRequestActioned(
    @Body()
    {
      subject,
      email,
      tutorName,
      date,
      requests,
      rejectedReason,
      unAcceptedReason,
      supervisorBcc
    }: {
      subject: string;
      email: string;
      tutorName: string;
      date: string;
      requests: any;
      rejectedReason: any;
      unAcceptedReason: any;
      supervisorBcc: string[];
    }
  ) {
    await this.emailService.TutorAvailabilityChangeRequestActionedService({
      subject,
      email,
      supervisorBcc,
      tutorName,
      date,
      requests,
      rejectedReason,
      unAcceptedReason
    });

    return {
      success: true,
      message: `${email} is available and otp has send to ${tutorName}`,
      status: 'available'
    };
  }

  @Post('tutor-changes-made-to-availability-by-admin')
  @ApiCreatedResponse({
    description: 'The resource was returned successfully',
    type: TutorChangesMadeToAvailabilityByAdmin201
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized Request',
    type: TutorTimeOffActionedMailDto401
  })
  async TutorChangesMadeToAvailabilityByAdmin(
    @Body()
    {
      subject,
      email,
      tutorName,
      date,
      requests,
      supervisorBcc
    }: // unAcceptedToInactive,
    // activeToInactive,
    // activeToUnaccepted,
    {
      subject: string;
      email: string;
      tutorName: string;
      date: string;
      requests: any;
      supervisorBcc: string[];
      // unAcceptedToInactive: any;
      // activeToInactive: any;
      // activeToUnaccepted: any;
    }
  ) {
    await this.emailService.TutorChangesMadeToAvailabilityByAdminService({
      subject,
      email,
      tutorName,
      date,
      requests,
      supervisorBcc
      // unAcceptedToInactive,
      // activeToInactive,
      // activeToUnaccepted,
    });

    return {
      success: true,
      message: `${email} is available and otp has send to ${tutorName}`,
      status: 'available'
    };
  }

  @Post('tutor-initial-availability-actioned')
  @ApiCreatedResponse({
    description: 'The resource was returned successfully',
    type: TutorInitialAvailabilityActioned201
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized Request',
    type: TutorTimeOffActionedMailDto401
  })
  async TutorInitialAvailabilityActioned(
    @Body()
    {
      subject,
      email,
      tutorName,
      date,
      requests,
      unAcceptedToInactive,
      activeToInactive,
      activeToUnaccepted
    }: {
      subject: string;
      email: string;
      tutorName: string;
      date: string;
      requests: any;
      unAcceptedToInactive: any;
      activeToInactive: any;
      activeToUnaccepted: any;
    }
  ) {
    await this.emailService.TutorInitialAvailabilityActionedService(
      subject,
      email,
      tutorName,
      date,
      requests,
      unAcceptedToInactive,
      activeToInactive,
      activeToUnaccepted
    );

    return {
      success: true,
      message: `${email} is available and otp has send to ${tutorName}`,
      status: 'available'
    };
  }
  @Post('send-invoice')
  @ApiCreatedResponse({
    description: 'The resource was returned successfully',
    type: TutorAvailabilityChangeRequestActioned201
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized Request',
    type: TutorTimeOffActionedMailDto401
  })
  async SendInvoice(
    @Body()
    {
      email,
      tutorName,
      //date,
      invoiceId,
      invoiceType,
      invoicePeriod,
      subjectDate,
      supervisorBcc,
      tutorId
    }: {
      email: string;
      tutorName: string;
      // date: string;
      invoiceId: string;
      invoiceType: string;
      invoicePeriod: string;
      subjectDate: string;
      tutorId: number;
      supervisorBcc: string[];
    }
  ) {
    await this.emailService.SendInvoiceService({
      email,
      tutorName,
      //date,
      invoiceId,
      invoiceType,
      invoicePeriod,
      subjectDate,
      supervisorBcc,
      tutorId
    });

    return {
      success: true,
      message: 'success true'
    };
  }

  @Post('update-invoice')
  @ApiCreatedResponse({
    description: 'The resource was returned successfully',
    type: TutorAvailabilityChangeRequestActioned201
  })
  async UpdateInvoice(
    @Body()
    {
      email,
      tutorName,
      // date,
      invoiceId,
      invoiceType,
      invoicePeriod,
      subjectDate,
      supervisorBcc,
      tutorId
    }: {
      email: string;
      tutorName: string;
      // date: string;
      invoiceId: string;
      invoiceType: string;
      invoicePeriod: string;
      subjectDate: string;
      supervisorBcc: string[];
      tutorId: number;
    }
  ) {
    await this.emailService.UpdateInvoiceService({
      email,
      tutorName,
      // date,
      invoiceId,
      invoiceType,
      invoicePeriod,
      subjectDate,
      supervisorBcc,
      tutorId
    });

    return {
      success: true,
      message: 'success true'
    };
  }

  @Post('permanent-swap-notification-email')
  @ApiCreatedResponse({
    description: 'The resource was returned successfully',
    type: PermanentSwapNotification201
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized Request',
    type: PermanentSwapNotifiactionDto401
  })
  async PermanentSwapNotificationEmail(
    @Body()
    {
      email,
      firstName,
      tutorManagerEmail,
      tutorId,
      sessionType,
      date,
      sessionSlot
    }: {
      email: string;
      firstName: string;
      tutorManagerEmail: string;
      tutorId: number;
      sessionType: string;
      date: string;
      sessionSlot: string;
      tuto;
    }
  ) {
    await this.emailService.PermanentSwapNotificationEmailService({
      email,
      firstName,
      tutorManagerEmail,
      tutorId,
      sessionType,
      date,
      sessionSlot
    });

    return {
      success: true,
      message: `${email} is sent swap notification email`
    };
  }
}
