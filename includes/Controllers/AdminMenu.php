<?php

namespace WpPayroll\Controllers;

use WpPayroll\Contracts\HookAbleInterface;

class AdminMenu implements HookAbleInterface {

	/**
	 * All the necessary hooks.
	 *
	 * @return void
	 * @since WP_PMS_SINCE
	 */
	public function hooks(): void {
		add_action( 'admin_menu', [ $this, 'admin_menu' ] );
	}

	/**
	 * Add menu page.
	 *
	 * @since WP_PMS_SINCE
	 *
	 * @return void
	 */
	public function admin_menu(): void {
		add_menu_page(
            __( 'WP Payroll', 'wp-payroll' ),
            __( 'WP Payroll', 'wp-payroll' ),
            'manage_options',
            'wp-payroll',
            [ $this, 'menu_page' ],
            'dashicons-money-alt',
            '20'
		);
	}

	/**
	 * Menu page callback.
	 *
	 * @since WP_PMS_SINCE
	 *
	 * @return void
	 */
	public function menu_page(): void {
		echo '<div id="root" class="h-full wrap"></div>';
	}
}
