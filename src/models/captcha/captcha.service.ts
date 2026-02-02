import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ServerConfigService } from '../server-config/server-config.service';
import axios from 'axios';

@Injectable()
export class CaptchaService {
  constructor(private readonly serverConfigService: ServerConfigService) {}

  async verify(token: string) {
    const secret = this.serverConfigService.get<string>('RECAPTCHA_SECRET_KEY');

    console.log('secret is: ', secret);

    try {
      const { data } = await axios.post(
        'https://www.google.com/recaptcha/api/siteverify',
        null,
        {
          params: {
            secret,
            response: token,
          },
        },
      );

      if (!data.success || data.score < 0.5) {
        throw new UnauthorizedException('Captcha verification failed');
      }

      return true;
    } catch (error) {
      console.log('Error in validate the recaptcha\n', error);
      return false;
    }
  }
}
