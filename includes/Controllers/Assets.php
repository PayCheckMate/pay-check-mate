<?php

namespace WpPayroll\Controllers;

use WpPayroll\Contracts\HookAbleInterface;

class Assets implements HookAbleInterface {

	public function hooks(): void {
		add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_scripts' ] );
	}

	public function enqueue_scripts(): void {
		$asset_file = require_once WP_PMS_DIR . '/build/index.asset.php';

		wp_enqueue_script(
			'wp-payroll-js',
			WP_PMS_URL . '/build/index.js',
			$asset_file['dependencies'],
			$asset_file['version'],
			true
		);

		wp_enqueue_style(
			'wp-payroll-css',
			WP_PMS_URL . '/build/index.css',
			[],
			$asset_file['version']
		);
	}
}
