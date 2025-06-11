import { HttpService } from '@nestjs/axios';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { DTO } from 'sea-platform-helpers';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { Constants } from 'src/config';

@Injectable()
export class FileService {
  constructor(
    @Inject(Constants.HttpProvider.HTTPProviders.FileManager)
    private readonly httpService: HttpService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

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
