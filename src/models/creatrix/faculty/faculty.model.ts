import {
  Table,
  Model,
  PrimaryKey,
  AutoIncrement,
  DataType,
  Column,
} from 'sequelize-typescript';

@Table({
  tableName: 'creatrix_faculty', // Set table name if different from model name
  timestamps: false,
})
export class CreatrixFaculty extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.BIGINT)
  id: number;

  @Column(DataType.STRING(250))
  name: string;

  @Column(DataType.STRING(15))
  status: string;

  @Column(DataType.DATE)
  create_date: Date;

  @Column(DataType.DATE)
  last_updated: Date;

  @Column(DataType.STRING(50))
  updated_by: string;

  @Column(DataType.STRING(250))
  lastname: string;

  @Column(DataType.STRING(250))
  firstname: string;

  @Column(DataType.STRING(10))
  gender: string;

  @Column(DataType.STRING(50))
  dateofbirth: string;

  @Column(DataType.STRING(250))
  email: string;

  @Column(DataType.STRING(20))
  mobileno: string;

  @Column(DataType.STRING(60))
  faculty_type: string;

  @Column(DataType.STRING(15))
  isdisabled: string;

  @Column(DataType.STRING(50))
  date_of_joining: string;

  @Column(DataType.STRING(20))
  passport_no: string;

  @Column(DataType.TEXT)
  permanent_address: string;

  @Column(DataType.STRING(50))
  dateofleaving: string;

  @Column(DataType.STRING(255))
  education_details: string;

  @Column(DataType.STRING(250))
  experience_details: string;

  @Column(DataType.STRING(250))
  training_details: string;

  @Column(DataType.STRING(60))
  employee_designation: string;

  @Column(DataType.STRING(20))
  employee_id: string;

  @Column(DataType.STRING(50))
  department: string;

  @Column(DataType.STRING(15))
  is_guest_lecturer: string;

  @Column(DataType.STRING(50))
  program: string;

  @Column(DataType.STRING(15))
  employee_type: string;

  @Column(DataType.STRING(250))
  specialization: string;

  @Column(DataType.STRING(255))
  incubation_unit: string;

  @Column(DataType.STRING(250))
  salutation: string;

  @Column(DataType.DATE)
  preferred_start_time: Date;

  @Column(DataType.DATE)
  preferred_end_time: Date;

  @Column(DataType.DECIMAL(10, 2))
  fte: number;

  @Column(DataType.STRING(250))
  contact: string;

  @Column(DataType.STRING(250))
  secondary_email: string;

  @Column(DataType.STRING(250))
  academic_subarea: string;

  @Column(DataType.STRING(250))
  sso_email: string;

  @Column(DataType.STRING(15))
  serving_notice_period: string;

  @Column(DataType.STRING(15))
  payroll_enrollment: string;

  @Column(DataType.STRING(60))
  lic_policy_no: string;

  @Column(DataType.STRING(15))
  is_esic_applicable: string;

  @Column(DataType.STRING(60))
  lic_policy_scheme: string;

  @Column(DataType.DATE)
  notice_period_start_date: Date;

  @Column(DataType.STRING(60))
  team: string;

  @Column(DataType.STRING(60))
  user_worktime_template: string;

  @Column(DataType.STRING(20))
  substantive_flag: string;

  @Column(DataType.STRING(50))
  sap_faculty: string;

  @Column(DataType.STRING(60))
  sap_dept: string;

  @Column(DataType.STRING(250))
  data_source: string;
}
