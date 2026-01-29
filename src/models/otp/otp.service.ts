import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Constants } from 'src/config';
import { OTP } from './otp.model';
import { Attributes, FindOptions } from 'sequelize';
import { Utils } from 'sea-platform-helpers';
import { Account } from '../account/account.model';
import { CONSTANTS } from 'sea-platform-helpers';
import { Services, Constants as BConstants } from 'sea-backend-helpers';

@Injectable()
export class OTPService {
  constructor(
    @Inject(Constants.Database.DatabaseRepositories.OTPRepository)
    private otpRepository: typeof OTP,
    private readonly queueService: Services.QueueService,
  ) {}

  async sendPasswordResetVerificationCode(
    accountId: string,
    otp: string,
    expireInMinutes: number,
  ) {
    console.log('sendPasswordResetVerificationCode');
    this.queueService.addJob(
      BConstants.Queue.Messages.Email,
      'PasswordResetVerificationCode',
      {
        accountId,
        otp,
        expireInMinutes,
      },
    );
  }

  async findByIdentifier(identifier: string) {
    return await this.findOne({ where: { identifier } });
  }

  async findOne(options?: FindOptions<Attributes<OTP>>) {
    return await this.otpRepository.findOne(options);
  }

  async createOrUpdate(identifier: string, account: Account | undefined) {
    const otpCode = Utils.String.generateRandomString();

    const expiresAt = new Date(
      Date.now() + CONSTANTS.OTP.OTPExpiresAfterXMinutes * 60 * 1000,
    );

    let otp = await this.findByIdentifier(identifier);
    if (otp) {
      otp.otpCode = otpCode;
      otp.expiresAt = expiresAt;
      otp.remainingTries = CONSTANTS.OTP.NumberOfTries;
      otp.accountId = account?.id || null;
      otp = await otp.save();
    } else {
      otp = await this.otpRepository.create({
        otpCode,
        expiresAt,
        identifier,
        accountId: account?.id || null,
      });
    }

    if (account) {
      this.sendPasswordResetVerificationCode(
        account.id,
        otpCode,
        CONSTANTS.OTP.OTPExpiresAfterXMinutes,
      );
    }

    return otp;
  }

  async checkValidity(identifier: string, OTPCode: string) {
    const otp = await this.findByIdentifier(identifier);
    if (!otp)
      throw new BadRequestException(
        `There is no OTP code for this identifier (${identifier})`,
      );

    if (otp.remainingTries <= 0) {
      await otp.destroy();
      throw new BadRequestException(`You reach the limit of tries!`);
    }

    if (new Date() > otp.expiresAt)
      throw new BadRequestException(`The OTP has been expired!`);

    if (otp.otpCode !== OTPCode) {
      await otp.update({
        remainingTries: otp.remainingTries - 1,
      });

      throw new BadRequestException(`The OTP code is incorrect!`);
    }

    return otp;
  }
}
