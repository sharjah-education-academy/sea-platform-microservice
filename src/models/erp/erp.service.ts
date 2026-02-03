import { Injectable } from '@nestjs/common';

import { EmployeeService } from './employee/employee.service';
import { RoleService } from '../role/role.service';
import { AccountService } from '../account/account.service';
import { Employee } from '../employee/employee.model';
import { Utils } from 'sea-platform-helpers';

@Injectable()
export class ERPService {
  constructor(
    private readonly employeeService: EmployeeService,
    private readonly roleService: RoleService,
    private readonly accountService: AccountService,
  ) {}

  async syncEmployees() {
    const data = await this.employeeService.fetchAll();

    const { rows: defaultEmployeeRoles } = await this.roleService.findAll(
      {
        where: {
          isEmployeeDefault: true,
        },
      },
      0,
      0,
      true,
    );

    const defaultEmployeeRoleIds = defaultEmployeeRoles.map((r) => r.id);

    for (const record of data) {
      if (!record.WorkEmail) continue;
      // Try to find account by email
      let account = await this.accountService.findByEmail(record.WorkEmail);

      const employeeData: Partial<Employee> = {
        salutation: record.Salutation,
        personNumber: record.PersonNumber,
        personId: record.PersonId,
        firstName: record.FirstName,
        middleName: record.MiddleName,
        lastName: record.LastName,
        displayName: record.DisplayName,
        workEmail: Utils.String.normalizeString(record.WorkEmail),
        username: record.UserName,
        gender: record.Gender,
        hireDate: record.HireDate ? new Date(record.HireDate) : null,
      };

      if (!record.UserName) {
        console.log(
          `The ERP Employee profile (${record.DisplayName}) has no username, it will be skipped!`,
        );
        continue;
      }

      if (account) {
        console.log(
          `Account already exists for employee email: ${record.WorkEmail} - Account ID: ${account.id}`,
        );

        const currentRoles = await this.accountService.getRoles(account);
        const currentRoleIds = currentRoles.map((role) => role.id);

        // Merge current roles + default employee roles (deduplicated)
        const mergedRoleIds = Array.from(
          new Set([...currentRoleIds, ...defaultEmployeeRoleIds]),
        );

        // Update account roles (no account data change, just roles)
        await this.accountService._update(account, {}, mergedRoleIds);

        // Check if employee already exists for this account
        const existingEmployee = await this.accountService.getEmployee(account);

        if (existingEmployee) {
          // Update existing employee
          await existingEmployee.update(employeeData);

          console.log(`Employee updated for account ID: ${account.id}`);
        } else {
          // Create new employee for existing account
          await account.$create('employee', employeeData);

          console.log(
            `Employee created for existing account ID: ${account.id}`,
          );
        }

        continue;
      }

      // Account does NOT exist → create account
      console.log(`Account not found for employee email: ${record.WorkEmail}`);

      account = await this.accountService._create(
        {
          email: record.WorkEmail,
          name: record.DisplayName,
        },
        defaultEmployeeRoleIds,
      );

      // Create employee for newly created account
      await account.$create('employee', employeeData);

      console.log(
        `Account and employee created for email: ${record.WorkEmail}`,
      );
    }

    return { length: data.length };
  }
}
