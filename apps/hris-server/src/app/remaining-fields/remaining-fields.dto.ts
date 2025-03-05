import { ApiProperty } from '@nestjs/swagger';

export class AllRemainingFields200Dto {
  @ApiProperty({
    type: [],
    example: {
      PersonalData: [
        'gender',
        'maritalState',
        'haveChildren',
        'haveAffiliations',
        'typeOfId',
        'idLanguage'
      ],
      ContactData: [
        'workEmail',
        'permanentCountry',
        'permanentProvince',
        'permanentDistrict',
        'residingCountry',
        'residingProvince',
        'residingDistrict',
        'residingCity',
        'emgContactName',
        'emgRelationship',
        'emgContactNum',
        'permanentCity'
      ],
      EducationData: [
        'olSyllabus',
        'olYear',
        'olMaths',
        'olEnglish',
        'alCheck',
        'olCertificateUrl'
      ],
      WorkExpData: ['havePreTsg', 'isCurrentlyEmployed'],
      BankData: ['bPassbookUrl'],
      RefereeData: [
        'refereeTitle1',
        'refereeFirstName1',
        'refereeLastName1',
        'refereeRelationship1',
        'refereeEmail1',
        'refereeTelephoneNumber1',
        'refereeConfirmation1',
        'refereeTitle2',
        'refereeFirstName2',
        'refereeLastName2',
        'refereeRelationship2',
        'refereeEmail2',
        'refereeTelephoneNumber2',
        'refereeConfirmation2',
        'acknowledgement1',
        'acknowledgement2'
      ],
      ItData: [
        'havePc',
        'haveHeadset',
        'primaryConnectionType',
        'primaryIsp',
        'primaryDownloadSpeed',
        'primaryUploadSpeed',
        'primaryPing',
        'haveSecondaryConnection',
        'primarySpeedUrl'
      ],
      HealthData: [
        'hd1Heart',
        'hd2Neck',
        'hd3High',
        'hd4Arthritis',
        'hd5Terminally',
        'hd6Unusual',
        'hd7Asthma',
        'hd8Fainting',
        'hd9Depression',
        'hd10Throat',
        'hd12Vision',
        'hd11Other'
      ],
      AvailabilityData: ['session'],
      QualificationsData: [
        'courseType',
        'fieldStudy',
        'hasCompleted',
        'startYear',
        'completionYear',
        'isLocal',
        'mainInst',
        'docUrl'
      ]
    }
  })
  data: any[];
}
