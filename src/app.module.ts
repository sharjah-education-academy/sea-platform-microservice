import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { AccountModule } from './modules/account.module';
import { AccountControllerModule } from './controllers/account/account-controller.module';
import { AuthControllerModule } from './controllers/auth/auth-controller.module';
import { AuthModule } from './modules/auth.module';
import { OTPModule } from './modules/otp.module';
import { ConfigModule } from '@nestjs/config';
import { ServerConfigModule } from './modules/server-config.module';
import { MicrosoftAuthModule } from './modules/microsoft-auth.module';
import { ExternalAccountControllerModule } from './controllers/external/account/external-account-controller.module';
import { SeederControllerModule } from './controllers/seeder/seeder-controller.module';
import { PermissionModule } from './modules/permission.module';
import { StaticControllerModule } from './controllers/static/static.module';
import { RoleModule } from './modules/role.module';
import { RoleControllerModule } from './controllers/role/role-controller.module';
import { RolePermissionModule } from './modules/role-permission.module';
import { ApplicationModule } from './modules/application.module';
import { ApplicationControllerModule } from './controllers/application/application.module';
import { OrganizationModule } from './modules/organization.module';
import { OrganizationControllerModule } from './controllers/organization/organization-controller.module';
import { DepartmentModule } from './modules/department.module';
import { ExternalOrganizationControllerModule } from './controllers/external/organization/external-organization-controller.module';
import { EmailTemplateControllerModule } from './controllers/email-template/email-template-controller.module';
import { RedisCacheModule } from './modules/redis-cache.module';
import { QueueModule } from './queue/queue.module';
import { LocalizationModule } from './modules/localization.module';
import { LocalizationControllerModule } from './controllers/localization/localization.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/public',
    }),
    RedisCacheModule,
    ServerConfigModule,
    QueueModule,
    AccountModule,
    AuthModule,
    MicrosoftAuthModule,
    OTPModule,
    AccountControllerModule,
    AuthControllerModule,
    ExternalAccountControllerModule,
    SeederControllerModule,
    PermissionModule,
    StaticControllerModule,
    RoleModule,
    RoleControllerModule,
    RolePermissionModule,
    ApplicationModule,
    ApplicationControllerModule,
    OrganizationModule,
    OrganizationControllerModule,
    DepartmentModule,
    ExternalOrganizationControllerModule,
    EmailTemplateControllerModule,
    LocalizationModule,
    LocalizationControllerModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
