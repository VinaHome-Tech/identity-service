import { Body, Controller, Post } from '@nestjs/common';
import { SPAccountService } from './sp_account.service';
import { DTO_RQ_AdminAccount } from './sp_account.dto';

@Controller('/sp-account')
export class SPAccountController {
  constructor(private readonly service: SPAccountService) {}

  // M2_v1.F1
  @Post('/create-admin')
  async CreateAdminAccount(@Body() data: DTO_RQ_AdminAccount) {
    return await this.service.CreateAdminAccount(data);
  }
}
