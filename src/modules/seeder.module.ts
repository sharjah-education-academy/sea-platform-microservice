import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';

import { SeederService } from 'src/models/seeder/seeder.service';
import { AccountModuleDependencies } from './account.module';
import { ApplicationModuleDependencies } from './application.module';

export const SeederModuleDependencies = {
  imports: [DatabaseModule],
  providers: [
    SeederService,
    ...AccountModuleDependencies.providers,
    ...ApplicationModuleDependencies.providers,
  ],
};

@Module({
  imports: [...SeederModuleDependencies.imports],
  providers: [...SeederModuleDependencies.providers],
})
export class SeederModule {}
