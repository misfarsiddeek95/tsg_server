import { ApiProperty } from '@nestjs/swagger';

class LatestEventDto {}

class LatestHolidyDto {}
class EventDto {
  @ApiProperty({ type: LatestEventDto })
  latest_event: LatestEventDto;

  @ApiProperty({ type: LatestHolidyDto })
  latest_holidy: LatestHolidyDto;
}
class ProfileDataDto {
  @ApiProperty({
    type: 'string',
    description: 'Full Name',
    example: 'Dinesh Nelundeniya'
  })
  fullName: string;

  @ApiProperty({
    type: 'string',
    description: 'Name with Initials',
    example: 'D Nelundeniya'
  })
  nameWithInitials: string;

  @ApiProperty({
    type: 'string',
    description: 'First Name',
    example: 'Dinesh'
  })
  firstName: string;

  @ApiProperty({
    type: 'string',
    description: 'Surname',
    example: 'Nelundeniya'
  })
  surname: string;

  @ApiProperty({
    type: 'string',
    description: 'Gender',
    example: 'male'
  })
  gender: string;

  @ApiProperty({
    type: 'string',
    description: 'Date of Birth',
    example: '1973-09-30'
  })
  dob: string;

  @ApiProperty({
    type: 'string',
    description: 'Birth Certificate URL',
    example: 'https://aws.com'
  })
  birthCirtificateUrl: string;

  @ApiProperty({
    type: 'string',
    description: 'Religion',
    example: 'Buddhism'
  })
  religion: string;

  @ApiProperty({
    type: 'string',
    description: 'Marital Status',
    example: 'married'
  })
  maritalStatus: string;

  @ApiProperty({
    type: 'string',
    description: 'Spouse Name',
    example: 'Spouse Name'
  })
  spouseName: string;

  @ApiProperty({
    type: 'string',
    description: 'Have Children',
    example: 'yes'
  })
  haveChildren: string;

  @ApiProperty({
    type: 'string',
    description: 'NIC',
    example: '732345670v'
  })
  nic: string;

  @ApiProperty({
    type: 'string',
    description: 'NIC URL',
    example: 'https://aws.com/'
  })
  nicUrl: string;

  @ApiProperty({
    type: 'string',
    description: 'Have Affiliations',
    example: 'yes'
  })
  haveAffiliations: string;

  @ApiProperty({
    type: 'string',
    description: 'Short Name',
    example: 'Dinesh'
  })
  shortName: string;

  @ApiProperty({
    type: 'string',
    description: 'Age',
    example: '50'
  })
  age: string;

  @ApiProperty({
    type: 'string',
    description: 'Profile Picture URL',
    example: 'https://aws.com/'
  })
  ppUrl: string;

  @ApiProperty({
    type: 'string',
    description: 'Nationality',
    example: 'Sri Lankan'
  })
  nationality: string;

  @ApiProperty({
    type: 'string',
    description: 'Type of ID',
    example: 'NIC'
  })
  typeOfId: string;

  @ApiProperty({
    type: 'string',
    description: 'Passport Country',
    example: 'Sri Lanka'
  })
  passportCountry: string;

  @ApiProperty({
    type: 'string',
    description: 'Passoprt Expiration Date',
    example: '2023-09-09'
  })
  passportExpirationDate: string;

  @ApiProperty({
    type: 'string',
    description: 'Have Right To Work Document',
    example: 'yes'
  })
  haveRtwDocument: string;

  @ApiProperty({
    type: 'string',
    description: 'Right to Work Document URL',
    example: 'https://aws.com/'
  })
  rtwDocumentUrl: string;

  @ApiProperty({
    type: 'string',
    description: 'Have Right to Work Expiration Date',
    example: 'yes'
  })
  haveRtwExpirationDate: string;

  @ApiProperty({
    type: 'string',
    description: 'Right to Work Expiration Date',
    example: '2023-09-09'
  })
  rtwExpirationDate: string;

  @ApiProperty({
    type: 'string',
    description: 'ID Language',
    example: 'Sinhala'
  })
  idLanguage: string;
}

export class DashboardDataDto {
  @ApiProperty({
    type: 'boolean',
    description: 'Success',
    example: true
  })
  success: boolean;

  @ApiProperty({ type: ProfileDataDto })
  data: ProfileDataDto;
}

export class HomeDataDto {
  @ApiProperty({
    type: 'boolean',
    description: 'Success',
    example: true
  })
  success: boolean;

  @ApiProperty({ type: EventDto })
  data: EventDto;
}
