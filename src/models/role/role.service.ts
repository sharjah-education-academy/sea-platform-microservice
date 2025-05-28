import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Constants } from 'src/config';
import { Attributes, FindOptions, WhereOptions } from 'sequelize';
import { Role } from './role.model';
import { PermissionService } from '../permission/permission.service';
import { RoleFullResponse, RoleShortResponse } from './role.dto';
import { RoleShortArrayDataResponse } from 'src/controllers/role/role.dto';
import { Op } from 'sequelize';
import { Account } from '../account/account.model';
import { RolePermissionService } from '../role-permission/role-permission.service';
import { AccountPermissionService } from '../account-permission/account-permission.service';
import { Sequelize } from 'sequelize-typescript';
import { CONSTANTS } from 'sea-platform-helpers';
import { ApplicationService } from '../application/application.service';

@Injectable()
export class RoleService {
  constructor(
    @Inject(Constants.Database.DatabaseRepositories.RoleRepository)
    private roleRepository: typeof Role,
    private readonly permissionService: PermissionService,
    private readonly rolePermissionService: RolePermissionService,
    private readonly accountPermissionService: AccountPermissionService,
    private readonly applicationService: ApplicationService,
  ) {}

  async getRolePermissions(role: Role) {
    return role.rolePermissions
      ? role.rolePermissions
      : await role.$get('rolePermissions');
  }

  async getAccountPermissions(role: Role) {
    return role.accountPermissions
      ? role.accountPermissions
      : await role.$get('accountPermissions');
  }

  async getAccounts(role: Role) {
    return role.accounts ? role.accounts : await role.$get('accounts');
  }

  async create(
    data: Attributes<Role>,
    permissionKeys: string[],
    applicationKey: CONSTANTS.Application.ApplicationKeys,
  ) {
    const application = await this.applicationService.checkIsFound({
      where: { key: applicationKey },
    });

    const role = new Role({
      ...data,
      applicationId: application.id,
    });

    await role.save();

    await this.rolePermissionService.createMultiForRole(permissionKeys, role);

    return role;
  }

  async update(
    role: Role,
    data: Attributes<Role>,
    permissionKeys: CONSTANTS.Permission.PermissionKeys[],
  ) {
    role = await role.update({ ...data });

    await this.rolePermissionService.updateKeysForRole(role, permissionKeys);

    // update the account permissions for all accounts has this role
    const accounts = await this.getAccounts(role);
    await Promise.all(
      accounts.map((a) =>
        this.accountPermissionService.updateKeysForAccount(
          a,
          role,
          permissionKeys,
        ),
      ),
    );

    return role;
  }

  async findAll(
    options?: FindOptions<Attributes<Role>>,
    page: number = 1,
    limit: number = 10,
  ) {
    if (page < 1) page = 1;
    const offset = (page - 1) * limit;
    const { count: totalCount, rows: roles } =
      await this.roleRepository.findAndCountAll({
        ...options,
        limit,
        offset,
      });
    return {
      totalCount,
      roles,
    };
  }

  async findByIds(ids: string[]) {
    return await this.roleRepository.findAll({
      where: { id: { [Op.in]: ids } },
    });
  }

  async findOne(options?: FindOptions<Attributes<Role>>) {
    return await this.roleRepository.findOne(options);
  }

  async checkIsFound(options?: FindOptions<Attributes<Role>>) {
    const role = await this.findOne(options);
    if (!role) throw new NotFoundException(`Role is not found!`);

    return role;
  }

  async assignRoleToAccount(account: Account, role: Role) {
    const rolePermissions = await this.getRolePermissions(role);

    await Promise.all(
      rolePermissions.map(async (rp) => {
        return await this.accountPermissionService.create({
          accountId: account.id,
          roleId: role.id,
          permissionKey: rp.permissionKey,
        });
      }),
    );

    return await account.$add('roles', role);
  }

  async unassignRoleFromAccount(account: Account, role: Role) {
    const accountPermissions = await this.getAccountPermissions(role);

    await Promise.all(
      accountPermissions.map(async (ap) => {
        return await this.accountPermissionService.delete(ap);
      }),
    );

    // Remove the role from the account
    return await account.$remove('roles', role);
  }

  async makeRoleShortResponse(role: Role) {
    const application = role.application
      ? role.application
      : await role.$get('application');
    const applicationResponse =
      await this.applicationService.makeApplicationResponse(application);
    return new RoleShortResponse(role, applicationResponse);
  }

  async makeRolesShortResponse(roles: Role[]) {
    const rolesResponse: RoleShortResponse[] = [];
    for (let i = 0; i < roles.length; i++) {
      const role = roles[i];
      const roleResponse = await this.makeRoleShortResponse(role);
      rolesResponse.push(roleResponse);
    }
    return rolesResponse;
  }

  async makeRoleShortArrayDataResponse(
    page: number,
    limit: number,
    q: string,
    applicationId: string,
  ) {
    const where: WhereOptions<Role> = {};
    if (applicationId != 'all') where.applicationId = applicationId;
    if (q) {
      where[Op.or] = ['id', 'name'].map((c) =>
        Sequelize.where(Sequelize.fn('LOWER', Sequelize.col(`Role.${c}`)), {
          [Op.like]: `%${q}%`,
        }),
      );
    }

    const { totalCount, roles } = await this.findAll({ where }, page, limit);

    const rolesResponse = await this.makeRolesShortResponse(roles);

    return new RoleShortArrayDataResponse(
      totalCount,
      rolesResponse,
      page,
      limit,
    );
  }

  async makeRoleFullResponse(role: Role): Promise<RoleFullResponse> {
    const application = role.application
      ? role.application
      : await role.$get('application');
    const applicationResponse =
      await this.applicationService.makeApplicationResponse(application);

    const rolePermissions = await this.getRolePermissions(role);

    const permissionKeys = rolePermissions.map((p) => p.permissionKey);

    const PERMISSIONS = CONSTANTS.Permission.PERMISSIONS.filter(
      (p) => p.applicationKey === application.key,
    );

    const permissionsResponse = await Promise.all(
      PERMISSIONS.map((permission) =>
        this.permissionService.makePermissionResponseForRole(
          permission,
          permissionKeys,
        ),
      ),
    );

    return new RoleFullResponse(role, applicationResponse, permissionsResponse);
  }

  async delete(role: Role) {
    // Fetch accounts associated with the role
    const accounts = await this.getAccounts(role);

    if (accounts && accounts.length) {
      throw new BadRequestException(
        `There are (${accounts.length}) accounts associated with this role, it can't be deleted`,
      );
    }

    // Forcefully delete associated RolePermissions and AccountPermissions
    const rolePermissions = await this.getRolePermissions(role);
    await rolePermissions.map((permission) =>
      this.rolePermissionService.delete(permission),
    );

    // Delete the role itself
    return await role.destroy({ force: true });
  }
}
