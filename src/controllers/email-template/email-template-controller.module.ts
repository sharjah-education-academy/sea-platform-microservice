import { Module } from '@nestjs/common';
import { EmailTemplateModule } from 'src/modules/email-template.module';
import { EmailTemplateController } from './email-template.controller';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [EmailTemplateModule],
  controllers: [EmailTemplateController],
  providers: [JwtService],
})
export class EmailTemplateControllerModule {}
