import { AccessGuard, Accesses } from './../auth/access.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  Body,
  Controller,
  Request,
  Get,
  Post,
  UseGuards,
  Put,
  Query
} from '@nestjs/common';
import { AdditionalDocumentsService } from './additional-documents.service';
import { ApiOperation, ApiResponse, ApiTags, ApiBody } from '@nestjs/swagger';
import {
  AuditorSubmitReferenceDetailsDto,
  AuditorSubmitRightToWorkDetailsDto,
  ReferenceFormDto,
  SubmitReferencesDetailsDto,
  SubmitRightToWorkDetailsDto,
  UpdateContractUrlDto,
  SetAuditorRefereeActionBtnFlagDto,
  SubmitSupportDocumentsDto,
  AuditorSubmitSupportDocumentsDto,
  SetAuditorContractActionDto,
  FetchReferencesDetailsDto,
  FetchRightToWorkDetailsDto,
  ReferenceDetails200Response,
  RightToWorkDetails200Response,
  AuditorReferenceDetails200Response,
  AuditorRightToWorkDetails200Response,
  FetchSupportDetailsDto,
  SupportDocuments200Response,
  FetchTsgSupportDocDto,
  AuditorSupportDocuments200Response
} from './additional-documents.dto';
import { BadRequest400Dto, Forbidden403Dto, UnauthorizedDto } from '../app.dto';

