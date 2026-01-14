import { Inject, Injectable } from '@nestjs/common';
import { Constants } from 'src/config';
import { Student } from './student.model';
import { InstanceDestroyOptions } from 'sequelize';
import { StudentResponse } from './student.dto';
import { CONSTANTS } from 'sea-platform-helpers';
import { Services } from 'sea-backend-helpers';
import { IncludeQuery } from 'sea-backend-helpers/dist/services/sequelize-crud.service';

const STUDENT_INCLUDES = [''] as const;

type StudentIncludes = (typeof STUDENT_INCLUDES)[number];

@Injectable()
export class StudentService extends Services.SequelizeCRUDService<
  Student,
  StudentResponse,
  CONSTANTS.Student.StudentIncludes
> {
  constructor(
    @Inject(Constants.Database.DatabaseRepositories.StudentRepository)
    private studentRepository: typeof Student,
  ) {
    super(studentRepository, 'Student');
  }

  async makeResponse(
    entity: Student,
    include?: IncludeQuery<CONSTANTS.Student.StudentIncludes>,
  ): Promise<StudentResponse> {
    if (!entity) return undefined;
    // Normalize include to array
    // const includeArray: StudentIncludes[] =
    //   include === CONSTANTS.Global.AllValue
    //     ? [...STUDENT_INCLUDES] // return all values
    //     : (include ?? []);

    // const [includeSections] = [includeArray.includes("")];

    // // const results = await Promise.all([
    // //   includeFaculty
    // //     ? this.accountRemote.fetchById<DTO.Account.IAccount>(entity.facultyId)
    // //     : Promise.resolve(null),
    // // ]);

    // // const [faculty] = results;

    return new StudentResponse(entity);
  }

  async delete(
    entity: Student,
    options?: InstanceDestroyOptions,
  ): Promise<Student> {
    return await super.delete(entity, { ...options, force: true });
  }
}
