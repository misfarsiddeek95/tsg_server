import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Controller, Get, UseGuards, Query } from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';

import { DocumentMasterDto, DocumentMaster200Dto } from './documentMaster.dto';
import { DocumentMasterService } from './document-master.service';
import { BadRequest400Dto, UnauthorizedDto, Forbidden403Dto } from '../app.dto';
import { Accesses, AccessGuard } from '../auth/access.guard';

@UseGuards(JwtAuthGuard)
@ApiTags('HRIS Table: Document Master')
@Controller('hris-document-master')
export class DocumentMasterController {
  constructor(private DocumentMasterService: DocumentMasterService) {}

  @Accesses('HR_ADMIN', 'HR_USER')
  @UseGuards(AccessGuard)
  @ApiBearerAuth()
  @Get()
  @ApiOperation({ summary: 'Fetch Document Master Table Data' })
  @ApiResponse({
    status: 200,
    description: 'Success: Fetch Document Master Table Data',
    type: DocumentMaster200Dto
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
  fetchTableDocumentMaster(@Query() query: DocumentMasterDto) {
    return this.DocumentMasterService.fetchTableDocumentMaster(query);
  }
}
