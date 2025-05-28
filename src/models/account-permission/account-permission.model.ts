import {
  Table,
  Column,
  Model,
  PrimaryKey,
  DataType,
  Default,
  ForeignKey,
} from 'sequelize-typescript';
import { Account } from '../account/account.model';
import { Role } from '../role/role.model';
import { CONSTANTS } from 'sea-platform-helpers';

@Table({
  tableName: 'account-permissions', // Set table name if different from model name
  timestamps: true, // Automatically adds createdAt and updatedAt timestamps
})
export class AccountPermission extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @ForeignKey(() => Account)
  @Column(DataType.UUID)
  accountId: string;

  @ForeignKey(() => Role)
  @Column(DataType.UUID)
  roleId: string;

  @Column({
    type: DataType.ENUM(...Object.values(CONSTANTS.Permission.PermissionKeys)),
    allowNull: false,
  })
  permissionKey: CONSTANTS.Permission.PermissionKeys;
}
