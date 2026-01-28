import { Module } from '@nestjs/common';

import { CaptchaService } from 'src/models/captcha/captcha.service';
import { ServerConfigModule } from './server-config.module';

@Module({
  imports: [ServerConfigModule],
  providers: [CaptchaService],
  exports: [CaptchaService],
})
export class CaptchaModule {}
