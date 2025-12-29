import {
  Table,
  Column,
  Model,
  PrimaryKey,
  DataType,
  Default,
  ForeignKey,
} from 'sequelize-typescript';
import { Application } from '../application/application.model';
import { CONSTANTS } from 'sea-platform-helpers';

@Table({
  tableName: 'localizations',
  timestamps: true, // Automatically adds createdAt and updatedAt timestamps
  indexes: [
    {
      unique: true,
      fields: ['code', 'applicationKey'],
      name: 'uniq_localizations_code_applicationKey',
    },
  ],
})
export class Localization extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @ForeignKey(() => Application)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  applicationId: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  code: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  enabled: boolean;

  @Column({
    type: DataType.ENUM(
      ...Object.values(CONSTANTS.Application.ApplicationKeys),
    ),
    allowNull: false,
  })
  applicationKey: CONSTANTS.Application.ApplicationKeys;
}
