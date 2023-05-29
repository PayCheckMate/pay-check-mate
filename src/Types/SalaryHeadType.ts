export interface SalaryHeadType {
    id: number;
    head_name: string;
    head_type: HeadType;
    status: SalaryHeadStatus;
    created_on: string;
    updated_at: string;
}

export enum HeadType {
    Earnings = 1,
    Deduction = 2
}

export enum SalaryHeadStatus {
    Active = 1,
    Inactive = 0
}