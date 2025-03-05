import { IsString } from 'class-validator';

export class NonTutorDashboardDto {
  @IsString()
  startDate: string;

  @IsString()
  endDate: string;
}
