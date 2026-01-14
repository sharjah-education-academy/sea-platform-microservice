import { Sequelize, SequelizeOptions } from 'sequelize-typescript';
import { OTP } from 'src/models/otp/otp.model';
import { ServerConfigService } from 'src/models/server-config/server-config.service';
import { Account } from 'src/models/account/account.model';
import { CONSTANTS } from 'sea-platform-helpers';
import { Role } from 'src/models/role/role.model';
import { AccountRoles } from 'src/models/account-role/account-role.model';
import { RolePermission } from 'src/models/role-permission/role-permission.model';
import { Application } from 'src/models/application/application.model';
import { Organization } from 'src/models/organization/organization.model';
import { Department } from 'src/models/department/department.model';
import { AccountAlertSetting } from 'src/models/account-alert-setting/account-alert-setting.model';
import { Localization } from 'src/models/localization/localization.model';

export enum DatabaseConnections {
  Main = 'Main',
  Creatrix = 'Creatrix',
}

export const databaseProviders = [
  {
    provide: DatabaseConnections.Main,
    useFactory: async (serverConfigService: ServerConfigService) => {
      const ConnectionConfig: SequelizeOptions = {
        host: serverConfigService.get<string>('DATABASE_HOST'),
        port: +serverConfigService.get<number>('DATABASE_PORT'),
        username: serverConfigService.get<string>('DATABASE_USERNAME'),
        password: serverConfigService.get<string>('DATABASE_PASSWORD'),
        database: serverConfigService.get<string>('DATABASE_NAME'),
        logging: serverConfigService.get<string>('DATABASE_LOGGING') === 'true',
      };

      const serverEnv = serverConfigService.getServerEnvironment();
      if (serverEnv !== CONSTANTS.Server.Environments.Production) {
        ConnectionConfig.sync = { alter: true };
      }

      const sequelize = new Sequelize({
        dialect: 'mysql',
        ...ConnectionConfig,
      });
      sequelize.addModels([
        Account,
        OTP,
        Role,
        RolePermission,
        AccountRoles,
        Application,
        Organization,
        Department,
        AccountAlertSetting,
        Localization,
      ]);
      await sequelize.sync();
      return sequelize;
    },
    inject: [ServerConfigService],
  },
  {
    provide: DatabaseConnections.Creatrix,
    useFactory: async (serverConfigService: ServerConfigService) => {
      const ConnectionConfig: SequelizeOptions = {
        host: serverConfigService.get<string>('CREATRIX_DATABASE_HOST'),
        port: +serverConfigService.get<number>('CREATRIX_DATABASE_PORT'),
        username: serverConfigService.get<string>('CREATRIX_DATABASE_USERNAME'),
        password: serverConfigService.get<string>('CREATRIX_DATABASE_PASSWORD'),
        database: serverConfigService.get<string>('CREATRIX_DATABASE_NAME'),
        logging:
          serverConfigService.get<string>('CREATRIX_DATABASE_LOGGING') ===
          'true',
      };

      const sequelize = new Sequelize({
        dialect: 'mysql',
        sync: {
          alter: false,
        },
        ...ConnectionConfig,
      });
      sequelize.addModels([]);

      // No need for sync
      // await sequelize.sync();
      return sequelize;
    },
    inject: [ServerConfigService],
  },
];
