import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested
} from 'class-validator';
import { Type } from 'class-transformer';

export class GroupsDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  weekday: number;

  @ApiProperty({ example: '11:30' })
  @IsString()
  @IsNotEmpty()
  timeslot: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  number_of_students: number;
}

export class DistributionRequestDto {
  @ApiProperty({ example: '2024-07-20' })
  @IsDateString()
  @IsNotEmpty()
  end_date: string;

  @ApiProperty({ example: 4627 })
  @IsNumber()
  @IsNotEmpty()
  school_id: number;

  @ApiProperty({
    example:
      'arn:aws:states:eu-west-1:267739230747:express:staging-api_block_create:9d7c2117-456f-4ac3-9cf7-66c2133f24d2:040837c9-f01e-45b9-98cb-ee965068a7ef'
  })
  @IsString()
  @IsNotEmpty()
  request_uuid: string;

  @ApiProperty({ example: 'primary' })
  @IsString()
  @IsNotEmpty()
  tutor_phase: string;

  @ApiProperty({ type: [GroupsDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GroupsDto)
  groups: GroupsDto[];

  @ApiProperty({ example: '3' })
  @IsString()
  @IsNotEmpty()
  supply_center_ids: string;

  @ApiProperty({ example: '2024-06-17' })
  @IsDateString()
  @IsNotEmpty()
  start_date: string;
}

export class BookedDetails {
  @IsString()
  @IsNotEmpty()
  reservation_uuid: string;

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true }) // Validates each item in the array
  @Type(() => Session) // Specifies the type for each array item
  sessions: Session[];
}
// {
//   "sessions": [
//     {
//       "date": "2025-01-27",
//       "session_to_end_at": "2025-01-27T11:45:00Z",
//       "tutor_id": 10,
//       "student_name": null,
//       "school_id": 792,
//       "session_planned_at": "2025-01-27T11:00:00Z",
//       "student_id": null,
//       "id": 1448297
//     }
//   ],
//   "reservation_uuid": "arn:aws:states:eu-west-1:267739230747:express:staging-api_block_create:7d7cb5bb-3152-4af6-b511-a359a2a610b0:e869017f-e14c-4677-ba56-74bf48174374"
// }
class Session {
  @IsNumber()
  @IsNotEmpty()
  id: number; // Session Id

  @IsNumber()
  @IsNotEmpty()
  tutor_id: number;

  @IsNumber()
  // @IsNotEmpty()
  student_id: number | null;

  @IsString()
  // @IsNotEmpty()
  student_name: string | null;

  @IsNumber()
  // @IsNotEmpty()
  school_id: number | null;

  @IsString()
  @IsNotEmpty()
  date: string; // Session Date

  @IsString()
  @IsNotEmpty()
  session_planned_at: string;

  @IsString()
  @IsNotEmpty()
  session_to_end_at: string;
  // "id": 1445882, // Session Id
  // "tutor_id": 20545,
  // "student_id": null,
  // "student_name": null,
  // "school_id": 4544,
  // "date": "2024-10-25", // Session Date
  // "session_planned_at": "2024-10-25T14:30:00Z",
  // "session_to_end_at": "2024-10-25T15:15:00Z",
}

export class LaunchedDetails {
  @IsNumber()
  @IsNotEmpty()
  booking_id: number; // booking_id

  @IsNumber()
  @IsNotEmpty()
  session_id: number; // Session Id

  @IsNumber()
  @IsNotEmpty()
  tutor_id: number;

  @IsNumber()
  @IsNotEmpty()
  student_id: number;

  @IsNumber()
  @IsNotEmpty()
  school_id: number;

  @IsString()
  @IsNotEmpty()
  session_planned_at: string;

  @IsString()
  @IsNotEmpty()
  session_to_end_at: string;
  // "booking_id":123456,
  // "session_id":1445882,
  // "tutor_id":20545,
  // "student_id":4321,
  // "school_id":4544,
  // "session_planned_at":"2024-10-25T14:30:00Z",
  // "session_to_end_at":"2024-10-25T15:15:00Z",
}
