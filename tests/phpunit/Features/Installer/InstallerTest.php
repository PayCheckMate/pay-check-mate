<?php

namespace PayCheckMate\Tests\Features\Installer;

use PayCheckMate\Classes\Installer;
use WP_Role;

class InstallerTest extends \WP_UnitTestCase {

    /**
     * Installer controller.
     *
     * @var Installer $installer
     */
    protected $installer;

    /**
     * Database tables.
     *
     * @var array $tables
     */
    protected $tables;

    /**
     * Setup.
     *
     * @return void
     */
    public function setUp(): void {
        global $wpdb;
        parent::setUp();
        remove_filter( 'query', array( $this, '_create_temporary_tables' ) );
        remove_filter( 'query', array( $this, '_drop_temporary_tables' ) );

        $this->installer = new Installer();
        $this->tables = wp_list_pluck( $wpdb->get_results( 'SHOW TABLES', ARRAY_N ), 0 ); // phpcs:ignore.
    }

    /**
     * Check it is an instance of the installer class.
     *
     * @test
     *
     * @return void
     */
    public function test_it_is_an_instance_of_install_controller_class() {
        $this->assertInstanceOf( Installer::class, $this->installer );
    }

    /**
     * Check it creates a new role called driver during installation.
     *
     * @test
     *
     * @return void
     */
    public function test_it_creates_user_roll_driver_during_installation() {
        $this->assertInstanceOf( WP_Role::class, get_role( 'pay_check_mate_accountant' ) );
        $this->assertInstanceOf( WP_Role::class, get_role( 'pay_check_mate_employee' ) );
    }

    /**
     * Check it creates a new role called driver with capabilities during installation.
     *
     * @test
     *
     * @return void
     */
    public function test_it_creates_user_roll_accountant_and_employee_with_capabilities() {
        $accountant = get_role( 'pay_check_mate_accountant' );
        $this->assertTrue( ! is_null( $accountant ) );
        $this->assertInstanceOf( WP_Role::class, $accountant );
        $this->assertTrue( array_key_exists( 'read', $accountant->capabilities ) );
        $this->assertTrue( array_key_exists( 'pay_check_mate_accountant', $accountant->capabilities ) );
        $this->assertTrue( array_key_exists( 'pay_check_mate_manage_menu', $accountant->capabilities ) );

        $employee = get_role( 'pay_check_mate_employee' );
        $this->assertInstanceOf( WP_Role::class, $employee );
        $this->assertTrue( array_key_exists( 'read', $employee->capabilities ) );
        $this->assertTrue( array_key_exists( 'pay_check_mate_employee', $employee->capabilities ) );
        $this->assertTrue( array_key_exists( 'pay_check_mate_manage_menu', $employee->capabilities ) );


    }

    /**
     * Check it creates pay_check_mate table during installation.
     *
     * @test
     *
     * @return void
     */
    public function test_it_creates_pay_check_mate_table_during_installation() {
        global $wpdb;

        $prefix = $wpdb->prefix . 'pay_check_mate_';
        $found = false;

        foreach ($this->tables as $table) {
            if (strpos($table, $prefix) !== false) {
                $found = true;
                break;
            }
        }

        $this->assertTrue($found);
    }
}