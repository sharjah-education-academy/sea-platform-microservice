import { HttpService } from '@nestjs/axios';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ServerConfigService } from '../server-config/server-config.service';
import { firstValueFrom } from 'rxjs';
import { DTO } from 'sea-platform-helpers';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { HttpClientConfigService } from 'src/common/global.service';

@Injectable()
export class FileService {
  private adminBaseUrl: string;
  private callAdminClientId: string;
  private callAdminClientSecret: string;

  constructor(
    private readonly httpService: HttpService,
    private serverConfigService: ServerConfigService,
    private readonly httpClientConfigService: HttpClientConfigService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {
    this.adminBaseUrl = this.serverConfigService.get('FILE_MANAGER_BASE_URL');
    this.callAdminClientId = this.serverConfigService.get(
      'CALL_FILE_MANAGER_CLIENT_ID',
    );
    this.callAdminClientSecret = this.serverConfigService.get(
      'CALL_FILE_MANAGER_CLIENT_SECRET',
    );

    this.httpClientConfigService.configureHttpService(
      this.httpService,
      this.adminBaseUrl,
      this.callAdminClientId,
      this.callAdminClientSecret,
    );
  }

  async fetchById(id: string): Promise<DTO.File.IFile | null> {
    const cacheKey = `file:${id}`;
    const cached = await this.cacheManager.get<DTO.File.IFile | undefined>(
      cacheKey,
    );

    if (cached) {
      return cached;
    }

    try {
      const response = await firstValueFrom(
        this.httpService.get<DTO.File.IFile | undefined>(
          `/api/external/file-manager/${id}`,
        ),
      );

      const file = response.data;

      if (file) {
        await this.cacheManager.set(cacheKey, file, 1000 * 60 * 60 * 24); // cache for 1 day
      }

      return file;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return null;
    }
  }

  async checkFindById(id: string) {
    const file = await this.fetchById(id);
    if (!file) throw new NotFoundException(`File is not found!`);

    return file;
  }

  async fetchByIds(ids: string[]): Promise<DTO.File.IFile[]> {
    const files = await Promise.all(ids.map((id) => this.fetchById(id)));

    return files;
  }
}
