import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Query,
  UseGuards,
  Request
} from '@nestjs/common';
import { SimsTicketFormService } from './sims-ticket-form.service';
import {
  CloseTicketSuccessResponse,
  CollaboratePeopleSuccessResponse,
  EscalateToHRSuccessResponse,
  FetchDataSuccessResponse,
  GetInvestigatorNamesSuccessResponse,
  RelaventEmailTemplateSuccessResponse,
  SessionDetailErrorResponse,
  SessionDetailSuccessResponse,
  TutorDetailSuccessResponse,
  TutorNameOrIdErrorResponse,
  TutorNameOrIdSuccessResponse,
  UpdateTicket400Response,
  UpdateTicketSuccessReponse
} from './dto/create-sims-ticket-form.dto';
import {
  UpdateCloseTicket,
  UpdateCollaborators,
  UpdateEscalateToHRDto,
  UpdateReplyEmail,
  UpdateResendPrimaryEmail,
  UpdateSimsTicketFormDto
} from './dto/update-sims-ticket-form.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';
@ApiBearerAuth()
@ApiTags('SIMS TICKET FORM')
@Controller('sims-ticket-form')
export class SimsTicketFormController {
  constructor(private readonly simsTicketFormService: SimsTicketFormService) {}

  // =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  // Get the session detail like session type, tutor who conducted the session and etc.
  @UseGuards(JwtAuthGuard)
  @Get('session-detail-by-id')
  @ApiOperation({
    summary: 'Get session details by ID',
    description:
      'Retrieve detailed information about a session based on its ID and ticket ID.'
  })
  @ApiQuery({
    name: 'id',
    type: String,
    description: 'Session ID',
    example: '3886847'
  })
  @ApiQuery({
    name: 'ticketId',
    type: String,
    description: 'SIMS master id',
    example: '232404577'
  })
  @ApiResponse({
    status: 200,
    description: 'Session detail fetched successfully',
    type: SessionDetailSuccessResponse
  })
  @ApiResponse({
    status: 200,
    description: 'No data to fetch for passed values',
    type: SessionDetailErrorResponse
  })
  findSessionDetailById(
    @Query('id') id: string,
    @Query('ticketId') ticketId: string
  ) {
    return this.simsTicketFormService.sessionDetails(+id, +ticketId);
  }

  // =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  // Get the name list and tutor id list in the dropdown.
  /*
    searchItem is what we search.
    searchType is what we pass the value as byid or byname.
      - byid: if we pass this as searchType and when we type search item like the tutor id, list of tutor ids will be suggested.
      - byname: if we pass this as searchType and when we type search item like the tutor name, list of tutor names will be suggested.
  */
  @UseGuards(JwtAuthGuard)
  @Get('get-tutor-name-or-id')
  @ApiOperation({
    summary: 'Get tutor name / tutor id by searching',
    description:
      'Retrive the tutor name / tutor id by searching the name or id and the method of searching.'
  })
  @ApiQuery({
    name: 'searchItem',
    type: String,
    description: 'Search term: Tutor name or Tutor Id',
    example: 'Misfar Siddeek'
  })
  @ApiQuery({
    name: 'searchType',
    type: String,
    description: 'Search type: byname or byid',
    example: 'byname'
  })
  @ApiResponse({
    status: 200,
    description: 'Sucessfully fetched tutor name or tutor id',
    type: TutorNameOrIdSuccessResponse
  })
  @ApiResponse({
    status: 200,
    description: 'No data to fetch for passed values',
    type: TutorNameOrIdErrorResponse
  })
  getTutorNameOrId(
    @Query('searchItem') searchItem: string,
    @Query('searchType') searchType: string
  ) {
    return this.simsTicketFormService.getTutorNameOrId(searchItem, searchType);
  }

  // =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  // Get the tutor details by passing the tutor id.
  /*
    Here I've passed the ticket id for the below reason.
      - need to get the history of the other cases related tutor except the current ticket id 
      - (No need to show the current ticket details due to that's not coming under the history).
   */
  @UseGuards(JwtAuthGuard)
  @Get('get-tutor-detail-by-id')
  @ApiOperation({
    summary: 'Get tutor detail by tutor tsp Id',
    description:
      "Retrive tutor detail by passing tutor's tsp id and the current sims master id"
  })
  @ApiQuery({
    name: 'id',
    type: String,
    description: 'Tutor Tsp Id',
    example: '9001'
  })
  @ApiQuery({
    name: 'ticketId',
    type: String,
    description: 'Current sims master id',
    example: '242592143'
  })
  @ApiResponse({
    status: 200,
    description: 'Sucessfully fetched tutor detail',
    type: TutorDetailSuccessResponse
  })
  getTutorDetail(@Query('id') id: string, @Query('ticketId') ticketId: string) {
    return this.simsTicketFormService.getTutorDetail(+id, +ticketId);
  }

  // =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  // Get the same issue count.
  /*
    This function is used to fetch the number of cases when the same concern category selected.
    Here also I've passed the ticket id for the below reason.
      - need to get the cases count except the current case.
      - (No need to include the current case to the count.)
  */
  @UseGuards(JwtAuthGuard)
  @Get('get-same-issue-count')
  @ApiOperation({
    summary: 'Get the same issue count',
    description:
      'Retrive the same issue count by passing tutor id, concern category id and current sims master id.'
  })
  @ApiQuery({
    name: 'tutorId',
    type: String,
    description: 'Tutor Id',
    example: '100099'
  })
  @ApiQuery({
    name: 'concernCate',
    type: String,
    description: 'Concern category id',
    example: '34'
  })
  @ApiQuery({
    name: 'ticketId',
    type: String,
    description: 'Current sims master id',
    example: '242584267'
  })
  @ApiResponse({
    status: 200,
    description: 'Sucessfully fetched the count of same issues',
    type: Number
  })
  getSameIssueCount(
    @Query('tutorId') tutorId: string,
    @Query('concernCate') concernCate: string,
    @Query('ticketId') ticketId: string
  ) {
    return this.simsTicketFormService.getSameIssueCount(
      +tutorId,
      +concernCate,
      +ticketId
    );
  }

