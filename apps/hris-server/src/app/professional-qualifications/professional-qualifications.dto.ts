import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
  IsString,
  IsArray,
  IsBoolean,
  ValidateNested,
  ValidateIf
} from 'class-validator';

export class SubmitEducationalQualificationsDto {
  @IsOptional()
  @IsNumber()
  @ApiProperty({
    type: Number,
    description: 'id',
    example: 7
  })
  id: number;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'type',
    example: 'candidate'
  })
  type: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'country',
    example: 'Sri Lanka'
  })
  country: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Profile Status',
    example: 'active'
  })
  profileStatus: string;

  @IsArray()
  @ValidateNested()
  @Type(() => XotherQualiData)
  xother_quali_data: XotherQualiData[];

  @IsOptional()
  @IsBoolean()
  confirm: boolean;
}

export class AuditorSubmitEducationalQualificationsDto extends SubmitEducationalQualificationsDto {
  @IsNumber()
  candidateId: number;
}

export class SubmitWorkExperienceDto {
  @IsOptional()
  @IsNumber()
  @ApiProperty({
    type: Number,
    description: 'id',
    example: 7
  })
  id: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({
    type: Number,
    description: 'local Id',
    example: 5
  })
  localId: number;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'type',
    example: 'candidate'
  })
  type: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'country',
    example: 'Sri Lanka'
  })
  country: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Profile Status',
    example: 'active'
  })
  profileStatus: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Have pre tsg',
    example: 'Yes'
  })
  havePreTsg: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Have pre tsg status',
    example: 'approved'
  })
  havePreTsgStatus: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Have pre tsg reject reason',
    example: ''
  })
  havePreTsgRejectReason: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Pre tsg type',
    example: 'Tutor'
  })
  preTsgType: string;

  @ValidateIf((o) => o.havePreTsg !== 'No')
  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Pre tsg start',
    example: '2022-04-30T00:00:00.000Z'
  })
  preTsgStart: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Pre tsg end',
    example: '2022-07-31T00:00:00.000Z'
  })
  preTsgEnd: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Is currently employed',
    example: 'No'
  })
  isCurrentlyEmployed: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Is currently employed status',
    example: ''
  })
  isCurrentlyEmployedStatus: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Is currently employed reject reason',
    example: ''
  })
  isCurrentlyEmployedRejectReason: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Current emp name',
    example: ''
  })
  currentEmpName: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Current emp type',
    example: ''
  })
  currentEmpType: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Current emp title',
    example: ''
  })
  currentEmpTitle: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Current emp start',
    example: ''
  })
  currentEmpStart: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Current emp teaching',
    example: ''
  })
  currentEmpTeaching: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Current emp doc url',
    example: ''
  })
  currentEmpDocUrl: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Current emp doc url status',
    example: ''
  })
  currentEmpDocUrlStatus: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Current emp doc url reject reason',
    example: ''
  })
  currentEmpDocUrlRejectReason: string;

  @IsArray()
  @ValidateNested()
  @Type(() => XotherWorkExpData)
  xother_work_exp_data: XotherWorkExpData[];

  @IsOptional()
  @IsBoolean()
  confirm: boolean;
}

export class AuditorSubmitWorkExperienceDto extends SubmitWorkExperienceDto {
  @IsNumber()
  candidateId: number;
}

