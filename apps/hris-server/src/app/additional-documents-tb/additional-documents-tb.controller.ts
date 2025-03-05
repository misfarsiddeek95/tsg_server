import {
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
  Request,
  Body
} from '@nestjs/common';
import { AdditionalDocumentsTbService } from './additional-documents-tb.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  AdditionalDocumentsTbDto,
  AdditionalDocumentsTb200Dto,
  SubmitTsgDocumentsDto,
  SubmitTsgDocuments200Dto,
  DeleteTsgDocumentDto,
  DeleteTsgDocument200Dto,
  SubmitCommonResourcesDto,
  SubmitCommonResources200Dto,
  AssignCommonResourcesDto,
  AssignCommonResources200Dto,
  DeleteCommonResourceDto,
  DeleteCommonResource200Dto,
  FetchTsgDocuments200Dto,
  FetchCommonResources200Dto,
  FetchUserDocuments200Dto
} from './additional-documents-tb.dto';
import { BadRequest400Dto, Forbidden403Dto, UnauthorizedDto } from '../app.dto';
import { Accesses, AccessGuard } from '../auth/access.guard';

@UseGuards(JwtAuthGuard)
@ApiTags('HRIS Table: Additional Documents & other related apis')
@Controller('additional-documents-tb')
export class AdditionalDocumentsTbController {
  constructor(
    private additionalDocumentsTbService: AdditionalDocumentsTbService
  ) {}

  @Accesses('HR_ADMIN', 'HR_USER')
  @UseGuards(AccessGuard)
  @ApiBearerAuth()
  @Get()
  @ApiOperation({ summary: 'Fetch Additional Documents Table Data' })
  @ApiResponse({
    status: 200,
    description: 'Success: Fetch Additional Documents Table Data',
    type: AdditionalDocumentsTb200Dto
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
  fetchTableAdditionalDocumentDetails(
    @Query() query: AdditionalDocumentsTbDto
  ) {
    return this.additionalDocumentsTbService.fetchTableAdditionalDocumentDetails(
      query
    );
  }

  @Accesses('HR_ADMIN', 'HR_USER')
  @UseGuards(AccessGuard)
  @Get('fetch-tsg-documents')
  @ApiOperation({ summary: 'Fetch TSG Documents' })
  @ApiResponse({
    status: 200,
    description: 'Success: Fetch TSG Documents',
    type: FetchTsgDocuments200Dto
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
  async fetchTsgDocuments(@Query('tspId') tspId: number) {
    return await this.additionalDocumentsTbService.fetchTsgDocuments(tspId);
  }

  @Accesses('HR_ADMIN', 'HR_USER')
  @UseGuards(AccessGuard)
  @Get('fetch-user-documents')
  @ApiOperation({ summary: 'Fetch User Documents' })
  @ApiResponse({
    status: 200,
    description: 'Success: Fetch User Documents',
    type: FetchUserDocuments200Dto
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
  async fetchUserDocuments(@Query('tspId') tspId: number) {
    return await this.additionalDocumentsTbService.fetchUserDocuments(+tspId);
  }

  @Accesses('HR_ADMIN', 'HR_USER')
  @UseGuards(AccessGuard)
  @Post('/submit-tsg-documents')
  @ApiOperation({ summary: 'Admin: Submit TSG Documents' })
  @ApiBody({ type: SubmitTsgDocumentsDto })
  @ApiResponse({
    status: 201,
    description: 'Success: Admin: Submit TSG Documents',
    type: SubmitTsgDocuments200Dto
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
  async submitTsgDocuments(
    @Request() req,
    @Body() body: SubmitTsgDocumentsDto
  ) {
    return this.additionalDocumentsTbService.submitTsgDocuments(
      req.user.userId,
      body
    );
  }

  @Accesses('HR_ADMIN', 'HR_USER')
  @UseGuards(AccessGuard)
  @Post('/delete-tsg-document')
  @ApiOperation({ summary: 'Admin: Delete Tsg Document' })
  @ApiBody({ type: DeleteTsgDocumentDto })
  @ApiResponse({
    status: 201,
    description: 'Success: Admin: Delete TSG Document',
    type: DeleteTsgDocument200Dto
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
  async deleteTsgDocument(@Request() req, @Body() data: DeleteTsgDocumentDto) {
    return this.additionalDocumentsTbService.deleteTsgDocument(data);
  }

  @Accesses('HR_ADMIN', 'HR_USER')
  @UseGuards(AccessGuard)
  @Post('/submit-common-resources')
  @ApiOperation({ summary: 'Admin: Submit Common Resources' })
  @ApiBody({ type: SubmitCommonResourcesDto })
  @ApiResponse({
    status: 201,
    description: 'Success: Admin:  Submit Common Resources',
    type: SubmitCommonResources200Dto
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
  async submitCommonResources(
    @Request() req,
    @Body() body: SubmitCommonResourcesDto
  ) {
    return this.additionalDocumentsTbService.submitCommonResources(
      req.user.userId,
      body
    );
  }

  @Accesses('HR_ADMIN', 'HR_USER')
  @UseGuards(AccessGuard)
  @Post('/delete-common-resource')
  @ApiOperation({ summary: 'Admin: Delete Common Resource' })
  @ApiBody({ type: DeleteCommonResourceDto })
  @ApiResponse({
    status: 201,
    description: 'Success: Admin: Delete Common Resource',
    type: DeleteCommonResource200Dto
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
  async deleteCommonResource(
    @Request() req,
    @Body() data: DeleteCommonResourceDto
  ) {
    return this.additionalDocumentsTbService.deleteCommonResource(data);
  }

  @Accesses('HR_ADMIN', 'HR_USER')
  @UseGuards(AccessGuard)
  @ApiBearerAuth()
  @Get('/fetch-common-resources')
  @ApiOperation({ summary: 'Admin: Fetch Common Resource Documents' })
  @ApiResponse({
    status: 200,
    description: 'Success: Admin: Fetch Common Resource Documents',
    type: FetchCommonResources200Dto
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
  async fetchCommonResources() {
    return this.additionalDocumentsTbService.fetchCommonResources();
  }

  @Accesses('HR_ADMIN', 'HR_USER')
  @UseGuards(AccessGuard)
  @Post('/assign-common-resources')
  @ApiOperation({ summary: 'Admin: Assign Common Resources' })
  @ApiBody({ type: AssignCommonResourcesDto })
  @ApiResponse({
    status: 201,
    description: 'Success: Admin: Assign Common Resources',
    type: AssignCommonResources200Dto
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
  async assignCommonResources(
    @Request() req,
    @Body() body: AssignCommonResourcesDto
  ) {
    return this.additionalDocumentsTbService.assignCommonResources(
      req.user.userId,
      body
    );
  }
}
