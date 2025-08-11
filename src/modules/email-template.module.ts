import { Module } from '@nestjs/common';
import { HttpProvidersModule } from './http-providers.module';
import { EmailTemplateService } from 'src/models/email-template/email-template.service';

@Module({
  imports: [HttpProvidersModule],
  providers: [EmailTemplateService],
  exports: [EmailTemplateService],
})
export class EmailTemplateModule {}
