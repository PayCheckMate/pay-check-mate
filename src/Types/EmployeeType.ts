import {SalaryHistoryType} from "./SalaryHistoryType";
import {UserType} from "./UserType";

export interface EmployeeType {
    id: number;
    employee_id: string;
    user_id: number;
    department_id: number;
    designation_id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    bank_name: string;
    bank_account_number: string;
    tax_number: string;
    address: string;
    joining_date: string;
    resign_date: string;
    status: EmployeeStatus;
    created_on: string;
    updated_at: string;
    salaryInformation?: SalaryHistoryType | SalaryHistoryType[];
    user?: UserType;
}

export enum EmployeeStatus {
    Active = 1,
    Inactive = 0
}

export interface EmployeeResponseType {
    data: EmployeeType[];
    headers: any;
    status: number;
}

export interface SingleEmployeeResponseType {
    data: EmployeeType;
    headers: any;
    status: number;
}
