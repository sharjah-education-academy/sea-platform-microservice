import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Constants } from 'src/config';
import { Attributes, FindOptions, WhereOptions } from 'sequelize';
import { Application } from './application.model';
import { ApplicationResponse } from './application.dto';
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { ApplicationArrayDataResponse } from 'src/controllers/application/application.dto';
import { CONSTANTS, DTO } from 'sea-platform-helpers';
import { Modules } from 'sea-backend-helpers';

@Injectable()
export class ApplicationService {
  constructor(
    @Inject(Constants.Database.DatabaseRepositories.ApplicationRepository)
    private applicationRepository: typeof Application,
    @Inject('Remote-File')
    private readonly fileManagerRemote: Modules.Remote.RemoteService,
  ) {}

  async findAll(
    options?: FindOptions<Attributes<Application>>,
    page: number = 1,
    limit: number = 10,
    all = false,
  ) {
    if (page < 1) page = 1;
    const offset = (page - 1) * limit;

    options = all ? options : { ...options, limit, offset };

    const { count: totalCount, rows: applications } =
      await this.applicationRepository.findAndCountAll({
        ...options,
      });
    return {
      totalCount,
      applications,
    };
  }

  async findOne(options?: FindOptions<Attributes<Application>>) {
    return await this.applicationRepository.findOne(options);
  }

  async checkIsFound(options?: FindOptions<Attributes<Application>>) {
    const application = await this.findOne(options);
    if (!application) throw new NotFoundException(`Application is not found!`);

    return application;
  }

  async create(data: Attributes<Application>, iconFileId: string | undefined) {
    let file: DTO.File.IFile | undefined = undefined;

    if (iconFileId)
      file =
        await this.fileManagerRemote.checkFindById<DTO.File.IFile>(iconFileId);

    const application = new Application({
      ...data,
      iconFileId: file?.id,
    });

    return await application.save();
  }

  async update(
    application: Application,
    data: Attributes<Application>,
    iconFileId: string,
  ) {
    const file =
      await this.fileManagerRemote.checkFindById<DTO.File.IFile>(iconFileId);

    return await application.update({ ...data, iconFileId: file.id });
  }
  async updateStatus(
    application: Application,
    status: CONSTANTS.Application.ApplicationStatuses,
  ) {
    application.status = status;
    return await application.save();
  }

  async makeApplicationResponse(application: Application) {
    const file = await this.fileManagerRemote.fetchById<DTO.File.IFile>(
      application.iconFileId,
    );

    return new ApplicationResponse(application, file);
  }

  async makeApplicationsResponse(applications: Application[]) {
    const applicationsResponse = await Promise.all(
      applications.map((application) =>
        this.makeApplicationResponse(application),
      ),
    );

    return applicationsResponse;
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

    const { totalCount, applications } = await this.findAll(
      { where },
      page,
      limit,
    );

    const rolesResponse = await this.makeApplicationsResponse(applications);

    return new ApplicationArrayDataResponse(
      totalCount,
      rolesResponse,
      page,
      limit,
    );
  }
}
