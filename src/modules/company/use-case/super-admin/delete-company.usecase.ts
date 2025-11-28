import { Injectable, NotFoundException } from "@nestjs/common";
import { CompanyRepository } from "../../repositories/company.repository";

@Injectable()
export class DeleteCompanyUseCase {
  constructor(
    private readonly repo: CompanyRepository,
  ) {}

  async execute(id: string) {
    // =====================================================
    // 1. Check tồn tại
    // =====================================================
    const exists = await this.repo.existsByCompanyId(id);
    if (!exists) {
      throw new NotFoundException("Công ty không tồn tại.");
    }
    // =====================================================
    // 2. Xoá công ty
    // =====================================================
    await this.repo.delete(id);
    return;
  }
}