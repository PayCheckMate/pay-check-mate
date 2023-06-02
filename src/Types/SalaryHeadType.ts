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
    Deduction = 2,
    NonTaxable = 3
}

export enum SalaryHeadStatus {
    Active = 1,
    Inactive = 0
}

export interface SelectBoxType {
    id: HeadType,
    name: string
}

export interface SalaryHeadTypeForPayroll {
    id: number;
    head_name: string;
    head_type: HeadType;
    priority: number;
}
export interface SalaryHeadsResponseType {
    earnings: SalaryHeadTypeForPayroll[];
    deductions: SalaryHeadTypeForPayroll[];
    nonTaxable: SalaryHeadTypeForPayroll[];
}

// Employee Salary Response Type
export interface Allowance {
    [id: number]: number;
}

export interface Deductions {
    [id: number]: number;
}

export interface NonTaxableAllowance {
    [id: number]: number;
}

export interface EmployeeSalary {
    id: number;
    employeeName: string;
    designation: string;
    department: string;
    basic: number;
    allowance: Allowance;
    totalAllowance: number;
    deductions: Deductions;
    totalDeductions: number;
    netPayable: number;
    nonTaxableAllowance: NonTaxableAllowance;
    totalPayable: number;
}
