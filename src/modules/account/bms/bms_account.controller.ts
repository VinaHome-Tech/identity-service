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
import { DTO_RQ_Account } from './bms_account.dto';
import { AccountIdParam } from 'src/param/AccountIdParam';

@Controller('bms-account')
@UseGuards(TokenGuard)
export class BmsAccountController {
  constructor(private readonly service: BmsAccountService) {}

  @Post('companies/:id/accounts')
  @Roles('ADMIN')
  async CreateAccout(
    @Param() param: CompanyIdParam,
    @Body() data: DTO_RQ_Account,
  ) {
    return await this.service.CreateAccout(param.id, data);
  }

  @Get('companies/:id/accounts')
  @Roles('ADMIN')
  async GetListAccountByCompanyId(@Param() param: CompanyIdParam) {
    return await this.service.GetListAccountByCompanyId(param.id);
  }

  @Put(':id')
  @Roles('ADMIN')
  async UpdateAccount(
    @Param() param: AccountIdParam,
    @Body() data: DTO_RQ_Account,
  ) {
    return await this.service.UpdateAccount(param.id, data);
  }

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
}
