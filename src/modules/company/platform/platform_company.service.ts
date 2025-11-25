import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from 'src/entities/company.entity';
import { Repository } from 'typeorm';
import { DTO_RP_Company, DTO_RQ_Company } from './platform_company.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class PLATFORMCompanyService {
  constructor(
    @InjectRepository(Company)
    private readonly repo: Repository<Company>,
  ) {}

  async CreateCompany(data: DTO_RQ_Company) {
    try {
      const existed = await this.repo.findOne({
        where: { company_code: data.company_code },
      });

      if (existed) {
        throw new ConflictException('Mã công ty đã tồn tại');
      }

      const company = this.repo.create({
        ...data,
        status: data.status ?? true,
      });

      const saved = await this.repo.save(company);

      const response = plainToInstance(DTO_RP_Company, saved, {
        excludeExtraneousValues: true, // chỉ lấy field có @Expose()
      });

      return {
        success: true,
        statusCode: HttpStatus.CREATED,
        message: 'Success',
        data: response,
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Lỗi khi tạo công ty');
    }
  }
}
