import {
  Table,
  Column,
  Model,
  PrimaryKey,
  DataType,
  Default,
  HasMany,
  BelongsToMany,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Account } from '../account/account.model';
import { AccountRoles } from '../account-role/account-role.model';
import { RolePermission } from '../role-permission/role-permission.model';
import { Application } from '../application/application.model';

@Table({
  tableName: 'roles', // Set table name if different from model name
  timestamps: true, // Automatically adds createdAt and updatedAt timestamps
})
export class Role extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @ForeignKey(() => Application)
  @Column(DataType.UUID)
  applicationId: string;

  @BelongsTo(() => Application)
  application: Application;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  description: string | undefined;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  color: string;

  @Default(true)
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  isDeletable: boolean;

  @Default(false)
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  isDefault: boolean;

  @BelongsToMany(() => Account, () => AccountRoles)
  accounts: Account[];

  @HasMany(() => RolePermission)
  rolePermissions: RolePermission[];
}
