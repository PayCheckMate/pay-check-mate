<?php

namespace WpPayroll\Contracts;

interface HookAbleApiInterface {

	/**
	 * Call the necessary hooks.
	 *
	 * @since WP_PAYROLL_SINCE
	 * @return void
	 */
	public function register_api_routes(): void;
}
