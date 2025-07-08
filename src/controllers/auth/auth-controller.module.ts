import { Module } from '@nestjs/common';

import { AuthController } from './auth.controller';
import { AuthModule } from 'src/modules/auth.module';
import { OTPModule } from 'src/modules/otp.module';
import { JwtService } from '@nestjs/jwt';
import { AccountModule } from 'src/modules/account.module';
import { ApplicationModule } from 'src/modules/application.module';
import { ServerConfigModule } from 'src/modules/server-config.module';

@Module({
  imports: [
    AuthModule,
    AccountModule,
    OTPModule,
    ApplicationModule,
    ServerConfigModule,
  ],
  controllers: [AuthController],
  providers: [JwtService],
})
export class AuthControllerModule {}
