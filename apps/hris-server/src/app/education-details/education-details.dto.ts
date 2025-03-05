import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class FetchEducationDetailsDto {
  @ApiProperty({
    example: {
      olState: null,
      olSyllabus: 'London',
      olSyllabusStatus: '',
      olSyllabusRejectReason: '',
      olYear: 2013,
      olYearStatus: '',
      olYearRejectReason: 'ffffff',
      olMaths: 'A',
      olMathsStatus: '',
      olMathsRejectReason: 'fffff',
      olEnglish: 'A',
      olEnglishStatus: '',
      olEnglishRejectReason: '',
      olCertificateUrl: '/4.jpeg',
      olCertificateUrlStatus: '',
      olCertificateUrlRejectReason: 'dsdds',
      alCheck: 'Yes',
      alSyllabus: 'Local',
      alSyllabusStatus: '',
      alSyllabusRejectReason: 'dd1',
      alYear: 2016,
      alYearStatus: '',
      alYearRejectReason: '2',
      alStream: 'Commerce',
      alStreamStatus: '',
      alStreamRejectReason: 'ss3',
      alCertificateUrl: '',
      alCertificateUrlStatus: '',
      alCertificateUrlRejectReason: '',
      alSubject1: 'Business Studies',
      alSubject1Status: '',
      alSubject1RejectReason: 'ss4',
      alSubject1Result: 'B',
      alSubject2: 'Chinese',
      alSubject2Status: '',
      alSubject2RejectReason: 'ss6',
      alSubject2Result: 'C',
      alSubject3: 'Political Science',
      alSubject3Status: '',
      alSubject3RejectReason: 'ss5',
      alSubject3Result: 'A',
      alSubject4: 'Christianity',
      alSubject4Status: '',
      alSubject4RejectReason: 'ssas',
      alSubject4Result: 'B',
      alSubject5: 'Combined Mathematics',
      alSubject5Status: '',
      alSubject5RejectReason: '',
      alSubject5Result: 'A'
    }
  })
  details: object;

  @ApiProperty({
    example: {
      olState: null,
      olSyllabus: 'London',
      olYear: 2013,
      olMaths: 'A',
      olEnglish: 'A*',
      olCertificateUrl: '/4.jpeg',
      alSyllabus: 'London',
      alYear: 2015,
      alStream: 'Biological Science',
      alCertificateUrl: '',
      alSubject1: 'Bio Resource Technology',
      alSubject1Result: 'B',
      alSubject2: 'Chemistry',
      alSubject2Result: 'C',
      alSubject3: 'Physics',
      alSubject3Result: 'A',
      alSubject4: 'Christian Civilization',
      alSubject4Result: 'B',
      alSubject5: 'Chemistry',
      alSubject5Result: 'A',
      alCheck: 'Yes',
      other: null
    }
  })
  approvedDetails: object;
}

export class FetchDetailsOkDto {
  @ApiProperty({
    type: 'boolean',
    example: true
  })
  success: boolean;

  @ApiProperty({
    type: () => FetchDetailsOkDto
  })
  data: FetchDetailsOkDto;
}

export class SubmitEducationDetailsDto {
  @ApiProperty({
    type: String,
    example: 'candidate'
  })
  @IsOptional()
  @IsString()
  type: string;

