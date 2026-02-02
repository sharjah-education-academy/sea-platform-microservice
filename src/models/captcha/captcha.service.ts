import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ServerConfigService } from '../server-config/server-config.service';
import axios from 'axios';

@Injectable()
export class CaptchaService {
  constructor(private readonly serverConfigService: ServerConfigService) {}

  async verify(token: string) {
    const secret = this.serverConfigService.get<string>('RECAPTCHA_SECRET_KEY');

    const { data } = await axios.post(
      'https://www.google.com/recaptcha/api/siteverify',
      null,
      {
        params: { secret, response: token },
        timeout: 5000,
      },
    );

    if (!data.success) {
      throw new UnauthorizedException('Captcha verification failed');
    }

    return true;
  }
}
