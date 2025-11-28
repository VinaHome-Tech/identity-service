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
import { DataSource, Repository } from 'typeorm';
import * as argon2 from 'argon2';
import { AcceptApp } from 'src/entities/accept_app.entity';
import { CompanyOrmEntity } from '../company/entities/CompanyOrmEntity';
@Injectable()
export class BmsAgentService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepo: Repository<Account>,
    @InjectRepository(CompanyOrmEntity)
    private readonly companyRepo: Repository<CompanyOrmEntity>,
    @InjectRepository(AcceptApp)
    private readonly acceptAppRepo: Repository<AcceptApp>,
    @InjectRepository(CommissionAgent)
    private readonly commissionRepo: Repository<CommissionAgent>,
    private readonly dataSource: DataSource,
  ) { }

  // M2_v1.F6
  async CreateAgentAccount(companyId: string, data: DTO_RQ_Agent) {
    try {
      // 1. check company
      const company = await this.companyRepo.findOne({
        where: { id: companyId },
        select: { id: true, company_code: true },
      });
      if (!company) throw new NotFoundException('Không tìm thấy dữ liệu công ty');

      // 2. build username
      const newUsername = `${data.username}.${company.company_code}`;

      // 3. check duplicate username
      const existing = await this.accountRepo.findOne({
        where: { username: newUsername },
        select: { id: true },
      });
      if (existing) throw new ConflictException('Tài khoản đã tồn tại');

      // 4. hash pw
      const hashedPassword = await argon2.hash(data.password);
      const normalize = (v: any) =>
        v === '' || v === undefined || v === null ? null : v;

      // 5. transaction
      const result = await this.dataSource.transaction(async (manager) => {
        // create account
        const account = manager.create(Account, {
          company,
          username: newUsername,
          password: hashedPassword,
          email: normalize(data.email),
          phone: normalize(data.phone),
          role: 'AGENT',
          address: normalize(data.address),
          status: data.status,
          name: data.name,
        });
        const savedAcc = await manager.save(account);

        // create accept_app
        await manager.save(AcceptApp, {
          bms: false,
          cms: false,
          ams: true,
          driver: false,
          account: savedAcc,
        });

        // create commission
        const savedCommission = await manager.save(CommissionAgent, {
          ticket_type: data.commission.ticket_type,
          ticket_value: data.commission.ticket_value,
          goods_type: data.commission.goods_type,
          goods_value: data.commission.goods_value,
          account: savedAcc,
        });

        // re-fetch commission (clean)
        const cleanCommission = await manager.findOne(CommissionAgent, {
          where: { id: savedCommission.id },
          select: {
            id: true,
            ticket_type: true,
            ticket_value: true,
            goods_type: true,
            goods_value: true,
          },
        });

        return {
          id: savedAcc.id,
          username: savedAcc.username,
          phone: savedAcc.phone,
          email: savedAcc.email,
          name: savedAcc.name,
          address: savedAcc.address,
          status: savedAcc.status,
          commission: cleanCommission,
        };
      });

      return {
        success: true,
        message: 'Success',
        statusCode: HttpStatus.CREATED,
        result,
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;

      console.error(error);
      throw new InternalServerErrorException('Lỗi hệ thống. Vui lòng thử lại sau.');
    }
  }


  // M2_v1.F7
  async GetListAgentByCompanyId(companyId: string) {
    try {
      const agents = await this.accountRepo
        .createQueryBuilder('acc')
        .leftJoin('acc.commission_agent', 'commission')
        .where('acc.company_id = :companyId', { companyId })
        .andWhere('acc.role = :role', { role: 'AGENT' })
        .orderBy('acc.created_at', 'ASC')
        .select([
          // Account fields
          'acc.id',
          'acc.username',
          'acc.email',
          'acc.phone',
          'acc.name',
          'acc.address',
          'acc.status',

          // Commission fields

          'commission.ticket_type',
          'commission.ticket_value',
          'commission.goods_type',
          'commission.goods_value',
        ])
        .getMany();

      if (!agents.length) {
        throw new NotFoundException('Không tìm thấy dữ liệu đại lý');
      }

      return {
        success: true,
        message: 'Success',
        statusCode: HttpStatus.OK,
        result: agents.map((a) => ({
          id: a.id,
          username: a.username,
          phone: a.phone,
          email: a.email,
          name: a.name,
          address: a.address,
          status: a.status,
          commission: a.commission_agent
            ? {
              ticket_type: a.commission_agent.ticket_type,
              ticket_value: a.commission_agent.ticket_value,
              goods_type: a.commission_agent.goods_type,
              goods_value: a.commission_agent.goods_value,
            }
            : null,
        })),
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      console.error(error);
      throw new InternalServerErrorException(
        'Lỗi hệ thống. Vui lòng thử lại sau.'
      );
    }
  }


  // M2_v1.F9
  async DeleteAgentAccount(agentId: string) {
    try {
      // 1. Kiểm tra tồn tại + load ID cho tối ưu
      const agent = await this.accountRepo.findOne({
        where: { id: agentId, role: 'AGENT' },
        select: { id: true },
      });

      if (!agent) {
        throw new NotFoundException('Không tìm thấy dữ liệu đại lý');
      }

      // 2. Transaction để tránh mất đồng bộ dữ liệu
      await this.dataSource.transaction(async (manager) => {
        // Xóa commission agent
        await manager.delete(CommissionAgent, { account: { id: agent.id } });

        // Xóa accept_app (nếu không bật onDelete: 'CASCADE')
        await manager.delete(AcceptApp, { account: { id: agent.id } });

        // Xóa account
        await manager.delete(Account, { id: agent.id });
      });

      return {
        success: true,
        message: 'Success',
        statusCode: HttpStatus.OK,
      };

    } catch (error) {
      if (error instanceof HttpException) throw error;
      console.error(error);
      throw new InternalServerErrorException(
        'Lỗi hệ thống. Vui lòng thử lại sau.',
      );
    }
  }

}
