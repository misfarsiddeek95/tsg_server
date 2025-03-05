import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean
} from 'class-validator';

export class NontutorDto {
  @ApiProperty({
    type: 'number',
    description: 'ID',
    example: '123'
  })
  id: number;

  @ApiProperty({
    type: 'number',
    description: 'TSP ID',
    example: '123'
  })
  tspId: number;

  @ApiProperty({
    type: 'string',
    description: 'Profile Picture',
    example:
      'https://tsg-erp.s3.eu-west-2.amazonaws.com/26/personal_info_nthris/1697504298946_____5968381.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIARAOBVENLYUWORPHZ%2F20231017%2Feu-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231017T010050Z&X-Amz-Expires=900&X-Amz-Signature=1c5a36220d1276bae7a52f9ccbdc7d369546bdbb291149d8d9ac5516a39c463f&X-Amz-SignedHeaders=host&x-id=GetObject'
  })
  pPicture?: string;

  @ApiProperty({
    type: 'string',
    description: 'Full Name',
    example: 'Dinesh Nelundeniya'
  })
  name?: string;

  @ApiProperty({
    type: 'string',
    description: 'Designation',
    example: 'Software Engineer'
  })
  designation?: string;

  @ApiProperty({
    type: 'string',
    description: 'Department',
    example: 'BSA'
  })
  department?: string;

  @ApiProperty({
    type: 'string',
    description: 'Division',
    example: 'Development'
  })
  division?: string;

  @ApiProperty({
    type: 'string',
    description: 'Phone Number',
    example: '0766197793'
  })
  phoneNumber?: string;

  @ApiProperty({
    type: 'string',
    description: 'Email',
    example: 'dinesh@thirdspaceglobal.com'
  })
  email?: string;

  @ApiProperty({
    type: 'string',
    description: 'Address',
    example: '16/59, Rafalwatta Rd, Yakkala'
  })
  address?: string;

  @ApiProperty({
    type: 'string',
    description: 'Line Manager',
    example: 'Yasiru Nanayakkara'
  })
  lineManager?: string;

  @ApiProperty({
    type: 'string',
    description: 'Country',
    example: 'Sri Lanka'
  })
  country?: string;
}

export class NontutorDetailDto {
  @IsString()
  @IsOptional()
  @ApiProperty({
    type: 'string',
    description: 'TSP ID',
    example: '123'
  })
  tspId: number;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: 'string',
    description: 'Full Name',
    example: 'Dinesh Nelundeniya'
  })
  fullName: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: 'string',
    description: 'Name With Initials',
    example: 'D. Nelundeniya'
  })
  nameWithInitials: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: 'string',
    description: 'Short Name',
    example: 'Dinesh'
  })
  shortName: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: 'string',
    description: 'Preferred Name',
    example: 'Dinesh Nelundeniya'
  })
  preferredName: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: 'string',
    description: 'Date of Birth',
    example: '1973-09-09'
  })
  dob: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: 'string',
    description: 'Nationality',
    example: 'Srilankan'
  })
  nationality: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: 'string',
    description: 'NIC',
    example: '732740123V'
  })
  nic: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: 'string',
    description: 'Gender',
    example: 'male'
  })
  gender: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: 'string',
    description: 'Religion',
    example: 'Buddhist'
  })
  religion: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: 'string',
    description: 'Profile Picture',
    example: 'https//'
  })
  ppUrl: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: 'string',
    description: 'Residing Country',
    example: 'Sri Lanka'
  })
  residingCountry: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: 'string',
    description: 'Residing Districe',
    example: 'Gampaha'
  })
  residingDistrict: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: 'string',
    description: 'Residing Province',
    example: 'Western'
  })
  residingProvince: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: 'string',
    description: 'Mobile Number',
    example: '0766197793'
  })
  mobileNumber: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: 'string',
    description: 'Work Email',
    example: 'dinesh@thirdspaceglobal.com'
  })
  workEmail: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: 'string',
    description: 'Personal Email',
    example: 'nelundeniya@gmail.com'
  })
  personalEmail: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: 'string',
    description: 'Job Title',
    example: 'Senior Software Engineer'
  })
  jobTitle: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: 'string',
    description: 'Supervisor Name',
    example: 'Yasiru Nanayakkara'
  })
  supervisorName: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: 'string',
    description: 'Division',
    example: 'BSA'
  })
  division: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: 'string',
    description: 'Department',
    example: 'Development'
  })
  department: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: 'number',
    description: 'Contract Number',
    example: 123
  })
  contractNo: number;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: 'string',
    description: 'Contract Type',
    example: 'FTC'
  })
  contractType: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: 'string',
    description: 'Contract Start Date',
    example: '2022-09-01'
  })
  contractStartDate: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: 'string',
    description: 'Contract End Date',
    example: '2023-08-31'
  })
  contractEndDate: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: 'string',
    description: 'EPF',
    example: '123'
  })
  epf: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: 'string',
    description: 'Sub Department',
    example: 'NA'
  })
  subDepartment: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: 'string',
    description: 'Management Level',
    example: 'Senior Executive'
  })
  managementLevel: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: 'string',
    description: 'Location',
    example: 'Sri Lanka'
  })
  location: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: 'string',
    description: 'Emplyment Type',
    example: 'Contract'
  })
  employmentType: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: 'string',
    description: 'Resignation Given Date',
    example: '2023-09-01'
  })
  resignationGivenDate: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: 'string',
    description: 'Last Working Date',
    example: '2023-09-01'
  })
  lastWorkingDate: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: 'string',
    description: 'Resignation Withdrawal Date',
    example: '2023-09-01'
  })
  resignationWithdrawalDate: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: 'string',
    description: 'PCC Status',
    example: 'Submitted'
  })
  pccStatus: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: 'string',
    description: 'Job Profile',
    example: 'Job Profile'
  })
  jobProfile: string;
}
export class DirectoryDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: 'string',
    description: 'User ID',
    example: '123'
  })
  tspId: string;
}

