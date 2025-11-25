import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { DTO_RP_AdminAccount, DTO_RQ_AdminAccount } from './sp_account.dto';
import { Account } from 'src/entities/account.entity';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AcceptApp } from 'src/entities/accept_app.entity';
import * as argon2 from 'argon2';
import { Company } from 'src/entities/company.entity';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class SPAccountService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepo: Repository<Account>,
    @InjectRepository(AcceptApp)
    private readonly acceptAppRepo: Repository<AcceptApp>,
    @InjectRepository(Company)
    private readonly companyRepo: Repository<Company>,
    private readonly dataSource: DataSource,
  ) {}

  // M2_v1.F1
  async CreateAdminAccount(data: DTO_RQ_AdminAccount) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const company = await queryRunner.manager.findOne(Company, {
        where: { id: data.company_id },
        select: { id: true, company_code: true },
      });
      if (!company) throw new NotFoundException('Không tìm thấy công ty');

      const newUsername = data.username + '.' + company.company_code;
      const existing = await queryRunner.manager.findOne(Account, {
        where: { username: newUsername },
      });
      if (existing) throw new ConflictException('Tài khoản đã tồn tại');

      const hashedPassword = await argon2.hash(data.password);

      const newAccount = queryRunner.manager.create(Account, {
        username: newUsername,
        password: hashedPassword,
        email: data.email,
        phone: data.phone,
        role: data.role,
        address: data.address,
        date_of_birth: data.date_of_birth,
        status: data.status,
        gender: data.gender,
        name: data.name,
        company: company,
      });

      const savedAccount = await queryRunner.manager.save(newAccount);

      const acceptApp = queryRunner.manager.create(AcceptApp, {
        bms: data.acceptApp?.bms || false,
        cms: data.acceptApp?.cms || false,
        ams: data.acceptApp?.ams || false,
        driver: data.acceptApp?.driver || false,
        account_id: savedAccount.id,
      });
      const savedAcceptApp = await queryRunner.manager.save(acceptApp);
      savedAccount.accept_app = savedAcceptApp;
      await queryRunner.manager.save(savedAccount);
      await queryRunner.commitTransaction();
      const response = plainToInstance(DTO_RP_AdminAccount, savedAccount, {
        excludeExtraneousValues: true,
      });

      return {
        success: true,
        message: 'Success',
        statusCode: HttpStatus.CREATED,
        result: response,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (error instanceof HttpException) throw error;
      console.error(error);
      throw new InternalServerErrorException('Lỗi khi tạo tài khoản admin');
    } finally {
      await queryRunner.release();
    }
  }
}
