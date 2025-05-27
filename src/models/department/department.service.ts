import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Constants } from 'src/config';
import { Department } from './department.model';
import { Attributes, FindOptions, WhereOptions } from 'sequelize';
import {
  DepartmentArrayDataResponse,
  DepartmentResponse,
} from './department.dto';
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { OrganizationService } from '../organization/organization.service';

@Injectable()
export class DepartmentService {
  constructor(
    @Inject(Constants.Database.DatabaseRepositories.DepartmentRepository)
    private departmentRepository: typeof Department,

    @Inject(forwardRef(() => OrganizationService))
    private readonly organizationService: OrganizationService,
  ) {}

  async findAll(
    options?: FindOptions<Attributes<Department>>,
    page: number = 1,
    limit: number = 10,
  ) {
    if (page < 1) page = 1;
    const offset = (page - 1) * limit;
    const { count: totalCount, rows: departments } =
      await this.departmentRepository.findAndCountAll({
        ...options,
        limit,
        offset,
      });
    return {
      totalCount,
      departments,
    };
  }

  async findOne(options?: FindOptions<Attributes<Department>>) {
    return await this.departmentRepository.findOne(options);
  }

  async checkIsFound(options?: FindOptions<Attributes<Department>>) {
    const department = await this.findOne(options);
    if (!department) throw new NotFoundException(`Department is not found!`);

    return department;
  }

  async create(data: Attributes<Department>) {
    const department = new Department({
      ...data,
    });

    return await department.save();
  }

  async update(department: Department, data: Attributes<Department>) {
    return await department.update({ ...data });
  }

  async delete(department: Department) {
    return await department.destroy({ force: true });
  }

  async makeDepartmentResponse(department: Department | undefined) {
    if (!department) return undefined;

    const organization = department.organization
      ? department.organization
      : await department.$get('organization');
    const organizationResponse =
      await this.organizationService.makeOrganizationResponse(organization);

    const accounts = department.accounts
      ? department.accounts
      : await department.$get('accounts');

    return new DepartmentResponse(
      department,
      organizationResponse,
      accounts.length,
    );
  }

  async makeDepartmentsResponse(departments: Department[]) {
    const departmentsResponse = await Promise.all(
      departments.map((department) => this.makeDepartmentResponse(department)),
    );

    return departmentsResponse;
  }

  async makeDepartmentArrayDataResponse(
    page: number,
    limit: number,
    q: string,
    organizationId?: string,
  ) {
    const where: WhereOptions<Department> = {};
    if (q) {
      where[Op.or] = ['id', 'name'].map((c) =>
        Sequelize.where(
          Sequelize.fn('LOWER', Sequelize.col(`Department.${c}`)),
          {
            [Op.like]: `%${q}%`,
          },
        ),
      );
    }

    if (organizationId && organizationId != 'all')
      where['organizationId'] = organizationId;

    const { totalCount, departments } = await this.findAll(
      { where },
      page,
      limit,
    );

    const rolesResponse = await this.makeDepartmentsResponse(departments);

    return new DepartmentArrayDataResponse(
      totalCount,
      rolesResponse,
      page,
      limit,
    );
  }
}
