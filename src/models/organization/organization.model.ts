import {
  Table,
  Column,
  Model,
  PrimaryKey,
  DataType,
  Default,
  HasMany,
} from 'sequelize-typescript';
import { Department } from '../department/department.model';
import { Account } from '../account/account.model';

@Table({
  tableName: 'organizations', // Set table name if different from model name
  timestamps: true, // Automatically adds createdAt and updatedAt timestamps
})
export class Organization extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @HasMany(() => Department)
  departments: Department[];

  @HasMany(() => Account)
  accounts: Account[];
}
