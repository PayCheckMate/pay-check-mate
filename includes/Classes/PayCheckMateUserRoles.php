<?php

namespace PayCheckMate\Classes;

class PayCheckMateUserRoles {

    /**
     * Constructor, Here we're adding AccountantRole with required capabilities.
     */
    public function __construct() {
        // Add an accountant role if it doesn't exist.
        if ( ! get_role( 'pay_check_mate_accountant' ) ) {
            add_role( 'pay_check_mate_accountant', __( 'PayCheckMate Accountant', 'pcm' ), $this->get_accountant_capabilities() );
        }

        // Add an employee role if it doesn't exist.
        if ( ! get_role( 'pay_check_mate_employee' ) ) {
            add_role( 'pay_check_mate_employee', __( 'PayCheckMate Employee', 'pcm' ), $this->get_employee_capabilities() );
        }

        // Add an admin role if it doesn't exist.
        if ( ! get_role( 'pay_check_mate_admin' ) ) {
            add_role( 'pay_check_mate_admin', __( 'PayCheckMate Admin', 'pcm' ), $this->get_all_capabilities() );
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
     * Get capabilities for the `accountant` role.
     *
     * @since  PAY_CHECK_MATE_SINCE
     * @return array<string, bool>
     */
    protected function get_accountant_capabilities(): array {
        return [
            'read'                       => true,
            'pay_check_mate_accountant'  => true,
            'pay_check_mate_manage_menu' => true,
        ];
    }

    /**
     * Get capabilities for the `employee` role.
     *
     * @since  PAY_CHECK_MATE_SINCE
     * @return array<string, bool>
     */
    protected function get_employee_capabilities(): array {
        return [
            'read'                       => true,
            'pay_check_mate_employee'    => true,
            'pay_check_mate_manage_menu' => true,
        ];
    }

    /**
     * Get all capabilities for the plugin.
     *
     * @since PAY_CHECK_MATE_SINCE
     * @return true[]
     */
    protected function get_all_capabilities(): array {
        return [
            'read'                       => true,
            'pay_check_mate_accountant'  => true,
            'pay_check_mate_employee'    => true,
            'pay_check_mate_manage_menu' => true,
            'pay_check_mate_employee_list' => true,
            'pay_check_mate_add_employee' => true,
            'pay_check_mate_edit_employee' => true,
            'pay_check_mate_salary_increment' => true,
            'pay_check_mate_payroll_list' => true,
            'pay_check_mate_add_payroll' => true,
            'pay_check_mate_edit_payroll' => true,
            'pay_check_mate_approve_payroll' => true,
            'pay_check_mate_reject_payroll' => true,
            'pay_check_mate_cancel_payroll' => true,
            'pay_check_mate_view_payroll' => true,
        ];
    }
}
