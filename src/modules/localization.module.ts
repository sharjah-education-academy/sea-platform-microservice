import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { localizationProviders } from 'src/models/localization/localization.provider';
import { LocalizationService } from 'src/models/localization/localization.service';
import { ApplicationModule } from './application.module';
import { applicationProviders } from 'src/models/application/application.provider';

@Module({
  imports: [DatabaseModule, ApplicationModule],
  providers: [
    LocalizationService,
    ...localizationProviders,
    ...applicationProviders,
  ],
  exports: [LocalizationService],
})
export class LocalizationModule {}
