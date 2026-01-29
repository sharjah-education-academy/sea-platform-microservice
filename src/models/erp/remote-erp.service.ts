import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { ServerConfigService } from '../server-config/server-config.service';

@Injectable()
export class RemoteERPService {
  constructor(private readonly serverConfigService: ServerConfigService) {}

  createClient(resource: string): AxiosInstance {
    return axios.create({
      baseURL: this.serverConfigService.get<string>('ERP_BASE_URL') + resource,
      auth: {
        username: this.serverConfigService.get<string>('ERP_ADMIN_USERNAME'),
        password: this.serverConfigService.get<string>('ERP_ADMIN_PASSWORD'),
      },
    });
  }
}
