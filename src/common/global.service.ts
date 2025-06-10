import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

@Injectable()
export class HttpClientConfigService {
  configureHttpService(
    httpService: HttpService,
    baseUrl: string,
    clientId: string,
    clientSecret: string,
  ): void {
    httpService.axiosRef.defaults.baseURL = baseUrl;
    httpService.axiosRef.defaults.auth = {
      username: clientId,
      password: clientSecret,
    };
    httpService.axiosRef.defaults.headers['Content-Type'] = 'application/json';
  }
}
