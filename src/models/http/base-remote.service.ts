import { HttpService } from '@nestjs/axios';
import { BadRequestException } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

export class BaseRemoteService {
  constructor(protected readonly httpService: HttpService) {}

  /** Generic request wrapper with unified error handling */
  protected async request<T>(callback: () => Promise<T>): Promise<T> {
    try {
      return await callback();
    } catch (error: any) {
      if (error.code === 'ECONNREFUSED') {
        throw new BadRequestException(
          `Could be the service is down, please try later!`,
        );
      }
      const message =
        error.response?.data?.message ||
        error.message ||
        'Remote service request failed';
      throw new BadRequestException(message);
    }
  }

  protected async get<T>(url: string) {
    const res = await this.request(() =>
      firstValueFrom(this.httpService.get<T>(url)),
    );
    return res.data;
  }

  protected async post<T>(url: string, body: unknown) {
    const res = await this.request(() =>
      firstValueFrom(this.httpService.post<T>(url, body)),
    );
    return res.data;
  }

  protected async put<T>(url: string, body: unknown) {
    const res = await this.request(() =>
      firstValueFrom(this.httpService.put<T>(url, body)),
    );
    return res.data;
  }

  protected async delete<T>(url: string) {
    const res = await this.request(() =>
      firstValueFrom(this.httpService.delete<T>(url)),
    );
    return res.data;
  }
}
