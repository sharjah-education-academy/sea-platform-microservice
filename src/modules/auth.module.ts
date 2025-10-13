import { forwardRef, Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from 'src/models/auth/auth.service';
import { AccountModule } from './account.module';
import { MicrosoftAuthModule } from './microsoft-auth.module';
import { RoleModule } from './role.module';

@Module({
  imports: [
    forwardRef(() => AccountModule),
    MicrosoftAuthModule,
    forwardRef(() => RoleModule),
  ],
  providers: [AuthService, JwtService],
  exports: [AuthService],
})
export class AuthModule {}
