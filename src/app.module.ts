import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
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
import { AccountPermissionModule } from './modules/account-permission.module';
import { ApplicationModule } from './modules/application.module';
import { ApplicationControllerModule } from './controllers/application/application.module';
import { FileManagerControllerModule } from './controllers/file-manager/file-manager.module';
import { join } from 'path';
import { FileModule } from './modules/file.module';
import { OrganizationModule } from './modules/organization.module';
import { OrganizationControllerModule } from './controllers/organization/organization-controller.module';
import { DepartmentModule } from './modules/department.module';
import { ExternalOrganizationControllerModule } from './controllers/external/organization/external-organization-controller.module';

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
    ServerConfigModule,
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
    AccountPermissionModule,
    ApplicationModule,
    ApplicationControllerModule,
    FileModule,
    FileManagerControllerModule,
    OrganizationModule,
    OrganizationControllerModule,
    DepartmentModule,
    ExternalOrganizationControllerModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
