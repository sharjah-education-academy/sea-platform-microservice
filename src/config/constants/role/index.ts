import { CONSTANTS } from 'sea-platform-helpers';

export const DEFAULT_ROLE_NAMES = {
  PlatformAdministration: 'Platform Administrator',
  PublicCalendarEndUser: 'Public Calendar | End user',
  PublicCalendarSuperAdmin: 'Public Calendar | Super admin',
  FacultyOperationChair: 'Faculty Operation | Chair',
  FacultyOperationFaculty: 'Faculty Operation | Faculty',
  FacultyOperationStudent: 'Faculty Operation | Student',
  StrategySuperAdmin: 'Strategy | Super admin',
  StrategyEndUser: 'Strategy | End user',
  StudentAttendanceAdmin: 'Student Attendance | Admin',
  StudentAttendanceFaculty: 'Student Attendance | Faculty',
  StudentAttendanceStudent: 'Student Attendance | Student',
};

export const DEFAULT_ROLES = [
  {
    name: DEFAULT_ROLE_NAMES.PlatformAdministration,
    description: 'The default role of the platform administrator',
    color: '#ff0062',
    applicationKey:
      CONSTANTS.Application.ApplicationKeys.PlatformAdministrationApplication,
    parentPermissionKey:
      CONSTANTS.Permission.PermissionKeys.PlatformAdministration,
    isStudentDefault: false,
    isFacultyDefault: false,
    isEmployeeDefault: false,
    isDeletable: false,
  },
  {
    name: DEFAULT_ROLE_NAMES.PublicCalendarEndUser,
    description: 'The default role of the end user for the public calendar app',
    color: '#029a30',
    applicationKey:
      CONSTANTS.Application.ApplicationKeys.PublicCalendarApplication,
    parentPermissionKey: CONSTANTS.Permission.PermissionKeys.ViewPublicCalendar,
    isStudentDefault: false,
    isFacultyDefault: false,
    isEmployeeDefault: true,
    isDeletable: false,
  },
  {
    name: DEFAULT_ROLE_NAMES.PublicCalendarSuperAdmin,
    description:
      'The default role of the super admin for the public calendar app',
    color: '#F4A6A2',
    applicationKey:
      CONSTANTS.Application.ApplicationKeys.PublicCalendarApplication,
    parentPermissionKey: CONSTANTS.Permission.PermissionKeys.PublicCalendarApp,
    isStudentDefault: false,
    isFacultyDefault: false,
    isEmployeeDefault: false,
    isDeletable: false,
  },
  {
    name: DEFAULT_ROLE_NAMES.FacultyOperationChair,
    description: 'The default role of the chair for the faculty operation app',
    color: '#4d1b19ff',
    applicationKey:
      CONSTANTS.Application.ApplicationKeys.FacultyOperationApplication,
    parentPermissionKey:
      CONSTANTS.Permission.PermissionKeys.FacultyOperationThesisChair,
    isStudentDefault: false,
    isFacultyDefault: false,
    isEmployeeDefault: false,
    isDeletable: false,
  },
  {
    name: DEFAULT_ROLE_NAMES.FacultyOperationFaculty,
    description:
      'The default role of the faculty for the faculty operation app',
    color: '#7a6f51',
    applicationKey:
      CONSTANTS.Application.ApplicationKeys.FacultyOperationApplication,
    parentPermissionKey:
      CONSTANTS.Permission.PermissionKeys.FacultyOperationThesisFaculty,
    isStudentDefault: false,
    isFacultyDefault: true,
    isEmployeeDefault: false,
    isDeletable: false,
  },
  {
    name: DEFAULT_ROLE_NAMES.FacultyOperationStudent,
    description:
      'The default role of the student for the faculty operation app',
    color: '#51607a',
    applicationKey:
      CONSTANTS.Application.ApplicationKeys.FacultyOperationApplication,
    parentPermissionKey:
      CONSTANTS.Permission.PermissionKeys.FacultyOperationThesisStudent,
    isStudentDefault: true,
    isFacultyDefault: false,
    isEmployeeDefault: false,
    isDeletable: false,
  },
  {
    name: DEFAULT_ROLE_NAMES.StrategySuperAdmin,
    description: 'The default role of the super admin for the strategy app',
    color: '#5d517a',
    applicationKey: CONSTANTS.Application.ApplicationKeys.StrategyApplication,
    parentPermissionKey: CONSTANTS.Permission.PermissionKeys.StrategyApp,
    isStudentDefault: false,
    isFacultyDefault: false,
    isEmployeeDefault: false,
    isDeletable: false,
  },
  {
    name: DEFAULT_ROLE_NAMES.StrategyEndUser,
    description: 'The default role of the end user for the strategy app',
    color: '#2e4f30',
    applicationKey: CONSTANTS.Application.ApplicationKeys.StrategyApplication,
    parentPermissionKey: CONSTANTS.Permission.PermissionKeys.ManageProjects, // TODO: make a parent permission for the strategy end user
    isStudentDefault: false,
    isFacultyDefault: false,
    isEmployeeDefault: true,
    isDeletable: false,
  },
  {
    name: DEFAULT_ROLE_NAMES.StudentAttendanceAdmin,
    description: 'The default role of the admin for the student attendance app',
    color: '#e8bee2',
    applicationKey:
      CONSTANTS.Application.ApplicationKeys.StudentAttendanceApplication,
    parentPermissionKey:
      CONSTANTS.Permission.PermissionKeys.StudentAttendanceAdmin,
    isStudentDefault: false,
    isFacultyDefault: false,
    isEmployeeDefault: false,
    isDeletable: false,
  },
  {
    name: DEFAULT_ROLE_NAMES.StudentAttendanceFaculty,
    description:
      'The default role of the faculty for the student attendance app',
    color: '#543242',
    applicationKey:
      CONSTANTS.Application.ApplicationKeys.StudentAttendanceApplication,
    parentPermissionKey:
      CONSTANTS.Permission.PermissionKeys.StudentAttendanceFaculty,
    isStudentDefault: false,
    isFacultyDefault: true,
    isEmployeeDefault: false,
    isDeletable: false,
  },
  {
    name: DEFAULT_ROLE_NAMES.StudentAttendanceStudent,
    description:
      'The default role of the student for the student attendance app',
    color: '#17c2d1',
    applicationKey:
      CONSTANTS.Application.ApplicationKeys.StudentAttendanceApplication,
    parentPermissionKey:
      CONSTANTS.Permission.PermissionKeys.StudentAttendanceStudent,
    isStudentDefault: true,
    isFacultyDefault: false,
    isEmployeeDefault: false,
    isDeletable: false,
  },
];
