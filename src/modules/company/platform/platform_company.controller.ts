import { Body, Controller, Post } from '@nestjs/common';
import { PLATFORMCompanyService } from './platform_company.service';
import { DTO_RQ_Company } from './platform_company.dto';

@Controller('/company')
export class PLATFORMCompanyController {
  constructor(private readonly service: PLATFORMCompanyService) {}

  // M1_v1.F1
  @Post('/create')
  async CreateCompany(@Body() data: DTO_RQ_Company) {
    return await this.service.CreateCompany(data);
  }
}
