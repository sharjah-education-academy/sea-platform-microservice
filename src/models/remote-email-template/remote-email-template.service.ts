import { Inject, Injectable } from '@nestjs/common';
import { DTO } from 'sea-platform-helpers';

import {
  CreateEmailTemplateDto,
  UpdateEmailTemplateDto,
} from 'src/controllers/email-template/email-template.dto';
import { Modules } from 'sea-backend-helpers';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class RemoteEmailTemplateService {
  constructor(
    @Inject('Remote-Email-Template')
    private readonly remote: Modules.Remote.RemoteService,
  ) {}
  async findAll(page = 1, limit = 10, query = '') {
    return this.remote.fetchAll(`?page=${page}&limit=${limit}&q=${query}`);
  }

  async checkFindById<T>(id: string): Promise<T | null> {
    return await this.remote.checkFindById(id);
  }

  async create(body: CreateEmailTemplateDto) {
    try {
      const response = await firstValueFrom(
        this.remote
          .getHttpService()
          .post<DTO.EmailTemplate.IEmailTemplate>(this.remote.getUrl(), body),
      );

      return response.data;
    } catch {
      return null;
    }
  }

  async update(id: string, body: UpdateEmailTemplateDto) {
    try {
      const response = await firstValueFrom(
        this.remote
          .getHttpService()
          .put<DTO.EmailTemplate.IEmailTemplate>(this.remote.getUrl(id), body),
      );

      return response.data;
    } catch {
      return null;
    }
  }

  async remove(id: string) {
    try {
      const response = await firstValueFrom(
        this.remote
          .getHttpService()
          .delete<DTO.EmailTemplate.IEmailTemplate>(this.remote.getUrl(id)),
      );

      return response.data;
    } catch {
      return null;
    }
  }
}
