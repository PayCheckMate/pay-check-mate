export interface SalaryHeadType {
    id: number;
    head_name: string;
    head_type: HeadType;
    head_amount: number;
    is_percentage: number;
    is_taxable: number;
    priority: number;
    status: SalaryHeadStatus;
    created_on: string;
    updated_at: string;
}

export enum HeadType {
    Earning = 1,
    Deduction = 2
}

export enum SalaryHeadStatus {
    Active = 1,
    Inactive = 0
}

export interface SelectBoxType {
    id: HeadType,
    name: string
}