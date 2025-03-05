import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';

export class ExamSubmitMainDto {
  @ApiProperty({
    type: 'string',
    example: '21'
  })
  @IsNotEmpty()
  @IsString()
  examId: string;

  @ApiProperty({
    type: 'string',
    example: 'Maths Exam'
  })
  @IsNotEmpty()
  @IsString()
  examName: string;

  @ApiProperty({
    type: 'string',
    example: 'MCQ'
  })
  @IsNotEmpty()
  @IsString()
  examType: string;

  @ApiProperty({
    type: 'boolean',
    example: true
  })
  @IsNotEmpty()
  activeStatus: boolean;
}

export class ExamSubmit201Dto {
  @ApiProperty({
    type: 'boolean',
    example: true
  })
  status: boolean;

  @ApiProperty({
    example: {
      id: '5',
      examId: '01',
      examName: 'Maths',
      examType: 'MSQ',
      activeStatus: true,
      created_at: '2022-11-09T08:28:50.115Z',
      updated_t: '2022-11-09T08:28:50.115Z',
      updated_by: null
    }
  })
  data: ExamSubmitMainDto;
}

export class ExamAll200Dto {
  @ApiProperty({
    type: 'boolean',
    example: true
  })
  status: boolean;

  @ApiProperty({
    example: [
      {
        id: '5',
        examId: '01',
        examName: 'Maths',
        examType: 'MSQ',
        activeStatus: true,
        created_at: '2022-11-09T08:28:50.115Z',
        updated_t: '2022-11-09T08:28:50.115Z',
        updated_by: null
      },
      {
        id: '6',
        examId: '11',
        examName: 'Maths',
        examType: 'MSQ',
        activeStatus: true,
        created_at: '2022-11-09T08:28:50.115Z',
        updated_t: '2022-11-09T08:28:50.115Z',
        updated_by: null
      },
      {
        id: '8',
        examId: '21',
        examName: 'Maths',
        examType: 'MSQ',
        activeStatus: true,
        created_at: '2022-11-09T08:28:50.115Z',
        updated_t: '2022-11-09T08:28:50.115Z',
        updated_by: null
      }
    ]
  })
  data: ExamSubmitMainDto;
}

export class Exam400Dto {
  @ApiProperty({
    type: 'number',
    example: 400
  })
  statusCode: number;

  @ApiProperty({
    type: 'string',
    example: 'Unexpected token : in JSON at position 47'
  })
  message: string;

  @ApiProperty({
    type: 'string',
    example: 'Bad Request'
  })
  error: string;
}

export class ExamSubmitDetailsDto {
  @ApiProperty({
    type: 'string',
    example: 'Abdalla'
  })
  @IsString()
  @IsOptional()
  candidateName: string;

  @ApiProperty({
    type: 'number',
    example: '0765402153'
  })
  @IsString()
  @IsOptional()
  mobileNo: string;

  @ApiProperty({
    type: 'string',
    example: 'Abdalla@gmail.com'
  })
  @IsString()
  @IsOptional()
  email: string;

  @ApiProperty({
    type: 'number',
    example: 78
  })
  @IsNumber()
  @IsOptional()
  score: number;

  @ApiProperty({
    type: 'number',
    example: 2
  })
  @IsNumber()
  @IsOptional()
  take: number;

  @ApiProperty({
    type: 'number',
    example: 1
  })
  @IsNumber()
  @IsOptional()
  skip: number;

  @ApiProperty({
    type: 'number',
    example: 80
  })
  @IsNumber()
  @IsOptional()
  outcome: number;
}
// function ApiPropert(arg0: {}) {
//   throw new Error('Function not implemented.');
// }

export class CandidateExam201Dto {
  @ApiProperty({
    type: 'boolean',
    example: true
  })
  success: boolean;

  @ApiProperty({
    type: 'string',
    example: '[]'
  })
  data: string;

  @ApiProperty({
    type: 'number',
    example: 0
  })
  count: number;
}

export class GetExamById201Dto {
  @ApiProperty({
    type: 'boolean',
    example: true
  })
  status: boolean;

  @ApiProperty({
    example: {
      id: '5',
      examId: '01',
      examName: 'Maths',
      examType: 'MSQ',
      activeStatus: true,
      created_at: '2022-11-09T08:28:50.115Z',
      updated_t: '2022-11-09T08:28:50.115Z',
      updated_by: null
    }
  })
  data: ExamSubmitMainDto;
}

export class GetExamStatus200Dto {
  @ApiProperty({
    type: 'boolean',
    example: true
  })
  status: boolean;

  @ApiProperty({
    type: 'string',
    example: 'null'
  })
  data: string;
}

export class GetExamByFlexiQuizId201Dto {
  @ApiProperty({
    type: 'boolean',
    example: true
  })
  status: boolean;

  @ApiProperty({
    example: {
      id: '5',
      examId: '01',
      examName: 'Maths',
      examType: 'MSQ',
      activeStatus: true,
      created_at: '2022-11-09T08:28:50.115Z',
      updated_t: '2022-11-09T08:28:50.115Z',
      updated_by: null
    }
  })
  data: ExamSubmitMainDto;
}

export class AssignForUser200Dto {
  @ApiProperty({
    type: 'boolean',
    example: true
  })
  status: boolean;

  @ApiProperty({
    type: 'string',
    example: '[]'
  })
  data: string;
}

export class Automaticassign201Dto {
  @ApiProperty({
    type: 'boolean',
    example: true
  })
  status: boolean;

  @ApiProperty({
    example: {
      tspId: 1234,
      activeStatus: true,
      examId: '01',
      candidateId: '002',
      examStatus: '4'
    }
  })
  data: ExamSubmitMainDto;
}

export class Manualyassign201Dto {
  @ApiProperty({
    type: 'boolean',
    example: true
  })
  status: boolean;

  @ApiProperty({
    example: {
      tspId: 1234,
      examId: '01',
      candidateId: '002'
    }
  })
  data: ExamSubmitMainDto;
}

export class UserExamResults200Dto {}

export class UserExamResults404Dto {}

export class UserExamResults401Dto {}

export class UserExamResultsDto {
  @ApiProperty({
    type: 'string',
    example: '0da8f8c5-0ed9-42f4-b4a2-cfb6948a2b8a'
  })
  @IsString()
  candidateExamId: string;
}
