import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateEducationDto {
  @ApiProperty({
    type: 'string',
    example: 'Pass'
  })
  @IsString()
  olState: string;

  @ApiProperty({
    type: 'string',
    example: 'Srilankan'
  })
  @IsString()
  olSyllabus?: string;

  @ApiProperty({
    type: 'string',
    example: 'A'
  })
  @IsString()
  olMaths?: string;

  @ApiProperty({
    type: 'string',
    example: 'NS001'
  })
  @IsString()
  @IsOptional()
  candidateId?: string;

  @ApiProperty({
    type: 'string',
    example: 'B'
  })
  @IsString()
  olEnglish?: string;

  @ApiProperty({
    type: 'string',
    example: 'Maths'
  })
  @IsString()
  alSyllabus: string;

  @ApiProperty({
    type: 'string',
    example: 'B'
  })
  @IsString()
  alEnglish?: string;

  @ApiProperty({
    type: 'string',
    example: 'None'
  })
  @IsString()
  other?: string;
}

export class Geteducation200Dto {
  @ApiProperty({
    type: 'boolean',
    example: true
  })
  success: boolean;

  @ApiProperty({
    type: 'string',
    examples: ['secondary', 'tertiary'],
    example: 'tertiary'
  })
  status: string;

  @ApiProperty({
    type: 'string',
    example: 'null'
  })
  'error': string;
}

export class submiteducation400Dto {
  @ApiProperty({
    type: 'number',
    example: 400
  })
  statusCode: number;

  @ApiProperty({
    type: 'string',
    example: 'Unexpected token , in JSON at position 16'
  })
  messages: string[];

  @ApiProperty({
    type: 'string',
    example: 'Bad Request'
  })
  'error': string;
}

export class submiteducation401Dto {
  @ApiProperty({
    type: 'number',
    example: 401
  })
  statusCode: number;

  @ApiProperty({
    type: 'string',
    example: 'Unauthorized'
  })
  'message': string;
}

export class submiteducation201Dto {
  @ApiProperty({
    type: 'number',
    example: 201
  })
  statusCode: number;

  @ApiProperty({
    type: Boolean,
    example: true
  })
  'success': string;

  @ApiProperty({
    type: Boolean,
    example: false
  })
  'result': string;
}

// {
//   "success": true,
//   "details": {
//     "tsp_id": 3,
//     "ol_status": "Pass",
//     "ol_syllabus": "Srilankan",
//     "ol_maths": "A",
//     "ol_english": "B",
//     "al_syllabus": "Maths",
//     "al_subject1": "English",
//     "al_subject1_result": "A",
//     "other": "None"
//   },
//   "result": false
// }
export class CreateEducation400Dto {
  @ApiProperty({
    type: 'number',
    example: 401
  })
  statusCode: number;

  @ApiProperty({
    type: 'string',
    example: 'Unauthorized'
  })
  'message': string;
}
