import { Module } from '@nestjs/common';
import { SPCompanyController } from './sp_company.controller';
import { SPCompanyService } from './sp_company.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from 'src/entities/company.entity';
import { Account } from 'src/entities/account.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Company, Account])],
  controllers: [SPCompanyController],
  providers: [SPCompanyService],
})
export class CompanyModule {}
