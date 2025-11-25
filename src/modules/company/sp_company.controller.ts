import { Body, Controller, Post } from '@nestjs/common';
import { SPCompanyService } from './sp_company.service';
import { DTO_RQ_Company } from './sp_company.dto';

@Controller('/company')
export class SPCompanyController {
  constructor(private readonly service: SPCompanyService) {}

  // M1_v1.F1
  @Post('/create')
  async CreateCompany(@Body() data: DTO_RQ_Company) {
    return await this.service.CreateCompany(data);
  }
}
