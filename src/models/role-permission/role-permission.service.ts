import { Inject, Injectable } from '@nestjs/common';

import { Constants } from 'src/config';
import { RolePermission } from './role-permission.model';
import { Attributes, Op } from 'sequelize';
import { PermissionService } from '../permission/permission.service';
import { Role } from '../role/role.model';
import { CONSTANTS } from 'sea-platform-helpers';

@Injectable()
export class RolePermissionService {
  constructor(
    @Inject(Constants.Database.DatabaseRepositories.RolePermissionRepository)
    private rolePermissionRepository: typeof RolePermission,
    private readonly permissionService: PermissionService,
  ) {}

  async findAllForRole(roleId: string) {
    return await this.rolePermissionRepository.findAll({
      where: {
        roleId,
      },
    });
  }
  async findAllForRoles(roleIds: string[]) {
    return await this.rolePermissionRepository.findAll({
      where: { roleId: { [Op.in]: roleIds } },
    });
  }

  async create(data: Attributes<RolePermission>) {
    await this.permissionService.checkIsLeafKey(data.permissionKey);

    const rolePermission = new RolePermission({
      ...data,
    });
    return await rolePermission.save();
  }

  async delete(rolePermission: RolePermission) {
    return await rolePermission.destroy({ force: true });
  }

  async createMultiForRole(
    keys: CONSTANTS.Permission.PermissionKeys[],
    role: Role,
  ) {
    await this.permissionService.checkAreLeafKeys(keys);

    const rolePermissions = await Promise.all(
      keys.map(async (key) => {
        return this.create({
          roleId: role.id,
          permissionKey: key,
        });
      }),
    );

    return rolePermissions;
  }

  async updateKeysForRole(
    role: Role,
    newKeys: CONSTANTS.Permission.PermissionKeys[],
  ) {
    await this.permissionService.checkAreLeafKeys(newKeys);

    // Fetch current role permissions from the database
    const rolePermissions = await this.findAllForRole(role.id);
    const currentKeys = rolePermissions.map((p) => p.permissionKey);

    // Determine keys to add and remove
    const keysToAdd = newKeys.filter((key) => !currentKeys.includes(key));
    const keysToRemove = currentKeys.filter((key) => !newKeys.includes(key));

    // Add new role permissions
    if (keysToAdd.length > 0) {
      await Promise.all(
        keysToAdd.map((key) =>
          this.create({
            roleId: role.id,
            permissionKey: key,
          }),
        ),
      );
    }

    // Remove unnecessary role permissions
    if (keysToRemove.length > 0) {
      const permissionsToRemove = rolePermissions.filter((p) =>
        keysToRemove.includes(p.permissionKey),
      );

      await Promise.all(permissionsToRemove.map((p) => this.delete(p)));
    }

    return {
      permissionsUpdated: keysToAdd.length !== 0 || keysToRemove.length !== 0,
    };
  }
}
