<?php

namespace PayCheckMate\Controllers;

/**
 * Installer class
 *
 * @since PAY_CHECK_MATE_SINCE
 */
class Installer {

	public function __construct() {
		new PayrollUserRoles();
		new Databases();
	}

}
