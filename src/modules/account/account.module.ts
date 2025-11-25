import { TypeOrmModule } from '@nestjs/typeorm';
import { AcceptApp } from './../../entities/accept_app.entity';
import { Module } from '@nestjs/common';
import { Account } from 'src/entities/account.entity';
import { SPAccountController } from './sp_account.controller';
import { SPAccountService } from './sp_account.service';
import { Company } from 'src/entities/company.entity';
import { BmsAccountController } from './bms_account.controller';
import { BmsAccountService } from './bms_account.service';
import { CommissionAgent } from 'src/entities/commission_agent.entity';
import { BmsAgentController } from './bms_agent.controller';
import { BmsAgentService } from './bms_agent.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([AcceptApp, Account, Company, CommissionAgent]),
  ],
  controllers: [SPAccountController, BmsAccountController, BmsAgentController],
  providers: [SPAccountService, BmsAccountService, BmsAgentService],
  exports: [],
})
export class AccountModule {}
