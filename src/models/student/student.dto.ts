import { ApiProperty } from '@nestjs/swagger';
import { Student } from './student.model';

export class StudentResponse {
  @ApiProperty()
  SSNNo: string;
  @ApiProperty()
  nameEn: string;
  @ApiProperty()
  nameAr: string;
  @ApiProperty()
  email: string;

  @ApiProperty({ nullable: true })
  salutation?: string;
  @ApiProperty({ nullable: true })
  gender?: string;
  @ApiProperty({ nullable: true })
  admissionNo?: string;
  @ApiProperty({ nullable: true })
  mobileNumber?: string;
  @ApiProperty({ nullable: true })
  nationality?: string;
  @ApiProperty({ nullable: true })
  passportNumber?: string;
  @ApiProperty({ nullable: true })
  emiratesId?: string;
  @ApiProperty({ nullable: true })
  employmentStatus?: string;
  @ApiProperty({ nullable: true })
  employerName?: string;
  @ApiProperty({ nullable: true })
  employmentLocationCountry?: string;
  @ApiProperty({ nullable: true })
  employmentLocationCity?: string;
  @ApiProperty({ nullable: true })
  bachelorsInstitutionName?: string;
  @ApiProperty({ nullable: true })
  arabicLanguageTestType?: string;
  @ApiProperty({ nullable: true })
  arabicLanguageTestScore?: string;
  @ApiProperty({ nullable: true })
  arabicLanguageTestDate?: Date;
  @ApiProperty({ nullable: true })
  englishLanguageTestType?: string;
  @ApiProperty({ nullable: true })
  englishLanguageTestScore?: string;
  @ApiProperty({ nullable: true })
  englishLanguageTestDate?: Date;
  @ApiProperty({ nullable: true })
  currentEnrolmentStatus?: string;
  @ApiProperty({ nullable: true })
  status?: string;
  @ApiProperty({ nullable: true })
  secondaryEmail?: string;
  @ApiProperty({ nullable: true })
  CGPAValue?: number;
  @ApiProperty({ nullable: true })
  passportIssuingAuthority?: string;
  @ApiProperty({ nullable: true })
  passportIssueDate?: Date;
  @ApiProperty({ nullable: true })
  emirateState?: string;
  @ApiProperty({ nullable: true })
  detailedAddress?: string;
  @ApiProperty({ nullable: true })
  maritalStatus?: string;
  @ApiProperty({ nullable: true })
  motherNationality?: string;
  @ApiProperty({ nullable: true })
  familyBookNumber?: string;
  @ApiProperty({ nullable: true })
  familyNumber?: string;
  @ApiProperty({ nullable: true })
  highestQualification?: string;

  constructor(student: Student) {
    this.SSNNo = student.SSNNo;
    this.nameEn = student.nameEn;
    this.nameAr = student.nameAr;
    this.email = student.email;
    this.salutation = student.salutation;
    this.gender = student.gender;
    this.admissionNo = student.admissionNo;
    this.mobileNumber = student.mobileNumber;
    this.nationality = student.nationality;
    this.passportNumber = student.passportNumber;
    this.emiratesId = student.emiratesId;
    this.employmentStatus = student.employmentStatus;
    this.employerName = student.employerName;
    this.employmentLocationCountry = student.employmentLocationCountry;
    this.employmentLocationCity = student.employmentLocationCity;
    this.bachelorsInstitutionName = student.bachelorsInstitutionName;
    this.arabicLanguageTestType = student.arabicLanguageTestType;
    this.arabicLanguageTestScore = student.arabicLanguageTestScore;
    this.arabicLanguageTestDate = student.arabicLanguageTestDate;
    this.englishLanguageTestType = student.englishLanguageTestType;
    this.englishLanguageTestScore = student.englishLanguageTestScore;
    this.englishLanguageTestDate = student.englishLanguageTestDate;
    this.currentEnrolmentStatus = student.currentEnrolmentStatus;
    this.status = student.status;
    this.secondaryEmail = student.secondaryEmail;
    this.CGPAValue = student.CGPAValue;
    this.passportIssuingAuthority = student.passportIssuingAuthority;
    this.passportIssueDate = student.passportIssueDate;
    this.emirateState = student.emirateState;
    this.detailedAddress = student.detailedAddress;
    this.maritalStatus = student.maritalStatus;
    this.motherNationality = student.motherNationality;
    this.familyBookNumber = student.familyBookNumber;
    this.familyNumber = student.familyNumber;
    this.highestQualification = student.highestQualification;
  }
}
