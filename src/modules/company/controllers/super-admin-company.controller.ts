import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, UseGuards } from "@nestjs/common";
import { Roles } from "src/decorator/roles.decorator";
import { TokenGuard } from "src/guards/token.guard";
import { DTO_RQ_Company } from "../dtos/request/company.dto";
import { CreateCompanyUseCase } from "../use-case/super-admin/create-company.usecase";
import { ResponseResult } from "src/shared/response/result";
import { GetAllCompanyUseCase } from "../use-case/super-admin/get-all-company.usecase";
import { UUIDParam } from "src/param/UUIDParam";
import { UpdateCompanyUseCase } from "../use-case/super-admin/update-company.usecase";
import { DeleteCompanyUseCase } from "../use-case/super-admin/delete-company.usecase";

@Controller('super-admin-company')
export class SuperAdminCompanyController {
    constructor(
        private readonly createCompanyUseCase: CreateCompanyUseCase,
        private readonly getAllCompanyUseCase: GetAllCompanyUseCase,
        private readonly updateCompanyUseCase: UpdateCompanyUseCase,
        private readonly deleteCompanyUseCase: DeleteCompanyUseCase,
    ) { }

    @Post('companies')
    async createCompany(@Body() body: DTO_RQ_Company) {
        const result = await this.createCompanyUseCase.execute(body);
        return new ResponseResult(true, HttpStatus.CREATED, 'Success', result);
    }

    @Get('companies')
    async getCompanies() {
        const result = await this.getAllCompanyUseCase.execute();
        return new ResponseResult(true, HttpStatus.OK, 'Success', result);
    }

    @Put('companies/:id')
    async updateCompany(@Param() param: UUIDParam, @Body() data: DTO_RQ_Company) {
        const result = await this.updateCompanyUseCase.execute(param.id, data);
        return new ResponseResult(true, HttpStatus.OK, 'Success', result);
    }

    @Delete('companies/:id')
    async deleteCompany(@Param() param: UUIDParam) {
        const result = await this.deleteCompanyUseCase.execute(param.id);
        return new ResponseResult(true, HttpStatus.OK, 'Success', result);
    }
    
}