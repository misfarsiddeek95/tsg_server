import { Controller, UseGuards, Get } from '@nestjs/common';
import { ValidationService } from '../services/validation.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { ApssEventValidationsResponseDto } from '../dtos/validation.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';
import { BadRequest400Dto, Unauthorized401Dto } from '../dtos/bad-request.dto';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('APSS Booking Validation Controller')
@Controller('user')
export class ValidationController {
  constructor(private validationService: ValidationService) {}

  @Get('/apss-event-validations')
  @ApiOperation({ summary: 'APSS: all: Fetch Event Validation Rules' })
  @ApiResponse({
    status: 200,
    description: 'Success: Fetch Event Validation Rules',
    type: ApssEventValidationsResponseDto
  })
  @ApiResponse({
    status: 400,
    description: 'Failed: Bad Request',
    type: BadRequest400Dto
  })
  @ApiResponse({
    status: 401,
    description: 'Failed: Unauthorized',
    type: Unauthorized401Dto
  })
  getEventValidations() {
    return this.validationService.apssEventValidations();
  }
}
