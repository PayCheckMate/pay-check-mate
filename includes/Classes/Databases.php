<?php
namespace PayCheckMate\Classes;

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
     * @since 1.0.0
     * @return void
     */
    public function create_tables() {
        $this->create_table_departments();
        $this->create_table_designation();
        $this->create_table_salary_head();
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
			    `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
			    `department_name` varchar(255) NOT NULL,
			    `status` tinyint(1) NOT NULL DEFAULT '1',
			    `created_on` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
			    `updated_at` DATETIME NULL ON UPDATE CURRENT_TIMESTAMP,
			    PRIMARY KEY (`id`)
			) {$this->charset_collate};";

        dbDelta( $sql );
    }

    /**
     * Create table designation.
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @return void
     */
    public function create_table_designation() {
        $this->include_db_delta();

        $sql = "CREATE TABLE IF NOT EXISTS `{$this->table_prefix}designations` (
                `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
                `designation_name` varchar(255) NOT NULL,
                `status` tinyint(1) NOT NULL DEFAULT '1',
                `created_on` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                `updated_at` DATETIME NULL ON UPDATE CURRENT_TIMESTAMP,
                PRIMARY KEY (`id`)
            ) {$this->charset_collate};";

        dbDelta( $sql );
    }

    /**
     * Create table salary head.
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @return void
     */
    public function create_table_salary_head() {
        $this->include_db_delta();

        $sql = "CREATE TABLE IF NOT EXISTS `{$this->table_prefix}salary_heads` (
                `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
                `head_name` varchar(255) NOT NULL,
                `head_type` tinyint(1) NOT NULL DEFAULT '1' Comment '1 = Earning, 2 = Deduction',
                `head_amount` decimal(10,2) NOT NULL,
                `is_percentage` tinyint(1) NOT NULL DEFAULT '1' Comment '0 = No, 1 = Yes',
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
