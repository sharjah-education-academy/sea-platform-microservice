import { Inject, Injectable } from '@nestjs/common';
import { Constants } from 'src/config';
import { Employee } from './employee.model';
import { InstanceDestroyOptions } from 'sequelize';
import { EmployeeResponse } from './employee.dto';
import { CONSTANTS } from 'sea-platform-helpers';
import { Services } from 'sea-backend-helpers';
import { IncludeQuery } from 'sea-backend-helpers/dist/services/sequelize-crud.service';

@Injectable()
export class EmployeeService extends Services.SequelizeCRUDService<
  Employee,
  EmployeeResponse,
  CONSTANTS.Employee.EmployeeIncludes
> {
  constructor(
    @Inject(Constants.Database.DatabaseRepositories.EmployeeRepository)
    private employeeRepository: typeof Employee,
  ) {
    super(employeeRepository, 'Employee');
  }

  async makeResponse(
    entity: Employee,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    include?: IncludeQuery<CONSTANTS.Employee.EmployeeIncludes>,
  ): Promise<EmployeeResponse> {
    if (!entity) return undefined;

    return new EmployeeResponse(entity);
  }

  async delete(
    entity: Employee,
    options?: InstanceDestroyOptions,
  ): Promise<Employee> {
    return await super.delete(entity, { ...options, force: true });
  }
}