class XotherQualiData {
  @IsOptional()
  @IsNumber()
  @ApiProperty({
    type: Number,
    description: 'id',
    example: 7
  })
  id: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({
    type: Number,
    description: 'local Id',
    example: 7
  })
  localId: number;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Course type',
    example: 'Professional qualification'
  })
  courseType: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Course type status',
    example: 'approved'
  })
  courseTypeStatus: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Course type reject reason',
    example: ''
  })
  courseTypeRejectReason: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Field study',
    example: 'Science'
  })
  fieldStudy: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Field study status',
    example: 'approved'
  })
  fieldStudyStatus: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Field study reject reason',
    example: ''
  })
  fieldStudyRejectReason: string;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({
    type: Boolean,
    description: 'Has Math Stat',
    example: true
  })
  hasMathStat: boolean;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Has completed',
    example: 'Completed'
  })
  hasCompleted: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Has completed status',
    example: 'approved'
  })
  hasCompletedStatus: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Has completed reject reason',
    example: ''
  })
  hasCompletedRejectReason: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Start year',
    example: '2014-10-31T00:00:00.000Z'
  })
  startYear: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Start year status',
    example: 'approved'
  })
  startYearStatus: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Start year reject reason',
    example: ''
  })
  startYearRejectReason: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Completion year',
    example: '2025-07-31T00:00:00.000Z'
  })
  completionYear: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Completion year status',
    example: 'approved'
  })
  completionYearStatus: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Completion year reject reason',
    example: ''
  })
  completionYearRejectReason: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Is local',
    example: 'Local'
  })
  isLocal: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Is local status',
    example: 'approved'
  })
  isLocalStatus: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Is local reject reason',
    example: ''
  })
  isLocalRejectReason: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Main inst',
    example: 'Washington Universitysdss'
  })
  mainInst: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Main inst status',
    example: 'approved'
  })
  mainInstStatus: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Main inst reject reason',
    example: ''
  })
  mainInstRejectReason: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Affi inst',
    example: ''
  })
  affiInst: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Affi inst status',
    example: 'approved'
  })
  affiInstStatus: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Affi inst reject reason',
    example: ''
  })
  affiInstRejectReason: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Doc url',
    example: '/4.jpeg'
  })
  docUrl: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Doc url status',
    example: 'approved'
  })
  docUrlStatus: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Doc url reject reason',
    example: ''
  })
  docUrlRejectReason: string;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({
    type: Boolean,
    description: 'is Highest Qualification',
    example: true
  })
  isHighestQualification: boolean;
}

class XotherWorkExpData {
  @IsOptional()
  @IsNumber()
  @ApiProperty({
    type: Number,
    description: 'id',
    example: 7
  })
  id: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({
    type: Number,
    description: 'local Id',
    example: 7
  })
  localId: number;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Doc',
    example: 'Nimal Perera'
  })
  employerName: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Employment type',
    example: 'Part-Time'
  })
  employmentType: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Job title',
    example: 'Informatics Institute Of Technology'
  })
  jobTitle: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Currently employed',
    example: 'Yes'
  })
  currentlyEmployed: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Start date',
    example: '2016-07-31T00:00:00.000Z'
  })
  startDate: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'End date',
    example: '2018-07-31T00:00:00.000Z'
  })
  endDate: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Teaching exp',
    example: 'Yes'
  })
  teachingExp: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Doc url',
    example: '/1.jpeg'
  })
  docUrl: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Doc url status',
    example: 'approved'
  })
  docUrlStatus: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Doc url reject reason',
    example: ''
  })
  docUrlRejectReason: string;
}

