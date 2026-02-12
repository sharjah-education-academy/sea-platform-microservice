import { CONSTANTS } from 'sea-platform-helpers';

export const DEFAULT_ROLE_NAMES = {
  PlatformAdministration: 'Platform Administrator',
  PublicCalendarEndUser: 'Public Calendar | End user',
  PublicCalendarSuperAdmin: 'Public Calendar | Super admin',
  FacultyOperationChair: 'Faculty Operation | Chair',
  FacultyOperationFaculty: 'Faculty Operation | Faculty',
  FacultyOperationStudent: 'Faculty Operation | Student',
  StrategySuperAdmin: 'Strategy | Super admin',
  StrategyStrategyManager: 'Strategy | Strategy manager',
  StrategyDepartmentManager: 'Strategy | Department manager',
  StrategyEmployee: 'Strategy | Employee',
  StudentAttendanceAdmin: 'Student Attendance | Admin',
  StudentAttendanceFaculty: 'Student Attendance | Faculty',
  StudentAttendanceStudent: 'Student Attendance | Student',
};

export const DEFAULT_ROLES: {
  name: string;
  description: string;
  color: string;
  applicationKey: CONSTANTS.Application.ApplicationKeys;
  parentPermissionKeys: CONSTANTS.Permission.PermissionKeys[];
  isStudentDefault: boolean;
  isFacultyDefault: boolean;
  isEmployeeDefault: boolean;
  isDeletable: boolean;
}[] = [
  {
    name: DEFAULT_ROLE_NAMES.PlatformAdministration,
    description: 'The default role of the platform administrator',
    color: '#ff0062',
    applicationKey:
      CONSTANTS.Application.ApplicationKeys.PlatformAdministrationApplication,
    parentPermissionKeys: [
      CONSTANTS.Permission.PermissionKeys.PlatformAdministration,
    ],
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
    parentPermissionKeys: [
      CONSTANTS.Permission.PermissionKeys.ViewPublicCalendar,
    ],
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
    parentPermissionKeys: [
      CONSTANTS.Permission.PermissionKeys.PublicCalendarApp,
    ],
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
    parentPermissionKeys: [
      CONSTANTS.Permission.PermissionKeys.FacultyOperationThesisChair,
    ],
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
    parentPermissionKeys: [
      CONSTANTS.Permission.PermissionKeys.FacultyOperationThesisFaculty,
    ],
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
    parentPermissionKeys: [
      CONSTANTS.Permission.PermissionKeys.FacultyOperationThesisStudent,
    ],
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
    parentPermissionKeys: [CONSTANTS.Permission.PermissionKeys.StrategyApp],
    isStudentDefault: false,
    isFacultyDefault: false,
    isEmployeeDefault: false,
    isDeletable: false,
  },
  {
    name: DEFAULT_ROLE_NAMES.StrategyStrategyManager,
    description:
      'The default role of the strategy manager for the strategy app',
    color: '#5d517a',
    applicationKey: CONSTANTS.Application.ApplicationKeys.StrategyApplication,
    parentPermissionKeys: [
      CONSTANTS.Permission.PermissionKeys.ManageVisionMission,
      CONSTANTS.Permission.PermissionKeys.ManageGoals,
      CONSTANTS.Permission.PermissionKeys.ManageObjectives,
      CONSTANTS.Permission.PermissionKeys.ManageInitiatives,
      CONSTANTS.Permission.PermissionKeys.ManageFlow,
    ],
    isStudentDefault: false,
    isFacultyDefault: false,
    isEmployeeDefault: false,
    isDeletable: false,
  },
  {
    name: DEFAULT_ROLE_NAMES.StrategyDepartmentManager,
    description:
      'The default role of the department manager for the strategy app',
    color: '#5d517a',
    applicationKey: CONSTANTS.Application.ApplicationKeys.StrategyApplication,
    parentPermissionKeys: [
      CONSTANTS.Permission.PermissionKeys.ManageInitiatives,
      CONSTANTS.Permission.PermissionKeys.ManageProjects,
      CONSTANTS.Permission.PermissionKeys.ManagePrograms,
      CONSTANTS.Permission.PermissionKeys.ManageActivities,
      CONSTANTS.Permission.PermissionKeys.ManageFlow,
    ],
    isStudentDefault: false,
    isFacultyDefault: false,
    isEmployeeDefault: false,
    isDeletable: false,
  },
  {
    name: DEFAULT_ROLE_NAMES.StrategyEmployee,
    description: 'The default role of the employee for the strategy app',
    color: '#2e4f30',
    applicationKey: CONSTANTS.Application.ApplicationKeys.StrategyApplication,
    parentPermissionKeys: [
      CONSTANTS.Permission.PermissionKeys.ManageGoalsRead,
      CONSTANTS.Permission.PermissionKeys.ManageGoalsProgressesRead,
      CONSTANTS.Permission.PermissionKeys.ManageObjectivesRead,
      CONSTANTS.Permission.PermissionKeys.ManageObjectivesProgressesRead,
      CONSTANTS.Permission.PermissionKeys.ManageInitiativesRead,
      CONSTANTS.Permission.PermissionKeys.ManageInitiativesProgressesRead,
      CONSTANTS.Permission.PermissionKeys.ManageProjectsRead,
      CONSTANTS.Permission.PermissionKeys.ManageProjectsProgressesRead,
      CONSTANTS.Permission.PermissionKeys.ManageProjectMembersRead,
      CONSTANTS.Permission.PermissionKeys.ManageProjectMilestonesRead,
      CONSTANTS.Permission.PermissionKeys.ManageProjectSectionsRead,
      CONSTANTS.Permission.PermissionKeys.ManageProjectDocumentsRead,
      CONSTANTS.Permission.PermissionKeys.ManageProjectLinksRead,
      CONSTANTS.Permission.PermissionKeys.ManageProjectActivitiesRead,
      CONSTANTS.Permission.PermissionKeys.ManageProgramsRead,
      CONSTANTS.Permission.PermissionKeys.ManageProgramsProgressesRead,
      CONSTANTS.Permission.PermissionKeys.ManageProgramMembersRead,
      CONSTANTS.Permission.PermissionKeys.ManageProgramDocumentsRead,
      CONSTANTS.Permission.PermissionKeys.ManageProgramLinksRead,
      CONSTANTS.Permission.PermissionKeys.ManageProgramActivitiesRead,
      CONSTANTS.Permission.PermissionKeys.ManageActivitiesRead,
      CONSTANTS.Permission.PermissionKeys.ManageFlowRead,
    ],
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
    parentPermissionKeys: [
      CONSTANTS.Permission.PermissionKeys.StudentAttendanceAdmin,
    ],
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
    parentPermissionKeys: [
      CONSTANTS.Permission.PermissionKeys.StudentAttendanceFaculty,
    ],
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
    parentPermissionKeys: [
      CONSTANTS.Permission.PermissionKeys.StudentAttendanceStudent,
    ],
    isStudentDefault: true,
    isFacultyDefault: false,
    isEmployeeDefault: false,
    isDeletable: false,
  },
];
