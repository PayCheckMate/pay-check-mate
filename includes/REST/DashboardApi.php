<?php

namespace PayCheckMate\REST;

use PayCheckMate\Classes\PayCheckMateUserRoles;
use PayCheckMate\Models\PayrollModel;
use Plugin_Upgrader;
use WP_Ajax_Upgrader_Skin;
use WP_REST_Server;
use WP_REST_Request;
use WP_REST_Response;
use PayCheckMate\Contracts\HookAbleApiInterface;
use PayCheckMate\Models\EmployeeModel;

class DashboardApi extends RestController implements HookAbleApiInterface {

    public function __construct() {
        $this->namespace = 'pay-check-mate/v1';
        $this->rest_base = 'dashboard';
    }

    public function register_api_routes(): void {
        register_rest_route(
            $this->namespace,
            '/' . $this->rest_base, [
                [
                    'methods'             => WP_REST_Server::READABLE,
                    'callback'            => [ $this, 'get_dashboard' ],
                    'permission_callback' => [ $this, 'get_dashboard_permissions_check' ],
                    'args'                => $this->get_collection_params(),
                ],
                'schema' => [ $this, 'get_public_item_schema' ],
            ]
        );

        register_rest_route(
            $this->namespace, '/install-required-plugins', [
                [
                    'methods'             => WP_REST_Server::CREATABLE,
                    'callback'            => [ $this, 'get_required_plugins' ],
                    'permission_callback' => [ $this, 'get_install_permissions_check' ],
                    'args'                => $this->get_collection_params(),
                ],
            ]
        );

        register_rest_route(
            $this->namespace, '/cancel-install-required-plugins', [
                [
                    'methods'             => WP_REST_Server::CREATABLE,
                    'callback'            => [ $this, 'cancel_required_plugins' ],
                    'permission_callback' => [ $this, 'get_install_permissions_check' ],
                    'args'                => $this->get_collection_params(),
                ],
            ]
        );
    }

    /**
     * Get the install permissions check.
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @return bool
     */
    public function get_install_permissions_check(): bool {
        return current_user_can( 'install_plugins' );
    }

    /**
     * Get the employee permissions check.
     *
     * @since 1.0.0
     *
     * @return bool
     */
    public function get_dashboard_permissions_check(): bool {
        return current_user_can( PayCheckMateUserRoles::get_pay_check_mate_admin_role_name() ) || current_user_can( PayCheckMateUserRoles::get_pay_check_mate_accountant_role_name() );
    }

    /**
     * Get a collection of items
     *
     * @since 1.0.0
     *
     * @param \WP_REST_Request<array<string>> $request Full details about the request.
     *
     * @throws \Exception
     * @return WP_REST_Response
     */
    public function get_dashboard( WP_REST_Request $request ): WP_REST_Response {
        $employee_model = new EmployeeModel();
        $all_employees  = $employee_model->count(
            [
                'status' => 1,
            ]
        );

        $payroll_model = new PayrollModel();
        $args          = [
            'limit'    => 12,
            'status'   => 1,
            'order_by' => 'payroll_date',
            'order'    => 'DESC',
        ];
        $salary        = $payroll_model->all( $args );
        // Now sort this in reverse order.
        $salary = array_reverse( $salary );

        // Get total salary amount of last month.
        $last_month_salary = end( $salary );

        $data = [
            'all_payrolls'    => $salary,
            'total_employees' => $all_employees,
            'last_payroll'    => $last_month_salary,
        ];

        return new WP_REST_Response( $data, 200 );
    }

    /**
     * Install required plugins.
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @param \WP_REST_Request<array<string>> $request Full details about the request.
     */
    public function get_required_plugins( WP_REST_Request $request ): WP_REST_Response {
        require_once ABSPATH . 'wp-admin/includes/plugin-install.php';
        if ( empty( $request->get_param( '_wpnonce' ) ) || ! wp_verify_nonce( $request->get_param( '_wpnonce' ), 'pay_check_mate_nonce' ) ) {
            return new WP_REST_Response(
                [
                    'success' => false,
                    'message' => __( 'Nonce verification failed', 'pay-check-mate' ),
                ], 403
            );
        }

        include_once ABSPATH . 'wp-admin/includes/plugin-install.php';
        include_once ABSPATH . 'wp-admin/includes/class-wp-upgrader.php';
        include_once ABSPATH . 'wp-admin/includes/file.php';
        update_option( 'pay_check_mate_onboarding', false );

        $plugin = $request->get_param( 'plugin' );
        // Check if plugin is already installed.
        if ( is_plugin_active( $plugin . '/' . $plugin . '.php' ) ) {
            return new WP_REST_Response(
                [
                    'success' => true,
                    'message' => __( 'Plugin already installed', 'pay-check-mate' ),
                ], 200
            );
        }

        $api = plugins_api(
            'plugin_information', [
                'slug'   => $plugin,
                'fields' => [ 'sections' => false ],
            ]
        );

        $installer = new Plugin_Upgrader( new WP_Ajax_Upgrader_Skin() );
        // @phpstan-ignore-next-line
        $result = $installer->install( $api->download_link );
        activate_plugin( $plugin . '/' . $plugin . '.php' );

        if ( is_wp_error( $result ) ) {
            return new WP_REST_Response(
                [
                    'success' => false,
                    'message' => $result->get_error_message(),
                ], 403
            );
        }

        return new WP_REST_Response(
            [
                'success' => true,
                'message' => __( 'Plugin installed successfully', 'pay-check-mate' ),
            ], 200
        );
    }

