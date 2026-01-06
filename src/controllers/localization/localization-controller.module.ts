import { Module } from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { LocalizationModule } from 'src/modules/localization.module';
import { LocalizationController } from './localization.controller';

@Module({
  imports: [LocalizationModule],
  controllers: [LocalizationController],
  providers: [JwtService],
})
export class LocalizationControllerModule {}
