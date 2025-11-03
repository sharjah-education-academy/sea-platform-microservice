import {
  Table,
  Column,
  Model,
  PrimaryKey,
  DataType,
  Default,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';

import { Account } from '../account/account.model';
import { CONSTANTS } from 'sea-platform-helpers';

@Table({
  tableName: 'account-alert-settings',
  timestamps: true,
  paranoid: true,
})
export class AccountAlertSetting extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @ForeignKey(() => Account)
  @Column(DataType.UUID)
  accountId: string;

  @BelongsTo(() => Account)
  account: Account;

  @Column({
    type: DataType.ENUM(
      ...Object.values(CONSTANTS.AccountAlertSetting.AlertActions),
    ),
    allowNull: false,
  })
  action: CONSTANTS.AccountAlertSetting.AlertActions;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  emailEnabled: boolean;
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  notificationEnabled: boolean;
}