    /**
     * Cancel required plugins.
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @return void
     */
    public function cancel_required_plugins() {
        update_option( 'pay_check_mate_onboarding', false );
    }

    /**
     * Get item schema.
     *
     * @since 1.0.0
     *
     * @return array<string, mixed> Item schema data.
     */
    public function get_item_schema(): array {
        return [
            '$schema'    => 'http://json-schema.org/draft-04/schema#',
            'title'      => 'dashboard',
            'type'       => 'object',
            'properties' => [
                'id'                  => [
                    'description' => __( 'Unique identifier for the object.', 'pay-check-mate' ),
                    'type'        => 'integer',
                    'context'     => [ 'view', 'edit', 'embed' ],
                    'readonly'    => true,
                ],
                'employee_id'         => [
                    'description' => __( 'Employee ID', 'pay-check-mate' ),
                    'type'        => 'integer',
                    'required'    => true,
                ],
                'department_id'       => [
                    'description' => __( 'Department ID', 'pay-check-mate' ),
                    'type'        => 'integer',
                    'required'    => true,
                ],
                'designation_id'      => [
                    'description' => __( 'Designation ID', 'pay-check-mate' ),
                    'type'        => 'integer',
                    'required'    => true,
                ],
                'department_name'     => [
                    'description' => __( 'Department ID', 'pay-check-mate' ),
                    'type'        => 'integer',
                    'context'     => [ 'view', 'edit', 'embed' ],
                ],
                'designation_name'    => [
                    'description' => __( 'Designation ID', 'pay-check-mate' ),
                    'type'        => 'integer',
                    'context'     => [ 'view', 'edit', 'embed' ],
                ],
                'first_name'          => [
                    'description' => __( 'Employee First Name', 'pay-check-mate' ),
                    'type'        => 'string',
                    'required'    => true,
                ],
                'last_name'           => [
                    'description' => __( 'Employee Last Name', 'pay-check-mate' ),
                    'type'        => 'string',
                    'required'    => true,
                ],
                'email'               => [
                    'description' => __( 'Employee Email', 'pay-check-mate' ),
                    'type'        => 'string',
                    'required'    => true,
                ],
                'phone'               => [
                    'description' => __( 'Employee Phone Number', 'pay-check-mate' ),
                    'type'        => 'string',
                ],
                'address'             => [
                    'description' => __( 'Employee Address', 'pay-check-mate' ),
                    'type'        => 'string',
                ],
                'joining_date'        => [
                    'description' => __( 'Employee Joining Date', 'pay-check-mate' ),
                    'type'        => 'string',
                    'format'      => 'date',
                    'required'    => true,
                ],
                'joining_date_string' => [
                    'description' => __( 'Employee Joining Date String', 'pay-check-mate' ),
                    'type'        => 'string',
                    'context'     => [ 'view', 'edit', 'embed' ],
                    'readonly'    => true,
                ],
                'resign_date'         => [
                    'description' => __( 'Employee Regine Date', 'pay-check-mate' ),
                    'type'        => 'string',
                    'format'      => 'date',
                ],
                'status'              => [
                    'description' => __( 'Employee Status', 'pay-check-mate' ),
                    'type'        => 'integer',
                ],
                'created_on'          => [
                    'description' => __( 'Employee Created On', 'pay-check-mate' ),
                    'type'        => 'string',
                    'format'      => 'date',
                ],
                'updated_at'          => [
                    'description' => __( 'Employee Updated At', 'pay-check-mate' ),
                    'type'        => 'string',
                    'format'      => 'date',
                ],
            ],
        ];
    }
}
