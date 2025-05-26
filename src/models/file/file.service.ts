import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Constants } from 'src/config';
import { join } from 'path';
import { File } from './file.model';
import { Attributes, FindOptions } from 'sequelize';
import { FileResponse } from './file.dto';
import { Utils as BackendUtils } from 'sea-backend-helpers';
import { ServerConfigService } from '../server-config/server-config.service';

@Injectable()
export class FileService {
  constructor(
    @Inject(Constants.Database.DatabaseRepositories.FileRepository)
    private fileRepository: typeof File,

    private readonly serverConfigService: ServerConfigService,
  ) {}

  async findOne(options?: FindOptions<Attributes<File>>) {
    return await this.fileRepository.findOne(options);
  }

  async checkIsFound(options?: FindOptions<Attributes<File>>) {
    const file = await this.findOne(options);
    if (!file) throw new NotFoundException(`File is not found!`);

    return file;
  }

  async create(data: Attributes<File>) {
    const file = new File({
      ...data,
    });

    return await file.save();
  }

  async delete(file: File) {
    // delete the static file first
    const absolutePath = join(__dirname, '..', '..', '..', file.path);
    await BackendUtils.File.removeFile(absolutePath);

    return await file.destroy({ force: true });
  }

  async makeFileResponse(file: File | undefined) {
    if (!file) return undefined;

    const baseUrl = this.serverConfigService.get<string>(
      'STATIC_FILES_BASE_URL',
    );
    const URL = baseUrl + file.path;
    return new FileResponse(file, URL);
  }
}
