import { Controller, Post } from '@nestjs/common';

import { SeederService } from 'src/models/seeder/seeder.service';

@Controller('seeders')
export class SeederController {
  constructor(private readonly seederService: SeederService) {}

  @Post('/init-platform-data')
  async initPlatformData() {
    await this.seederService.initPlatformData();
    return true;
  }
}
