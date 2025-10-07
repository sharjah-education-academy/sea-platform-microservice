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

  // async fetchTemplateVersions(id: string) {
  //   return this.get<DTO.EmailTemplate.IEmailTemplateVersion[]>(
  //     `/api/email-templates/${id}/versions`,
  //   );
  // }

  // async fetchVersionById(id: string) {
  //   const cacheKey = `email-template-version:${id}`;
  //   const cached =
  //     await this.cacheManager.get<DTO.EmailTemplate.IEmailTemplateVersion>(
  //       cacheKey,
  //     );
  //   if (cached) return cached;

  //   const version = await this.get<DTO.EmailTemplate.IEmailTemplateVersion>(
  //     `/api/email-templates/versions/${id}`,
  //   );
  //   if (version) {
  //     await this.cacheManager.set(cacheKey, version, 1000 * 60 * 60 * 24);
  //   }
  //   return version;
  // }

  // async checkVersionFindById(id: string) {
  //   const version = await this.fetchVersionById(id);
  //   if (!version)
  //     throw new NotFoundException(`Email Template Version is not found!`);
  //   return version;
  // }

  // async createVersion(body: CreateEmailTemplateVersionDto) {
  //   return this.post(`/api/email-templates/versions`, body);
  // }

  // async updateVersion(id: string, body: UpdateEmailTemplateVersionDto) {
  //   return this.put(`/api/email-templates/versions/${id}`, body);
  // }

  // async removeVersion(id: string) {
  //   return this.delete(`/api/email-templates/versions/${id}`);
  // }
}
