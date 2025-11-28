export class DTO_RP_Company {
    id: string;
    status: boolean;
    company_name: string;
    company_short_name: string;
    tax_code: string;
    business_license_number: string;
    email: string;
    phone: string;
    legal_representative: string;
    head_office_address?: string;
    company_code: string;
    url_logo?: string;
    bank_name?: string;
    bank_account_number?: string;
    bank_account_name?: string;
    created_at: Date;   
    updated_at: Date;
}