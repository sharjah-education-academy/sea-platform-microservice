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
  tableName: 'faculties', // Set table name if different from model name
  timestamps: true, // Automatically adds createdAt and updatedAt timestamps
  paranoid: true,
})
export class Faculty extends Model {
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

  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @Column({ type: DataType.STRING, allowNull: false })
  email: string;
  @Column({ type: DataType.STRING, allowNull: true })
  address: string;
  @Column({ type: DataType.STRING, allowNull: true })
  designation: string;
  @Column({ type: DataType.STRING, allowNull: true })
  contactNumber: string;
}