  // =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  // Fetch the relevant email template from the meta table according to the Action category.
  @UseGuards(JwtAuthGuard)
  @Get('get-relavent-email-template')
  @ApiOperation({
    summary: 'Get relavent email template',
    description:
      'Retrive the particular email template by passing the action category id and the current sims master id.'
  })
  @ApiQuery({
    name: 'actionCateId',
    type: String,
    description: 'Action category id',
    example: '89'
  })
  @ApiQuery({
    name: 'ticketId',
    type: String,
    description: 'Current sims master id',
    example: '232494936'
  })
  @ApiResponse({
    status: 200,
    description: 'Sucessfully fetched relavent email template',
    type: RelaventEmailTemplateSuccessResponse
  })
  getRelaventEmailTemplate(
    @Query('actionCateId') actionCateId: string,
    @Query('ticketId') ticketId: string
  ) {
    return this.simsTicketFormService.fetchRelaventEmailTemplate(
      +actionCateId,
      +ticketId
    );
  }

  // =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  // Escalate the issue to the HR.
  @UseGuards(JwtAuthGuard)
  @Patch('escalate-to-hr')
  @ApiOperation({
    summary: 'Escalate to HR',
    description: 'Escalate the issue to the HR.'
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully escalated to HR',
    type: EscalateToHRSuccessResponse
  })
  escalateToHR(@Body() escalateToHr: UpdateEscalateToHRDto) {
    return this.simsTicketFormService.escalateToHR(escalateToHr);
  }

  // =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  // Fetching the investigators like Ops and Acs when type their name in the collaborators section.
  @UseGuards(JwtAuthGuard)
  @Get('get-investigator-names')
  @ApiOperation({
    summary: 'Get investigators name list',
    description:
      'Retrive all the investigators name who are from operations and academic team.'
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully fetch the investigators',
    type: GetInvestigatorNamesSuccessResponse
  })
  getInvestigatorNames() {
    return this.simsTicketFormService.getInvestigatorNames();
  }

  // =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  // Update the db field and insert list of collaborators to the db table after clicking the bell icon in the collaborators section.
  @UseGuards(JwtAuthGuard)
  @Post('collaborate-people')
  @ApiOperation({
    summary: 'Collaborate people',
    description: 'Assign the investigators to the ticket.'
  })
  @ApiResponse({
    status: 201,
    description: 'Successfully collaborate people to the ticket',
    type: CollaboratePeopleSuccessResponse
  })
  collaboratePeople(@Body() data: UpdateCollaborators) {
    return this.simsTicketFormService.collaborateUsersToTicket(data);
  }

  // =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  // This function created to update the ticket status once the close case button clicked.
  @UseGuards(JwtAuthGuard)
  @Patch('close-ticket')
  @ApiOperation({
    summary: 'Close ticket',
    description:
      'Close the ticket once after getting the acknowledge email from the tutor.'
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully close the ticket',
    type: CloseTicketSuccessResponse
  })
  closeTicket(@Body() data: UpdateCloseTicket) {
    return this.simsTicketFormService.closeTicket(data);
  }

  // =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  // This is the main function which used to save or update the form values in the db table.
  // Here I've used Request anotation to get the current logged in user id.
  @UseGuards(JwtAuthGuard)
  @Patch('update-ticket-form')
  @ApiOperation({
    summary: 'Update ticket form',
    description: 'Update ticket form data to the db.'
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully ticket updated',
    type: UpdateTicketSuccessReponse
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request error',
    type: UpdateTicket400Response
  })
  updateTicketForm(
    @Request() req,
    @Body() ticketForm: UpdateSimsTicketFormDto
  ) {
    return this.simsTicketFormService.updateTicketForm(ticketForm, req.user);
  }
  // =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

  // This function used to fetch the data from the db when we open the ticket by clicking the VIEW CASE button.
  @UseGuards(JwtAuthGuard)
  @Get('fetch-ticket-data')
  @ApiOperation({
    summary: 'Fetch ticket data',
    description: 'Fetch all the data from db to show in the sims form.'
  })
  @ApiQuery({
    name: 'ticketId',
    type: String,
    description: 'Sims Master Id',
    example: '242545789'
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully fetched ticket data',
    type: FetchDataSuccessResponse
  })
  fetchTicketData(@Request() req, @Query('ticketId') ticketId: string) {
    return this.simsTicketFormService.fetchTicketData(+ticketId, req.user);
  }
  // =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

  // Resend primary email.
  @UseGuards(JwtAuthGuard)
  @Patch('resend-primary-email')
  @ApiOperation({
    summary: 'Resend primary email',
    description: 'Resend the primary email due to the issue faced.'
  })
  resendPrimaryEmail(@Request() req, @Body() data: UpdateResendPrimaryEmail) {
    return this.simsTicketFormService.resendPrimaryEmail(data, req.user);
  }
  // =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

  // Resend primary email.
  @UseGuards(JwtAuthGuard)
  @Patch('send-reply-email')
  @ApiOperation({
    summary: 'Send Reply Email',
    description: 'Send reply email to the tutor.'
  })
  replyEmail(@Request() req, @Body() data: UpdateReplyEmail) {
    return this.simsTicketFormService.sendReplyEmail(data, req.user);
  }
}
