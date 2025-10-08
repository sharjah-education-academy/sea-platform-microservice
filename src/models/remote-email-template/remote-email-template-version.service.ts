import { Inject, Injectable } from '@nestjs/common';
import { DTO } from 'sea-platform-helpers';

import {
  CreateEmailTemplateVersionDto,
  UpdateEmailTemplateVersionDto,
} from 'src/controllers/email-template/email-template.dto';
import { Modules, Constants as BConstants } from 'sea-backend-helpers';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class RemoteEmailTemplateVersionService {
  constructor(
    @Inject(
      BConstants.Cache.getCacheModuleName(
        BConstants.Cache.CacheableModules.EmailTemplateVersion,
      ),
    )
    private readonly remote: Modules.Remote.RemoteService,
  ) {}

  async findAllForTemplate(templateId: string) {
    return this.remote.fetchAll(`/${templateId}/versions`);
  }

  async findAll(page = 1, limit = 10, query = '') {
    return this.remote.fetchAll(`?page=${page}&limit=${limit}&q=${query}`);
  }

  async checkFindById<T>(id: string): Promise<T | null> {
    return await this.remote.checkFindById(id);
  }

  async create(body: CreateEmailTemplateVersionDto) {
    try {
      const response = await firstValueFrom(
        this.remote
          .getHttpService()
          .post<DTO.EmailTemplate.IEmailTemplateVersion>(
            this.remote.getUrl() + '/versions',
            body,
          ),
      );

      return response.data;
    } catch {
      return null;
    }
  }

  async update(id: string, body: UpdateEmailTemplateVersionDto) {
    try {
      const response = await firstValueFrom(
        this.remote
          .getHttpService()
          .put<DTO.EmailTemplate.IEmailTemplateVersion>(
            this.remote.getUrl(id),
            body,
          ),
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
