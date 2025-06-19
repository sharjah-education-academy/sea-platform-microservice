import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MicrosoftAuthService } from 'src/models/microsoft-auth/microsoft-auth.service';
import { ServerConfigService } from 'src/models/server-config/server-config.service';

@Module({
  imports: [],
  providers: [MicrosoftAuthService, ServerConfigService, JwtService],
  exports: [MicrosoftAuthService],
})
export class MicrosoftAuthModule {}
