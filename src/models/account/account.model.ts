import {
  Table,
  Column,
  Model,
  PrimaryKey,
  DataType,
  BeforeCreate,
  BeforeUpdate,
  HasMany,
  Default,
  BelongsToMany,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Utils, CONSTANTS } from 'sea-platform-helpers';

import { OTP } from '../otp/otp.model';
import { Role } from '../role/role.model';
import { AccountRoles } from '../account-role/account-role.model';
import { AccountPermission } from '../account-permission/account-permission.model';
import { Utils as BackendUtils } from 'sea-backend-helpers';
import { Department } from '../department/department.model';
import { Organization } from '../organization/organization.model';

@Table({
  tableName: 'accounts',
  timestamps: true,
  paranoid: true,
  indexes: [
    {
      unique: true,
      fields: ['email'],
      name: 'unique_email',
    },
    {
      unique: true,
      fields: ['phoneNumber'],
      name: 'unique_phone_number',
    },
  ],
})
export class Account extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    validate: {
      len: [3, 50],
    },
  })
  name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  email: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  phoneNumber: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  password: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  birthDate: Date;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  isLocked: boolean;

  @HasMany(() => OTP)
  OTPs: OTP[];

  @Column({
    type: DataType.ENUM(...Object.values(CONSTANTS.Account.AccountTypes)),
    allowNull: false,
  })
  type: CONSTANTS.Account.AccountTypes;

  @BelongsToMany(() => Role, () => AccountRoles)
  roles: Role[];

  @HasMany(() => AccountPermission)
  accountPermissions: AccountPermission[];

  @ForeignKey(() => Organization)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  organizationId: string | undefined;

  @BelongsTo(() => Organization)
  organization: Organization | undefined;

  @ForeignKey(() => Department)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  departmentId: string | undefined;

  @BelongsTo(() => Department)
  department: Department | undefined;

  @BeforeCreate
  @BeforeUpdate
  static async handleSensitiveData(account: Account) {
    if (account.email) {
      account.email = Utils.String.normalizeString(account.email);
    }
    if (account.password && account.changed('password')) {
      account.password = await BackendUtils.Bcrypt.hashPassword(
        account.password,
      );
    }

    if (account.phoneNumber) {
      account.phoneNumber = Utils.PhoneNumber.normalizePhoneNumber(
        account.phoneNumber,
      );
    }
  }
}
