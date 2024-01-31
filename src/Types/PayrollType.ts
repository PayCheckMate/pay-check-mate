export interface PayrollType {
    id: number;
    department_id: number;
    designation_id: number;
    payroll_date: string;
    total_salary: number;
    payroll_date_string: string;
    remarks: string;
    status: number;
    created_user_id: number;
    approved_user_id: number;
    created_on: string;
    updated_at: string;
    created_user: string;
    approved_user: string;
}

export enum PayrollStatus {
    NotApproved = 0,
    Approved = 1,
    Rejected = 2,
    Cancelled = 3,
}

export interface PayrollDetails{
    id: number;
    payroll_id: number;
    employee_id: number;
    basic_salary: number;
    salary_details: string;
    status: number;
    created_on: string;
    updated_at: string;
}
