import { Injectable } from '@nestjs/common';

import { CreatrixStudentService } from './student/student.service';
import { CreatrixFacultyService } from './faculty/faculty.service';
import { StudentService } from '../student/student.service';
import { FacultyService } from '../faculty/faculty.service';
import { AccountService } from '../account/account.service';
import { Faculty } from '../faculty/faculty.model';
import { Student } from '../student/student.model';
import { Utils } from 'sea-platform-helpers';
import { RoleService } from '../role/role.service';

@Injectable()
export class CreatrixService {
  constructor(
    private readonly creatrixStudentService: CreatrixStudentService,
    private readonly creatrixFacultyService: CreatrixFacultyService,
    private readonly studentService: StudentService,
    private readonly facultyService: FacultyService,
    private readonly accountService: AccountService,
    private readonly roleService: RoleService,
  ) {}

  private createDateFromCreatrixDate(creatrixDate: string) {
    const [day, month, year] = creatrixDate.split('-').map(Number);
    return new Date(year, month - 1, day);
  }

  async syncStudents() {
    const data = await this.creatrixStudentService.repository.findAll();

    const { roles: defaultStudentRoles } = await this.roleService.findAll(
      {
        where: {
          isStudentDefault: true,
        },
      },
      0,
      0,
      true,
    );

    const defaultStudentRoleIds = defaultStudentRoles.map((r) => r.id);

    for (const record of data) {
      // Try to find account by email
      let account = await this.accountService.findByEmail(record.email);

      const studentData: Partial<Student> = {
        SSNNo: record.ssno,
        nameEn: record.name,
        nameAr: record.student_name_arab,
        email: Utils.String.normalizeString(record.email),
        gender: record.gender,
        admissionNo: record.admission_no,
        mobileNumber: record.mobile_no,
        nationality: record.nationality,
        passportNumber: record.passport_no,
        emiratesId: record.emirates_id_number,
        employmentStatus: record.employment_status,
        employerName: record.employer_name,
        employmentLocationCountry: record.employment_location_country,
        employmentLocationCity: record.employment_location_city,
        bachelorsInstitutionName: record.bachelors_institution_name,
        arabicLanguageTestType: record.arabic_language_test_type,
        arabicLanguageTestScore: record.arabic_language_test_score,
        arabicLanguageTestDate: record.arabic_language_test_date
          ? this.createDateFromCreatrixDate(record.arabic_language_test_date)
          : null,
        englishLanguageTestType: record.english_language_test_type,
        englishLanguageTestScore: record.english_language_test_score,
        englishLanguageTestDate: record.english_language_test_date
          ? this.createDateFromCreatrixDate(record.english_language_test_date)
          : null,
        currentEnrolmentStatus: record.current_enrollment_status,

        status: record.status,
        secondaryEmail: Utils.String.normalizeString(record.secondary_email),
        CGPAValue: record.cgpa_value ? Number(record.cgpa_value) : null,
        passportIssuingAuthority: record.passport_issuing_authority,
        passportIssueDate: record.passport_issue_date
          ? this.createDateFromCreatrixDate(record.passport_issue_date)
          : null,
        emirateState: record.emirate_state,
        detailedAddress: record.detailed_address_1,
        maritalStatus: record.marital_status,
        motherNationality: record.mother_nationality,
        familyBookNumber: record.family_book_number,
        familyNumber: record.family_number,
        highestQualification: record.the_highest_qualification_you,
      };

      if (account) {
        console.log(
          `Account already exists for student email: ${record.email} - Account ID: ${account.id}`,
        );

        const currentRoles = await this.accountService.getRoles(account);
        const currentRoleIds = currentRoles.map((role) => role.id);

        // Merge current roles + default employee roles (deduplicated)
        const mergedRoleIds = Array.from(
          new Set([...currentRoleIds, ...defaultStudentRoleIds]),
        );

        // Update account roles (no account data change, just roles)
        await this.accountService._update(account, {}, mergedRoleIds);

        // Check if student already exists for this account
        const existingStudent = await this.accountService.getStudent(account);

        if (existingStudent) {
          // Update existing student
          await existingStudent.update(studentData);

          console.log(`Student updated for account ID: ${account.id}`);
        } else {
          // Create new student for existing account
          await account.$create('student', studentData);

          console.log(`Student created for existing account ID: ${account.id}`);
        }

        continue;
      }

      // Account does NOT exist → create account
      console.log(`Account not found for student email: ${record.email}`);

      account = await this.accountService._create(
        {
          email: record.email,
          name: record.name,
        },
        defaultStudentRoleIds,
      );

      // Create student for newly created account
      await account.$create('student', studentData);

      console.log(`Account and student created for email: ${record.email}`);
    }

    return { length: data.length };
  }

  async syncFaculties() {
    const data = await this.creatrixFacultyService.repository.findAll();

    const { roles: defaultFacultyRoles } = await this.roleService.findAll(
      {
        where: {
          isFacultyDefault: true,
        },
      },
      0,
      0,
      true,
    );

    const defaultFacultyRoleIds = defaultFacultyRoles.map((r) => r.id);

    for (const record of data) {
      // Try to find account by email
      let account = await this.accountService.findByEmail(record.email);

      const facultyData: Partial<Faculty> = {
        name: record.name,
        email: Utils.String.normalizeString(record.email),
        address: record.permanent_address,
        designation: record.employee_designation,
        contactNumber: record.contact,
      };

      if (account) {
        console.log(
          `Account already exists for faculty email: ${record.email} - Account ID: ${account.id}`,
        );

        const currentRoles = await this.accountService.getRoles(account);
        const currentRoleIds = currentRoles.map((role) => role.id);

        // Merge current roles + default employee roles (deduplicated)
        const mergedRoleIds = Array.from(
          new Set([...currentRoleIds, ...defaultFacultyRoleIds]),
        );

        // Update account roles (no account data change, just roles)
        await this.accountService._update(account, {}, mergedRoleIds);

        // Check if faculty already exists for this account
        const existingFaculty = await this.accountService.getFaculty(account);

        if (existingFaculty) {
          // Update existing faculty
          await existingFaculty.update(facultyData);

          console.log(`Faculty updated for account ID: ${account.id}`);
        } else {
          // Create new faculty for existing account
          await account.$create('faculty', facultyData);

          console.log(`Faculty created for existing account ID: ${account.id}`);
        }

        continue;
      }

      // Account does NOT exist → create account
      console.log(`Account not found for faculty email: ${record.email}`);

      account = await this.accountService._create(
        {
          email: record.email,
          name: record.name,
        },
        defaultFacultyRoleIds,
      );

      // Create faculty for newly created account
      await account.$create('faculty', facultyData);

      console.log(`Account and faculty created for email: ${record.email}`);
    }

    return { length: data.length, data };
  }
}
