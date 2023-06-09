export interface EmployeeType {
    id: number;
    employee_id: string;
    department_id: number;
    designation_id: number;
    employee_first_name: string;
    employee_middle_name: string;
    employee_last_name: string;
    employee_email: string;
    employee_phone: string;
    employee_address: string;
    employee_joining_date: string;
    employee_regine_date: string;
    status: EmployeeStatus;
    created_on: string;
    updated_at: string;
}

export enum EmployeeStatus {
    Active = 1,
    Inactive = 0
}

export interface EmployeeResponseType {
    data: EmployeeType[];
}