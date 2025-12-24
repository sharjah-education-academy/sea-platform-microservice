import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { localizationProviders } from 'src/models/localization/localization.provider';
import { LocalizationService } from 'src/models/localization/localization.service';
import { ApplicationModule } from './application.module';

@Module({
  imports: [DatabaseModule, ApplicationModule],
  providers: [LocalizationService, ...localizationProviders],
  exports: [LocalizationService],
})
export class LocalizationModule {}
