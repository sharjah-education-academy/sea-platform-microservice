import { Constants } from 'src/config';
import { OTP } from './otp.model';
import { DatabaseConnections } from 'src/database/database.provider';

export const otpProviders = [
  {
    provide: Constants.Database.DatabaseRepositories.OTPRepository,
    useFactory: (sequelize) => sequelize.getRepository(OTP),
    inject: [DatabaseConnections.Main],
  },
];
