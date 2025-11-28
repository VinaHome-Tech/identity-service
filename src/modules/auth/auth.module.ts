import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import configuration from 'src/config/configuration';
import { AcceptApp } from 'src/entities/accept_app.entity';
import { Account } from 'src/entities/account.entity';
import { BMSAuthController } from './bms/bms_auth.controller';
import { BMSAuthService } from './bms/bms_auth.service';
import { RefreshToken } from 'src/entities/refresh_token.entity';
import { CompanyOrmEntity } from '../company/entities/CompanyOrmEntity';
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    TypeOrmModule.forFeature([Account, AcceptApp, CompanyOrmEntity, RefreshToken]),
    JwtModule.register({
      global: true,
      secret: configuration().jwt.secret,
      signOptions: { expiresIn: Number(configuration().jwt.expiresIn) },
    }),
  ],
  controllers: [BMSAuthController],
  providers: [BMSAuthService],
  exports: [],
})
export class AuthModule {}