export class WorkExperienceDetails200Response {
  @ApiProperty({
    example: {
      id: 206,
      havePreTsg: 'Yes',
      havePreTsgStatus: 'approved',
      havePreTsgRejectReason: '',
      preTsgType: 'Tutor',
      preTsgStart: '2022-04-30T00:00:00.000Z',
      preTsgEnd: '2022-07-31T00:00:00.000Z',
      isCurrentlyEmployed: 'No',
      isCurrentlyEmployedStatus: '',
      isCurrentlyEmployedRejectReason: '',
      currentEmpName: '',
      currentEmpType: '',
      currentEmpTitle: '',
      currentEmpStart: null,
      currentEmpTeaching: '',
      currentEmpDocUrl: '',
      currentEmpDocUrlStatus: '',
      currentEmpDocUrlRejectReason: '',
      xother_work_exp_data: [
        {
          id: 206,
          localId: 73,
          employerName: 'Nimal Perera',
          employmentType: 'Part-Time',
          jobTitle: 'Informatics Institute Of Technology',
          currentlyEmployed: 'Yes',
          startDate: '2016-07-31T00:00:00.000Z',
          endDate: null,
          teachingExp: 'Yes',
          docUrl: '/1.jpeg',
          docUrlStatus: 'approved',
          docUrlRejectReason: ''
        }
      ]
    }
  })
  data: object;
}
export class QualificationDetails200Response {
  @ApiProperty({
    example: [
      {
        id: 455,
        localId: 98,
        courseType: 'Professional qualification',
        courseTypeStatus: 'approved',
        courseTypeRejectReason: '',
        fieldStudy: 'Science',
        fieldStudyStatus: 'approved',
        fieldStudyRejectReason: '',
        hasMathStat: false,
        hasMathStatStatus: null,
        hasMathStatRejectReason: null,
        hasCompleted: 'Completed',
        hasCompletedStatus: 'approved',
        hasCompletedRejectReason: '',
        startYear: '2014-10-31T00:00:00.000Z',
        startYearStatus: 'approved',
        startYearRejectReason: '',
        completionYear: '2025-07-31T00:00:00.000Z',
        completionYearStatus: 'approved',
        completionYearRejectReason: '',
        isLocal: 'Local',
        isLocalStatus: 'approved',
        isLocalRejectReason: '',
        mainInst: 'Washington Universitysdss',
        mainInstStatus: 'approved',
        mainInstRejectReason: '',
        affiInst: '',
        affiInstStatus: 'approved',
        affiInstRejectReason: '',
        docUrl: '/4.jpeg',
        docUrlStatus: 'approved',
        docUrlRejectReason: '',
        isHighestQualification: true
      },
      {
        id: 456,
        localId: 119,
        courseType: 'Diploma Level',
        courseTypeStatus: 'approved',
        courseTypeRejectReason: '',
        fieldStudy: 'Biochemistry',
        fieldStudyStatus: 'approved',
        fieldStudyRejectReason: '',
        hasMathStat: false,
        hasMathStatStatus: null,
        hasMathStatRejectReason: null,
        hasCompleted: 'Completed',
        hasCompletedStatus: '',
        hasCompletedRejectReason: '',
        startYear: '2017-07-31T00:00:00.000Z',
        startYearStatus: 'approved',
        startYearRejectReason: '',
        completionYear: '2018-07-31T00:00:00.000Z',
        completionYearStatus: 'approved',
        completionYearRejectReason: '',
        isLocal: '',
        isLocalStatus: 'approved',
        isLocalRejectReason: '',
        mainInst: '',
        mainInstStatus: 'approved',
        mainInstRejectReason: '',
        affiInst: '',
        affiInstStatus: 'approved',
        affiInstRejectReason: '',
        docUrl: '',
        docUrlStatus: 'approved',
        docUrlRejectReason: '',
        isHighestQualification: false
      }
    ]
  })
  xother_quali_data: [];
}

export class FetchWorkExperienceDetailsDto {
  @ApiProperty({
    example: {
      success: true,
      data: {
        details: [
          {
            id: 190,
            havePreTsg: 'Yes',
            havePreTsgStatus: 'approved',
            havePreTsgRejectReason: '',
            preTsgType: 'Tutor',
            preTsgStart: '2022-04-30T00:00:00.000Z',
            preTsgEnd: '2022-07-31T00:00:00.000Z',
            isCurrentlyEmployed: 'No',
            isCurrentlyEmployedStatus: '',
            isCurrentlyEmployedRejectReason: '',
            currentEmpName: '',
            currentEmpType: '',
            currentEmpTitle: '',
            currentEmpStart: null,
            currentEmpTeaching: '',
            currentEmpDocUrl: '',
            currentEmpDocUrlStatus: '',
            currentEmpDocUrlRejectReason: '',
            xother_work_exp_data: [
              {
                id: 192,
                localId: 73,
                employerName: 'Nimal Perera',
                employmentType: 'Part-Time',
                jobTitle: 'Informatics Institute Of Technology',
                currentlyEmployed: 'Yes',
                startDate: null,
                endDate: null,
                teachingExp: 'Yes',
                docUrl: '/1.jpeg',
                docUrlStatus: 'approved',
                docUrlRejectReason: ''
              }
            ]
          }
        ],
        approvedWorkExperienceDetails: [
          {
            id: 205,
            tspId: 10,
            havePreTsg: 'Yes',
            havePreTsgStatus: 'approved',
            havePreTsgRejectReason: '',
            preTsgType: 'Tutor',
            preTsgStart: '2022-04-30T00:00:00.000Z',
            preTsgEnd: '2022-07-31T00:00:00.000Z',
            isCurrentlyEmployed: 'No',
            isCurrentlyEmployedStatus: '',
            isCurrentlyEmployedRejectReason: '',
            currentEmpName: '',
            currentEmpType: '',
            currentEmpTitle: '',
            currentEmpStart: null,
            currentEmpTeaching: '',
            currentEmpDocUrl: '',
            currentEmpDocUrlStatus: '',
            currentEmpDocUrlRejectReason: '',
            acknowledgmentCheck: null,
            updatedBy: 6,
            updatedAt: '2023-12-20T05:46:00.000Z',
            auditedBy: 6,
            auditedAt: '2023-12-20T05:46:00.000Z',
            recordApproved: null,
            tutoringPartner: null,
            xother_work_exp_data: [
              {
                id: 205,
                localId: 73,
                employerName: 'Nimal Perera',
                employmentType: 'Part-Time',
                jobTitle: 'Informatics Institute Of Technology',
                currentlyEmployed: 'Yes',
                startDate: null,
                endDate: null,
                teachingExp: 'Yes',
                docUrl: '/1.jpeg',
                docUrlStatus: 'approved',
                docUrlRejectReason: '',
                ApprovedXotherWorkExpData: {
                  localId: 73,
                  otherWorkExpId: 205,
                  employerName: 'Nimal Perera',
                  employmentType: 'Part-Time',
                  jobTitle: 'Informatics Institute Of Technology',
                  currentlyEmployed: 'Yes',
                  startDate: null,
                  endDate: null,
                  teachingExp: 'Yes',
                  docUrl: '/1.jpeg',
                  tspId: 10
                }
              }
            ]
          }
        ]
      }
    }
  })
  data: object;
}

