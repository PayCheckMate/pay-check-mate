<?php

namespace PayCheckMate\Core;

/**
 * Installer class
 *
 * @since PAY_CHECK_MATE_SINCE
 */
class Installer {

	public function __construct() {
		new PayCheckMateUserRoles();
		new Databases();
	}

}
