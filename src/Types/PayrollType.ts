export interface PayrollType {
    id: number;
    department_id: number;
    designation_id: number;
    payroll_date: string;
    remarks: string;
    status: number;
    created_employee_id: number;
    approved_employee_id: number;
    created_on: string;
    updated_at: string;
}

export enum PayrollStatus {
    NotApproved = 0,
    Approved = 1,
    Rejected = 2
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
