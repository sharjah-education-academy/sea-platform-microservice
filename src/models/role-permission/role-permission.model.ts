import {
  Table,
  Column,
  Model,
  PrimaryKey,
  DataType,
  Default,
  ForeignKey,
} from 'sequelize-typescript';
import { Role } from '../role/role.model';
import { CONSTANTS } from 'sea-platform-helpers';

@Table({
  tableName: 'role-permissions', // Set table name if different from model name
  timestamps: true, // Automatically adds createdAt and updatedAt timestamps
})
export class RolePermission extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @ForeignKey(() => Role)
  @Column(DataType.UUID)
  roleId: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  permissionKey: CONSTANTS.Permission.PermissionKeys;
}
