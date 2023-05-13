<?php

namespace WpPayroll\Contracts;

interface HookAbleInterface {

	/**
	 * Call the necessary hooks.
	 *
	 * @since WP_PAYROLL_SINCE
	 * @return void
	 */
	public function hooks(): void;
}
