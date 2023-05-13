<?php

namespace WpPayroll\Controllers;

/**
 * Installer class
 *
 * @since WP_PAYROLL_SINCE
 */
class Installer {

	public function __construct() {
		new PayrollUserRoles();
	}

}
