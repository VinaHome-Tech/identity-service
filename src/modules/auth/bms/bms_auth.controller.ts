import { Body, Controller, Post, Req } from '@nestjs/common';
import { BMSAuthService } from '../bms/bms_auth.service';
import { DTO_RQ_LoginBMS, DTO_RQ_LogoutBMS } from '../bms/bms_auth.dto';
import { Request } from 'express';
@Controller('bms-auth')
export class BMSAuthController {
  constructor(private readonly service: BMSAuthService) { }

  // M3_v1.F1
  @Post('login-bms')
  async LoginBms(@Body() data: DTO_RQ_LoginBMS, @Req() req: Request) {
    return this.service.LoginBms(data, req);
  }

  // M3_v1.F2
  @Post('logout-bms')
  async LogoutBms(@Body() data: DTO_RQ_LogoutBMS) {
    return this.service.LogoutBms(data.account_id);
  }
}
