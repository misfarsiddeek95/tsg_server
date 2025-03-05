import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class AddNoteDto {
  @IsString()
  @ApiProperty({
    required: true,
    type: String,
    description: 'note content',
    example: '<p>notes test 3</p><p>ghdf</p>'
  })
  note: string;
}

export class AddNoteByAuditorDto extends AddNoteDto {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    required: true,
    type: Number,
    description: 'tspId of tutor',
    example: 2
  })
  candidateId: number;
}

export class AddNoteByAuditor200Dto {
  @ApiProperty({
    type: [],
    example: {
      success: true,
      data: {
        candidateShortName: 'C D',
        isCurrentAuditor: true,
        auditorShortName: 'Auditortwo Acc',
        auditorId: 17,
        candidateId: 21,
        id: 1,
        createdAt: '2023-12-22T06:10:12.000Z',
        text: '<p>notes test 3</p><p>ghdf</p>'
      }
    }
  })
  data: any[];
}

export class AuditorFetchNotes200Dto {
  @ApiProperty({
    type: [],
    example: {
      success: true,
      data: [
        {
          tutorStatus: 'initial audit fail',
          isCurrentAuditor: true,
          candidateShortName: 'C D',
          auditorShortName: 'Auditortwo Acc',
          auditorId: 17,
          candidateId: 21,
          id: 1,
          createdAt: '2023-12-22T06:10:12.000Z',
          text: '<p>notes test 3</p><p>ghdf</p>'
        },
        {
          tutorStatus: 'initial audit fail',
          isCurrentAuditor: true,
          candidateShortName: 'C D',
          auditorShortName: 'Auditortwo Acc',
          auditorId: 17,
          candidateId: 21,
          id: 2,
          createdAt: '2023-12-22T08:49:46.000Z',
          text: '<p><br></p>'
        }
      ]
    }
  })
  data: any[];
}

export class UpdateNoteDto {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    required: true,
    type: Number,
    description: 'id of note to edtit',
    example: 2
  })
  id: number;

  @IsString()
  @ApiProperty({
    required: true,
    type: String,
    description: 'note content',
    example: '<p>notes test 3</p><p>ghdf</p>'
  })
  note: string;
}

export class UpdateNote200Dto {
  @ApiProperty({
    type: [],
    example: {
      success: true,
      data: {
        candidateShortName: 'C D',
        isCurrentAuditor: true,
        auditorShortName: 'Auditortwo Acc',
        auditorId: 17,
        candidateId: 21,
        id: 1,
        createdAt: '2023-12-22T06:10:12.000Z',
        text: '<p>notes test 3</p><p>correction</p>'
      }
    }
  })
  data: any[];
}