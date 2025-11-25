import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { DTO_RQ_LoginBMS } from './bms_auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from 'src/entities/account.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import configuration from 'src/config/configuration';
import { RefreshToken } from 'src/entities/refresh_token.entity';
import { v4 as uuidv4 } from 'uuid';
@Injectable()
export class BMSAuthService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
    private jwtService: JwtService,
  ) {}
  // M3_v1.F1
  async LoginBms(data: DTO_RQ_LoginBMS) {
    try {
      const account = await this.accountRepository.findOne({
        where: { username: data.username },
        relations: ['accept_app', 'company'],
      });

      if (!account) {
        throw new NotFoundException('Tài khoản không tồn tại');
      }
      if (!account.status) {
        throw new ForbiddenException('Tài khoản đã bị khóa');
      }
      if (!account.accept_app?.bms) {
        throw new ForbiddenException('Tài khoản không có quyền truy cập');
      }
      const isPasswordValid = await argon2.verify(
        account.password,
        data.password,
      );
      if (!isPasswordValid) {
        throw new ForbiddenException('Mật khẩu không chính xác');
      }
      const payload = {
        sub: account.id,
        username: account.username,
        role: account.role,
        company_id: account.company?.id,
      };
      const access_token = this.jwtService.sign(payload);
      const refresh_token = uuidv4();
      const refreshTokenEntity = this.refreshTokenRepository.create({
        account_id: account.id,
        refresh_token: await argon2.hash(refresh_token), // Hash UUID trước khi lưu
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 ngày
      });
      await this.refreshTokenRepository.save(refreshTokenEntity);
      const response = {
        id: account.id,
        username: account.username,
        full_name: account.name,
        company_id: account.company?.id,
        company_name: account.company?.company_short_name,
        company_code: account.company?.company_code,
        access_token: access_token,
        refresh_token: refresh_token,
        expires_in: Number(configuration().jwt.expiresIn),
        role: account.role,
      };
      return {
        success: true,
        message: 'Success',
        statusCode: HttpStatus.OK,
        result: response,
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      console.error(error);
      throw new InternalServerErrorException('Lỗi hệ thống. Vui lòng thử lại sau');
    }
  }

  // M3_v1.F2
  async LogoutBms(account_id: string) {
    try {
      await this.refreshTokenRepository.delete({
        account_id: account_id,
      });

      return {
        success: true,
        message: 'Success',
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      console.error(error);
      throw new InternalServerErrorException('Đăng xuất không thành công');
    }
  }
}
