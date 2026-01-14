import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Account } from './account.model';
import { Constants } from 'src/config';
import {
  Attributes,
  CreateOptions,
  FindOptions,
  InstanceDestroyOptions,
  InstanceUpdateOptions,
  WhereOptions,
} from 'sequelize';
import { Op } from 'sequelize';
import { RoleService } from '../role/role.service';
import { Role } from '../role/role.model';
import {
  Utils as BackendUtils,
  Constants as BConstants,
  Services,
} from 'sea-backend-helpers';
import { OrganizationService } from '../organization/organization.service';
import { DepartmentService } from '../department/department.service';
import { Organization } from '../organization/organization.model';
import { Department } from '../department/department.model';
import { ApplicationService } from '../application/application.service';
import { CONSTANTS, Utils } from 'sea-platform-helpers';
import { RolePermission } from '../role-permission/role-permission.model';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { AccountAlertSettingService } from '../account-alert-setting/account-alert-setting.service';
import { AccountResponse } from './account.dto';
import { IncludeQuery } from 'sea-backend-helpers/dist/services/sequelize-crud.service';
import { Sequelize } from 'sequelize-typescript';
import { AccountArrayDataResponse } from 'src/controllers/account/account.dto';

const ACCOUNT_INCLUDES = [
  'roles',
  'organization',
  'department',
  'permissionKeys',
  'applicationKeys',
  'alertSettings',
] as const;

type AccountIncludes = (typeof ACCOUNT_INCLUDES)[number];

@Injectable()
export class AccountService extends Services.SequelizeCRUDService<
  Account,
  AccountResponse,
  CONSTANTS.Account.AccountIncludes