  @ApiProperty({
    type: String,
    example: 'Sri Lanka'
  })
  @IsOptional()
  @IsString()
  country: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Profile Status',
    example: 'active'
  })
  profileStatus: string;

  @ApiProperty({
    type: Number,
    description: 'id',
    example: 2
  })
  id: number;

  @ApiProperty({
    type: String,
    description: 'ol State',
    example: 'Completed'
  })
  @IsOptional()
  @IsString()
  olState: string;

  @ApiProperty({
    type: String,
    description: 'ol Syllabus',
    example: 'London'
  })
  @IsOptional()
  @IsString()
  olSyllabus: string;

  @ApiProperty({
    type: String,
    description: 'ol Syllabus Status',
    example: 'approved'
  })
  @IsOptional()
  @IsString()
  olSyllabusStatus: string;

  @ApiProperty({
    type: String,
    description: 'ol Syllabus Reject Reason',
    example: ''
  })
  @IsOptional()
  @IsString()
  olSyllabusRejectReason: string;

  @ApiProperty({
    type: Number,
    description: 'ol Year',
    example: '2017'
  })
  @IsOptional()
  @IsNumber()
  olYear: number;

  @ApiProperty({
    type: String,
    description: 'ol Year Status',
    example: 'approved'
  })
  @IsOptional()
  @IsString()
  olYearStatus: string;

  @ApiProperty({
    type: String,
    description: 'ol Year Reject Reason',
    example: ''
  })
  @IsOptional()
  @IsString()
  olYearRejectReason: string;

  @ApiProperty({
    type: String,
    description: 'ol Maths',
    example: 'A'
  })
  @IsOptional()
  @IsString()
  olMaths: string;

  @ApiProperty({
    type: String,
    description: 'ol Maths Status',
    example: 'pending'
  })
  @IsOptional()
  @IsString()
  olMathsStatus: string;

  @ApiProperty({
    type: String,
    description: 'ol Maths Reject Reason',
    example: ''
  })
  @IsOptional()
  @IsString()
  olMathsRejectReason: string;

  @ApiProperty({
    type: String,
    description: 'ol English',
    example: 'A*'
  })
  @IsOptional()
  @IsString()
  olEnglish: string;

  @ApiProperty({
    type: String,
    description: 'ol English Status',
    example: 'pending'
  })
  @IsOptional()
  @IsString()
  olEnglishStatus: string;

  @ApiProperty({
    type: String,
    description: 'ol English Reject Reason',
    example: ''
  })
  @IsOptional()
  @IsString()
  olEnglishRejectReason: string;

  @ApiProperty({
    type: String,
    description: 'ol Certificate Url',
    example: '/67/education_details/1692684357168_____work$ex1.jpeg'
  })
  @IsOptional()
  @IsString()
  olCertificateUrl: string;

  @ApiProperty({
    type: String,
    description: 'ol Certificate Url Status',
    example: 'pending'
  })
  @IsOptional()
  @IsString()
  olCertificateUrlStatus: string;

  @ApiProperty({
    type: String,
    description: 'ol Certificate Url Reject Reason',
    example: ''
  })
  @IsOptional()
  @IsString()
  olCertificateUrlRejectReason: string;

  @ApiProperty({
    type: String,
    description: 'al Syllabus',
    example: 'London'
  })
  @IsOptional()
  @IsString()
  alSyllabus: string;

  @ApiProperty({
    type: String,
    description: 'al Syllabus Status',
    example: 'pending'
  })
  @IsOptional()
  @IsString()
  alSyllabusStatus: string;

  @ApiProperty({
    type: String,
    description: 'al Syllabus Reject Reason',
    example: ''
  })
  @IsOptional()
  @IsString()
  alSyllabusRejectReason: string;

  @ApiProperty({
    type: Number,
    description: 'al Year',
    example: '2019'
  })
  @IsOptional()
  @IsNumber()
  alYear: number;

  @ApiProperty({
    type: String,
    description: 'al Year Status',
    example: 'pending'
  })
  @IsOptional()
  @IsString()
  alYearStatus: string;

  @ApiProperty({
    type: String,
    description: 'al Year Reject Reason',
    example: ''
  })
  @IsOptional()
  @IsString()
  alYearRejectReason: string;

  @ApiProperty({
    type: String,
    description: 'al Stream',
    example: 'Arts'
  })
  @IsOptional()
  @IsString()
  alStream: string;

  @ApiProperty({
    type: String,
    description: 'al Stream Status',
    example: 'pending'
  })
  @IsOptional()
  @IsString()
  alStreamStatus: string;

  @ApiProperty({
    type: String,
    description: 'al Stream Reject Reason',
    example: ''
  })
  @IsOptional()
  @IsString()
  alStreamRejectReason: string;

  @ApiProperty({
    type: String,
    description: 'al Certificate Url',
    example: '/67/education_details/1692684357180_____work ex2.jpeg'
  })
  @IsOptional()
  @IsString()
  alCertificateUrl: string;

  @ApiProperty({
    type: String,
    description: 'al Certificate Url Status',
    example: 'pending'
  })
  @IsOptional()
  @IsString()
  alCertificateUrlStatus: string;

  @ApiProperty({
    type: String,
    description: 'al Certificate Url Reject Reason',
    example: ''
  })
  @IsOptional()
  @IsString()
  alCertificateUrlRejectReason: string;

  @ApiProperty({
    type: String,
    description: 'al Subject 1',
    example: 'Buddhism'
  })
  @IsOptional()
  @IsString()
  alSubject1: string;

  @ApiProperty({
    type: String,
    description: 'al Subject 1 Status',
    example: 'pending'
  })
  @IsOptional()
  @IsString()
  alSubject1Status: string;

  @ApiProperty({
    type: String,
    description: 'al Subject 1 Reject Reason',
    example: ''
  })
  @IsOptional()
  @IsString()
  alSubject1RejectReason: string;

  @ApiProperty({
    type: String,
    description: 'al Subject 1 Result',
    example: 'B'
  })
  @IsOptional()
  @IsString()
  alSubject1Result: string;

  @ApiProperty({
    type: String,
    description: 'al Subject 2',
    example: 'Agriculture Technology'
  })
  @IsOptional()
  @IsString()
  alSubject2: string;

  @ApiProperty({
    type: String,
    description: 'al Subject 2 Status',
    example: 'pending'
  })
  @IsOptional()
  @IsString()
  alSubject2Status: string;

  @ApiProperty({
    type: String,
    description: 'al Subject 2 Reject Reason',
    example: ''
  })
  @IsOptional()
  @IsString()
  alSubject2RejectReason: string;

  @ApiProperty({
    type: String,
    description: 'al Subject 2 Result',
    example: 'A'
  })
  @IsOptional()
  @IsString()
  alSubject2Result: string;

  @ApiProperty({
    type: String,
    description: 'al Subject 3',
    example: 'History of Sri Lanka'
  })
  @IsOptional()
  @IsString()
  alSubject3: string;

  @ApiProperty({
    type: String,
    description: 'al Subject 3 Status',
    example: 'pending'
  })
  @IsOptional()
  @IsString()
  alSubject3Status: string;

  @ApiProperty({
    type: String,
    description: 'al Subject 3 Reject Reason',
    example: ''
  })
  @IsOptional()
  @IsString()
  alSubject3RejectReason: string;

  @ApiProperty({
    type: String,
    description: 'al Subject 3 Result',
    example: 'B'
  })
  @IsOptional()
  @IsString()
  alSubject3Result: string;

  @ApiProperty({
    type: String,
    description: 'al Subject 4',
    example: 'History of India - Paper II'
  })
  @IsOptional()
  @IsString()
  alSubject4: string;

  @ApiProperty({
    type: String,
    description: 'al Subject 4 Status',
    example: 'pending'
  })
  @IsOptional()
  @IsString()
  alSubject4Status: string;

  @ApiProperty({
    type: String,
    description: 'al Subject 4 Reject Reason',
    example: ''
  })
  @IsOptional()
  @IsString()
  alSubject4RejectReason: string;

  @ApiProperty({
    type: String,
    description: 'al Subject 4 Result',
    example: 'C'
  })
  @IsOptional()
  @IsString()
  alSubject4Result: string;

  @ApiProperty({
    type: String,
    description: 'al Subject 5',
    example: 'Sanskrit'
  })
  @IsOptional()
  @IsString()
  alSubject5: string;

  @ApiProperty({
    type: String,
    description: 'al Subject 5 Status',
    example: 'pending'
  })
  @IsOptional()
  @IsString()
  alSubject5Status: string;

  @ApiProperty({
    type: String,
    description: 'al Subject 5 Reject Reason',
    example: ''
  })
  @IsOptional()
  @IsString()
  alSubject5RejectReason: string;

  @ApiProperty({
    type: String,
    description: 'al Subject 5 Result',
    example: 'A'
  })
  @IsOptional()
  @IsString()
  alSubject5Result: string;
}

