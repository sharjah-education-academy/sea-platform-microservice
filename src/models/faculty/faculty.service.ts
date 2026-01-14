import { Inject, Injectable } from '@nestjs/common';
import { Constants } from 'src/config';
import { Faculty } from './faculty.model';
import { InstanceDestroyOptions } from 'sequelize';
import { FacultyResponse } from './faculty.dto';
import { CONSTANTS } from 'sea-platform-helpers';
import { Services } from 'sea-backend-helpers';
import { IncludeQuery } from 'sea-backend-helpers/dist/services/sequelize-crud.service';

@Injectable()
export class FacultyService extends Services.SequelizeCRUDService<
  Faculty,
  FacultyResponse,
  CONSTANTS.Faculty.FacultyIncludes
> {
  constructor(
    @Inject(Constants.Database.DatabaseRepositories.FacultyRepository)
    private facultyRepository: typeof Faculty,
  ) {
    super(facultyRepository, 'Faculty');
  }

  async makeResponse(
    entity: Faculty,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    include?: IncludeQuery<CONSTANTS.Faculty.FacultyIncludes>,
  ): Promise<FacultyResponse> {
    if (!entity) return undefined;

    return new FacultyResponse(entity);
  }

  async delete(
    entity: Faculty,
    options?: InstanceDestroyOptions,
  ): Promise<Faculty> {
    return await super.delete(entity, { ...options, force: true });
  }
}
