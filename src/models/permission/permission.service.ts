import { BadRequestException, Injectable } from '@nestjs/common';

import { DTO } from 'sea-platform-helpers';
import {
  PermissionChecked,
  PermissionResponse,
  PermissionResponseForRole,
} from './permission.dto';
import { Utils, CONSTANTS } from 'sea-platform-helpers';

@Injectable()
export class PermissionService {
  constructor() {}

  async findPermissionByKey(key: string) {
    let permission: DTO.Permission.IPermission | undefined = undefined;
    for (let i = 0; i < CONSTANTS.Permission.PERMISSIONS.length; i++) {
      const p = CONSTANTS.Permission.PERMISSIONS[i];

      permission = await Utils.DFS.findItem(
        p,
        (node) => node.key === key,
        'children',
      );

      if (permission) break;
    }

    return permission;
  }

  async getLeafKeys(key: string) {
    const permission = await this.findPermissionByKey(key);
    return await Utils.DFS.getAllLeafNodes(permission, 'children').map(
      (p) => p.key,
    );
  }

  async getAllLeafKeys() {
    let keys: string[] = [];

    for (let i = 0; i < CONSTANTS.Permission.PERMISSIONS.length; i++) {
      const p = CONSTANTS.Permission.PERMISSIONS[i];
      const leafKeys = await this.getLeafKeys(p.key as string);
      keys = Utils.Array.concatWithoutDuplicates(
        keys,
        leafKeys,
        (a, b) => a === b,
      );
    }

    return keys;
  }

  async isLeafKey(key: string) {
    const leafKeys = await this.getAllLeafKeys();
    return leafKeys.includes(key);
  }

  async checkIsLeafKey(key: string) {
    const isLeaf = await this.isLeafKey(key);

    if (!isLeaf) {
      throw new BadRequestException(`(${key}) is not a leaf key`);
    }
  }

  async checkAreLeafKeys(keys: string[]) {
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      await this.checkIsLeafKey(key);
    }
  }

  private async makePermissionResponse(permission: DTO.Permission.IPermission) {
    const children: PermissionResponse[] = [];

    for (let i = 0; i < permission.children?.length; i++) {
      const child = permission.children[i];
      const childResponse = await this.makePermissionResponse(child);
      children.push(childResponse);
    }

    return new PermissionResponse(permission, children);
  }

  private async makePermissionsResponse(
    permissions: DTO.Permission.IPermission[],
  ) {
    const permissionsResponse: PermissionResponse[] = [];

    for (let i = 0; i < permissions.length; i++) {
      const permission = permissions[i];
      const permissionResponse = await this.makePermissionResponse(permission);
      permissionsResponse.push(permissionResponse);
    }

    return permissionsResponse;
  }

  async fetchAllPermissions() {
    return await this.makePermissionsResponse(CONSTANTS.Permission.PERMISSIONS);
  }

  async makePermissionResponseForRole(
    permission: DTO.Permission.IPermission,
    permissionKeys: string[],
  ): Promise<PermissionResponseForRole> {
    const children: PermissionResponseForRole[] = [];

    const isLeaf = !permission.children || permission.children.length === 0;

    // Determine allChecked and someChecked based on whether the node is a leaf.
    let allChecked = true,
      someChecked = false;

    if (isLeaf) {
      allChecked = permissionKeys.includes(permission.key as string);
    } else {
      for (const child of permission.children) {
        const childResponse = await this.makePermissionResponseForRole(
          child,
          permissionKeys,
        );
        children.push(childResponse);

        // Update allChecked and someChecked based on child responses.
        if (childResponse.checked !== PermissionChecked.All) {
          allChecked = false;
        }
        if (childResponse.checked !== PermissionChecked.None) {
          someChecked = true;
        }
      }
    }

    // Determine the checked status for the current permission.
    const checked = allChecked
      ? PermissionChecked.All
      : someChecked
        ? PermissionChecked.Some
        : PermissionChecked.None;

    return new PermissionResponseForRole(permission, children, checked);
  }
}
