import { Module } from '@nestjs/common';
import { PLATFORMCompanyController } from './platform/platform_company.controller';
import { PLATFORMCompanyService } from './platform/platform_company.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from 'src/entities/account.entity';
import { CompanyOrmEntity } from './entities/CompanyOrmEntity';
import { SuperAdminCompanyController } from './controllers/super-admin-company.controller';
import { CompanyRepository } from './repositories/company.repository';
import { TypeORMCompanyRepository } from './repositories/typeorm-company.repository';
import { CreateCompanyUseCase } from './use-case/super-admin/create-company.usecase';
import { GetAllCompanyUseCase } from './use-case/super-admin/get-all-company.usecase';
import { UpdateCompanyUseCase } from './use-case/super-admin/update-company.usecase';
import { DeleteCompanyUseCase } from './use-case/super-admin/delete-company.usecase';

@Module({
  imports: [TypeOrmModule.forFeature([CompanyOrmEntity, Account])],
  controllers: [PLATFORMCompanyController, SuperAdminCompanyController],
  providers: [
    {
      provide: CompanyRepository,
      useClass: TypeORMCompanyRepository,
    },
    CreateCompanyUseCase,
    GetAllCompanyUseCase,
    UpdateCompanyUseCase,
    DeleteCompanyUseCase,
    PLATFORMCompanyService],
})
export class CompanyModule { }
