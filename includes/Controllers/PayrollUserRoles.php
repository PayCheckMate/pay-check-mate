<?php

namespace PayCheckMate\Controllers;

class PayrollUserRoles {
	/**
	 * Constructor, Here we're adding AccountantRole with required capabilities.
	 */
	public function __construct() {
		// Add an accountant role if it doesn't exist.
		if ( ! get_role( 'wp_payroll_accountant' ) ) {
			add_role( 'wp_payroll_accountant', __( 'Payroll Accountant', 'pcm' ), $this->get_accountant_capabilities() );
		}

		// Add an employee role if it doesn't exist.
		if ( ! get_role( 'wp_payroll_employee' ) ) {
			add_role( 'wp_payroll_employee', __( 'Payroll Employee', 'pcm' ), $this->get_employee_capabilities() );
		}

		// Add capabilities to admin.
		$admin = get_role( 'administrator' );
		if ( $admin ) {
			$admin->add_cap( 'wp_payroll_accountant' );
			$admin->add_cap( 'wp_payroll_manage_menu' );
		}
	}

	/**
	 * Get capabilities for the `accountant` role.
	 *
	 * @return array
	 * @since  PAY_CHECK_MATE_SINCE
	 */
	protected function get_accountant_capabilities(): array {
		return [
			'read'                   => true,
			'wp_payroll_accountant'  => true,
			'wp_payroll_manage_menu' => true,
		];
	}

	/**
	 * Get capabilities for the `employee` role.
	 *
	 * @return array
	 * @since  PAY_CHECK_MATE_SINCE
	 */
	protected function get_employee_capabilities(): array {
		return [
			'read'                   => true,
			'wp_payroll_employee'    => true,
			'wp_payroll_manage_menu' => true,
		];
	}
}
