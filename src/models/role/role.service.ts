import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Constants } from 'src/config';
import {
  Attributes,
  CreateOptions,
  InstanceDestroyOptions,
  InstanceUpdateOptions,
  WhereOptions,
} from 'sequelize';
import { Role } from './role.model';
import { PermissionService } from '../permission/permission.service';
import { RoleArrayDataResponse, RoleResponse } from './role.dto';
import { Op } from 'sequelize';
import { Account } from '../account/account.model';
import { RolePermissionService } from '../role-permission/role-permission.service';
import { Sequelize } from 'sequelize-typescript';
import { CONSTANTS } from 'sea-platform-helpers';
import { ApplicationService } from '../application/application.service';
import { AuthService } from '../auth/auth.service';
import { Services } from 'sea-backend-helpers';
import { IncludeQuery } from 'sea-backend-helpers/dist/services/sequelize-crud.service';

const ROLE_INCLUDES = ['application', 'permissions'] as const;

type RoleIncludes = (typeof ROLE_INCLUDES)[number];

@Injectable()
export class RoleService extends Services.SequelizeCRUDService<
  Role,
  RoleResponse,
  CONSTANTS.Role.RoleIncludes
> {
  constructor(
    @Inject(Constants.Database.DatabaseRepositories.RoleRepository)
    private roleRepository: typeof Role,
    private readonly permissionService: PermissionService,
    private readonly rolePermissionService: RolePermissionService,
    private readonly applicationService: ApplicationService,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {
    super(roleRepository, 'Application');
  }

  async getRolePermissions(role: Role) {
    return role.rolePermissions
      ? role.rolePermissions
      : await role.$get('rolePermissions');
  }

  async getAccounts(role: Role) {
    return role.accounts ? role.accounts : await role.$get('accounts');
  }

  async getApplication(role: Role) {
    return role.application ? role.application : await role.$get('application');
  }

  async create(
    data: Attributes<Role>,
    options?: CreateOptions<Role>,
  ): Promise<Role> {
    await this.applicationService.checkIsFoundByPk(data.applicationId);
    return await super.create(data, options);
  }

  async _create(
    data: Attributes<Role>,
    permissionKeys: CONSTANTS.Permission.PermissionKeys[],
  ) {
    const role = await this.create(data);

    await this.rolePermissionService.createMultiForRole(permissionKeys, role);

    return role;
  }

  async update(
    entity: Role,
    data: Partial<Role>,
    options?: InstanceUpdateOptions<Role>,
  ): Promise<Role> {
    // can't change the application id
    delete data.applicationId;

    return await super.update(entity, data, options);
  }

  async _update(
    entity: Role,
    data: Partial<Role>,
    permissionKeys: CONSTANTS.Permission.PermissionKeys[],
  ) {
    return await this.update(entity, data).then(async (updated) => {
      const { permissionsUpdated } =
        await this.rolePermissionService.updateKeysForRole(
          updated,
          permissionKeys,
        );
      if (permissionsUpdated) this.authService.invalidateTokensForRole(updated);
      return updated;
    });
  }

  async createOrUpdate(data: Attributes<Role>) {
    const existing = await this.findOne({
      where: {
        name: data.name,
        isStudentDefault: data.isStudentDefault,
        isFacultyDefault: data.isFacultyDefault,
        isEmployeeDefault: data.isEmployeeDefault,
        isDeletable: data.isDeletable,
      },
    });
    if (existing) return await this.update(existing, data);
    else return await this.create(data);
  }

  async _createOrUpdate(
    data: Attributes<Role>,
    permissionKeys: CONSTANTS.Permission.PermissionKeys[],
  ) {
    const existing = await this.findOne({
      where: {
        name: data.name,
        isStudentDefault: data.isStudentDefault,
        isFacultyDefault: data.isFacultyDefault,
        isEmployeeDefault: data.isEmployeeDefault,
        isDeletable: data.isDeletable,
      },
    });
    if (existing) return await this._update(existing, data, permissionKeys);
    else return await this._create(data, permissionKeys);
  }

  async findByIds(ids: string[]) {
    return await this.roleRepository.findAll({
      where: { id: { [Op.in]: ids } },
    });
  }

  async assignRoleToAccount(account: Account, role: Role) {
    return await account.$add('roles', role);
  }

  async unassignRoleFromAccount(account: Account, role: Role) {
    return await account.$remove('roles', role);
  }

  async makeRoleArrayDataResponse(
    page: number,
    limit: number,
    q: string,
    applicationId: string | CONSTANTS.Global.AllType,
    include?: IncludeQuery<CONSTANTS.Role.RoleIncludes>,
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

    const { totalCount, rows: roles } = await this.findAll(
      { where },
      page,
      limit,
    );

    const rolesResponse = await this.makeResponses(roles, include);

    return new RoleArrayDataResponse(totalCount, rolesResponse, page, limit);
  }

  async makeResponse(
    role: Role,
    include?: IncludeQuery<CONSTANTS.Role.RoleIncludes>,
  ): Promise<RoleResponse> {
    if (!role) return null;

    // Normalize include to array
    const includeArray: RoleIncludes[] =
      include === CONSTANTS.Global.AllValue
        ? [...ROLE_INCLUDES] // return all values
        : (include ?? []);

    const [includeApplication, includePermissions] = [
      includeArray.includes('application'),
      includeArray.includes('permissions'),
    ];

    const [application, rolePermissions] = await Promise.all([
      includeApplication || includePermissions
        ? this.getApplication(role)
        : Promise.resolve(null),
      includePermissions
        ? this.getRolePermissions(role)
        : Promise.resolve(null),
    ]);

    const permissionKeys = (rolePermissions || []).map((p) => p.permissionKey);

    const PERMISSIONS = CONSTANTS.Permission.PERMISSIONS.filter(
      (p) => p.applicationKey === application?.key,
    );

    const [applicationResponse, permissionsResponse] = await Promise.all([
      includeApplication
        ? this.applicationService.makeResponse(application)
        : Promise.resolve(null),
      includePermissions
        ? await Promise.all(
            PERMISSIONS.map((permission) =>
              this.permissionService.makePermissionResponseForRole(
                permission,
                permissionKeys,
              ),
            ),
          )
        : Promise.resolve(null),
    ]);

    return new RoleResponse(role, applicationResponse, permissionsResponse);
  }

  async delete(role: Role, options?: InstanceDestroyOptions): Promise<Role> {
    if (!role.isDeletable)
      throw new BadRequestException(
        `Can't delete this role (${role.name}), it is not deletable`,
      );

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

    return await super
      .delete(role, { ...options, force: true })
      .then((deleted) => {
        this.authService.invalidateTokensForRole(role);
        return deleted;
      });
  }
}
