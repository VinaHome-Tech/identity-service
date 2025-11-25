import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { BmsAgentService } from './bms_agent.service';
import { TokenGuard } from 'src/guards/token.guard';
import { Roles } from 'src/decorator/roles.decorator';
import { CompanyIdParam } from 'src/param/CompanyIdParam';
import { DTO_RQ_Agent } from './bms_agent.dto';
import { AccountIdParam } from 'src/param/AccountIdParam';

@Controller('bms-agent')
@UseGuards(TokenGuard)
export class BmsAgentController {
  constructor(private readonly service: BmsAgentService) {}

  // M2_v1.F6
  @Post('companies/:id/agents')
  @Roles('ADMIN')
  async CreateAgentAccount(
    @Param() param: CompanyIdParam,
    @Body() data: DTO_RQ_Agent,
  ) {
    return await this.service.CreateAgentAccount(param.id, data);
  }

  // M2_v1.F7
  @Get('companies/:id/agents')
  @Roles('ADMIN')
  async GetListAgentByCompanyId(@Param() param: CompanyIdParam) {
    return await this.service.GetListAgentByCompanyId(param.id);
  }

  // M2_v1.F9
  @Delete(':id')
  @Roles('ADMIN')
  async DeleteAgentAccount(@Param() param: AccountIdParam) {
    return await this.service.DeleteAgentAccount(param.id);
  }
}
