<?php

namespace WpPayroll\Controllers;

use WpPayroll\Contracts\HookAbleInterface;

class Assets implements HookAbleInterface {

	public function hooks(): void {
		add_action( 'init', [ $this, 'register_scripts' ] );
		add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_scripts' ] );
	}

	/**
	 * Register scripts.
	 *
	 * @return void
	 * @since WP_PMS_SINCE
	 */
	public function register_scripts(): void {
		$asset_file = require_once WP_PMS_DIR . '/build/index.asset.php';

		wp_register_script(
			'wp-payroll-js',
			WP_PMS_URL . '/build/index.js',
			$asset_file['dependencies'],
			$asset_file['version'],
			true,
		);

		wp_register_style(
			'wp-payroll-css',
			WP_PMS_URL . '/build/index.css',
			[],
			$asset_file['version'],
		);
	}

	/**
	 * Enqueue scripts.
	 *
	 * @return void
	 * @since DOKAN_PRO_SINCE
	 */
	public function enqueue_scripts(): void {
		if ( 'toplevel_page_wp-payroll' !== get_current_screen()->id ) {
			return;
		}
		$this->register_translations();
		wp_enqueue_script( 'wp-payroll-js' );
		wp_enqueue_style( 'wp-payroll-css' );
	}

	/**
	 * Register translations.
	 *
	 * @return void
	 * @since WP_PMS_SINCE
	 */
	public function register_translations(): void {
		wp_localize_script(
			'wp-payroll-js', 'wpPayroll', [
				'ajaxUrl' => admin_url( 'admin-ajax.php' ),
				'nonce'   => wp_create_nonce( 'wp-payroll-nonce' ),
				'menus'   => apply_filters(
                    'wp_payroll_menus', [
						[
							'title' => __( 'Dashboard', 'wp-payroll' ),
							'path'  => '/dashboard',
							'icon'  => 'dashicons dashicons-dashboard',
						],
						[
							'title' => __( 'Employees', 'wp-payroll' ),
							'path'  => '/employees',
							'icon'  => 'dashicons dashicons-groups',
						],
						[
							'title' => __( 'Payroll', 'wp-payroll' ),
							'path'  => '/payroll',
							'icon'  => 'dashicons dashicons-money-alt',
						],
						[
							'title' => __( 'Settings', 'wp-payroll' ),
							'path'  => '/settings',
							'icon'  => 'dashicons dashicons-admin-settings',
						],
					],
                ),
			],
		);
	}
}
