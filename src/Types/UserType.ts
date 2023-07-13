export interface UserType {
    ID: number;
    allcaps: {
        [key: string]: boolean;
    };
    cap_key: string;
    caps: {
        [key: string]: boolean;
    }
    data: any;
    filter: any;
    roles: string[];
}

export interface UserCaps {
    [key: string]: boolean;
}

export enum UserCapNames {
    pay_check_mate_manage_menu = "pay_check_mate_manage_menu",
    pay_check_mate_view_employee_list = "pay_check_mate_view_employee_list",
    pay_check_mate_add_employee = "pay_check_mate_add_employee",
    pay_check_mate_edit_employee = "pay_check_mate_edit_employee",
    pay_check_mate_view_employee_details = "pay_check_mate_view_employee_details",
    pay_check_mate_salary_increment = "pay_check_mate_salary_increment",
    pay_check_mate_payroll_list = "pay_check_mate_payroll_list",
    pay_check_mate_add_payroll = "pay_check_mate_add_payroll",
    pay_check_mate_edit_payroll = "pay_check_mate_edit_payroll",
    pay_check_mate_approve_payroll = "pay_check_mate_approve_payroll",
    pay_check_mate_reject_payroll = "pay_check_mate_reject_payroll",
    pay_check_mate_cancel_payroll = "pay_check_mate_cancel_payroll",
    pay_check_mate_view_payroll = "pay_check_mate_view_payroll",
    pay_check_mate_view_department = "pay_check_mate_view_department",
    pay_check_mate_add_department = "pay_check_mate_add_department",
    pay_check_mate_edit_department = "pay_check_mate_edit_department",
    pay_check_mate_change_department_status = "pay_check_mate_change_department_status",
    pay_check_mate_view_designation = "pay_check_mate_view_designation",
    pay_check_mate_add_designation = "pay_check_mate_add_designation",
    pay_check_mate_edit_designation = "pay_check_mate_edit_designation",
    pay_check_mate_change_designation_status = "pay_check_mate_change_designation_status",
}
