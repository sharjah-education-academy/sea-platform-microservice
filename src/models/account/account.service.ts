import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Account } from './account.model';
import { Constants } from 'src/config';
import { Attributes, FindAndCountOptions, FindOptions } from 'sequelize';
import { Op } from 'sequelize';
import { RoleService } from '../role/role.service';
import { Role } from '../role/role.model';
import { AccountFullResponse, AccountShortResponse } from './account.dto';
import {
  Utils as BackendUtils,
  Constants as BConstants,
} from 'sea-backend-helpers';
import { OrganizationService } from '../organization/organization.service';
import { DepartmentService } from '../department/department.service';
import { Organization } from '../organization/organization.model';
import { Department } from '../department/department.model';
import { ApplicationService } from '../application/application.service';
import { CONSTANTS, Utils } from 'sea-platform-helpers';
import { RolePermission } from '../role-permission/role-permission.model';

import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class AccountService {
  constructor(
    @Inject(Constants.Database.DatabaseRepositories.AccountRepository)
    private accountRepository: typeof Account,
    private readonly roleService: RoleService,
    private readonly organizationService: OrganizationService,
    private readonly departmentService: DepartmentService,
    private readonly applicationService: ApplicationService,
    @Inject(CACHE_MANAGER)
    private readonly cache: Cache,
  ) {}

  async getAccountRoles(account: Account) {
    return account.roles ? account.roles : await account.$get('roles');
  }

  async getAccountPermissionKeys(account: Account) {
    const roles = await this.getAccountRoles(account);

    const rolesPermissions = await Promise.all(
      roles.map((r) => this.roleService.getRolePermissions(r)),
    );

    const permissions = rolesPermissions.flat();

    const permissionKeys = permissions.map((p) => p.permissionKey);

    return Utils.Array.removeDuplicates(permissionKeys, (a, b) => a === b);
  }

  async findAll(
    options?: FindAndCountOptions<Attributes<Account>>,
    page: number = 1,
    limit: number = 10,
  ) {
    if (page < 1) page = 1;
    const offset = (page - 1) * limit;
    const { count: totalCount, rows: accounts } =
      await this.accountRepository.findAndCountAll({
        ...options,
        limit,
        offset,
      });
    return {
      totalCount,
      accounts,
    };
  }

  async findOne(options?: FindOptions<Attributes<Account>>) {
    return await this.accountRepository.findOne(options);
  }

  async checkIsFound(options?: FindOptions<Attributes<Account>>) {
    const account = await this.findOne(options);
    if (!account) throw new NotFoundException(`Account is not found!`);

    return account;
  }

  async checkPhoneNumberRegistered(phoneNumber: string) {
    const existingAccount = await this.accountRepository.findOne({
      where: {
        phoneNumber: { [Op.eq]: phoneNumber },
      },
    });

    if (existingAccount) {
      throw new BadRequestException('Phone Number already in use');
    }
  }

  async checkEmailRegistered(email: string) {
    const existingAccount = await this.accountRepository.findOne({
      where: {
        email: { [Op.eq]: email },
      },
    });

    if (existingAccount) {
      throw new BadRequestException('Email already in use');
    }
  }

  async assignOrganizationAndDepartmentAccount(
    account: Account,
    organizationId: string | undefined = undefined,
    departmentId: string | undefined = undefined,
  ) {
    organizationId = organizationId || undefined;
    departmentId = departmentId || undefined;

    let organization: Organization | undefined = undefined,
      department: Department | undefined = undefined;
    if (organizationId)
      organization = await this.organizationService.checkIsFound({
        where: { id: organizationId },
        include: [Department],
      });

    if (departmentId)
      department = await this.departmentService.checkIsFound({
        where: { id: departmentId },
      });

    if (organization && department)
      await this.organizationService.checkIsHasThisDepartment(
        organization,
        department,
      );
    account.organizationId = organization?.id ?? null;
    account.departmentId = department?.id ?? null;

    return account;
  }

  async create(data: Attributes<Account>, roleIds: string[]) {
    const { organizationId, departmentId, ...restDate } = data;
    await Promise.all([
      this.checkPhoneNumberRegistered(data.phoneNumber),
      this.checkEmailRegistered(data.email),
    ]);

    let roles: Role[] = [];

    if (roleIds) roles = await this.roleService.findByIds(roleIds);

    let organization: Organization | undefined = undefined,
      department: Department | undefined = undefined;
    if (organizationId)
      organization = await this.organizationService.checkIsFound({
        where: { id: organizationId },
        include: [Department],
      });

    if (departmentId)
      department = await this.departmentService.checkIsFound({
        where: { id: departmentId },
      });

    if (organization && department)
      await this.organizationService.checkIsHasThisDepartment(
        organization,
        department,
      );

    let account = await this.accountRepository.create({
      ...restDate,
      organizationId: organization?.id ?? null,
      departmentId: department?.id ?? null,
    });

    account = await account.save();

    await Promise.all(
      roles.map((r) => this.roleService.assignRoleToAccount(account, r)),
    );

    return account;
  }

  async updateMe(account: Account, data: Attributes<Account>) {
    const roles = await this.getAccountRoles(account);

    // pass same current role Ids
    const roleIds = roles.map((r) => r.id);

    return await this.update(account, data, roleIds);
  }

  async update(
    account: Account,
    data: Attributes<Account>,
    newRoleIds: string[],
  ) {
    if (data.phoneNumber && data.phoneNumber !== account.phoneNumber)
      await this.checkPhoneNumberRegistered(data.phoneNumber);
    if (data.email && data.email !== account.email)
      await this.checkEmailRegistered(data.email);

    let organization: Organization | undefined = undefined,
      department: Department | undefined = undefined;
    if (data.organizationId)
      organization = await this.organizationService.checkIsFound({
        where: { id: data.organizationId },
        include: [Department],
      });

    if (data.departmentId)
      department = await this.departmentService.checkIsFound({
        where: { id: data.departmentId },
      });

    if (organization && department)
      await this.organizationService.checkIsHasThisDepartment(
        organization,
        department,
      );

    // Fetch current and new roles
    const [currentRoles, newRoles] = await Promise.all([
      await this.getAccountRoles(account),
      await this.roleService.findByIds(newRoleIds),
    ]);

    // Determine roles to be removed and added
    const rolesToRemove = currentRoles.filter(
      (currentRole) =>
        !newRoles.some((newRole) => newRole.id === currentRole.id),
    );
    const rolesToAdd = newRoles.filter(
      (newRole) =>
        !currentRoles.some((currentRole) => currentRole.id === newRole.id),
    );

    if (rolesToRemove.length > 0) {
      await Promise.all(
        rolesToRemove.map((r) =>
          this.roleService.unassignRoleFromAccount(account, r),
        ),
      );
    }
    if (rolesToAdd.length > 0) {
      await Promise.all(
        rolesToAdd.map((r) => this.roleService.assignRoleToAccount(account, r)),
      );
    }

    return await account
      .update({
        ...data,
        organizationId: organization?.id ?? null,
        departmentId: department?.id ?? null,
      })
      .then(async (value) => {
        BackendUtils.Cache.updateIfExist(
          value.id,
          BConstants.Cache.CacheableModules.Account,
          await this.makeAccountFullResponse(value),
          this.cache as any,
        );
        return value;
      });
  }

  async createOrUpdate(data: Attributes<Account>, roleIds: string[]) {
    let account = await this.findOne({
      where: { email: data.email },
    });

    if (account) {
      account = await this.update(account, data, roleIds);
    } else {
      account = await this.create(data, roleIds);
    }

    return await account.save();
  }

  async toggleLockStatus(account: Account) {
    account.isLocked = !account.isLocked;
    return await account.save();
  }

  async restore(account: Account) {
    await account.restore();
    return account;
  }

  async delete(account: Account) {
    // TODO // to be reviewed after finish
    await account.destroy().then(() => {
      BackendUtils.Cache.deleteIfExist(
        account.id,
        BConstants.Cache.CacheableModules.Account,
        this.cache as any,
      );
      return;
    });
  }

  async changePassword(
    account: Account,
    newPassword: string,
    compareTheOldPassword: boolean = false,
    oldPassword: string = null,
  ) {
    if (compareTheOldPassword) {
      const isCorrect = await BackendUtils.Bcrypt.comparePassword(
        oldPassword,
        account?.password,
      );

      if (!isCorrect)
        throw new UnauthorizedException('Old password is incorrect.');
    }

    account.password = newPassword;
    await account.save();
    BackendUtils.Cache.deleteIfExist(account.id, 'Token', this.cache as any);
    return true;
  }

  async makeAccountShortResponse(account: Account) {
    const roles = await this.getAccountRoles(account);
    const rolesResponse = await this.roleService.makeRolesShortResponse(roles);
    const organization = account.organization
      ? account.organization
      : await account.$get('organization');
    const department = account.department
      ? account.department
      : await account.$get('department');

    const [organizationResponse, departmentResponse] = await Promise.all([
      this.organizationService.makeOrganizationResponse(organization),
      this.departmentService.makeDepartmentResponse(department),
    ]);

    return new AccountShortResponse(
      account,
      rolesResponse,
      organizationResponse,
      departmentResponse,
    );
  }

  async getAccountApplications(account: Account) {
    const roles = await this.getAccountRoles(account);

    const applicationIds = roles
      .map((role) => role.applicationId)
      .filter((value, index, self) => self.indexOf(value) === index);

    const { applications } = await this.applicationService.findAll(
      {
        where: {
          id: {
            [Op.in]: applicationIds,
          },
          status: {
            [Op.ne]: CONSTANTS.Application.ApplicationStatuses.Unavailable,
          },
        },
      },
      0,
      0,
      true,
    );

    return applications;
  }

  async makeAccountFullResponse(account: Account) {
    if (!account) return null;
    const accountResponse = await this.makeAccountShortResponse(account);

    // const accountPermissions = await this.getAccountPermissions(account);
    // const permissionKeys = accountPermissions.map((p) => p.permissionKey);
    const permissionKeys = await this.getAccountPermissionKeys(account);

    const organization = account.organization
      ? account.organization
      : await account.$get('organization');
    const department = account.department
      ? account.department
      : await account.$get('department');

    const [organizationResponse, departmentResponse] = await Promise.all([
      this.organizationService.makeOrganizationResponse(organization),
      this.departmentService.makeDepartmentResponse(department),
    ]);

    const applications = await this.getAccountApplications(account);

    const applicationKeys = applications.map((a) => a.key);

    return new AccountFullResponse(
      account,
      accountResponse.roles,
      organizationResponse,
      departmentResponse,
      permissionKeys,
      applicationKeys,
    );
  }

  async makeAccountsShortResponse(accounts: Account[]) {
    const accountsResponse: AccountShortResponse[] = [];
    for (let i = 0; i < accounts.length; i++) {
      const account = accounts[i];
      const AccountResponse = await this.makeAccountShortResponse(account);
      accountsResponse.push(AccountResponse);
    }
    return accountsResponse;
  }

  async makeAccountsFullResponse(accounts: Account[]) {
    const accountsResponse: AccountFullResponse[] = [];
    for (let i = 0; i < accounts.length; i++) {
      const account = accounts[i];
      const AccountResponse = await this.makeAccountFullResponse(account);
      accountsResponse.push(AccountResponse);
    }
    return accountsResponse;
  }

  async getAccountsInPermissionKeys(permissionKeys: string[]) {
    const { roles } = await this.roleService.findAll({
      include: [
        {
          model: RolePermission,
          as: 'rolePermissions',
          where: {
            permissionKey: {
              [Op.in]: permissionKeys,
            },
          },
        },
      ],
    });

    const roleIds = roles.map((r) => r.id);

    const accounts = await this.accountRepository.findAll({
      include: [
        {
          model: Role,
          as: 'roles',
          where: {
            id: {
              [Op.in]: roleIds,
            },
          },
        },
      ],
    });
    return accounts;
  }
}
