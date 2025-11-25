import { Body, Controller, Post } from '@nestjs/common';
import { BMSAuthService } from './bms_auth.service';
import { DTO_RQ_LoginBMS, DTO_RQ_LogoutBMS } from './bms_auth.dto';

@Controller('bms-auth')
export class BMSAuthController {
  constructor(private readonly service: BMSAuthService) {}

  // M3_v1.F1
  @Post('login-bms')
  async LoginBms(@Body() data: DTO_RQ_LoginBMS) {
    return this.service.LoginBms(data);
  }

  // M3_v1.F2
  @Post('logout-bms')
  async LogoutBms(@Body() data: DTO_RQ_LogoutBMS) {
    return this.service.LogoutBms(data.account_id);
  }
}
