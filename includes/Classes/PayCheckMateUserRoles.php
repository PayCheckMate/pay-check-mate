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

        // Add capabilities to all admin users.
        $admins = get_users( [ 'role' => 'administrator' ] );
        if ( $admins ) {
            foreach ( $admins as $admin ) {
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
}