export class DirectorySearchDto {
  @IsString()
  @IsOptional()
  @ApiProperty({
    type: 'string',
    description: 'TSP ID',
    example: '123'
  })
  tspId: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: 'string',
    description: 'Status',
    example: 'blocked'
  })
  status: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: 'string',
    description: 'Full Name',
    example: 'Dinesh'
  })
  fullName: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: 'string',
    description: 'First Name',
    example: 'Dinesh'
  })
  firstName: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: 'string',
    description: 'Last Name',
    example: 'Nelundeniya'
  })
  lastName: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: 'string',
    description: 'Name With Initials',
    example: 'D. K. Nelundeniya'
  })
  nameWithInitials: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: 'string',
    description: 'Prefered Name',
    example: 'Dinesh Nelundeniya'
  })
  preferredName: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: 'string',
    description: 'NIC',
    example: '73275V'
  })
  nic: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: 'string',
    description: 'EPF',
    example: '123'
  })
  epf: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: 'string',
    description: 'Gender',
    example: 'male'
  })
  gender: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: 'string',
    description: 'Religion',
    example: 'Buddhism'
  })
  religion: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: 'string',
    description: 'Contact Number',
    example: '12345678'
  })
  contactNumber: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: 'string',
    description: 'Work Email',
    example: 'dinesh@thiredspaceglobal.com'
  })
  workEmail: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: 'string',
    description: 'Personal Email',
    example: 'nelundeniya@gmail.com'
  })
  personalEmail: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: 'string',
    description: 'Supervisor',
    example: 'Yasiru'
  })
  supervisor: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: 'string',
    description: 'Job Profile',
    example: 'BSA'
  })
  jobProfile: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: 'string',
    description: 'Department',
    example: 'QA'
  })
  department: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: 'string',
    description: 'Sub Department',
    example: 'Testing'
  })
  subDepartment: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: 'string',
    description: 'Contract Number',
    example: '123'
  })
  contractNumber: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: 'string',
    description: 'Contract Type',
    example: 'FTC'
  })
  contractType: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: 'string',
    description: 'Management Level',
    example: '3'
  })
  managementLevel: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: 'string',
    description: 'Location',
    example: 'Sri Lanka'
  })
  location: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: 'string',
    description: 'Role Profile',
    example: 'na'
  })
  roleProfile: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: 'string',
    description: 'Joined Date',
    example: '2022-09-01'
  })
  joinedDate: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: 'string',
    description: 'Contract Start Date',
    example: '2022-09-01'
  })
  contractStartDate: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: 'string',
    description: 'Contract Start Date To',
    example: '2022-09-10'
  })
  contractStartDateTo: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: 'string',
    description: 'Contract End Date',
    example: '2022-09-01'
  })
  contractEndDate: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: 'string',
    description: 'Contract End Date To',
    example: '2022-09-01'
  })
  contractEndDateTo: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: 'string',
    description: 'PCC Status',
    example: 'pending'
  })
  pccStatus: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: 'string',
    description: 'Employment Type',
    example: 'contract'
  })
  employmentType: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: 'string',
    description: 'Resigned Date',
    example: '2022-09-01'
  })
  resignedDate: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: 'string',
    description: 'Resigned Date To',
    example: '2022-09-01'
  })
  resignedDateTo: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: 'string',
    description: 'Last Working Date',
    example: '2022-09-01'
  })
  lastWorkingDate: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: 'string',
    description: 'Last Working Date To',
    example: '2022-09-01'
  })
  lastWorkingDateTo: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: 'string',
    description: 'Resign Withdrawal',
    example: '2022-09-01'
  })
  resignWithdrawal: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    type: 'number',
    description: 'Page',
    example: '1'
  })
  page: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    type: 'number',
    description: 'Per Page',
    example: '10'
  })
  perPage: number;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    type: 'noolean',
    description: 'Export To CSV',
    example: true
  })
  exportToCsv: boolean;
}
