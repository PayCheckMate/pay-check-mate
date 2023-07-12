import {SalaryInformationType} from "../Pages/Employee/Components/ReviewInformation";

export interface EmployeeType {
    id: number;
    employee_id: string;
    department_id: number;
    designation_id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    address: string;
    joining_date: string;
    regine_date: string;
    status: EmployeeStatus;
    created_on: string;
    updated_at: string;
    salaryInformation?: SalaryInformationType;
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
