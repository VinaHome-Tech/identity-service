import { ConflictException, Injectable } from "@nestjs/common";
import { CompanyRepository } from "../../repositories/company.repository";
import { DTO_RQ_Company } from "../../dtos/request/company.dto";
import { CompanyMapper } from "../../mappers/company.mapper";

@Injectable()
export class CreateCompanyUseCase {
  constructor(
    private readonly repo: CompanyRepository,
  ) {}

  async execute(data: DTO_RQ_Company) {
    const company_code = data.company_code.toLowerCase().trim();

    const existCompanyCode = await this.repo.existsByCompanyCode(company_code);
    if (existCompanyCode) {
      throw new ConflictException('Mã công ty đã tồn tại.');
    }
    const entityData = CompanyMapper.toEntity(data);
    const created = await this.repo.create(entityData);

    return CompanyMapper.toResponse(created);
  }
}