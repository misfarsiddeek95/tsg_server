import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class RemainingFieldsService {
  constructor(private prisma: PrismaService) {}

  async allRemainingFields(userId: number) {
    try {
      return getAllRemainingFields(this.prisma, userId);
    } catch (error) {
      throw new HttpException({ success: false, error }, 400);
    }
  }
}

async function getAllRemainingFields(prisma: PrismaService, userId: number) {
  const contactDetails = await prisma.approvedContactData.findUnique({
    where: {
      tspId: userId
    }
  });

  const emptyAllFields = {};

  const fieldSets = {
    PersonalData: [
      'fullName',
      'nameWithInitials',
      'firstName',
      'surname',
      'gender',
      'dob',
      'religion',
      'maritalState',
      'haveChildren',
      'haveAffiliations',
      'typeOfId',
      'idLanguage',
      'nic',
      'nicUrl'
      // 'ppUrl'
    ],
    ContactData: [
      'personalEmail',
      'workEmail',
      'mobileNumber',
      'permanentAddressL1',
      'permanentCountry',
      'permanentProvince',
      'permanentDistrict',
      'sameResidingPermanent',
      'residingAddressL1',
      'residingCountry',
      'residingProvince',
      'residingDistrict',
      'residingCity',
      'emgContactName',
      'emgRelationship',
      'emgContactNum',
      ...(contactDetails.residingCountry === 'India'
        ? ['residingPin', 'permanentPin']
        : ['permanentCity'])
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
    BankData: [
      'bankName',
      'bBranch',
      'bAccountNo',
      'bAccountName',
      'bPassbookUrl',
      ...(contactDetails.residingCountry === 'India'
        ? ['bSwift', 'bBranchCode', 'ifscCode']
        : [])
    ],

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
    ]
  };

  for (const tableName in fieldSets) {
    emptyAllFields[tableName] = await getEmptyFields(
      prisma,
      `hris${tableName}`,
      userId,
      fieldSets[tableName]
    );
  }

  const availabilityProgress = await prisma.hrisProgress.findUnique({
    where: {
      tspId: userId
    },
    select: {
      availabilityDataCount: true,
      user: {
        select: {
          level: true
        }
      }
    }
  });

  if (
    availabilityProgress.availabilityDataCount != '35/35' &&
    availabilityProgress.user.level != 1
  ) {
    emptyAllFields['AvailabilityData'] = ['session'];
  }

  const lastQualiData = await prisma.hrisQualificationsData.findFirst({
    where: {
      tspId: userId
    },
    orderBy: {
      id: 'desc'
    }
  });

  const QualificationsData = [
    'courseType',
    'fieldStudy',
    'hasCompleted',
    'startYear',
    'completionYear',
    'isLocal',
    'mainInst',
    'docUrl'
  ];

  if (lastQualiData) {
    const xOtherQualiData = await prisma.xotherQualiData.findFirst({
      where: {
        qId: lastQualiData.id
      },
      orderBy: {
        id: 'asc'
      }
    });

    const qualiEmptyFields = QualificationsData.filter((field) => {
      return !xOtherQualiData || isFieldEmpty(xOtherQualiData[field]);
    });
    emptyAllFields['QualificationsData'] = qualiEmptyFields;
  } else {
    emptyAllFields['QualificationsData'] = QualificationsData;
  }

  return emptyAllFields;
}

// Define a function to get empty fields for a specific table
async function getEmptyFields(prisma, tableName, userId, mandatoryFields) {
  const emptyMandatoryFields = await prisma[tableName].findFirst({
    where: {
      tspId: userId
    },
    orderBy: {
      id: 'desc'
    }
  });

  const emptyFields = mandatoryFields.filter((field) => {
    return !emptyMandatoryFields || isFieldEmpty(emptyMandatoryFields[field]);
  });

  return emptyFields;
}

// Define a function to check if a field is empty
function isFieldEmpty(fieldValue: string) {
  return fieldValue === null || fieldValue === undefined || fieldValue === '';
}
