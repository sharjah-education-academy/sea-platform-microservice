import { Inject, Injectable } from '@nestjs/common';
import { Constants } from 'src/config';

import { Services } from 'sea-backend-helpers';
import { CreatrixStudent } from './student.model';

@Injectable()
export class CreatrixStudentService extends Services.SequelizeCRUDService<
  CreatrixStudent,
  object
> {
  constructor(
    @Inject(Constants.Database.DatabaseRepositories.CreatrixStudentRepository)
    private creatrixStudentRepository: typeof CreatrixStudent,
  ) {
    super(creatrixStudentRepository, 'Creatrix Student');
  }
}
