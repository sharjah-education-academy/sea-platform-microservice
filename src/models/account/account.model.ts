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
  HasOne,
} from 'sequelize-typescript';
import { CONSTANTS, Utils } from 'sea-platform-helpers';

import { OTP } from '../otp/otp.model';
import { Role } from '../role/role.model';
import { AccountRoles } from '../account-role/account-role.model';
import { Utils as BackendUtils } from 'sea-backend-helpers';
import { Department } from '../department/department.model';
import { Organization } from '../organization/organization.model';
import { AccountAlertSetting } from '../account-alert-setting/account-alert-setting.model';
import { Faculty } from '../faculty/faculty.model';
import { Student } from '../student/student.model';
import { Employee } from '../employee/employee.model';

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

  @Column({
    type: DataType.STRING,
    defaultValue: CONSTANTS.Account.DEFAULT_PREFERRED_LANGUAGE_CODE,
  })
  preferredLanguage: string;

  @HasMany(() => OTP)
  OTPs: OTP[];

  @HasMany(() => AccountAlertSetting)
  accountAlertSettings: AccountAlertSetting[];

  @BelongsToMany(() => Role, () => AccountRoles)
  roles: Role[];

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

  @HasOne(() => Faculty)
  faculty?: Faculty;

  @HasOne(() => Student)
  student?: Student;

  @HasOne(() => Employee)
  employee?: Employee;

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
