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

    // Employee capabilities.
    pay_check_mate_view_employee_list = "pay_check_mate_view_employee_list",
    pay_check_mate_add_employee = "pay_check_mate_add_employee",
    pay_check_mate_edit_employee = "pay_check_mate_edit_employee",
    pay_check_mate_view_employee_details = "pay_check_mate_view_employee_details",
    pay_check_mate_salary_increment = "pay_check_mate_salary_increment",

    // PaySlip capabilities.
    pay_check_mate_view_payslip_list = "pay_check_mate_view_payslip_list",
    pay_check_mate_view_other_payslip_list = "pay_check_mate_view_other_payslip_list",

    // Payroll capabilities.
    pay_check_mate_add_payroll = "pay_check_mate_add_payroll",
    pay_check_mate_edit_payroll = "pay_check_mate_edit_payroll",
    pay_check_mate_approve_payroll = "pay_check_mate_approve_payroll",
    pay_check_mate_reject_payroll = "pay_check_mate_reject_payroll",
    pay_check_mate_cancel_payroll = "pay_check_mate_cancel_payroll",
    pay_check_mate_view_payroll_list = "pay_check_mate_view_payroll_list",
    pay_check_mate_view_payroll_details = "pay_check_mate_view_payroll_details",

    // Department capabilities.
    pay_check_mate_view_department_list = "pay_check_mate_view_department_list",
    pay_check_mate_add_department = "pay_check_mate_add_department",
    pay_check_mate_edit_department = "pay_check_mate_edit_department",
    pay_check_mate_change_department_status = "pay_check_mate_change_department_status",

    // Designation capabilities.
    pay_check_mate_view_designation_list = "pay_check_mate_view_designation_list",
    pay_check_mate_add_designation = "pay_check_mate_add_designation",
    pay_check_mate_edit_designation = "pay_check_mate_edit_designation",
    pay_check_mate_change_designation_status = "pay_check_mate_change_designation_status",

    // Salary Head capabilities.
    pay_check_mate_view_salary_head_list = "pay_check_mate_view_salary_head_list",
    pay_check_mate_add_salary_head = "pay_check_mate_add_salary_head",
    pay_check_mate_edit_salary_head = "pay_check_mate_edit_salary_head",
    pay_check_mate_change_salary_head_status = "pay_check_mate_change_salary_head_status",
}
