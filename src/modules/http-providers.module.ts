import { HttpService } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import axios from 'axios';
import { Constants } from 'src/config';

@Module({
  providers: [
    {
      provide: Constants.HttpProvider.HTTPProviders.FileManager,
      useFactory: () => {
        const axiosInstance = axios.create({
          baseURL: process.env.FILE_MANAGER_BASE_URL,
          auth: {
            username: process.env.CALL_FILE_MANAGER_CLIENT_ID,
            password: process.env.CALL_FILE_MANAGER_CLIENT_SECRET,
          },
        });
        return new HttpService(axiosInstance);
      },
    },
    {
      provide: Constants.HttpProvider.HTTPProviders.EmailTemplate,
      useFactory: () => {
        const axiosInstance = axios.create({
          baseURL: process.env.EMAIL_TEMPLATE_BASE_URL,
          auth: {
            username: process.env.CALL_EMAIL_TEMPLATE_CLIENT_ID,
            password: process.env.CALL_EMAIL_TEMPLATE_CLIENT_SECRET,
          },
        });
        return new HttpService(axiosInstance);
      },
    },
  ],
  exports: [
    Constants.HttpProvider.HTTPProviders.FileManager,
    Constants.HttpProvider.HTTPProviders.EmailTemplate,
  ],
})
export class HttpProvidersModule {}