export class FetchQualificationDetailsDto {
  @ApiProperty({
    example: {
      success: true,
      data: {
        details: [
          {
            id: 260,
            tspId: 10,
            hqCourseType: null,
            hqCourseTypeStatus: null,
            hqCourseTypeRejectReason: null,
            hqFieldStudy: null,
            hqFieldStudyStatus: null,
            hqFieldStudyRejectReason: null,
            hqHasCompleted: null,
            hqHasCompletedStatus: null,
            hqHasCompletedRejectReason: null,
            hqStartYear: null,
            hqStartYearStatus: null,
            hqStartYearRejectReason: null,
            hqCompletionYear: null,
            hqCompletionYearStatus: null,
            hqCompletionYearRejectReason: null,
            hqIsLocal: null,
            hqIsLocalStatus: null,
            hqIsLocalRejectReason: null,
            hqMainInst: null,
            hqMainInstStatus: null,
            hqMainInstRejectReason: null,
            hqAffiInst: null,
            hqAffiInstStatus: null,
            hqAffiInstRejectReason: null,
            hqDocUrl: null,
            hqDocUrlStatus: null,
            hqDocUrlRejectReason: null,
            updatedBy: 6,
            updatedAt: '2023-12-19T11:14:40.000Z',
            auditedBy: 6,
            auditedAt: '2023-12-19T11:14:40.000Z',
            recordApproved: null,
            xother_quali_data: [
              {
                id: 452,
                localId: 98,
                courseType: 'Professional qualification',
                courseTypeStatus: 'approved',
                courseTypeRejectReason: '',
                fieldStudy: 'Science',
                fieldStudyStatus: 'approved',
                fieldStudyRejectReason: '',
                hasMathStat: false,
                hasCompleted: 'Completed',
                hasCompletedStatus: 'approved',
                hasCompletedRejectReason: '',
                startYear: '2014-10-31T00:00:00.000Z',
                startYearStatus: 'approved',
                startYearRejectReason: '',
                completionYear: '2025-07-31T00:00:00.000Z',
                completionYearStatus: 'approved',
                completionYearRejectReason: '',
                isLocal: 'Local',
                isLocalStatus: 'approved',
                isLocalRejectReason: '',
                mainInst: 'Washington Universitysdss',
                mainInstStatus: 'approved',
                mainInstRejectReason: '',
                affiInst: '',
                affiInstStatus: 'approved',
                affiInstRejectReason: '',
                docUrl: '/4.jpeg',
                docUrlStatus: 'approved',
                docUrlRejectReason: '',
                isHighestQualification: true
              },
              {
                id: 453,
                localId: 119,
                courseType: 'Diploma Level',
                courseTypeStatus: 'approved',
                courseTypeRejectReason: '',
                fieldStudy: 'Biochemistry',
                fieldStudyStatus: 'approved',
                fieldStudyRejectReason: '',
                hasMathStat: false,
                hasCompleted: 'Completed',
                hasCompletedStatus: '',
                hasCompletedRejectReason: '',
                startYear: '2017-07-31T00:00:00.000Z',
                startYearStatus: 'approved',
                startYearRejectReason: '',
                completionYear: '2018-07-31T00:00:00.000Z',
                completionYearStatus: 'approved',
                completionYearRejectReason: '',
                isLocal: '',
                isLocalStatus: 'approved',
                isLocalRejectReason: '',
                mainInst: '',
                mainInstStatus: 'approved',
                mainInstRejectReason: '',
                affiInst: '',
                affiInstStatus: 'approved',
                affiInstRejectReason: '',
                docUrl: '',
                docUrlStatus: 'approved',
                docUrlRejectReason: '',
                isHighestQualification: false
              }
            ]
          }
        ],
        approvedQualificationDetails: [
          {
            id: 260,
            tspId: 10,
            hqCourseType: null,
            hqCourseTypeStatus: null,
            hqCourseTypeRejectReason: null,
            hqFieldStudy: null,
            hqFieldStudyStatus: null,
            hqFieldStudyRejectReason: null,
            hqHasCompleted: null,
            hqHasCompletedStatus: null,
            hqHasCompletedRejectReason: null,
            hqStartYear: null,
            hqStartYearStatus: null,
            hqStartYearRejectReason: null,
            hqCompletionYear: null,
            hqCompletionYearStatus: null,
            hqCompletionYearRejectReason: null,
            hqIsLocal: null,
            hqIsLocalStatus: null,
            hqIsLocalRejectReason: null,
            hqMainInst: null,
            hqMainInstStatus: null,
            hqMainInstRejectReason: null,
            hqAffiInst: null,
            hqAffiInstStatus: null,
            hqAffiInstRejectReason: null,
            hqDocUrl: null,
            hqDocUrlStatus: null,
            hqDocUrlRejectReason: null,
            updatedBy: 6,
            updatedAt: '2023-12-19T11:14:40.000Z',
            auditedBy: 6,
            auditedAt: '2023-12-19T11:14:40.000Z',
            recordApproved: null,
            xother_quali_data: [
              {
                id: 452,
                localId: 98,
                courseType: 'Professional qualification',
                courseTypeStatus: 'approved',
                courseTypeRejectReason: '',
                fieldStudy: 'Science',
                fieldStudyStatus: 'approved',
                fieldStudyRejectReason: '',
                hasMathStat: false,
                hasCompleted: 'Completed',
                hasCompletedStatus: 'approved',
                hasCompletedRejectReason: '',
                startYear: '2014-10-31T00:00:00.000Z',
                startYearStatus: 'approved',
                startYearRejectReason: '',
                completionYear: '2025-07-31T00:00:00.000Z',
                completionYearStatus: 'approved',
                completionYearRejectReason: '',
                isLocal: 'Local',
                isLocalStatus: 'approved',
                isLocalRejectReason: '',
                mainInst: 'Washington Universitysdss',
                mainInstStatus: 'approved',
                mainInstRejectReason: '',
                affiInst: '',
                affiInstStatus: 'approved',
                affiInstRejectReason: '',
                docUrl: '/4.jpeg',
                docUrlStatus: 'approved',
                docUrlRejectReason: '',
                isHighestQualification: true,
                approvedXotherQualiData: {
                  localId: 98,
                  otherQualifactionId: 452,
                  courseType: 'Professional qualification',
                  fieldStudy: 'Science',
                  hasCompleted: 'Completed',
                  startYear: '2014-10-31T00:00:00.000Z',
                  completionYear: '2025-07-31T00:00:00.000Z',
                  isLocal: 'Local',
                  mainInst: 'Washington Universitysdss',
                  affiInst: '',
                  docUrl: '/4.jpeg',
                  tspId: 10,
                  isHighestQualification: true
                }
              },
              {
                id: 453,
                localId: 119,
                courseType: 'Diploma Level',
                courseTypeStatus: 'approved',
                courseTypeRejectReason: '',
                fieldStudy: 'Biochemistry',
                fieldStudyStatus: 'approved',
                fieldStudyRejectReason: '',
                hasMathStat: false,
                hasCompleted: 'Completed',
                hasCompletedStatus: '',
                hasCompletedRejectReason: '',
                startYear: '2017-07-31T00:00:00.000Z',
                startYearStatus: 'approved',
                startYearRejectReason: '',
                completionYear: '2018-07-31T00:00:00.000Z',
                completionYearStatus: 'approved',
                completionYearRejectReason: '',
                isLocal: '',
                isLocalStatus: 'approved',
                isLocalRejectReason: '',
                mainInst: '',
                mainInstStatus: 'approved',
                mainInstRejectReason: '',
                affiInst: '',
                affiInstStatus: 'approved',
                affiInstRejectReason: '',
                docUrl: '',
                docUrlStatus: 'approved',
                docUrlRejectReason: '',
                isHighestQualification: false,
                approvedXotherQualiData: {
                  localId: 119,
                  otherQualifactionId: 453,
                  courseType: 'Diploma Level',
                  fieldStudy: 'Biochemistry',
                  hasCompleted: 'Completed',
                  startYear: '2017-07-31T00:00:00.000Z',
                  completionYear: '2018-07-31T00:00:00.000Z',
                  isLocal: '',
                  mainInst: '',
                  affiInst: '',
                  docUrl: '',
                  tspId: 10,
                  isHighestQualification: false
                }
              }
            ]
          }
        ]
      }
    }
  })
  data: object;
}

