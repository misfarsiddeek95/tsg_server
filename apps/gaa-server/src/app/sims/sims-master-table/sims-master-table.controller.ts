// Importing required modules from NestJS and the service
import {
  Controller,
  Post,
  Body,
  Delete,
  Get,
  Query,
  UseGuards,
  Request
} from '@nestjs/common';
import { SimsMasterTableService } from './sims-master-table.service';
import {
  CreateSimsMasterTableDto,
  DeleteSimsMasterTicketDto,
  TheHubTableDto,
  createTicket201ResponseDto,
  createTicket400ResponseDto,
  deleteTicket201ResponseDto,
  deleteTicket400ResponseDto,
  deleteTicket404ResponseDto,
  getTickets200ResponseDto,
  getTickets400ResponseDto,
  searchColabTicketIdSuggestion200ResponseDto,
  searchRelationshipManagerNameSuggestion200ResponseDto,
  searchTicketCreatorNameSuggestion200ResponseDto,
  searchTicketIdSuggestion200ResponseDto,
  searchTutorIdSuggestion200ResponseDto,
  searchTutorNameSuggestion200ResponseDto
} from './dto/create-sims-master-table.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';
@ApiTags('GAA SIMS Master Table Controller')
@Controller('sims-master-table')
export class SimsMasterTableController {
  // Constructor to inject SimsMasterTableService
  constructor(
    private readonly simsMasterTableService: SimsMasterTableService
  ) {}

  //Create Ticket
  @UseGuards(JwtAuthGuard)
  @Post('create-ticket')
  @ApiOperation({ summary: 'Create Ticket' })
  @ApiResponse({
    status: 201,
    type: createTicket201ResponseDto
  })
  @ApiResponse({
    status: 400,
    type: createTicket400ResponseDto
  })
  async createTicket(
    @Body() createSimsMasterTableDto: CreateSimsMasterTableDto
  ) {
    return this.simsMasterTableService.createTicketService(
      createSimsMasterTableDto
    );
  }

  //Delete Ticket
  @UseGuards(JwtAuthGuard)
  @Delete('delete-ticket')
  @ApiOperation({ summary: 'Delete Ticket' })
  @ApiResponse({
    status: 201,
    type: deleteTicket201ResponseDto
  })
  @ApiResponse({
    status: 400,
    type: deleteTicket400ResponseDto
  })
  @ApiResponse({
    status: 404,
    type: deleteTicket404ResponseDto
  })
  async deleteTicket(
    @Body() deleteSimsMasterTicketDto: DeleteSimsMasterTicketDto
  ) {
    return this.simsMasterTableService.deleteTicketService(
      deleteSimsMasterTicketDto
    );
  }

  //Get Table Data with JWTAuthGuard
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('/get-the-hub-table-data')
  @ApiOperation({ summary: 'Get SIMS Tickets' })
  @ApiResponse({
    status: 201,
    type: getTickets200ResponseDto
  })
  @ApiResponse({
    status: 400,
    type: getTickets400ResponseDto
  })
  getInvoiceTableData(@Request() req, @Body() theHubTableDto: TheHubTableDto) {
    return this.simsMasterTableService.getTheHubTableData(
      theHubTableDto,
      req.user
    );
  }

  // Search Tutor Name
  @UseGuards(JwtAuthGuard)
  @Get('search-tutor-name')
  @ApiOperation({ summary: 'Tutor Name Search Suggestion' })
  @ApiResponse({
    status: 201,
    type: searchTutorNameSuggestion200ResponseDto
  })
  async tutorNameFilter(@Query('tutorName') tutorName: string) {
    return await this.simsMasterTableService.tutorNameFilterService(tutorName);
  }

  // Search Tutor Id
  @UseGuards(JwtAuthGuard)
  @Get('search-tutor-id')
  @ApiOperation({ summary: 'Tutor Id Search Suggestion' })
  @ApiResponse({
    status: 201,
    type: searchTutorIdSuggestion200ResponseDto
  })
  async tutorIdFilter(@Query('tutorId') tutorId: number) {
    return await this.simsMasterTableService.tutorIdFilterService(tutorId);
  }

  // Search Ticket Id
  @UseGuards(JwtAuthGuard)
  @Get('search-ticket-id')
  @ApiOperation({ summary: 'Ticket Id Search Suggestion' })
  @ApiResponse({
    status: 201,
    type: searchTicketIdSuggestion200ResponseDto
  })
  async ticketIdFilter(@Query('ticketId') ticketId: string) {
    return await this.simsMasterTableService.ticketIdFilterService(ticketId);
  }

  // Get Colab Ticket Ids with JWTAuthGuard
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('get-colab-ticket-ids')
  @ApiOperation({ summary: 'Colab Ticket Ids Search Suggestion' })
  @ApiResponse({
    status: 201,
    type: searchColabTicketIdSuggestion200ResponseDto
  })
  async getColabTicketIds(@Request() req) {
    return await this.simsMasterTableService.getColabTicketIdsService(req.user);
  }

  // Search Relationship Manager Name
  @UseGuards(JwtAuthGuard)
  @Get('relationship-manager-name')
  @ApiOperation({ summary: 'Relationship Manager Name Search Suggestion' })
  @ApiResponse({
    status: 201,
    type: searchRelationshipManagerNameSuggestion200ResponseDto
  })
  async relationshipManagerNameFilter(
    @Query('relationshipManagerName') relationshipManagerName: string
  ) {
    return await this.simsMasterTableService.relationshipManagerNameService(
      relationshipManagerName
    );
  }

  // Search Ticket Creator Name
  @UseGuards(JwtAuthGuard)
  @Get('search-ticket-creator-name')
  @ApiOperation({ summary: 'Ticket Creator Name Search Suggestion' })
  @ApiResponse({
    status: 201,
    type: searchTicketCreatorNameSuggestion200ResponseDto
  })
  async ticketCreatorFilter(@Query('raisedBy') raisedBy: string) {
    return await this.simsMasterTableService.ticketCreatorFilterService(
      raisedBy
    );
  }

  // Get Email Details with JWTAuthGuard
  // @UseGuards(JwtAuthGuard)
  // @Post('get-email-details')
  // getEmailDetails(@Request() req, @Body() ticketId: any) {
  //   return this.simsMasterTableService.getEmailDetailsService(
  //     ticketId,
  //     req.user
  //   );
  // }
}
