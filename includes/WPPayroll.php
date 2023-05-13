<?php

namespace WpPayroll;

use WpPayroll\Contracts\HookAbleInterface;
use WpPayroll\Controllers\Installer;

final class WPPayroll {

	protected static $instance;

	/**
	 * All the controller classes.
	 *
	 * @var array|string[]
	 */
	protected array $classes = [
		'WpPayroll\Controllers\AdminMenu',
		'WpPayroll\Controllers\Assets',
	];

	/**
	 * Get the single instance of the class
	 *
	 * @return WPPayroll
	 * @since WP_PAYROLL_SINCE
	 */
	public static function get_instance(): WPPayroll {
		if ( ! self::$instance ) {
			self::$instance = new self();
		}

		return self::$instance;
	}

	/**
	 * Construct method for WPPayroll class.
	 */
	private function __construct() {
		add_action( 'init', [ $this, 'set_translation' ] );
		register_activation_hook( WP_PAYROLL_FILE, [ $this, 'activate_this_plugin' ] );
		add_action( 'plugins_loaded', [ $this, 'load_plugin_hooks' ] );
	}

	/**
	 * Set Transaction Text Domain
	 *
	 * @return void
	 * @since WP_PAYROLL_SINCE
	 */
	public function set_translation(): void {
		load_plugin_textdomain( 'wp-payroll', false, dirname( plugin_basename( WP_PAYROLL_FILE ) ) . '/languages' );
	}

	/**
	 * On activate this plugin.
	 *
	 * @return void
	 * @since 1.0.0
	 */
	public function activate_this_plugin(): void {
		if ( ! get_option( 'wp_payroll_installed' ) ) {
			update_option( 'wp_payroll_installed', time() );
		}

		update_option( 'wp_payroll_version', WP_PAYROLL_PLUGIN_VERSION );

		new Installer();

		flush_rewrite_rules();
	}

	/**
	 * Main point of loading the plugin.
	 *
	 * @since WP_PAYROLL_SINCE
	 *
	 * @return void
	 */
	public function load_plugin_hooks(): void {
		if ( empty( $this->classes ) ) {
			return;
        }

		foreach ( $this->classes as $item ) {
			$item = new $item();
			if ( $item instanceof HookAbleInterface ) {
				$this->load_hooks( $item );
			}
		}
	}

	/**
	 * Load necessary hooks.
	 *
	 * @since WP_PAYROLL_SINCE
	 *
	 * @param  HookAbleInterface $hook_able  HookAble Interface.
	 *
	 * @return void
	 */
	private function load_hooks( HookAbleInterface $hook_able ): void {
		$hook_able->hooks();
	}

}
