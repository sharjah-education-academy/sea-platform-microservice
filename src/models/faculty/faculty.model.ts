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
  accountId: string;

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
