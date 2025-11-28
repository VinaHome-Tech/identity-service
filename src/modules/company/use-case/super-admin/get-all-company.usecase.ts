import { Injectable } from "@nestjs/common";
import { CompanyRepository } from "../../repositories/company.repository";
import { CompanyMapper } from "../../mappers/company.mapper";

@Injectable()
export class GetAllCompanyUseCase {
    constructor(
        private readonly repo: CompanyRepository,
    ) { }
    async execute() {
        const companies = await this.repo.findAll();
        return CompanyMapper.toResponseList(companies);
    }
}