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
}
