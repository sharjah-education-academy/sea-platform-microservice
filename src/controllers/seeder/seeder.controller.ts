import { Controller, Post } from '@nestjs/common';

import { SeederService } from 'src/models/seeder/seeder.service';

@Controller('seeders')
export class SeederController {
  constructor(private readonly seederService: SeederService) {}

  @Post('/seed-init-data')
  async seedInitData() {
    return await this.seederService.seedInitData();
  }

  @Post('/seed-thesis-users')
  async seedThesisUsers() {
    return await this.seederService.seedThesisUsers();
  }
  @Post('/seed-email-templates')
  async seedEmailTemplates() {
    return await this.seederService.seedEmailTemplates();
  }

  @Post('/sync-students')
  async syncStudents() {
    return await this.seederService.syncStudents();
  }

  @Post('/sync-faculties')
  async syncFaculties() {
    return await this.seederService.syncFaculties();
  }

  @Post('/sync-employees')
  async syncEmployees() {
    return await this.seederService.syncEmployees();
  }
}
