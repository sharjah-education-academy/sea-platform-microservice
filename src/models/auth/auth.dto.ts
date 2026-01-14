import { ApiProperty } from '@nestjs/swagger';
import { AccountResponse } from '../account/account.dto';

export class LoginResponse {
  @ApiProperty()
  accessToken: string;
  @ApiProperty({ type: AccountResponse })
  account: AccountResponse;

  constructor(accessToken: string, account: AccountResponse) {
    this.accessToken = accessToken;
    this.account = account;
  }
}
