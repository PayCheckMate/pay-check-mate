export interface SalaryHeadType {
    id: number;
    head_name: string;
    head_type: HeadType;
    head_type_text?: string;
    head_amount: number;
    is_percentage: number;
    is_variable: number;
    is_taxable: number;
    is_personal_savings: number;
    should_affect_basic_salary: number;
    priority: number;
    status: SalaryHeadStatus;
    created_on: string;
    updated_at: string;
}

export enum HeadType {
    Earning    = 1,
    Deduction  = 2,
    NonTaxable = 3
}

export enum SalaryHeadStatus {
    Active   = 1,
    Inactive = 0
}

export interface SelectBoxType {
    id: number|null,
    name: string
}

export interface SalaryHeadTypeForPayroll {
    id: number;
    head_name: string;
    head_type: HeadType;
    priority: number;
}

export interface SalaryResponseType {
    salary_head_types: SalaryHeadsResponseType
    employee_salary_history: EmployeeSalary[];
}

export interface SalaryHeadsResponseType {
    earnings: SalaryHeadTypeForPayroll[];
    deductions: SalaryHeadTypeForPayroll[];
    non_taxable: SalaryHeadTypeForPayroll[];
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
    employee_id: string | number;
    full_name: string;
    designation_name: string;
    department_name: string;
    basic_salary: number;
    salary_head_details: {
        earnings: {
            [id: number]: number;
        }
        deductions: {
            [id: number]: number;
        }
        non_taxable: {
            [id: number]: number;
        }
    }
}