export class AuditorQualificationDetails200Response {
  @ApiProperty({
    example: {
      xother_quali_data: [
        {
          id: 458,
          localId: 98,
          courseType: 'Professional qualification',
          courseTypeStatus: 'approved',
          courseTypeRejectReason: '',
          fieldStudy: 'Science',
          fieldStudyStatus: 'approved',
          fieldStudyRejectReason: '',
          hasMathStat: false,
          hasMathStatStatus: null,
          hasMathStatRejectReason: null,
          hasCompleted: 'Completed',
          hasCompletedStatus: 'approved',
          hasCompletedRejectReason: '',
          startYear: '2014-10-31T00:00:00.000Z',
          startYearStatus: 'approved',
          startYearRejectReason: '',
          completionYear: '2025-07-31T00:00:00.000Z',
          completionYearStatus: 'approved',
          completionYearRejectReason: '',
          isLocal: 'Local',
          isLocalStatus: 'approved',
          isLocalRejectReason: '',
          mainInst: 'Washington Universitysdss',
          mainInstStatus: 'approved',
          mainInstRejectReason: '',
          affiInst: '',
          affiInstStatus: 'approved',
          affiInstRejectReason: '',
          docUrl: '/4.jpeg',
          docUrlStatus: 'approved',
          docUrlRejectReason: '',
          isHighestQualification: true
        },
        {
          id: 459,
          localId: 119,
          courseType: 'Diploma Level',
          courseTypeStatus: 'approved',
          courseTypeRejectReason: '',
          fieldStudy: 'Biochemistry',
          fieldStudyStatus: 'approved',
          fieldStudyRejectReason: '',
          hasMathStat: false,
          hasMathStatStatus: null,
          hasMathStatRejectReason: null,
          hasCompleted: 'Completed',
          hasCompletedStatus: '',
          hasCompletedRejectReason: '',
          startYear: '2017-07-31T00:00:00.000Z',
          startYearStatus: 'approved',
          startYearRejectReason: '',
          completionYear: '2018-07-31T00:00:00.000Z',
          completionYearStatus: 'approved',
          completionYearRejectReason: '',
          isLocal: '',
          isLocalStatus: 'approved',
          isLocalRejectReason: '',
          mainInst: '',
          mainInstStatus: 'approved',
          mainInstRejectReason: '',
          affiInst: '',
          affiInstStatus: 'approved',
          affiInstRejectReason: '',
          docUrl: '',
          docUrlStatus: 'approved',
          docUrlRejectReason: '',
          isHighestQualification: false
        }
      ]
    }
  })
  details: object;

