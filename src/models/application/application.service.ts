import { Inject, Injectable } from '@nestjs/common';
import { Constants } from 'src/config';
import {
  Attributes,
  CreateOptions,
  InstanceUpdateOptions,
  WhereOptions,
} from 'sequelize';
import { Application } from './application.model';
import { ApplicationResponse } from './application.dto';
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { ApplicationArrayDataResponse } from 'src/controllers/application/application.dto';
import { CONSTANTS, DTO } from 'sea-platform-helpers';
import {
  Modules,
  Constants as BConstants,
  Services,
} from 'sea-backend-helpers';
import { IncludeQuery } from 'sea-backend-helpers/dist/services/sequelize-crud.service';

@Injectable()
export class ApplicationService extends Services.SequelizeCRUDService<
  Application,
  ApplicationResponse,
  CONSTANTS.Application.ApplicationIncludes
> {
  constructor(
    @Inject(Constants.Database.DatabaseRepositories.ApplicationRepository)
    private applicationRepository: typeof Application,
    @Inject(
      BConstants.Cache.getCacheModuleName(
        BConstants.Cache.CacheableModules.File,
      ),
    )
    private readonly fileManagerRemote: Modules.Remote.RemoteService,
  ) {
    super(applicationRepository, 'Application');
  }

  async create(
    data: Attributes<Application>,
    options?: CreateOptions<Application>,
  ): Promise<Application> {
    if (data.iconFileId)
      await this.fileManagerRemote.checkFindById(data.iconFileId);
    return await super.create(data, options);
  }

  async update(
    entity: Application,
    data: Attributes<Application>,
    options?: InstanceUpdateOptions<Application>,
  ): Promise<Application> {
    if (data.iconFileId && data.iconFileId !== entity.iconFileId)
      await this.fileManagerRemote.checkFindById(data.iconFileId);

    return await super.update(entity, data, options);
  }

  async createOrUpdate(data: Attributes<Application>) {
    const existing = await this.findOne({
      where: {
        key: data.key,
      },
    });
    if (existing) return await this.update(existing, data);
    else return await this.create(data);
  }

  async makeResponse(
    entity: Application,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    include?: IncludeQuery<CONSTANTS.Application.ApplicationIncludes>,
  ): Promise<ApplicationResponse> {
    if (!entity) return null;

    const file = await this.fileManagerRemote.fetchById<DTO.File.IFile>(
      entity.iconFileId,
    );
    return new ApplicationResponse(entity, file);
  }

  async makeApplicationArrayDataResponse(
    page: number,
    limit: number,
    q: string,
    status: CONSTANTS.Application.ApplicationStatuses | 'all',
  ) {
    const where: WhereOptions<Application> = {};
    if (status !== 'all') where['status'] = status;
    if (q) {
      where[Op.or] = ['id', 'name'].map((c) =>
        Sequelize.where(
          Sequelize.fn('LOWER', Sequelize.col(`Application.${c}`)),
          {
            [Op.like]: `%${q}%`,
          },
        ),
      );
    }

    const { totalCount, rows: applications } = await this.findAll(
      { where },
      page,
      limit,
    );

    const rolesResponse = await this.makeResponses(applications);

    return new ApplicationArrayDataResponse(
      totalCount,
      rolesResponse,
      page,
      limit,
    );
  }
}
