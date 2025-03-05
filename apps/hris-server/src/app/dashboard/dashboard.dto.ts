import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class TutorSubmitProfile200Dto {}

export class GetProfileSubmitStatus200Dto {
  @ApiProperty({
    example: {
      success: true
    }
  })
  data: object;
}

export class GetProfileStatus200Dto {
  @ApiProperty({
    example: {
      success: true,
      profileStatus: 'initial audit fail'
    }
  })
  data: object;
}

export class DashboardAssignedCandidatesDto {
  @IsNumber()
  @ApiProperty({
    required: false,
    type: Number,
    description: 'auditorId',
    example: 2
  })
  auditorId: number;

  @IsString()
  @ApiProperty({
    required: false,
    type: String,
    description: 'startDate',
    example: '2023-10-12'
  })
  startDate: string;

  @IsString()
  @ApiProperty({
    required: false,
    type: String,
    description: 'endDate',
    example: '2023-10-22'
  })
  endDate: string;
}

export class DashboardAssignedCandidates200Dto {
  @ApiProperty({
    type: [],
    example: []
  })
  data: any[];
}