  @ApiProperty({
    example: {
      id: 262,
      tspId: 10,
      hqCourseType: null,
      hqCourseTypeStatus: null,
      hqCourseTypeRejectReason: null,
      hqFieldStudy: null,
      hqFieldStudyStatus: null,
      hqFieldStudyRejectReason: null,
      hqHasCompleted: null,
      hqHasCompletedStatus: null,
      hqHasCompletedRejectReason: null,
      hqStartYear: null,
      hqStartYearStatus: null,
      hqStartYearRejectReason: null,
      hqCompletionYear: null,
      hqCompletionYearStatus: null,
      hqCompletionYearRejectReason: null,
      hqIsLocal: null,
      hqIsLocalStatus: null,
      hqIsLocalRejectReason: null,
      hqMainInst: null,
      hqMainInstStatus: null,
      hqMainInstRejectReason: null,
      hqAffiInst: null,
      hqAffiInstStatus: null,
      hqAffiInstRejectReason: null,
      hqDocUrl: null,
      hqDocUrlStatus: null,
      hqDocUrlRejectReason: null,
      updatedBy: 6,
      updatedAt: '2023-12-20T10:22:29.000Z',
      auditedBy: 6,
      auditedAt: '2023-12-20T10:22:29.000Z',
      recordApproved: null,
      xother_quali_data: [
        {
          id: 458,
          localId: 98,
          courseType: 'Professional qualification',
          courseTypeStatus: 'approved',
          courseTypeRejectReason: '',
          fieldStudy: 'Science',
          fieldStudyStatus: 'approved',
          fieldStudyRejectReason: '',
          hasMathStat: false,
          hasCompleted: 'Completed',
          hasCompletedStatus: 'approved',
          hasCompletedRejectReason: '',
          startYear: '2014-10-31T00:00:00.000Z',
          startYearStatus: 'approved',
          startYearRejectReason: '',
          completionYear: '2025-07-31T00:00:00.000Z',
          completionYearStatus: 'approved',
          completionYearRejectReason: '',
          isLocal: 'Local',
          isLocalStatus: 'approved',
          isLocalRejectReason: '',
          mainInst: 'Washington Universitysdss',
          mainInstStatus: 'approved',
          mainInstRejectReason: '',
          affiInst: '',
          affiInstStatus: 'approved',
          affiInstRejectReason: '',
          docUrl: '/4.jpeg',
          docUrlStatus: 'approved',
          docUrlRejectReason: '',
          approvedXotherQualiData: {
            localId: 98,
            otherQualifactionId: 458,
            courseType: 'Professional qualification',
            fieldStudy: 'Science',
            hasCompleted: 'Completed',
            startYear: '2014-10-31T00:00:00.000Z',
            completionYear: '2025-07-31T00:00:00.000Z',
            isLocal: 'Local',
            mainInst: 'Washington Universitysdss',
            affiInst: '',
            docUrl: '/4.jpeg',
            tspId: 10,
            isHighestQualification: true
          },
          isHighestQualification: true
        },
        {
          id: 459,
          localId: 119,
          courseType: 'Diploma Level',
          courseTypeStatus: 'approved',
          courseTypeRejectReason: '',
          fieldStudy: 'Biochemistry',
          fieldStudyStatus: 'approved',
          fieldStudyRejectReason: '',
          hasMathStat: false,
          hasCompleted: 'Completed',
          hasCompletedStatus: '',
          hasCompletedRejectReason: '',
          startYear: '2017-07-31T00:00:00.000Z',
          startYearStatus: 'approved',
          startYearRejectReason: '',
          completionYear: '2018-07-31T00:00:00.000Z',
          completionYearStatus: 'approved',
          completionYearRejectReason: '',
          isLocal: '',
          isLocalStatus: 'approved',
          isLocalRejectReason: '',
          mainInst: '',
          mainInstStatus: 'approved',
          mainInstRejectReason: '',
          affiInst: '',
          affiInstStatus: 'approved',
          affiInstRejectReason: '',
          docUrl: '',
          docUrlStatus: 'approved',
          docUrlRejectReason: '',
          approvedXotherQualiData: {
            localId: 119,
            otherQualifactionId: 459,
            courseType: 'Diploma Level',
            fieldStudy: 'Biochemistry',
            hasCompleted: 'Completed',
            startYear: '2017-07-31T00:00:00.000Z',
            completionYear: '2018-07-31T00:00:00.000Z',
            isLocal: '',
            mainInst: '',
            affiInst: '',
            docUrl: '',
            tspId: 10,
            isHighestQualification: false
          },
          isHighestQualification: false
        }
      ]
    }
  })
  approvedQualificationDetails: object;
}

