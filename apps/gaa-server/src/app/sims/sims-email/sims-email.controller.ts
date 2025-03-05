// sims-email.controller.ts
import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { SimsEmailService } from './sims-email.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  emailResponseDto201,
  emailResponseDto400
} from './dto/SimsEmailResponse.dto';


@ApiTags('GAA SIMS Email Controller')
/**
 * Controller for handling email-related actions in the Sims application.
 * It defines endpoints for submitting tutor mails,
 * collaborating on emails, and escalating emails to HR.
 */
@Controller('sims-email')
export class SimsEmailController {
  constructor(private readonly simsEmailService: SimsEmailService) {}

  /**
   * Endpoint for submitting tutor mails. Protected by JWT authentication.
   * @param {Request} req - The request object.
   * @param {string} content - The content of the email.
   * @param {string} email - The recipient's email.
   * @param {string} subject - The subject of the email.
   * @returns A Promise resolved by the email service.
   */
  @UseGuards(JwtAuthGuard)
  @Post('action-category')
  @ApiOperation({ summary: 'Action Category Email' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        content: {
          type: 'string',
          example: 'test content'
        },
        email: {
          type: 'string',
          example: 'test@thirdspaceglobal.com'
        }
      }
    }
  })
  @ApiResponse({
    status: 201,
    type: emailResponseDto201
  })
  @ApiResponse({
    status: 400,
    type: emailResponseDto400
  })
  async SubmitTutorMail(
    @Request() req,
    @Body()
    {
      content,
      email,
      subject
    }: { content: string; email: string; subject: string }
  ) {
    return await this.simsEmailService.actionCategoryMailsService(
      content,
      email,
      subject,
      req.user.username
    );
  }

  /**
   * Endpoint for sending collaboration emails.
   * @param {string} email - The recipient's email.
   * @param {string} nonTutorEmployee - The non-tutor employee involved.
   * @param {string} ticketId - The ticket ID related to the email.
   * @param {string} escalatedUser - The user to whom the issue is escalated.
   * @param {string} subject - The subject of the email.
   * @returns A Promise resolved by the email service.
   */

  @UseGuards(JwtAuthGuard)
  @Post('collaborate-email')
  @ApiOperation({ summary: 'Collaborate Email' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          example: 'test@thirdspaceglobal.com'
        },
        nonTutorEmployee: {
          type: 'string',
          example: 'test employee'
        },
        ticketId: {
          type: 'string',
          example: '23241000'
        },
        escalatedUser: {
          type: 'string',
          example: 'test escalated user'
        }
      }
    }
  })
  @ApiResponse({
    status: 201,
    type: emailResponseDto201
  })
  @ApiResponse({
    status: 400,
    type: emailResponseDto400
  })
  async CollaborateEmail(
    @Body()
    {
      email,
      nonTutorEmployee,
      ticketId,
      escalatedUser,
      subject
    }: {
      email: string;
      nonTutorEmployee: string;
      ticketId: string;
      escalatedUser: string;
      subject: string;
    }
  ) {
    return await this.simsEmailService.collaborateEmailService(
      email,
      nonTutorEmployee,
      ticketId,
      escalatedUser,
      subject
    );
  }

  /**
   * Endpoint for escalating emails to HR.
   * @param {string} email - The recipient's email.
   * @param {string} nonTutorEmployee - The non-tutor employee involved.
   * @param {string} fromEmail - The sender's email.
   * @param {string} ticketId - The ticket ID related to the email.
   * @param {string} escalatedUser - The user to whom the issue is escalated.
   * @param {string} subject - The subject of the email.
   * @returns A Promise resolved by the email service.
   */

  @UseGuards(JwtAuthGuard)
  @Post('escalate-to-hr')
  @ApiOperation({ summary: 'Escalate to HR Email' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          example: 'test@thirdspaceglobal.com'
        },
        nonTutorEmployee: {
          type: 'string',
          example: 'test employee'
        },
        fromEmail: {
          type: 'string',
          example: 'test@thirdspaceglobal.com'
        },
        ticketId: {
          type: 'string',
          example: '23241000'
        },
        escalatedUser: {
          type: 'string',
          example: 'test escalated user'
        }
      }
    }
  })
  @ApiResponse({
    status: 201,
    type: emailResponseDto201
  })
  @ApiResponse({
    status: 400,
    type: emailResponseDto400
  })
  async EscalateToHREmail(
    @Body()
    {
      email,
      nonTutorEmployee,
      fromEmail,
      ticketId,
      escalatedUser,
      subject
    }: {
      email: string;
      nonTutorEmployee: string;
      fromEmail: string;
      ticketId: string;
      escalatedUser: string;
      subject: string;
    }
  ) {
    return await this.simsEmailService.escalateToHREmailService(
      email,
      nonTutorEmployee,
      fromEmail,
      ticketId,
      escalatedUser,
      subject
    );
  }
}
