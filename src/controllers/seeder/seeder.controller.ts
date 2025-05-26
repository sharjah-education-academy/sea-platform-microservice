import { Controller, Post } from '@nestjs/common';

import { SeederService } from 'src/models/seeder/seeder.service';

@Controller('seeders')
export class SeederController {
  constructor(private readonly seederService: SeederService) {}

  @Post('/super-admin')
  async seedSuperAdminAccount() {
    return this.seederService.seedSuperAdminAccount();
  }
}
