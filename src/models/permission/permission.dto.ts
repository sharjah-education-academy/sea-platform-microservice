import { ApiProperty } from '@nestjs/swagger';
import { CONSTANTS, DTO } from 'sea-platform-helpers';
export class PermissionResponse {
  @ApiProperty()
  name: string;
  @ApiProperty()
  key: CONSTANTS.Permission.PermissionKeys;

  @ApiProperty({ enum: CONSTANTS.Application.ApplicationKeys })
  applicationKey: CONSTANTS.Application.ApplicationKeys;

  @ApiProperty({ type: Boolean })
  isLeaf: boolean;

  @ApiProperty({ type: PermissionResponse, isArray: true, nullable: true })
  children: PermissionResponse[] | undefined;

  constructor(
    permission: DTO.Permission.IPermission,
    children: PermissionResponse[],
  ) {
    this.name = permission.name;
    this.applicationKey = permission.applicationKey;
    this.key = permission.key;
    this.children = children;
    this.isLeaf = !children || !children?.length;
  }
}

export enum PermissionChecked {
  None = 'none',
  Some = 'some',
  All = 'all',
}

export class PermissionResponseForRole {
  @ApiProperty()
  name: string;
  @ApiProperty()
  key: CONSTANTS.Permission.PermissionKeys;

  @ApiProperty({ type: Boolean })
  isLeaf: boolean;

  @ApiProperty({ enum: PermissionChecked })
  checked: PermissionChecked;

  @ApiProperty({ type: PermissionResponse, isArray: true, nullable: true })
  children: PermissionResponseForRole[] | undefined;

  constructor(
    permission: DTO.Permission.IPermission,
    children: PermissionResponseForRole[],
    checked: PermissionChecked,
  ) {
    this.name = permission.name;
    this.key = permission.key;
    this.isLeaf = !children || !children?.length;
    this.checked = checked;
    this.children = children;
  }
}
