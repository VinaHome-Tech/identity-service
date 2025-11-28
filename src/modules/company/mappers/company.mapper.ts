import { DTO_RQ_Company } from "../dtos/request/company.dto";
import { CompanyOrmEntity } from "../entities/CompanyOrmEntity";

export class CompanyMapper {
    static toEntity(data: DTO_RQ_Company) {
        return {
            status: data.status,
            company_name: data.company_name.trim(),
            company_short_name: data.company_short_name.trim(),
            tax_code: data.tax_code.trim(),
            business_license_number: data.business_license_number.trim(),
            email: data.email.toLowerCase().trim(),
            phone: data.phone.trim(),
            legal_representative: data.legal_representative.trim(),
            head_office_address: data.head_office_address?.trim() ?? null,
            company_code: data.company_code.toLowerCase().trim(),
            url_logo: data.url_logo ?? null,
            bank_name: data.bank_name ?? null,
            bank_account_number: data.bank_account_number ?? null,
            bank_account_name: data.bank_account_name ?? null,
        }
    }
    static toResponse(entity: CompanyOrmEntity) {
        return {
            id: entity.id,
            company_name: entity.company_name,
            company_short_name: entity.company_short_name,
            tax_code: entity.tax_code,
            email: entity.email,
            phone: entity.phone,
            legal_representative: entity.legal_representative,
            head_office_address: entity.head_office_address,
            business_license_number: entity.business_license_number,
            status: entity.status,
            company_code: entity.company_code,
            url_logo: entity.url_logo,
            bank_name: entity.bank_name,
            bank_account_number: entity.bank_account_number,
            bank_account_name: entity.bank_account_name,
            created_at: entity.created_at,
            updated_at: entity.updated_at,
        };
    }
    static toResponseList(entities: CompanyOrmEntity[]) {
        return entities.map((entity) => this.toResponse(entity));
    }
}