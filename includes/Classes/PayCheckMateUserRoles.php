<?php

namespace PayCheckMate\Classes;

class PayCheckMateUserRoles {

    /**
     * Constructor, Here we're adding AccountantRole with required capabilities.
     */
    public function __construct() {
        // Add an employee role if it doesn't exist.
        if ( ! get_role( 'pay_check_mate_employee' ) ) {
            add_role( self::get_pay_check_mate_employee_role_name(), __( 'PayCheckMate Employee', 'pay-check-mate' ), $this->get_employee_capabilities() );
        }

        // Add an accountant role if it doesn't exist.
        if ( ! get_role( 'pay_check_mate_accountant' ) ) {
            add_role( self::get_pay_check_mate_accountant_role_name(), __( 'PayCheckMate Accountant', 'pay-check-mate' ), $this->get_all_capabilities() );
        }

        // Add an admin role if it doesn't exist.
        if ( ! get_role( 'pay_check_mate_admin' ) ) {
            add_role( self::get_pay_check_mate_admin_role_name(), __( 'PayCheckMate Admin', 'pay-check-mate' ), $this->get_all_capabilities() );
        }

        // Add capabilities to all admin users.
        $admins = get_users( [ 'role' => 'administrator' ] );
        if ( $admins ) {
            foreach ( $admins as $admin ) {
                $admin->add_role( 'pay_check_mate_admin' );
                $admin->add_role( 'pay_check_mate_accountant' );
                $admin->add_role( 'pay_check_mate_employee' );
            }
        }
    }

    /**
     * Get the admin role.
     *
     * @since 1.0.0
     *
     * @return string
     */
    public static function get_pay_check_mate_admin_role_name(): string {
        return 'pay_check_mate_admin';
    }

    /**
     * Get the accountant role.
     *
     * @since 1.0.0
     *
     * @return string
     */
    public static function get_pay_check_mate_accountant_role_name(): string {
        return 'pay_check_mate_accountant';
    }

    /**
     * Get the employee role.
     *
     * @since 1.0.0
     *
     * @return string
     */
    public static function get_pay_check_mate_employee_role_name(): string {
        return 'pay_check_mate_employee';
    }

    /**
     * Get capabilities for the `employee` role.
     *
     * @since  1.0.0
     * @return array<string, bool>
     */
    protected function get_employee_capabilities(): array {
        return [
            'read'                                 => true,
            'pay_check_mate_employee'              => true,
            'pay_check_mate_view_employee_details' => true,
            'pay_check_mate_payroll_ledger'        => true,
            'pay_check_mate_manage_menu'           => true,
            'pay_check_mate_view_payslip_list'     => true,
        ];
    }

    /**
     * Get all capabilities for the plugin.
     *
     * @since 1.0.0
     * @return true[]
     */
    protected function get_all_capabilities(): array {
        return [
            'read'                                     => true,
            'pay_check_mate_accountant'                => true,
            'pay_check_mate_employee'                  => true,
            'pay_check_mate_manage_menu'               => true,

            // Employee capabilities.
            'pay_check_mate_view_employee_list'        => true,
            'pay_check_mate_add_employee'              => true,
            'pay_check_mate_edit_employee'             => true,
            'pay_check_mate_view_employee_details'     => true,
            'pay_check_mate_salary_increment'          => true,

            // Payroll capabilities.
            'pay_check_mate_add_payroll'               => true,
            'pay_check_mate_edit_payroll'              => true,
            'pay_check_mate_approve_payroll'           => true,
            'pay_check_mate_reject_payroll'            => true,
            'pay_check_mate_cancel_payroll'            => true,
            'pay_check_mate_view_payroll_list'         => true,
            'pay_check_mate_view_payroll_details'      => true,

            // PaySlip capabilities.
            'pay_check_mate_view_payslip_list'         => true,
            'pay_check_mate_view_other_payslip_list'   => true,

            // Department capabilities.
            'pay_check_mate_view_department_list'      => true,
            'pay_check_mate_add_department'            => true,
            'pay_check_mate_edit_department'           => true,
            'pay_check_mate_change_department_status'  => true,

            // Designation capabilities.
            'pay_check_mate_view_designation_list'     => true,
            'pay_check_mate_add_designation'           => true,
            'pay_check_mate_edit_designation'          => true,
            'pay_check_mate_change_designation_status' => true,

            // Salary Head capabilities.
            'pay_check_mate_view_salary_head_list'     => true,
            'pay_check_mate_add_salary_head'           => true,
            'pay_check_mate_edit_salary_head'          => true,
            'pay_check_mate_change_salary_head_status' => true,

            // Report capabilities.
            'pay_check_mate_payroll_register'          => true,
            'pay_check_mate_payroll_ledger'            => true,
        ];
    }

    /**
     * Get all the roles for the plugin.
     *
     * @since 1.0.0
     *
     * @param string $role Role name.
     *
     * @return array<string, string>|string
     */
    public static function get_pay_check_mate_roles( string $role = '' ) {
        $roles = [
            'pay_check_mate_employee'   => __( 'PayCheckMate Employee', 'pay-check-mate' ),
            'pay_check_mate_accountant' => __( 'PayCheckMate Accountant', 'pay-check-mate' ),
            'pay_check_mate_admin'      => __( 'PayCheckMate Admin', 'pay-check-mate' ),
        ];
        if ( ! empty( $role ) ) {
            return $roles[ $role ];
        }

        return $roles;
    }
}
