import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Constants } from 'src/config';
import { Organization } from './organization.model';
import { Attributes, FindOptions, WhereOptions } from 'sequelize';
import {
  OrganizationArrayDataResponse,
  OrganizationResponse,
} from './organization.dto';
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { DepartmentService } from '../department/department.service';
import { Department } from '../department/department.model';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { Utils, Constants as BConstants } from 'sea-backend-helpers';

@Injectable()
export class OrganizationService {
  constructor(
    @Inject(Constants.Database.DatabaseRepositories.OrganizationRepository)
    private organizationRepository: typeof Organization,
    @Inject(forwardRef(() => DepartmentService))
    private readonly departmentService: DepartmentService,
    @Inject(CACHE_MANAGER)
    private readonly cache: Cache,
  ) {}

  async findAll(
    options?: FindOptions<Attributes<Organization>>,
    page: number = 1,
    limit: number = 10,
    all = false,
  ) {
    if (page < 1) page = 1;
    const offset = (page - 1) * limit;

    options = all ? options : { ...options, limit, offset };

    const { count: totalCount, rows: organizations } =
      await this.organizationRepository.findAndCountAll(options);
    return {
      totalCount,
      organizations,
    };
  }

  async findOne(options?: FindOptions<Attributes<Organization>>) {
    return await this.organizationRepository.findOne(options);
  }

  async checkIsFound(options?: FindOptions<Attributes<Organization>>) {
    const organization = await this.findOne(options);
    if (!organization)
      throw new NotFoundException(`Organization is not found!`);

    return organization;
  }

  async create(data: Attributes<Organization>) {
    const organization = new Organization({
      ...data,
    });

    return await organization.save();
  }

  async update(organization: Organization, data: Attributes<Organization>) {
    return await organization.update({ ...data }).then(async (value) => {
      Utils.Cache.updateIfExist(
        value.id,
        BConstants.Cache.CacheableModules.Organization,
        await this.makeOrganizationResponse(value),
        this.cache as any,
      );
      return value;
    });
  }

  async delete(organization: Organization) {
    return await organization.destroy({ force: true }).then(() => {
      Utils.Cache.deleteIfExist(
        organization.id,
        BConstants.Cache.CacheableModules.Organization,
        this.cache as any,
      );
      return;
    });
  }

  async makeOrganizationResponse(organization: Organization | undefined) {
    if (!organization) return undefined;

    const accounts = organization.accounts
      ? organization.accounts
      : await organization.$get('accounts');

    return new OrganizationResponse(organization, accounts.length);
  }

  async makeOrganizationsResponse(organizations: Organization[]) {
    const organizationsResponse = await Promise.all(
      organizations.map((organization) =>
        this.makeOrganizationResponse(organization),
      ),
    );

    return organizationsResponse;
  }

  async makeOrganizationArrayDataResponse(
    page: number,
    limit: number,
    q: string,
  ) {
    const where: WhereOptions<Organization> = {};
    if (q) {
      where[Op.or] = ['id', 'name'].map((c) =>
        Sequelize.where(
          Sequelize.fn('LOWER', Sequelize.col(`Organization.${c}`)),
          {
            [Op.like]: `%${q}%`,
          },
        ),
      );
    }

    const { totalCount, organizations } = await this.findAll(
      { where },
      page,
      limit,
    );

    const rolesResponse = await this.makeOrganizationsResponse(organizations);

    return new OrganizationArrayDataResponse(
      totalCount,
      rolesResponse,
      page,
      limit,
    );
  }

  async isHasThisDepartment(
    organization: Organization,
    department: Department,
  ) {
    const departments = organization.departments
      ? organization.departments
      : await organization.$get('departments');
    return departments.some((d) => d.id === department.id);
  }

  async checkIsHasThisDepartment(
    organization: Organization,
    department: Department,
  ) {
    const isHas = await this.isHasThisDepartment(organization, department);
    if (!isHas)
      throw new NotFoundException(
        `Organization does not have this department!`,
      );

    return isHas;
  }
}