export class AuditorWorkExperienceDetails200Response {
  @ApiProperty({
    example: {
      id: 207,
      havePreTsg: 'Yes',
      havePreTsgStatus: 'approved',
      havePreTsgRejectReason: '',
      preTsgType: 'Tutor',
      preTsgStart: '2022-04-30T00:00:00.000Z',
      preTsgEnd: '2022-07-31T00:00:00.000Z',
      isCurrentlyEmployed: 'Yes',
      isCurrentlyEmployedStatus: 'approved',
      isCurrentlyEmployedRejectReason: '',
      currentEmpName: 'Sampath Bank',
      currentEmpType: 'Full-Time',
      currentEmpTitle: 'Banker',
      currentEmpStart: '2022-07-31T00:00:00.000Z',
      currentEmpTeaching: 'No',
      currentEmpDocUrl: '',
      currentEmpDocUrlStatus: '',
      currentEmpDocUrlRejectReason: '',
      xother_work_exp_data: [
        {
          id: 207,
          localId: 73,
          employerName: 'Nimal Perera',
          employmentType: 'Part-Time',
          jobTitle: 'Informatics Institute Of Technology',
          currentlyEmployed: 'Yes',
          startDate: '2016-07-31T00:00:00.000Z',
          endDate: null,
          teachingExp: 'Yes',
          docUrl: '/1.jpeg',
          docUrlStatus: 'approved',
          docUrlRejectReason: ''
        }
      ]
    }
  })
  details: object;

