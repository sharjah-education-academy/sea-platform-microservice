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

@Table({
  tableName: 'employees', // Set table name if different from model name
  timestamps: true, // Automatically adds createdAt and updatedAt timestamps
  paranoid: true,
})
export class Employee extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @ForeignKey(() => Account)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    unique: true, // 👈 enforces 1-to-1
  })
  accountId: string;

  @BelongsTo(() => Account)
  account: Account;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  salutation?: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  personNumber: string;
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
  })
  personId: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  firstName: string;
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  middleName?: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  lastName: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  displayName: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  workEmail: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  username: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  gender?: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  hireDate: Date;
}
