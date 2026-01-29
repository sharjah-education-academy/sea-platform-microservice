import {
  Table,
  Model,
  PrimaryKey,
  AutoIncrement,
  DataType,
  Column,
} from 'sequelize-typescript';

@Table({
  tableName: 'creatrix_student', // Set table name if different from model name
  timestamps: false,
})
export class CreatrixStudent extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.BIGINT)
  id: number;

  @Column(DataType.STRING(250))
  name: string;

  @Column(DataType.DATE)
  create_date: Date;

  @Column(DataType.DATE)
  last_updated: Date;

  @Column(DataType.STRING(60))
  updated_by: string;

  @Column(DataType.STRING(60))
  ssno: string;

  @Column(DataType.STRING(20))
  admission_no: string;

  @Column(DataType.STRING(10))
  gender: string;

  @Column(DataType.STRING(20))
  religion: string;

  @Column(DataType.STRING(100))
  fathers_email: string;

  @Column(DataType.STRING(40))
  mobile_no: string;

  @Column(DataType.STRING(100))
  first_name: string;

  @Column(DataType.STRING(100))
  lastname: string;

  @Column(DataType.STRING(50))
  dateofbirth: string;

  @Column(DataType.STRING(250))
  email: string;

  @Column(DataType.STRING(100))
  nationality: string;

  @Column(DataType.STRING(20))
  isdisabled: string;

  @Column(DataType.STRING(20))
  pincode: string;

  @Column(DataType.STRING(100))
  batch: string;

  @Column(DataType.STRING(20))
  passport_no: string;

  @Column(DataType.STRING(100))
  student_category: string;

  @Column(DataType.STRING(100))
  status: string;

  @Column(DataType.STRING(100))
  secondary_email: string;

  @Column(DataType.STRING(100))
  current_academic_year: string;

  @Column(DataType.STRING(150))
  current_program: string;

  @Column(DataType.STRING(150))
  department: string;

  @Column(DataType.DECIMAL(10, 2))
  cgpa_value: number;

  @Column(DataType.STRING(100))
  middle_name: string;

  @Column(DataType.STRING(100))
  registered_number: string;

  @Column(DataType.STRING(30))
  salutation: string;

  @Column(DataType.DECIMAL(10, 2))
  po_attainment_percent: number;

  @Column(DataType.STRING(100))
  curr_planner: string;

  @Column(DataType.STRING(100))
  catalog_year: string;

  @Column(DataType.STRING(100))
  catalog_term: string;

  @Column(DataType.STRING(100))
  student_semester_status: string;

  @Column(DataType.STRING(100))
  student_major: string;

  @Column(DataType.STRING(10))
  financial_hold: string;

  @Column(DataType.DECIMAL(10, 2))
  credit_percent: number;

  @Column(DataType.TEXT)
  transcript_remarks: string;

  @Column(DataType.STRING(100))
  category_credit_status: string;

  @Column(DataType.STRING(10))
  is_special_student: string;

  @Column(DataType.STRING(40))
  father_contact: string;

  @Column(DataType.STRING(100))
  scholarship_category: string;

  @Column(DataType.STRING(100))
  sponsor: string;

  @Column(DataType.STRING(100))
  emirates_id_number: string;

  @Column(DataType.STRING(40))
  employment_status: string;

  @Column(DataType.STRING(100))
  employer_name: string;

  @Column(DataType.STRING(100))
  employment_location_city: string;

  @Column(DataType.STRING(40))
  employment_location_country: string;

  @Column(DataType.STRING(10))
  bloodgroup: string;

  @Column(DataType.STRING(100))
  masters_institution_name: string;

  @Column(DataType.STRING(100))
  bachelors_institution_name: string;

  @Column(DataType.STRING(10))
  enabled_food_fee: string;

  @Column(DataType.STRING(10))
  has_housing: string;

  @Column(DataType.STRING(50))
  arabic_language_test_score: string;

  @Column(DataType.STRING(40))
  arabic_language_test_date: string;

  @Column(DataType.STRING(40))
  arabic_language_test_type: string;

  @Column(DataType.STRING(40))
  english_language_test_date: string;

  @Column(DataType.STRING(10))
  english_language_test_score: string;

  @Column(DataType.STRING(40))
  english_language_test_type: string;

  @Column(DataType.STRING(40))
  current_enrollment_status: string;

  @Column(DataType.STRING(150))
  student_name_arab: string;

  @Column(DataType.STRING(150))
  first_name_in_arabic: string;

  @Column(DataType.STRING(150))
  family_last_name_in_arabic: string;

  @Column(DataType.STRING(150))
  father_name_in_arabic: string;

  @Column(DataType.TEXT)
  detailed_address_1: string;

  @Column(DataType.TEXT)
  address_2: string;

  @Column(DataType.STRING(150))
  emirate_state: string;

  @Column(DataType.STRING(100))
  passport_issuing_authority: string;

  @Column(DataType.STRING(50))
  passport_issue_date: string;

  @Column(DataType.STRING(50))
  marital_status: string;

  @Column(DataType.STRING(50))
  mother_nationality: string;

  @Column(DataType.STRING(50))
  family_book_number: string;

  @Column(DataType.STRING(50))
  family_number: string;

  @Column(DataType.STRING(50))
  passport_number_secondary: string;

  @Column(DataType.STRING(50))
  issue_date_secondary_passport: string;

  @Column(DataType.STRING(50))
  expiry_date_secondary_passport: string;

  @Column(DataType.STRING(50))
  issuing_authority_sec_passport: string;

  @Column(DataType.STRING(100))
  id_type: string;

  @Column(DataType.STRING(100))
  the_highest_qualification_you: string;

  @Column(DataType.STRING(50))
  country_of_school: string;

  @Column(DataType.STRING(50))
  dip_institution_name: string;

  @Column(DataType.STRING(50))
  dip_country: string;

  @Column(DataType.STRING(50))
  dip_year_of_graduation: string;

  @Column(DataType.STRING(100))
  bachelor_institution_name: string;

  @Column(DataType.STRING(100))
  bachelor_year_of_graduation: string;

  @Column(DataType.DECIMAL(10, 2))
  bachelor_cgpa: number;

  @Column(DataType.STRING(50))
  masters_degree_country_of_institution: string;

  @Column(DataType.STRING(150))
  masters_major: string;

  @Column(DataType.STRING(100))
  other_degree_institution_name: string;

  @Column(DataType.STRING(50))
  other_degree_country_of_institution: string;

  @Column(DataType.STRING(50))
  other_degree_major: string;

  @Column(DataType.DECIMAL(10, 2))
  other_cgpa: number;

  @Column(DataType.STRING(50))
  other_year_of_graduation: string;

  @Column(DataType.STRING(100))
  doctoral_institution_name: string;

  @Column(DataType.STRING(100))
  doctoral_degree_country_of_institution: string;

  @Column(DataType.STRING(100))
  doctoral_major: string;

  @Column(DataType.STRING(100))
  ft_employment_position: string;

  @Column(DataType.STRING(20))
  guardian_contact_no: string;

  @Column(DataType.STRING(100))
  guardian_name: string;

  @Column(DataType.STRING(100))
  ft_employer_type: string;

  @Column(DataType.STRING(100))
  dip_equivalency_number: string;

  @Column(DataType.STRING(100))
  other_equivalency_number: string;

  @Column(DataType.STRING(100))
  master_equivalency_number: string;

  @Column(DataType.STRING(100))
  doctoral_equivalency_number: string;

  @Column(DataType.STRING(100))
  bachelor_equivalency_number: string;

  @Column(DataType.DECIMAL(10, 2))
  masters_cgpa: number;

  @Column(DataType.DECIMAL(10, 2))
  doctoral_cgpa: number;

  @Column(DataType.DECIMAL(10, 2))
  dip_cgpa: number;

  @Column(DataType.STRING(50))
  masters_year_of_graduation: string;

  @Column(DataType.STRING(50))
  doctoral_year_of_graduation: string;

  @Column(DataType.STRING(100))
  bachelor_degree_country_of_institution: string;

  @Column(DataType.STRING(100))
  current_semester: string;
}
