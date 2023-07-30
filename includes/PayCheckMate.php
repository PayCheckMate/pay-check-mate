<?php

namespace PayCheckMate;

use PayCheckMate\Classes\Installer;
use PayCheckMate\Contracts\HookAbleApiInterface;
use PayCheckMate\Contracts\HookAbleInterface;

final class PayCheckMate {

    /**
     * @var PayCheckMate|null
     */
    protected static ?PayCheckMate $instance = null;

    /**
     * All the hook classes.
     *
     * @var array|string[]
     */
    protected array $hook_classes = [
        'PayCheckMate\Controllers\AdminMenu',
        'PayCheckMate\Controllers\Assets',
    ];

    /**
     * All the controller classes.
     *
     * @var array|string[]
     */
    protected array $classes = [
        'employee' => 'PayCheckMate\Classes\Employee',
    ];

    /**
     * All the API classes.
     *
     * @var array|string[]
     */
    protected array $api_classes = [
        'PayCheckMate\Controllers\REST\DepartmentApi',
        'PayCheckMate\Controllers\REST\DesignationApi',
        'PayCheckMate\Controllers\REST\SalaryHeadApi',
        'PayCheckMate\Controllers\REST\PayrollApi',
        'PayCheckMate\Controllers\REST\EmployeeApi',
        'PayCheckMate\Controllers\REST\PaySlipApi',
        'PayCheckMate\Controllers\REST\DashboardApi',
    ];

    /**
     * Holds classes instances
     *
     * @var array
     */
    private array $container = [];

    /**
     * Get the single instance of the class
     *
     * @since PAY_CHECK_MATE_SINCE
     * @return PayCheckMate
     */
    public static function get_instance(): PayCheckMate {
        if ( null === self::$instance ) {
            self::$instance = new self();
        }

        return self::$instance;
    }

    /**
     * Construct method for PayCheckMate class.
     */
    private function __construct() {
        add_action( 'init', [ $this, 'set_translation' ] );
        register_activation_hook( PAY_CHECK_MATE_FILE, [ $this, 'activate_this_plugin' ] );
        add_action( 'plugins_loaded', [ $this, 'load_plugin_hooks' ] );

        // Register REST API routes.
        add_action( 'rest_api_init', [ $this, 'register_rest_routes' ] );
    }

    /**
     * Magic getter to bypass referencing plugin.
     *
     * @param string $prop Property name.
     *
     * @return mixed
     */
    public function __get( string $prop ) {
        if ( array_key_exists( $prop, $this->container ) ) {
            return $this->container[ $prop ];
        }

        return $this->{$prop};
    }

    /**
     * Set Transaction Text Domain
     *
     * @since PAY_CHECK_MATE_SINCE
     * @return void
     */
    public function set_translation(): void {
        load_plugin_textdomain( 'pay-check-mate', false, dirname( plugin_basename( PAY_CHECK_MATE_FILE ) ) . '/languages' );
    }

    /**
     * On activate this plugin.
     *
     * @since PAY_CHECK_MATE_SINCE
     * @return void
     */
    public function activate_this_plugin(): void {
        if ( ! get_option( 'pay_check_mate_installed' ) ) {
            update_option( 'pay_check_mate_installed', time() );
        }

        update_option( 'pay_check_mate_version', PAY_CHECK_MATE_PLUGIN_VERSION );

        new Installer();

        flush_rewrite_rules();
    }

    /**
     * Main point of loading the plugin.
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @return void
     */
    public function load_plugin_hooks(): void {
        $this->load_hook_classes();
        $this->load_classes();

        do_action( 'pay_check_mate_loaded' );
    }

    /**
     * Load all the hook classes.
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @return void
     */
    public function load_hook_classes() {
        if ( empty( $this->hook_classes ) ) {
            return;
        }

        foreach ( $this->hook_classes as $item ) {
            $item = new $item();
            if ( $item instanceof HookAbleInterface ) {
                $this->load_hooks( $item );
            }
        }
    }

    /**
     * Load all the classes.
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @return void
     */
    public function load_classes() {
        if ( empty( $this->classes ) ) {
            return;
        }

        foreach ( $this->classes as $key => $item ) {
            $this->container[ $key ] = new $item();
        }
    }

    /**
     * Register REST API routes.
     *
     * @since PAY_CHECK_MATE_SINCE
     * @return void
     */
    public function register_rest_routes(): void {
        if ( empty( $this->api_classes ) ) {
            return;
        }

        foreach ( $this->api_classes as $item ) {
            $item = new $item();
            if ( $item instanceof HookAbleApiInterface ) {
                $item->register_api_routes();
            }
        }
    }

    /**
     * Load necessary hooks.
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @param HookAbleInterface $hook_able HookAble Interface.
     *
     * @return void
     */
    private function load_hooks( HookAbleInterface $hook_able ): void {
        $hook_able->hooks();
    }
}
