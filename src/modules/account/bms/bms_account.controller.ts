import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { BmsAccountService } from '../bms/bms_account.service';
import { TokenGuard } from 'src/guards/token.guard';
import { Roles } from 'src/decorator/roles.decorator';
import { CompanyIdParam } from 'src/param/CompanyIdParam';
import { DTO_RQ_Account, DTO_RQ_AccountInfo, DTO_RQ_ChangePassword } from './bms_account.dto';
import { AccountIdParam } from 'src/param/AccountIdParam';
import { UUIDParam } from 'src/param/UUIDParam';

@Controller('bms-account')
@UseGuards(TokenGuard)
export class BmsAccountController {
  constructor(private readonly service: BmsAccountService) {}

  // M2_v1.F2
  @Post('companies/:id/accounts')
  @Roles('ADMIN')
  async CreateAccout(
    @Param() param: CompanyIdParam,
    @Body() data: DTO_RQ_Account,
  ) {
    return await this.service.CreateAccout(param.id, data);
  }

  // M2_v1.F3
  @Get('companies/:id/accounts')
  @Roles('ADMIN')
  async GetListAccountByCompanyId(@Param() param: CompanyIdParam) {
    return await this.service.GetListAccountByCompanyId(param.id);
  }

  // M2_v1.F4
  @Put(':id')
  @Roles('ADMIN')
  async UpdateAccount(
    @Param() param: AccountIdParam,
    @Body() data: DTO_RQ_Account,
  ) {
    return await this.service.UpdateAccount(param.id, data);
  }

  // M2_v1.F5
  @Delete(':id')
  @Roles('ADMIN')
  async DeleteAccount(@Param() param: AccountIdParam) {
    return await this.service.DeleteAccount(param.id);
  }

  @Get('companies/:id/drivers')
  @Roles('ADMIN', 'STAFF')
  async GetListDriverByCompanyId(@Param() param: CompanyIdParam) {
    return await this.service.GetListDriverByCompanyId(param.id);
  }

  @Get('companies/:id/assistants')
  @Roles('ADMIN', 'STAFF')
  async GetListAssistantByCompanyId(@Param() param: CompanyIdParam) {
    return await this.service.GetListAssistantByCompanyId(param.id);
  }

  // M2_v1.F10
  @Get(':id/info')
  @Roles('ADMIN', 'STAFF')
  async GetInfoAccountById(@Param() param: UUIDParam) {
    return await this.service.GetInfoAccountById(param.id);
  }

  // M2_v1.F11
  @Put(':id/info')
  @Roles('ADMIN', 'STAFF')
  async UpdateInfoAccountById(
    @Param() param: UUIDParam,
    @Body() data: DTO_RQ_AccountInfo,
  ) {
    return await this.service.UpdateInfoAccountById(param.id, data);
  }

  // M2_v1.F12
  @Post(':id/change-password')
  @Roles('ADMIN', 'STAFF')
  async ChangePasswordAccountById(
    @Param() param: UUIDParam,
    @Body() data: DTO_RQ_ChangePassword,
  ) {
    return await this.service.ChangePasswordAccountById(
      param.id,
      data,
    );
  }
}
