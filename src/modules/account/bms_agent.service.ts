import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { DTO_RQ_Agent } from './bms/bms_agent.dto';
import { CommissionAgent } from 'src/entities/commission_agent.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from 'src/entities/account.entity';
import { Repository } from 'typeorm';
import { Company } from 'src/entities/company.entity';
import * as argon2 from 'argon2';
import { AcceptApp } from 'src/entities/accept_app.entity';
@Injectable()
export class BmsAgentService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepo: Repository<Account>,
    @InjectRepository(Company)
    private readonly companyRepo: Repository<Company>,
    @InjectRepository(AcceptApp)
    private readonly acceptAppRepo: Repository<AcceptApp>,
    @InjectRepository(CommissionAgent)
    private readonly commissionRepo: Repository<CommissionAgent>,
  ) {}

  // M2_v1.F6
  async CreateAgentAccount(companyId: string, data: DTO_RQ_Agent) {
    try {
      console.time('CreateAgentAccount');

      const company = await this.companyRepo.findOne({
        where: { id: companyId },
        select: { id: true, company_code: true },
      });
      if (!company) {
        throw new NotFoundException('Không tìm thấy dữ liệu công ty');
      }

      const newUsername = data.username + '.' + company.company_code;
      const existing = await this.accountRepo.findOne({
        where: { username: newUsername },
      });
      if (existing) throw new ConflictException('Tài khoản đã tồn tại');

      const hashedPassword = await argon2.hash(data.password);

      const newAccount = this.accountRepo.create({
        company: company,
        username: newUsername,
        password: hashedPassword,
        email: data.email,
        phone: data.phone,
        role: 'AGENT',
        address: data.address,
        status: data.status,
        name: data.name,
        accept_app: this.acceptAppRepo.create({
          bms: false,
          cms: false,
          ams: true,
          driver: false,
        }),
      });
      await this.accountRepo.save(newAccount);

      const commission = this.commissionRepo.create({
        ticket_type: data.commission.ticket_type,
        ticket_value: data.commission.ticket_value,
        goods_type: data.commission.goods_type,
        goods_value: data.commission.goods_value,
        account: newAccount,
      });
      await this.commissionRepo.save(commission);

      const response = {
        id: newAccount.id,
        username: newAccount.username,
        phone: newAccount.phone,
        email: newAccount.email,
        name: newAccount.name,
        address: newAccount.address,
        status: newAccount.status,
        commission: commission,
      };

      return {
        success: true,
        message: 'Success',
        statusCode: HttpStatus.CREATED,
        result: response,
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      console.error(error);
      throw new InternalServerErrorException('Thêm đại lý thất bại');
    } finally {
      console.timeEnd('CreateAgentAccount');
    }
  }

  // M2_v1.F7
  async GetListAgentByCompanyId(companyId: string) {
    try {
      console.time('GetListAgentByCompanyId');

      const agents = await this.accountRepo.find({
        where: { company: { id: companyId }, role: 'AGENT' },
        relations: ['commission_agent'],
      });
      if (!agents || agents.length === 0) {
        throw new NotFoundException('Không tìm thấy dữ liệu đại lý');
      }

      return {
        success: true,
        message: 'Success',
        statusCode: HttpStatus.OK,
        result: agents,
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      console.error(error);
      throw new InternalServerErrorException('Lấy danh sách đại lý thất bại');
    } finally {
      console.timeEnd('GetListAgentByCompanyId');
    }
  }

  // M2_v1.F9
  async DeleteAgentAccount(agentId: string) {
    try {
      console.time('DeleteAgentAccount');

      const agent = await this.accountRepo.findOne({
        where: { id: agentId.toString(), role: 'AGENT' },
      });
      if (!agent) {
        throw new NotFoundException('Không tìm thấy dữ liệu đại lý');
      }

      await this.accountRepo.delete({ id: agentId.toString() });

      return {
        success: true,
        message: 'Xoá đại lý thành công',
        statusCode: HttpStatus.OK,
        result: null,
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      console.error(error);
      throw new InternalServerErrorException('Xoá đại lý thất bại');
    } finally {
      console.timeEnd('DeleteAgentAccount');
    }
  }
}
