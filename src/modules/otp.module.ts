import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { otpProviders } from 'src/models/otp/otp.provider';
import { OTPService } from 'src/models/otp/otp.service';

@Module({
  imports: [DatabaseModule],
  providers: [OTPService, ...otpProviders],
  exports: [OTPService],
})
export class OTPModule {}