> {
  constructor(
    @Inject(Constants.Database.DatabaseRepositories.AccountRepository)
    private accountRepository: typeof Account,
    private readonly roleService: RoleService,
    private readonly organizationService: OrganizationService,
    private readonly departmentService: DepartmentService,
    private readonly applicationService: ApplicationService,
    private readonly accountAlertSettingService: AccountAlertSettingService,
    @Inject(CACHE_MANAGER)
    private readonly cache: Cache,
  ) {
    super(accountRepository, 'Account');
  }

  async getRoles(account: Account) {
    return account.roles ? account.roles : await account.$get('roles');
  }

  async getPermissionKeys(account: Account) {
    const roles = await this.getRoles(account);

    const rolesPermissions = await Promise.all(
      roles.map((r) => this.roleService.getRolePermissions(r)),
    );

    const permissions = rolesPermissions.flat();

    const permissionKeys = permissions.map((p) => p.permissionKey);

    return Utils.Array.removeDuplicates(permissionKeys, (a, b) => a === b);
  }

  async find(options?: FindOptions<Attributes<Account>>) {
    return await this.accountRepository.findAll(options);
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

  async _create(
    data: Attributes<Account>,
    roleIds: string[],
    options?: CreateOptions<Account>,
  ) {
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

    return await super
      .create(
        {
          ...restDate,
          organizationId: organization?.id ?? null,
          departmentId: department?.id ?? null,
        },
        options,
      )
      .then(async (created) => {
        await Promise.all(
          roles.map((r) => this.roleService.assignRoleToAccount(created, r)),
        );
        return created;
      });
  }

  async updateMe(account: Account, data: Attributes<Account>) {
    const roles = await this.getRoles(account);

    // pass same current role Ids
    const roleIds = roles.map((r) => r.id);

    return await this._update(account, data, roleIds);
  }

  async _update(
    account: Account,
    data: Partial<Attributes<Account>>,
    newRoleIds: string[],
    options?: InstanceUpdateOptions<Account>,
  ): Promise<Account> {
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
      await this.getRoles(account),
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

    return await super
      .update(
        account,
        {
          ...data,
          organizationId: organization?.id ?? null,
          departmentId: department?.id ?? null,
        },
        options,
      )
      .then(async (value) => {
        BackendUtils.Cache.updateIfExist(
          value.id,
          BConstants.Cache.CacheableModules.Account,
          await this.makeResponse(value, 'all'),
          this.cache as any,
        );
        return value;
      });
  }

  // async update(
  //   account: Account,
  //   data: Attributes<Account>,
  //   newRoleIds: string[],
  // ) {
  //   if (data.phoneNumber && data.phoneNumber !== account.phoneNumber)
  //     await this.checkPhoneNumberRegistered(data.phoneNumber);
  //   if (data.email && data.email !== account.email)
  //     await this.checkEmailRegistered(data.email);

  //   let organization: Organization | undefined = undefined,
  //     department: Department | undefined = undefined;
  //   if (data.organizationId)
  //     organization = await this.organizationService.checkIsFound({
  //       where: { id: data.organizationId },
  //       include: [Department],
  //     });

  //   if (data.departmentId)
  //     department = await this.departmentService.checkIsFound({
  //       where: { id: data.departmentId },
  //     });

  //   if (organization && department)
  //     await this.organizationService.checkIsHasThisDepartment(
  //       organization,
  //       department,
  //     );

  //   // Fetch current and new roles
  //   const [currentRoles, newRoles] = await Promise.all([
  //     await this.getRoles(account),
  //     await this.roleService.findByIds(newRoleIds),
  //   ]);

  //   // Determine roles to be removed and added
  //   const rolesToRemove = currentRoles.filter(
  //     (currentRole) =>
  //       !newRoles.some((newRole) => newRole.id === currentRole.id),
  //   );
  //   const rolesToAdd = newRoles.filter(
  //     (newRole) =>
  //       !currentRoles.some((currentRole) => currentRole.id === newRole.id),
  //   );

  //   if (rolesToRemove.length > 0) {
  //     await Promise.all(
  //       rolesToRemove.map((r) =>
  //         this.roleService.unassignRoleFromAccount(account, r),
  //       ),
  //     );
  //   }
  //   if (rolesToAdd.length > 0) {
  //     await Promise.all(
  //       rolesToAdd.map((r) => this.roleService.assignRoleToAccount(account, r)),
  //     );
  //   }

  //   return await account
  //     .update({
  //       ...data,
  //       organizationId: organization?.id ?? null,
  //       departmentId: department?.id ?? null,
  //     })
  //     .then(async (value) => {
  //       BackendUtils.Cache.updateIfExist(
  //         value.id,
  //         BConstants.Cache.CacheableModules.Account,
  //         await this.makeResponse(value, 'all'),
  //         this.cache as any,
  //       );
  //       return value;
  //     });
  // }

  async createOrUpdate(data: Attributes<Account>, roleIds: string[]) {
    let account = await this.findOne({
      where: { email: data.email },
    });

    if (account) {
      account = await this._update(account, data, roleIds);
    } else {
      account = await this._create(data, roleIds);
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

  async delete(
    account: Account,
    options?: InstanceDestroyOptions,
  ): Promise<Account> {
    return await super
      .delete(account, { ...options, force: false })
      .then((deleted) => {
        BackendUtils.Cache.deleteIfExist(
          account.id,
          BConstants.Cache.CacheableModules.Account,
          this.cache as any,
        );

        return deleted;
      });
  }

  // async delete(account: Account) {
  //   // TODO // to be reviewed after finish
  //   await account.destroy().then(() => {
  //     BackendUtils.Cache.deleteIfExist(
  //       account.id,
  //       BConstants.Cache.CacheableModules.Account,
  //       this.cache as any,
  //     );
  //     return;
  //   });
  // }

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

  async getAccountApplications(account: Account) {
    const roles = await this.getRoles(account);

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

  async getOrganization(account: Account) {
    return account.organization
      ? account.organization
      : await account.$get('organization');
  }

  async getDepartment(account: Account) {
    return account.department
      ? account.department
      : await account.$get('department');
  }

  async makeResponse(
    account: Account,
    include?: IncludeQuery<CONSTANTS.Account.AccountIncludes>,
  ): Promise<AccountResponse> {
    if (!account) return null;

    // Normalize include to array
    const includeArray: AccountIncludes[] =
      include === CONSTANTS.Global.AllValue
        ? [...ACCOUNT_INCLUDES] // return all values
        : (include ?? []);

    const [
      includeOrganization,
      includeDepartment,
      includeAlertSettings,
      includeRoles,
      includePermissionKeys,
      includeApplicationKeys,
    ] = [
      includeArray.includes('organization'),
      includeArray.includes('department'),
      includeArray.includes('alertSettings'),
      includeArray.includes('roles'),
      includeArray.includes('permissionKeys'),
      includeArray.includes('applicationKeys'),
    ];

    const results = await Promise.all([
      includeOrganization
        ? this.getOrganization(account)
        : Promise.resolve(null),
      includeDepartment ? this.getDepartment(account) : Promise.resolve(null),
      includeAlertSettings
        ? this.accountAlertSettingService.makeAccountAlertsSettingsResponse(
            account,
          )
        : Promise.resolve(null),
      includeRoles ? this.getRoles(account) : Promise.resolve(null),
      includePermissionKeys
        ? this.getPermissionKeys(account)
        : Promise.resolve(null),
      includeApplicationKeys
        ? this.getAccountApplications(account)
        : Promise.resolve(null),
    ]);

    const [
      organization,
      department,
      alertSettings,
      roles,
      permissionKeys,
      applications,
    ] = results;

    const [rolesResponse, organizationResponse, departmentResponse] =
      await Promise.all([
        includeRoles
          ? this.roleService.makeRolesShortResponse(roles)
          : Promise.resolve(null),
        includeOrganization
          ? this.organizationService.makeOrganizationResponse(organization)
          : Promise.resolve(null),
        includeDepartment
          ? this.departmentService.makeDepartmentResponse(department)
          : Promise.resolve(null),
      ]);

    const applicationKeys = (applications || []).map((a) => a.key);

    return new AccountResponse(
      account,
      rolesResponse,
      organizationResponse,
      departmentResponse,
      permissionKeys,
      applicationKeys,
      alertSettings,
    );
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

  async makeAccountArrayDataResponse(
    page: number,
    limit: number,
    q: string,
    roleId: string | CONSTANTS.Global.AllType,
    isDeleted: boolean,
    include?: IncludeQuery<CONSTANTS.Account.AccountIncludes>,
  ) {
    const where: WhereOptions<Account> = {};
    const roleWhere: WhereOptions<Role> = {};

    if (q) {
      where[Op.or] = ['id', 'name', 'email', 'phoneNumber'].map((c) =>
        Sequelize.where(Sequelize.fn('LOWER', Sequelize.col(`Account.${c}`)), {
          [Op.like]: `%${q}%`,
        }),
      );
    }

    if (isDeleted) {
      where['deletedAt'] = { [Op.ne]: null };
    }

    if (roleId !== 'all') {
      roleWhere['id'] = roleId;
    }

    const { totalCount, rows: accounts } = await this.findAll(
      {
        where,
        include: [{ model: Role, where: roleWhere }],
        paranoid: !isDeleted,
        distinct: true,
      },
      page,
      limit,
    );

    const accountsResponse = await this.makeResponses(accounts, include);

    return new AccountArrayDataResponse(
      totalCount,
      accountsResponse,
      page,
      limit,
    );
  }
}