export class EducationDetails200Response {
  @ApiProperty({
    example: {
      olState: null,
      olSyllabus: 'Local',
      olSyllabusStatus: 'pending',
      olSyllabusRejectReason: '',
      olYear: 2014,
      olYearStatus: 'pending',
      olYearRejectReason: 'ffffff',
      olMaths: 'A*',
      olMathsStatus: 'pending',
      olMathsRejectReason: 'fffff',
      olEnglish: 'A',
      olEnglishStatus: '',
      olEnglishRejectReason: '',
      olCertificateUrl: '/4.jpeg',
      olCertificateUrlStatus: '',
      olCertificateUrlRejectReason: 'dsdds',
      alCheck: 'Yes',
      alSyllabus: 'Local',
      alSyllabusStatus: '',
      alSyllabusRejectReason: 'dd1',
      alYear: 2016,
      alYearStatus: '',
      alYearRejectReason: '2',
      alStream: 'Arts',
      alStreamStatus: 'pending',
      alStreamRejectReason: 'ss3',
      alCertificateUrl: '',
      alCertificateUrlStatus: '',
      alCertificateUrlRejectReason: '',
      alSubject1: 'Buddhist Civilization',
      alSubject1Status: 'pending',
      alSubject1RejectReason: 'ss4',
      alSubject1Result: 'B',
      alSubject2: 'Chinese',
      alSubject2Status: '',
      alSubject2RejectReason: 'ss6',
      alSubject2Result: 'C',
      alSubject3: 'Political Science',
      alSubject3Status: '',
      alSubject3RejectReason: 'ss5',
      alSubject3Result: 'A',
      alSubject4: 'Christianity',
      alSubject4Status: '',
      alSubject4RejectReason: 'ssas',
      alSubject4Result: 'B',
      alSubject5: 'Combined Mathematics',
      alSubject5Status: '',
      alSubject5RejectReason: '',
      alSubject5Result: 'A'
    }
  })
  data: object;
}
export class AuditorEducationSubmitDetailsDto extends SubmitEducationDetailsDto {
  @IsNumber()
  candidateId: number;
}
export class AuditorEducationDetails200Response {
  @ApiProperty({
    example: {
      olState: null,
      olSyllabus: 'Local',
      olSyllabusStatus: 'approved',
      olSyllabusRejectReason: '',
      olYear: 2014,
      olYearStatus: 'approved',
      olYearRejectReason: '',
      olMaths: 'A*',
      olMathsStatus: 'pending',
      olMathsRejectReason: 'fffff',
      olEnglish: 'A',
      olEnglishStatus: '',
      olEnglishRejectReason: '',
      olCertificateUrl: '/4.jpeg',
      olCertificateUrlStatus: '',
      olCertificateUrlRejectReason: 'dsdds',
      alCheck: 'Yes',
      alSyllabus: 'Local',
      alSyllabusStatus: 'approved',
      alSyllabusRejectReason: '',
      alYear: 2016,
      alYearStatus: 'approved',
      alYearRejectReason: '',
      alStream: 'Arts',
      alStreamStatus: 'pending',
      alStreamRejectReason: 'ss3',
      alCertificateUrl: '',
      alCertificateUrlStatus: '',
      alCertificateUrlRejectReason: '',
      alSubject1: 'Buddhist Civilization',
      alSubject1Status: 'approved',
      alSubject1RejectReason: '',
      alSubject1Result: 'B',
      alSubject2: 'Chinese',
      alSubject2Status: '',
      alSubject2RejectReason: 'ss6',
      alSubject2Result: 'C',
      alSubject3: 'Political Science',
      alSubject3Status: 'approved',
      alSubject3RejectReason: '',
      alSubject3Result: 'A',
      alSubject4: 'Christianity',
      alSubject4Status: '',
      alSubject4RejectReason: 'ssas',
      alSubject4Result: 'B',
      alSubject5: 'Combined Mathematics',
      alSubject5Status: '',
      alSubject5RejectReason: '',
      alSubject5Result: 'A'
    }
  })
  details: object;

  @ApiProperty({
    example: {
      olState: null,
      olSyllabus: 'Local',
      olYear: 2014,
      olMaths: 'A',
      olEnglish: 'A*',
      olCertificateUrl: '/4.jpeg',
      alSyllabus: 'Local',
      alYear: 2016,
      alStream: 'Biological Science',
      alCertificateUrl: '',
      alSubject1: 'Buddhist Civilization',
      alSubject1Result: 'B',
      alSubject2: 'Chemistry',
      alSubject2Result: 'C',
      alSubject3: 'Political Science',
      alSubject3Result: 'A',
      alSubject4: 'Christian Civilization',
      alSubject4Result: 'B',
      alSubject5: 'Chemistry',
      alSubject5Result: 'A',
      alCheck: 'Yes',
      other: null
    }
  })
  approvedDetails: object;
}
