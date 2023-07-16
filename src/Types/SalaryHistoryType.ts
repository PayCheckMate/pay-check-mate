export interface SalaryHistoryType {
    id: number;
    employee_id: string | number;
    basic_salary: number|string;
    gross_salary: number|string;
    salary_details: {
        [id: number]: number|string;
    }
    status: number;
    active_from: string;
    remarks: string;
    salary_purpose: SalaryPurposeType;
    created_at: string;
    updated_at: string;
}

export enum SalaryPurposeType {
    Initial = 1,
    Increment = 2,
    Promotion = 3,
}