@ApiTags('HRIS Additional Documents')
@Controller('additional-documents')
export class AdditionalDocumentsController {
  constructor(private additionalDocuments: AdditionalDocumentsService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/references')
  @ApiOperation({ summary: 'Tutor: Fetch References Details' })
  @ApiResponse({
    status: 200,
    description: 'Success: Tutor: Fetch References Details',
    type: FetchReferencesDetailsDto
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
  async fetchDetails(@Request() req) {
    return this.additionalDocuments.fetchReferenceDetails(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/references')
  @ApiOperation({ summary: 'Tutor: Submit Reference Details' })
  @ApiBody({ type: SubmitReferencesDetailsDto })
  @ApiResponse({
    status: 201,
    description: 'Success: Tutor: Submit Reference Details',
    type: ReferenceDetails200Response
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
  async submitReferencesDetails(
    @Request() req,
    @Body() body: SubmitReferencesDetailsDto
  ) {
    return this.additionalDocuments.submitReferenceDetails(
      req.user.userId,
      body
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('/right-to-work')
  @ApiOperation({ summary: 'Tutor: Fetch Right To Work Details' })
  @ApiResponse({
    status: 200,
    description: 'Success: Tutor: Fetch Right To Work Details',
    type: FetchRightToWorkDetailsDto
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
  async fetchRightToWorkDetails(@Request() req) {
    return this.additionalDocuments.fetchRightToWorkDetails(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/right-to-work')
  @ApiOperation({ summary: 'Tutor: Submit Right To Work Details' })
  @ApiBody({ type: SubmitRightToWorkDetailsDto })
  @ApiResponse({
    status: 201,
    description: 'Success: Tutor: Submit Right To Work Details',
    type: RightToWorkDetails200Response
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
  async submitRightToWorkDetails(
    @Request() req,
    @Body() body: SubmitRightToWorkDetailsDto
  ) {
    return this.additionalDocuments.submitRightToWorkDetails(
      req.user.userId,
      body
    );
  }

  @Accesses('AUDITOR', 'HR_ADMIN', 'HR_USER')
  @UseGuards(AccessGuard)
  @UseGuards(JwtAuthGuard)
  @Post('/right-to-work/auditor')
  @ApiOperation({ summary: 'Auditor: Submit Right To Work Details' })
  @ApiBody({ type: AuditorSubmitRightToWorkDetailsDto })
  @ApiResponse({
    status: 201,
    description: 'Success: Auditor: Submit Bank Details',
    type: AuditorRightToWorkDetails200Response
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
  async auditorSubmitRightToWorkDetails(
    @Request() req,
    @Body() body: AuditorSubmitRightToWorkDetailsDto
  ) {
    return this.additionalDocuments.auditorSubmitRightToWorkDetails(
      req.user.userId,
      body
    );
  }

  @Accesses('AUDITOR', 'HR_ADMIN', 'HR_USER')
  @UseGuards(AccessGuard)
  @UseGuards(JwtAuthGuard)
  @Post('/references/auditor')
  @ApiOperation({ summary: 'Auditor: Submit Reference Details' })
  @ApiBody({ type: AuditorSubmitReferenceDetailsDto })
  @ApiResponse({
    status: 201,
    description: 'Success: Auditor: Submit Reference Details',
    type: AuditorReferenceDetails200Response
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
  async auditorSubmitReferencesDetails(
    @Request() req,
    @Body() body: AuditorSubmitReferenceDetailsDto
  ) {
    return this.additionalDocuments.auditorSubmitReferenceDetails(
      req.user.userId,
      body
    );
  }

  @Accesses('AUDITOR', 'HR_ADMIN', 'HR_USER')
  @UseGuards(AccessGuard)
  @UseGuards(JwtAuthGuard)
  @Put('/references/auditor-action-btn')
  @ApiOperation({ summary: 'Auditor: Update Referee flags email & submission' })
  async setAuditorRefereeActionBtnFlag(
    @Request() req: any,
    @Body()
    {
      candidateId,
      refereeAction,
      refereeCount
    }: SetAuditorRefereeActionBtnFlagDto
  ) {
    return this.additionalDocuments.setAuditorRefereeActionBtnFlag(
      +req.user.userId,
      candidateId,
      refereeAction,
      refereeCount
    );
  }

  @UseGuards(JwtAuthGuard)
  @Put('/auditor-contract-action-btn')
  @ApiOperation({ summary: 'Auditor: Update Contract audit status' })
  async setAuditorContractAction(
    @Request() req: any,
    @Body()
    {
      candidateId,
      contractAction,
      contractRejectReason
    }: SetAuditorContractActionDto
  ) {
    return this.additionalDocuments.setAuditorContractAction(
      +req.user.userId,
      candidateId,
      contractAction,
      contractRejectReason
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('/references/auditor-fetch-referee-response')
  @ApiOperation({ summary: 'Auditor: Fetch Referee Response' })
  @ApiResponse({
    status: 200
    // type: FetchDetailsOkDto
  })
  @ApiResponse({
    status: 401,
    description: 'Failed: Unauthorized',
    type: UnauthorizedDto
  })
  async fetchRefereeResponseData(
    @Query()
    {
      candidateTspId,
      refereeCount
    }: {
      candidateTspId: number;
      refereeCount: number;
    }
  ) {
    return this.additionalDocuments.fetchRefereeResponseData(
      +candidateTspId,
      +refereeCount
    );
  }

  @UseGuards(JwtAuthGuard)
  @Put('/update-contract-url')
  @ApiOperation({ summary: 'Update Contract URL' })
  async updateContractUrl(
    @Request() req: any,
    @Body() { url }: UpdateContractUrlDto
  ) {
    return this.additionalDocuments.updateContractUrl(url, +req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/get-existing-contract-url')
  @ApiOperation({ summary: 'Get Contract Url' })
  async getExistingContractUrl(@Request() req: any) {
    return this.additionalDocuments.checkExistingContract(+req.user.userId);
  }

  // DO NOT USE GUARD as this API is called externally
  @Post('/save-reference-form')
  @ApiOperation({ summary: 'TSG External Form: Submit reference form data' })
  @ApiBody({ type: ReferenceFormDto })
  @ApiResponse({
    status: 201,
    description: 'Success: TSG External Form: Submit reference form data'
    // type: FetchDetailsOkDto
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
  async saveReferenceForm(@Request() req, @Body() body: ReferenceFormDto) {
    return this.additionalDocuments.saveReferenceForm(req.tspId, body);
  }

  // DO NOT USE GUARD as this API is called externally
  @Get('/fetch-referee-details')
  @ApiOperation({ summary: 'TSG External Form: Fetch referee values' })
  @ApiResponse({
    status: 200,
    description: 'Success: TSG External Form: Fetch referee values'
    // type: FetchDetailsOkDto
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
  async fetchReferenceFormData(@Query() query: any) {
    return this.additionalDocuments.fetchReferenceFormData(query.token);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/support-documents')
  @ApiOperation({ summary: 'Tutor: Fetch Support Documents' })
  @ApiResponse({
    status: 200,
    description: 'Success: Tutor: Fetch Support Documents',
    type: FetchSupportDetailsDto
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
  async fetchSupportDocuments(@Request() req) {
    return this.additionalDocuments.fetchSupportDocuments(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/tsg-tutor-support-documents')
  @ApiOperation({ summary: 'Tutor: Fetch TSG User Support Documents' })
  @ApiResponse({
    status: 200,
    description: 'Success: Tutor: Fetch TSG User Support Documents',
    type: FetchTsgSupportDocDto
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
  async fetchTsgTutorSupportDocuments(@Request() req) {
    return this.additionalDocuments.fetchTsgTutorSupportDocuments(
      req.user.userId
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('/support-documents')
  @ApiOperation({ summary: 'Tutor: Submit Support Documents' })
  @ApiBody({ type: SubmitSupportDocumentsDto })
  @ApiResponse({
    status: 201,
    description: 'Success: Tutor: Submit Support Documents',
    type: SupportDocuments200Response
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
  async submitSupportDocuments(
    @Request() req,
    @Body() body: SubmitSupportDocumentsDto
  ) {
    return this.additionalDocuments.submitSupportDocuments(
      req.user.userId,
      body
    );
  }

  @Accesses('AUDITOR', 'HR_ADMIN', 'HR_USER')
  @UseGuards(AccessGuard)
  @UseGuards(JwtAuthGuard)
  @Post('/support-documents/auditor')
  @ApiOperation({ summary: 'Auditor: Submit Support Documents' })
  @ApiBody({ type: AuditorSubmitSupportDocumentsDto })
  @ApiResponse({
    status: 201,
    description: 'Success: Auditor: Submit Support Documents',
    type: AuditorSupportDocuments200Response
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
  async auditorSubmitSupportDocuments(
    @Request() req,
    @Body() body: AuditorSubmitSupportDocumentsDto
  ) {
    return this.additionalDocuments.auditorSubmitSupportDocuments(
      req.user.userId,
      body
    );
  }
}
