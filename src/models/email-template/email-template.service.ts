import { HttpService } from '@nestjs/axios';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DTO } from 'sea-platform-helpers';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { Constants } from 'src/config';
import {
  CreateEmailTemplateDto,
  CreateEmailTemplateVersionDto,
  UpdateEmailTemplateDto,
  UpdateEmailTemplateVersionDto,
} from 'src/controllers/email-template/email-template.dto';
import { BaseRemoteService } from '../http/base-remote.service';

@Injectable()
export class EmailTemplateService extends BaseRemoteService {
  constructor(
    @Inject(Constants.HttpProvider.HTTPProviders.EmailTemplate)
    httpService: HttpService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {
    super(httpService as any);
  }

  async findAll(page = 1, limit = 10, query = '') {
    return this.get<DTO.EmailTemplate.IEmailTemplateArrayDataResponse>(
      `/api/email-templates?page=${page}&limit=${limit}&q=${query}`,
    );
  }

  async fetchById(id: string) {
    const cacheKey = `email-template:${id}`;
    const cached =
      await this.cacheManager.get<DTO.EmailTemplate.IEmailTemplate>(cacheKey);
    if (cached) return cached;

    const template = await this.get<DTO.EmailTemplate.IEmailTemplate>(
      `/api/email-templates/${id}`,
    );
    if (template) {
      await this.cacheManager.set(cacheKey, template, 1000 * 60 * 60 * 24);
    }
    return template;
  }

  async checkFindById(id: string) {
    const template = await this.fetchById(id);
    if (!template) throw new NotFoundException(`Email Template is not found!`);
    return template;
  }

  async create(body: CreateEmailTemplateDto) {
    return this.post<DTO.EmailTemplate.IEmailTemplate>(
      `/api/email-templates`,
      body,
    ).then((value) => {
      const cacheKey = `email-template:${value.id}`;
      this.cacheManager.set(cacheKey, value);
    });
  }

  async update(id: string, body: UpdateEmailTemplateDto) {
    return this.put<DTO.EmailTemplate.IEmailTemplate>(
      `/api/email-templates/${id}`,
      body,
    ).then((value) => {
      const cacheKey = `email-template:${id}`;
      this.cacheManager.set(cacheKey, value);
    });
  }

  async remove(id: string) {
    return this.delete(`/api/email-templates/${id}`).then(() => {
      const cacheKey = `email-template:${id}`;
      this.cacheManager.del(cacheKey);
    });
  }

  async fetchTemplateVersions(id: string) {
    return this.get<DTO.EmailTemplate.IEmailTemplateVersion[]>(
      `/api/email-templates/${id}/versions`,
    );
  }

  async fetchVersionById(id: string) {
    const cacheKey = `email-template-version:${id}`;
    const cached =
      await this.cacheManager.get<DTO.EmailTemplate.IEmailTemplateVersion>(
        cacheKey,
      );
    if (cached) return cached;

    const version = await this.get<DTO.EmailTemplate.IEmailTemplateVersion>(
      `/api/email-templates/versions/${id}`,
    );
    if (version) {
      await this.cacheManager.set(cacheKey, version, 1000 * 60 * 60 * 24);
    }
    return version;
  }

  async checkVersionFindById(id: string) {
    const version = await this.fetchVersionById(id);
    if (!version)
      throw new NotFoundException(`Email Template Version is not found!`);
    return version;
  }

  async createVersion(body: CreateEmailTemplateVersionDto) {
    return this.post(`/api/email-templates/versions`, body);
  }

  async updateVersion(id: string, body: UpdateEmailTemplateVersionDto) {
    return this.put(`/api/email-templates/versions/${id}`, body);
  }

  async removeVersion(id: string) {
    return this.delete(`/api/email-templates/versions/${id}`);
  }
}
