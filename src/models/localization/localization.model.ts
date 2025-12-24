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

@Table({
  tableName: 'localizations',
  timestamps: true, // Automatically adds createdAt and updatedAt timestamps
})
export class Localization extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @ForeignKey(() => Application)
  @Column({})
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

  // @Column({
  //   type: DataType.STRING,
  //   allowNull: false,
  // })
  // native_name: string;

  // @Column({
  //   type: DataType.STRING,
  //   allowNull: false,
  // })
  // locale: string; // en

  // @Column({
  //   type: DataType.BOOLEAN,
  //   allowNull: false,
  // })
  // default: boolean;

  // @Column({
  //   type: DataType.BOOLEAN,
  //   allowNull: false,
  // })
  // isRtl: boolean;
}
