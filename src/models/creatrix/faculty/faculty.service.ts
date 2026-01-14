import { Inject, Injectable } from '@nestjs/common';
import { Constants } from 'src/config';

import { Services } from 'sea-backend-helpers';
import { CreatrixFaculty } from './faculty.model';

@Injectable()
export class CreatrixFacultyService extends Services.SequelizeCRUDService<
  CreatrixFaculty,
  object
> {
  constructor(
    @Inject(Constants.Database.DatabaseRepositories.CreatrixFacultyRepository)
    private creatrixFacultyRepository: typeof CreatrixFaculty,
  ) {
    super(creatrixFacultyRepository, 'Creatrix Faculty');
  }
}
