import { Module } from '@nestjs/common';
import { PLATFORMCompanyController } from './platform/platform_company.controller';
import { PLATFORMCompanyService } from './platform/platform_company.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from 'src/entities/company.entity';
import { Account } from 'src/entities/account.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Company, Account])],
  controllers: [PLATFORMCompanyController],
  providers: [PLATFORMCompanyService],
})
export class CompanyModule {}
