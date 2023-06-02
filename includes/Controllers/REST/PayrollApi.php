<?php

namespace PayCheckMate\Controllers\REST;

use PayCheckMate\Classes\Payroll;
use PayCheckMate\Contracts\HookAbleApiInterface;
use WP_REST_Server;

class PayrollApi extends RestController implements HookAbleApiInterface {

    public function __construct() {
        $this->namespace = 'pay-check-mate/v1';
        $this->rest_base = 'payroll';
    }

    /**
     * Register routes.
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @return void
     */
    public function register_api_routes(): void {
        register_rest_route(
            $this->namespace,
            '/' . $this->rest_base . '/create-payroll', [
                [
                    'methods'             => WP_REST_Server::CREATABLE,
                    'callback'            => [ $this, 'create_payroll' ],
                    'permission_callback' => [ $this, 'create_payroll_permissions_check' ],
                    'args'                => $this->get_endpoint_args_for_item_schema( \WP_REST_Server::CREATABLE ),
                ],
                'schema' => [ $this, 'get_public_item_schema' ],
            ]
        );
    }

    /**
     * Get items.
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @param \WP_REST_Request<array<string>> $request Request object.
     *
     * @return \WP_REST_Response
     */
    public function a_payroll( \WP_REST_Request $request ): \WP_REST_Response {
//        $payroll = new Payroll();
//        $payroll->create_payroll( $request->get_param( 'date' ) );
        return new \WP_REST_Response( [ 'message' => 'Hello World!' ] );
	}

    /**
     * Create payroll permissions check.
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @param \WP_REST_Request<array<string>> $request Request object.
     *
     * @return bool
     */
    public function create_payroll_permissions_check( \WP_REST_Request $request ): bool {
        // phpcs:ignore
        return current_user_can( 'pay_check_mate_accountant' );
    }

    /**
     * Get items.
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @param \WP_REST_Request<array<string>> $request Request object.
     *
     * @return \WP_REST_Response
     */
    public function create_payroll( \WP_REST_Request $request ): \WP_REST_Response {
        //        $payroll = new Payroll();
        //        $payroll->create_payroll( $request->get_param( 'date' ) );
        return new \WP_REST_Response( [ 'message' => 'Hello World!' ] );
    }

    public function get_collection_params(): array {
        return [
            '$schema'    => 'http://json-schema.org/draft-04/schema#',
            'title'      => 'designation',
            'type'       => 'object',
            'properties' => [
                'date' => [
                    'description'       => __( 'The date of the payroll', 'pcm' ),
                    'type'              => 'string',
                    'format'            => 'Y-m-d',
                    'required'          => true,
                    'sanitize_callback' => 'sanitize_text_field',
                    'validate_callback' => 'rest_validate_request_arg',
                ],
            ],
        ];
    }

}
