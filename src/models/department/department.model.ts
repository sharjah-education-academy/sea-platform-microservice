import {
  Table,
  Column,
  Model,
  PrimaryKey,
  DataType,
  Default,
  ForeignKey,
  HasMany,
  BelongsTo,
} from 'sequelize-typescript';
import { Organization } from '../organization/organization.model';
import { Account } from '../account/account.model';

@Table({
  tableName: 'departments', // Set table name if different from model name
  timestamps: true, // Automatically adds createdAt and updatedAt timestamps
})
export class Department extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @ForeignKey(() => Organization)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  organizationId: string;

  @BelongsTo(() => Organization)
  organization: Organization;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @HasMany(() => Account)
  accounts: Account[];
}
