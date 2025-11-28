import { Injectable } from "@nestjs/common";
import { CompanyRepository } from "./company.repository";
import { InjectRepository } from "@nestjs/typeorm";
import { CompanyOrmEntity } from "../entities/CompanyOrmEntity";
import { Repository } from "typeorm";
import { DTO_RQ_Company } from "../dtos/request/company.dto";

@Injectable()
export class TypeORMCompanyRepository extends CompanyRepository {
    constructor(
        @InjectRepository(CompanyOrmEntity)
        private readonly repo: Repository<CompanyOrmEntity>,
    ) {
        super();
    }

    // ----- COMMON CHECKS -----

    async existsByCompanyId(id: string): Promise<boolean> {
        return this.repo.exist({ where: { id } });
    }

    async existsByCompanyCode(code: string): Promise<boolean> {
        return this.repo.exist({ where: { company_code: code } });
    }

    async existsByTaxCode(code: string): Promise<boolean> {
        return this.repo.exist({ where: { tax_code: code } });
    }

    async existsByEmail(email: string): Promise<boolean> {
        return this.repo.exist({ where: { email } });
    }


    // ----- FIND FULL ENTITY -----

    async findById(id: string): Promise<CompanyOrmEntity | null> {
        return this.repo.findOne({ where: { id } });
    }

    async findByCompanyCode(code: string): Promise<CompanyOrmEntity | null> {
        return this.repo.findOne({ where: { company_code: code } });
    }

    async findByEmail(email: string): Promise<CompanyOrmEntity | null> {
        return this.repo.findOne({ where: { email } });
    }

    async findByTaxCode(tax_code: string): Promise<CompanyOrmEntity | null> {
        return this.repo.findOne({ where: { tax_code } });
    }


    // ----- LITE CHECKER (for duplicate check only) -----

    async findByCompanyCodeLite(code: string): Promise<{ id: string } | null> {
        return this.repo.findOne({
            where: { company_code: code },
            select: { id: true }
        });
    }


    // ----- CREATE -----

    async create(data: Partial<CompanyOrmEntity>): Promise<CompanyOrmEntity> {
        const entity = this.repo.create({
            ...data,
            created_at: new Date(),
            updated_at: new Date(),
        });

        return await this.repo.save(entity);
    }


    // ----- UPDATE -----

    async update(id: string, data: Partial<CompanyOrmEntity>): Promise<CompanyOrmEntity> {
        await this.repo.update(id, {
            ...data,
            updated_at: new Date(),
        });

        return this.findById(id); // return full updated entity
    }


    // ----- DELETE -----

    async delete(id: string): Promise<void> {
        await this.repo.delete(id);
    }


    // ----- LIST -----

    async findAll(): Promise<CompanyOrmEntity[]> {
        return this.repo.find();
    }
}
