import { DTO_RQ_Company } from "../dtos/request/company.dto";
import { CompanyOrmEntity } from "../entities/CompanyOrmEntity";

export abstract class CompanyRepository {
  
  // ----- EXISTS CHECK -----
  abstract existsByCompanyId(id: string): Promise<boolean>;
  abstract existsByCompanyCode(code: string): Promise<boolean>;
  abstract existsByTaxCode(code: string): Promise<boolean>;
  abstract existsByEmail(email: string): Promise<boolean>;

  // ----- FIND FULL ENTITY -----
  abstract findById(id: string): Promise<CompanyOrmEntity | null>;
  abstract findByCompanyCode(code: string): Promise<CompanyOrmEntity | null>;
  abstract findByEmail(email: string): Promise<CompanyOrmEntity | null>;
  abstract findByTaxCode(code: string): Promise<CompanyOrmEntity | null>;

  // ----- LITE VERSION (for duplicate check only) -----
  abstract findByCompanyCodeLite(code: string): Promise<{ id: string } | null>;

  // ----- CRUD -----
  abstract create(data: Partial<CompanyOrmEntity>): Promise<CompanyOrmEntity>;
  abstract update(id: string, data: Partial<CompanyOrmEntity>): Promise<CompanyOrmEntity>;
  abstract delete(id: string): Promise<void>;

  // ----- LIST -----
  abstract findAll(): Promise<CompanyOrmEntity[]>;
}
