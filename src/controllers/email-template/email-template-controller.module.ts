import { Module } from '@nestjs/common';
import { EmailTemplateController } from './email-template.controller';
import { JwtService } from '@nestjs/jwt';
import { RemoteEmailTemplateModule } from 'src/modules/remote-email-template.module';
import { RemoteEmailTemplateVersionModule } from 'src/modules/remote-email-template-version.module';

@Module({
  imports: [RemoteEmailTemplateModule, RemoteEmailTemplateVersionModule],
  controllers: [EmailTemplateController],
  providers: [JwtService],
})
export class EmailTemplateControllerModule {}