  @ApiProperty({
    example: {
      id: 207,
      tspId: 10,
      havePreTsg: 'Yes',
      havePreTsgStatus: 'approved',
      havePreTsgRejectReason: '',
      preTsgType: 'Tutor',
      preTsgStart: '2022-04-30T00:00:00.000Z',
      preTsgEnd: '2022-07-31T00:00:00.000Z',
      isCurrentlyEmployed: 'Yes',
      isCurrentlyEmployedStatus: 'approved',
      isCurrentlyEmployedRejectReason: '',
      currentEmpName: 'Sampath Bank',
      currentEmpType: 'Full-Time',
      currentEmpTitle: 'Banker',
      currentEmpStart: '2022-07-31T00:00:00.000Z',
      currentEmpTeaching: 'No',
      currentEmpDocUrl: '',
      currentEmpDocUrlStatus: '',
      currentEmpDocUrlRejectReason: '',
      acknowledgmentCheck: null,
      updatedBy: 6,
      updatedAt: '2023-12-21T13:32:49.000Z',
      auditedBy: 6,
      auditedAt: '2023-12-21T13:32:49.000Z',
      recordApproved: null,
      tutoringPartner: null,
      xother_work_exp_data: [
        {
          id: 207,
          localId: 73,
          employerName: 'Nimal Perera',
          employmentType: 'Part-Time',
          jobTitle: 'Informatics Institute Of Technology',
          currentlyEmployed: 'Yes',
          startDate: '2016-07-31T00:00:00.000Z',
          endDate: null,
          teachingExp: 'Yes',
          docUrl: '/1.jpeg',
          docUrlStatus: 'approved',
          docUrlRejectReason: '',
          ApprovedXotherWorkExpData: {
            localId: 73,
            otherWorkExpId: 207,
            employerName: 'Nimal Perera',
            employmentType: 'Part-Time',
            jobTitle: 'Informatics Institute Of Technology',
            currentlyEmployed: 'Yes',
            startDate: '2016-07-31T00:00:00.000Z',
            endDate: null,
            teachingExp: 'Yes',
            docUrl: '/1.jpeg',
            tspId: 10
          }
        }
      ]
    }
  })
  approvedWorkExperienceDetails: object;
}
