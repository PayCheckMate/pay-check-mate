/**
 * 'department_id'         => '%d',
 *         'designation_id'        => '%d',
 *         'employee_first_name'   => '%s',
 *         'employee_middle_name'  => '%s',
 *         'employee_last_name'    => '%s',
 *         'employee_email'        => '%s',
 *         'employee_phone'        => '%s',
 *         'employee_address'      => '%s',
 *         'employee_joining_date' => '%s',
 *         'employee_regine_date'  => '%s',
 *         'status'                => '%d',
 *         'created_on'            => '%s',
 *         'updated_at'            => '%s',
 */
export interface EmployeeType {
    id: number;
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