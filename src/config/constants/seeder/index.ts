import { CONSTANTS } from 'sea-platform-helpers';

export const DEFAULT_ROLE_NAMES = {
  PlatformAdministration: 'Platform Administrator',
  PublicCalendarEndUser: 'Public Calendar | End user',
  PublicCalendarSuperAdmin: 'Public Calendar | Super admin',
  FacultyOperationChair: 'Faculty Operation | Chair',
  FacultyOperationFaculty: 'Faculty Operation | Faculty',
  FacultyOperationStudent: 'Faculty Operation | Student',
  StrategySuperAdmin: 'Strategy | Super admin',
};

export const DEFAULT_ROLES = [
  {
    name: DEFAULT_ROLE_NAMES.PlatformAdministration,
    description: 'The default role of the platform administrator',
    color: '#F4A610',
    applicationKey:
      CONSTANTS.Application.ApplicationKeys.PlatformAdministrationApplication,
    parentPermissionKey:
      CONSTANTS.Permission.PermissionKeys.PlatformAdministration,
    isDefault: false,
    isDeletable: false,
  },
  {
    name: DEFAULT_ROLE_NAMES.PublicCalendarEndUser,
    description: 'The default role of the end user for the public calendar app',
    color: '#F4A610',
    applicationKey:
      CONSTANTS.Application.ApplicationKeys.PublicCalendarApplication,
    parentPermissionKey: CONSTANTS.Permission.PermissionKeys.ViewPublicCalendar,
    isDefault: true,
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
    isDefault: false,
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
    isDefault: false,
    isDeletable: false,
  },
  {
    name: DEFAULT_ROLE_NAMES.FacultyOperationFaculty,
    description:
      'The default role of the faculty for the faculty operation app',
    color: '#112839ff',
    applicationKey:
      CONSTANTS.Application.ApplicationKeys.FacultyOperationApplication,
    parentPermissionKey:
      CONSTANTS.Permission.PermissionKeys.FacultyOperationThesisFaculty,
    isDefault: false,
    isDeletable: false,
  },
  {
    name: DEFAULT_ROLE_NAMES.FacultyOperationStudent,
    description:
      'The default role of the student for the faculty operation app',
    color: '#1e4153ff',
    applicationKey:
      CONSTANTS.Application.ApplicationKeys.FacultyOperationApplication,
    parentPermissionKey:
      CONSTANTS.Permission.PermissionKeys.FacultyOperationThesisStudent,
    isDefault: false,
    isDeletable: false,
  },
  {
    name: DEFAULT_ROLE_NAMES.StrategySuperAdmin,
    description: 'The default role of the super admin for the strategy app',
    color: '#1e4153ff',
    applicationKey: CONSTANTS.Application.ApplicationKeys.StrategyApplication,
    parentPermissionKey: CONSTANTS.Permission.PermissionKeys.StrategyApp,
    isDefault: false,
    isDeletable: false,
  },
];
