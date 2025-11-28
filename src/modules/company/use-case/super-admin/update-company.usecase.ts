import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { CompanyRepository } from "../../repositories/company.repository";
import { DTO_RQ_Company } from "../../dtos/request/company.dto";
import { CompanyMapper } from "../../mappers/company.mapper";

@Injectable()
export class UpdateCompanyUseCase {
    constructor(
        private readonly repo: CompanyRepository,
    ) {}

    async execute(id: string, data: DTO_RQ_Company) {

        // =====================================================
        // 1. Check tồn tại
        // =====================================================
        const exists = await this.repo.existsByCompanyId(id);
        if (!exists) {
            throw new NotFoundException("Công ty không tồn tại.");
        }

        // =====================================================
        // 2. Lấy entity hiện tại (để merge dữ liệu)
        // =====================================================
        const current = await this.repo.findById(id);
        if (!current) {
            throw new NotFoundException("Công ty không tồn tại.");
        }

        // =====================================================
        // 3. Chuẩn hóa dữ liệu mới
        // =====================================================
        const company_code = data.company_code.toLowerCase().trim();
        const tax_code = data.tax_code.trim();
        const email = data.email.toLowerCase().trim();

        // =====================================================
        // 4. Check duplicate company_code (trừ chính nó)
        // =====================================================
        const companyCodeExists = await this.repo.findByCompanyCode(company_code);
        if (companyCodeExists && companyCodeExists.id !== id) {
            throw new ConflictException("Mã công ty đã tồn tại.");
        }

        // =====================================================
        // 5. Check duplicate tax_code
        // =====================================================
        const taxExists = await this.repo.findByTaxCode(tax_code);
        if (taxExists && taxExists.id !== id) {
            throw new ConflictException("Mã số thuế đã tồn tại.");
        }

        // =====================================================
        // 6. Check duplicate email
        // =====================================================
        const emailExists = await this.repo.findByEmail(email);
        if (emailExists && emailExists.id !== id) {
            throw new ConflictException("Email công ty đã tồn tại.");
        }

        // =====================================================
        // 7. Merge dữ liệu cũ + dữ liệu mới
        // =====================================================
        const updatedEntity = {
            ...current,   // giữ lại mọi field cũ
            ...data,      // override bằng field mới gửi lên
            company_code, // dùng giá trị đã normalize
            tax_code,
            email,
            updated_at: new Date(),
        };

        // =====================================================
        // 8. Update vào DB
        // =====================================================
        const updated = await this.repo.update(id, updatedEntity);

        // =====================================================
        // 9. Trả về response dùng mapper
        // =====================================================
        return CompanyMapper.toResponse(updated);
    }
}