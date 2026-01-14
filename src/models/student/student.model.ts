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
  tableName: 'students', // Set table name if different from model name
  timestamps: true, // Automatically adds createdAt and updatedAt timestamps
  paranoid: true,
})
export class Student extends Model {
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
  SSNNo: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  nameEn: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  nameAr: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  email: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  gender?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  admissionNo?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  mobileNumber?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  nationality?: string;
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  passportNumber?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  emiratesId?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  employmentStatus?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  employerName?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  employmentLocationCountry?: string;
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  employmentLocationCity?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  bachelorsInstitutionName?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  arabicLanguageTestType?: string;
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  arabicLanguageTestScore?: string;

  @Column({
    type: DataType.DATEONLY,
    allowNull: true,
  })
  arabicLanguageTestDate?: Date;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  englishLanguageTestType?: string;
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  englishLanguageTestScore?: string;

  @Column({
    type: DataType.DATEONLY,
    allowNull: true,
  })
  englishLanguageTestDate?: Date;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  currentEnrolmentStatus?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  status?: string;
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  secondaryEmail?: string;

  @Column({
    type: DataType.FLOAT,
    allowNull: true,
  })
  CGPAValue?: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  passportIssuingAuthority?: string;
  @Column({
    type: DataType.DATEONLY,
    allowNull: true,
  })
  passportIssueDate?: Date;
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  emirateState?: string;
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  detailedAddress?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  maritalStatus?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  motherNationality?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  familyBookNumber?: string;
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  familyNumber?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  highestQualification?: string;
}
