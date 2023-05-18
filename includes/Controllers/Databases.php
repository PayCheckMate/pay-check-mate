<?php
namespace PayCheckMate\Controllers;

class Databases {

	/**
	 * Charset collate of DB.
	 *
	 * @var string
	 */
	protected $charset_collate;

	/**
	 * Database prefix.
	 *
	 * @var string
	 */
	protected $prefix;
	protected string $table_prefix;

	/**
	 * Constructor.
	 */
	public function __construct() {
		global $wpdb;

		$this->charset_collate = $wpdb->get_charset_collate();
		$this->prefix          = $wpdb->prefix;
		$this->table_prefix    = $wpdb->prefix . 'pay_check_mate_';

		$this->create_tables();
	}

	/**
	 * Create tables.
	 *
	 * @return void
	 * @since 1.0.0
	 */
	public function create_tables() {
		$this->create_table_departments();
	}

	/**
	 * Create table departments.
	 *
	 * @since PAY_CHECK_MATE_SINCE
	 *
	 * @return void
	 */
	public function create_table_departments() {
		$this->include_db_delta();

		$sql = "CREATE TABLE IF NOT EXISTS `{$this->table_prefix}departments` (
			`id` bigint(20) unsigned NOT NULL,
    		`department_name` varchar(255) NOT NULL,
    		`status` tinyint(1) NOT NULL DEFAULT '1',
			`created_on` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
			`updated_at` DATETIME NULL ON UPDATE CURRENT_TIMESTAMP,
			PRIMARY KEY (`id`)
		) {$this->charset_collate};";

		dbDelta( $sql );
	}

	/**
	 * Include the db delta file
	 *
	 * @return void
	 */
	protected function include_db_delta(): void {
		if ( ! function_exists( 'dbDelta' ) ) {
			require ABSPATH . 'wp-admin/includes/upgrade.php';
		}
	}
}
