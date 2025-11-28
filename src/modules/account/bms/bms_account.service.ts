import {
  BadRequestException,
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as argon2 from 'argon2';
import { AcceptApp } from 'src/entities/accept_app.entity';
import { Account } from 'src/entities/account.entity';
import { Repository } from 'typeorm';
import { DTO_RQ_Account, DTO_RQ_AccountInfo, DTO_RQ_ChangePassword } from './bms_account.dto';
import { RefreshToken } from 'src/entities/refresh_token.entity';
import { CompanyOrmEntity } from 'src/modules/company/entities/CompanyOrmEntity';
@Injectable()
export class BmsAccountService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepo: Repository<Account>,
    @InjectRepository(AcceptApp)
    private readonly acceptAppRepo: Repository<AcceptApp>,
    @InjectRepository(CompanyOrmEntity)
    private readonly companyRepo: Repository<CompanyOrmEntity>,
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepo: Repository<RefreshToken>,
  ) { }


  async GetHistoryLoginByAccountId(id: string) {
    try {
      // Kiểm tra tài khoản tồn tại
      const account = await this.accountRepo.findOne({ where: { id }, select: { id: true } });
      if (!account) {
        throw new NotFoundException('Tài khoản không tồn tại');
      }
      // Lấy lịch sử đăng nhập
      const history = await this.refreshTokenRepo.find({
        where: { account_id: account.id },
        select: {
          id: true,
          user_agent: true,
          ip_address: true,
          created_at: true,
        },
        order: { created_at: 'DESC' },
      });
      return {
        success: true,
        message: 'Success',
        statusCode: HttpStatus.OK,
        result: history,
        
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      console.error(error);
      throw new InternalServerErrorException('Lỗi hệ thống. Vui lòng thử lại sau.');
    }
  }
  // M2_v1.F10
  async GetInfoAccountById(id: string) {
    try {
      // === 1. Lấy thông tin tài khoản ===
      const account = await this.accountRepo.findOne({
        where: { id },
        select: {
          id: true,
          username: true,
          name: true,
          email: true,
          phone: true,
          address: true,
          date_of_birth: true,
          gender: true,
        },
      });

      // === 2. Kiểm tra tồn tại ===
      if (!account) {
        throw new NotFoundException('Tài khoản không tồn tại');
      }

      // === 3. Chuẩn hóa response ===
      const response = {
        id: account.id,
        username: account.username,
        name: account.name,
        email: account.email,
        phone: account.phone,
        address: account.address,
        date_of_birth: account.date_of_birth,
        gender: account.gender,
      };

      return {
        success: true,
        message: 'Success',
        statusCode: HttpStatus.OK,
        result: response,
      };

    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Lỗi hệ thống. Vui lòng thử lại sau.');
    }
  }

  // M2_v1.F11
  async UpdateInfoAccountById(id: string, data: DTO_RQ_AccountInfo) {
    try {
      // 1. Kiểm tra tồn tại
      const account = await this.accountRepo.findOne({ where: { id } });

      if (!account) {
        throw new NotFoundException('Tài khoản không tồn tại');
      }

      // Hàm chuẩn hóa dữ liệu FE gửi lên
      const normalize = (value: any) => {
        if (value === '' || value === undefined || value === null) return null;
        return value;
      };

      // 2. Build dữ liệu update
      const updateData: Partial<Account> = {
        name: normalize(data.name),
        phone: normalize(data.phone),
        email: normalize(data.email),
        address: normalize(data.address),
        date_of_birth: normalize(data.date_of_birth),
        gender: normalize(data.gender),
      };

      // Xóa field null nếu bạn không muốn update trường đó
      // (push option nếu cần)
      // Object.keys(updateData).forEach(
      //   (key) => updateData[key] === undefined && delete updateData[key],
      // );

      // 3. Cập nhật
      await this.accountRepo.update(id, updateData);

      // 4. Lấy dữ liệu mới
      const updatedAccount = await this.accountRepo.findOne({
        where: { id },
        select: [
          'id',
          'username',
          'name',
          'email',
          'phone',
          'address',
          'date_of_birth',
          'gender',
        ],
      });


      return {
        success: true,
        message: 'Success',
        statusCode: HttpStatus.OK,
        result: updatedAccount,
      };

    } catch (error) {
      if (error instanceof HttpException) throw error;

      console.error(error);
      throw new InternalServerErrorException('Lỗi hệ thống. Vui lòng thử lại sau.');
    }
  }

  // M2_v1.F12
  async ChangePasswordAccountById(id: string, data: DTO_RQ_ChangePassword) {
    try {
      const { old_password, new_password } = data;

      // 1. Tìm thông tin tài khoản
      const account = await this.accountRepo.findOne({
        where: { id },
        select: ['id', 'password'], // chỉ cần password để kiểm tra
      });

      if (!account) {
        throw new NotFoundException('Tài khoản không tồn tại');
      }

      // 2. Kiểm tra mật khẩu cũ
      const isOldPasswordCorrect = await argon2.verify(account.password, old_password);

      if (!isOldPasswordCorrect) {
        throw new BadRequestException('Mật khẩu cũ không chính xác');
      }

      // 3. Kiểm tra mật khẩu mới khác mật khẩu cũ
      const isSamePassword = await argon2.verify(account.password, new_password);
      if (isSamePassword) {
        throw new BadRequestException('Mật khẩu mới không được trùng với mật khẩu cũ');
      }

      // 4. Hash mật khẩu mới
      const hashedPassword = await argon2.hash(new_password);

      // 5. Cập nhật vào database
      await this.accountRepo.update(id, {
        password: hashedPassword,
      });

      return {
        success: true,
        message: 'Success',
        statusCode: HttpStatus.OK,
      };

    } catch (error) {
      if (error instanceof HttpException) throw error;

      console.error(error);
      throw new InternalServerErrorException('Lỗi hệ thống. Vui lòng thử lại sau.');
    }
  }



  // M2_v1.F2
  async CreateAccout(id: string, data: DTO_RQ_Account) {
    try {
      // 1. kiểm tra công ty tồn tại
      const company = await this.companyRepo.findOne({
        where: { id },
        select: {
          id: true,
          company_code: true,
        },
      });

      if (!company) {
        throw new NotFoundException('Không tìm thấy dữ liệu công ty');
      }

      // 2. Tạo username theo chuẩn
      const newUsername = `${data.username}.${company.company_code}`;

      // 3. Kiểm tra username có tồn tại chưa (tối ưu chỉ lấy id)
      const existing = await this.accountRepo.findOne({
        where: { username: newUsername },
        select: { id: true },
      });

      if (existing) {
        throw new ConflictException('Tài khoản đã tồn tại');
      }

      // 4. Hash mật khẩu
      const hashedPassword = await argon2.hash(data.password);

      // 5. Chuẩn hóa dữ liệu null/empty
      const normalize = (v: any) => (v === '' || v === undefined ? null : v);

      // 6. Tạo entity account và accept_app
      const account = this.accountRepo.create({
        company,
        username: newUsername,
        password: hashedPassword,
        email: normalize(data.email),
        phone: normalize(data.phone),
        role: data.role,
        address: normalize(data.address),
        date_of_birth: normalize(data.date_of_birth),
        status: data.status,
        name: data.name,
        gender: data.gender,
        accept_app: this.acceptAppRepo.create({
          bms: data.accept_app?.bms ?? false,
          cms: data.accept_app?.cms ?? false,
          ams: data.accept_app?.ams ?? false,
          driver: data.accept_app?.driver ?? false,
        }),
      });

      // 7. Save
      const saved = await this.accountRepo.save(account);

      // 8. Lấy dữ liệu trả về tối ưu
      const result = await this.accountRepo.findOne({
        where: { id: saved.id },
        relations: { accept_app: true },
        select: {
          id: true,
          username: true,
          email: true,
          phone: true,
          role: true,
          address: true,
          date_of_birth: true,
          status: true,
          name: true,
          gender: true,
          accept_app: {
            bms: true,
            cms: true,
            ams: true,
            driver: true,
          },
        },
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


  // M2_v1.F3
  async GetListAccountByCompanyId(id: string) {
    try {
      // 1. kiểm tra công ty có tồn tại
      const company = await this.companyRepo.findOne({
        where: { id },
        select: { id: true },
      });

      if (!company) {
        throw new NotFoundException('Không tìm thấy dữ liệu công ty');
      }

      // 2. QueryBuilder: select tối ưu
      const accounts = await this.accountRepo
        .createQueryBuilder('acc')
        .leftJoinAndSelect('acc.accept_app', 'accept_app')
        .where('acc.company_id = :companyId', { companyId: company.id })
        .orderBy('acc.created_at', 'ASC')
        .select([
          // Account fields
          'acc.id',
          'acc.username',
          'acc.email',
          'acc.phone',
          'acc.role',
          'acc.address',
          'acc.date_of_birth',
          'acc.status',
          'acc.name',
          'acc.gender',

          // Accept_app fields
          'accept_app.bms',
          'accept_app.cms',
          'accept_app.ams',
          'accept_app.driver',
        ])
        .getMany();

      return {
        success: true,
        message: 'Success',
        statusCode: HttpStatus.OK,
        result: accounts,
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;

      console.error(error);
      throw new InternalServerErrorException(
        'Lỗi hệ thống. Vui lòng thử lại sau.',
      );
    }
  }



  // M2_v1.F4
  async UpdateAccount(id: string, data: DTO_RQ_Account) {
    try {
      // 1. Kiểm tra tài khoản có tồn tại không (chỉ select id)
      const account = await this.accountRepo.findOne({
        where: { id },
        select: { id: true },
      });

      if (!account) {
        throw new NotFoundException('Không tìm thấy tài khoản');
      }

      // 2. Chuẩn hóa dữ liệu
      const normalize = (v: any) =>
        v === '' || v === undefined || v === null ? null : v;

      // 3. Update bảng account (NHANH vì không load entity)
      await this.accountRepo.update(id, {
        email: normalize(data.email),
        phone: normalize(data.phone),
        role: data.role,
        address: normalize(data.address),
        date_of_birth: normalize(data.date_of_birth),
        status: data.status,
        name: data.name,
        gender: data.gender,
      });

      // 4. Update bảng AcceptApp
      await this.acceptAppRepo.update(
        { account: { id } }, // where
        {
          bms: data.accept_app.bms,
          cms: data.accept_app.cms,
          ams: data.accept_app.ams,
          driver: data.accept_app.driver,
        },
      );

      // 5. Lấy lại dữ liệu tối ưu (chỉ field FE cần)
      const result = await this.accountRepo.findOne({
        where: { id },
        relations: { accept_app: true },
        select: {
          id: true,
          username: true,
          email: true,
          phone: true,
          role: true,
          address: true,
          date_of_birth: true,
          status: true,
          name: true,
          gender: true,
          accept_app: {
            bms: true,
            cms: true,
            ams: true,
            driver: true,
          },
        },
      });

      return {
        success: true,
        message: 'Success',
        statusCode: HttpStatus.OK,
        result,
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;

      console.error(error);
      throw new InternalServerErrorException(
        'Lỗi hệ thống. Vui lòng thử lại sau.',
      );
    }
  }


  // M2_v1.F5
  async DeleteAccount(id: string) {
    try {
      const account = await this.accountRepo.findOne({
        where: { id },
        select: { id: true },
      });
      if (!account) {
        throw new NotFoundException('Không tìm thấy tài khoản');
      }
      await this.accountRepo.delete({ id: id });
      return {
        success: true,
        message: 'Success',
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      console.error(error);
      throw new InternalServerErrorException('Lỗi hệ thống. Vui lòng thử lại sau.');
    }
  }

  async GetListDriverByCompanyId(id: string) {
    try {
      console.time('GetListDriverByCompanyId');
      const company = await this.companyRepo.findOne({
        where: { id: id },
        select: { id: true },
      });
      if (!company) {
        throw new NotFoundException('Không tìm thấy dữ liệu công ty');
      }
      const drivers = await this.accountRepo.find({
        where: { company: { id: company.id }, role: 'DRIVER', status: true },
        order: { created_at: 'ASC' },
      });
      const response = drivers.map((acc) => ({
        id: acc.id,
        name: acc.name,
        phone: acc.phone,
      }));
      return {
        success: true,
        message: 'Success',
        statusCode: HttpStatus.OK,
        result: response,
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      console.error(error);
      throw new InternalServerErrorException('Lấy danh sách tài xế thất bại');
    } finally {
      console.timeEnd('GetListDriverByCompanyId');
    }
  }

  async GetListAssistantByCompanyId(id: string) {
    try {
      console.time('GetListAssistantByCompanyId');
      const company = await this.companyRepo.findOne({
        where: { id: id },
        select: { id: true },
      });
      if (!company) {
        throw new NotFoundException('Không tìm thấy dữ liệu công ty');
      }
      const assistants = await this.accountRepo.find({
        where: { company: { id: company.id }, role: 'ASSISTANT', status: true },
        order: { created_at: 'ASC' },
      });
      const response = assistants.map((acc) => ({
        id: acc.id,
        name: acc.name,
        phone: acc.phone,
      }));
      return {
        success: true,
        message: 'Success',
        statusCode: HttpStatus.OK,
        result: response,
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      console.error(error);
      throw new InternalServerErrorException('Lấy danh sách phụ xe thất bại');
    } finally {
      console.timeEnd('GetListAssistantByCompanyId');
    }
  }
}
