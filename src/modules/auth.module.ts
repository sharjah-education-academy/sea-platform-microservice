import { forwardRef, Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from 'src/models/auth/auth.service';
import { AccountModule } from './account.module';
import { MicrosoftAuthModule } from './microsoft-auth.module';
import { RoleModule } from './role.module';
import { QueueModule } from 'src/queue/queue.module';
import { IPService } from 'src/models/ip/ip.service';
import { CaptchaModule } from './captcha.module';

@Module({
  imports: [
    forwardRef(() => AccountModule),
    MicrosoftAuthModule,
    forwardRef(() => RoleModule),
    QueueModule,
    CaptchaModule,
  ],
  providers: [AuthService, JwtService, IPService],
  exports: [AuthService],
})
export class AuthModule {}
