import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
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
import { Request } from 'express';
@Injectable()
export class BMSAuthService {
  private readonly logger = new Logger(BMSAuthService.name);
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
    private jwtService: JwtService,
  ) { }
  // M3_v1.F1
  async LoginBms(data: DTO_RQ_LoginBMS, req: Request) {
    try {
      // ===== 1. Tìm tài khoản =====
      const account = await this.accountRepository.findOne({
        where: { username: data.username },
        relations: ['accept_app', 'company'],
      });

      if (!account) {
        throw new NotFoundException('Tài khoản không tồn tại');
      }

      // ===== 2. Kiểm tra trạng thái =====
      if (!account.status) {
        throw new ForbiddenException('Tài khoản đã bị khóa');
      }

      if (!account.accept_app?.bms) {
        throw new ForbiddenException('Tài khoản không có quyền truy cập BMS');
      }

      // ===== 3. Kiểm tra mật khẩu =====
      const isPasswordValid = await argon2.verify(account.password, data.password);
      if (!isPasswordValid) {
        throw new ForbiddenException('Mật khẩu không chính xác');
      }

      // ===== 4. Tạo Access Token =====
      const payload = {
        sub: account.id,
        username: account.username,
        role: account.role,
        company_id: account.company?.id,
      };

      const access_token = await this.jwtService.signAsync(payload);

      // ===== 5. Thu hồi refresh token cũ theo device =====
      const userAgent = req.headers['user-agent'] || 'unknown';
      const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim()
        || req.socket.remoteAddress
        || 'unknown';


      await this.refreshTokenRepository.update(
        { account_id: account.id, user_agent: userAgent },
        { is_revoked: true },
      );

      // ===== 6. Tạo refresh token mới =====
      const rawRefreshToken = uuidv4();
      const hashedRefreshToken = await argon2.hash(rawRefreshToken);

      const refreshTokenEntity = this.refreshTokenRepository.create({
        account_id: account.id,
        refresh_token: hashedRefreshToken,
        user_agent: userAgent,
        ip_address: ip,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 ngày
      });

      await this.refreshTokenRepository.save(refreshTokenEntity);

      // ===== 7. Chuẩn hóa response =====
      return {
        success: true,
        message: 'Success',
        statusCode: HttpStatus.OK,
        result: {
          id: account.id,
          username: account.username,
          full_name: account.name,
          company_id: account.company?.id,
          company_name: account.company?.company_short_name,
          company_code: account.company?.company_code,
          access_token,
          refresh_token: rawRefreshToken,
          expires_in: Number(configuration().jwt.expiresIn),
          role: account.role,
        },
      };
    } catch (error) {
      this.logger.error('LoginBms error', error.stack);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException(
        'Đã xảy ra lỗi hệ thống. Vui lòng thử lại sau.',
      );
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
