<?php

namespace PayCheckMate\Controllers\REST;

use PayCheckMate\Classes\Employee;
use PayCheckMate\Classes\PayrollDetails;
use WP_Error;
use WP_REST_Server;
use WP_REST_Request;
use WP_REST_Response;
use PayCheckMate\Requests\EmployeeRequest;
use PayCheckMate\Requests\SalaryHistoryRequest;
use PayCheckMate\Contracts\HookAbleApiInterface;
use PayCheckMate\Models\EmployeeModel;
use PayCheckMate\Models\SalaryHistoryModel;

class PaySlipApi extends RestController implements HookAbleApiInterface {

    public function __construct() {
        $this->namespace = 'pay-check-mate/v1';
        $this->rest_base = 'payslip';
    }

    public function register_api_routes(): void {
        register_rest_route(
            $this->namespace, '/' . $this->rest_base, [
                [
                    'methods'             => WP_REST_Server::READABLE,
                    'callback'            => [ $this, 'get_employee_payslip_list' ],
                    'permission_callback' => [ $this, 'get_payslip_list_permissions_check' ],
                    'args'                => [
                        'context' => $this->get_context_param( [ 'default' => 'view' ] ),
                    ],
                ],
            ]
        );

        register_rest_route(
            $this->namespace, '/' . $this->rest_base . '/(?P<payslip_id>[\d]+)', [
                [
                    'methods'             => WP_REST_Server::READABLE,
                    'callback'            => [ $this, 'get_employee_payslip' ],
                    'permission_callback' => [ $this, 'get_payslip_permissions_check' ],
                    'args'                => [
                        'context' => $this->get_context_param( [ 'default' => 'view' ] ),
                    ],
                ],
            ]
        );
    }

    /**
     * Get the employee salary details permissions check.
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @return bool
     */
    public function get_payslip_list_permissions_check(): bool {
        // phpcs:ignore
        return current_user_can( 'pay_check_mate_view_payslip_list' );
    }

    /**
     * Get the employee payslip permissions check.
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @return bool
     */
    public function get_payslip_permissions_check(): bool {
        // phpcs:ignore
        return current_user_can( 'pay_check_mate_view_payslip_list' );
    }

    /**
     * Get a single employee payslip.
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @param \WP_REST_Request<array<string>> $request Full details about the request.
     *
     * @throws \Exception
     * @return \WP_REST_Response
     */
    public function get_employee_payslip_list( WP_REST_Request $request ): WP_REST_Response {
        $user_id = get_current_user_id();
        $args    = [
            'limit'    => $request->get_param( 'per_page' ) ? $request->get_param( 'per_page' ) : '-1',
            'offset'   => $request->get_param( 'page' ) ? ( $request->get_param( 'page' ) - 1 ) * $request->get_param( 'per_page' ) : 0,
            'order'    => $request->get_param( 'order' ) ? $request->get_param( 'order' ) : 'ASC',
            'order_by' => $request->get_param( 'order_by' ) ? $request->get_param( 'order_by' ) : 'id',
            'status'   => $request->get_param( 'status' ) ? $request->get_param( 'status' ) : 'all',
            'search'   => $request->get_param( 'search' ) ? $request->get_param( 'search' ) : '',
        ];

        $employee       = new Employee();
        $emp            = $employee->get_employee_by_user_id( $user_id );
        $payroll_detail = new PayrollDetails( $emp );
        $details        = $payroll_detail->get_payroll_details( $args );

        $data = [];
        foreach ( $details->data as $key => $detail ) {
            $data[ $key ] = (array) $detail;
            $data[ $key ]['employee_information'] = $emp->get_data();
        }

        $total     = $payroll_detail->count_payroll_details();
        $max_pages = ceil( $total / (int) $args['limit'] );

        $response = new WP_REST_Response( $data );

        $response->header( 'X-WP-Total', (string) $total );
        $response->header( 'X-WP-TotalPages', (string) $max_pages );

        return new WP_REST_Response( $response, 200 );
    }

    /**
     * Get item schema.
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @return array<string, mixed> Item schema data.
     */
    public function get_item_schema(): array {
        return [
            '$schema'    => 'http://json-schema.org/draft-04/schema#',
            'title'      => 'employee',
            'type'       => 'object',
            'properties' => [
                'id'                  => [
                    'description' => __( 'Unique identifier for the object.', 'pcm' ),
                    'type'        => 'integer',
                    'context'     => [ 'view', 'edit', 'embed' ],
                    'readonly'    => true,
                ],
                'employee_id'         => [
                    'description' => __( 'Employee ID', 'pcm' ),
                    'type'        => 'integer',
                    'required'    => true,
                ],
                'department_id'       => [
                    'description' => __( 'Department ID', 'pcm' ),
                    'type'        => 'integer',
                    'required'    => true,
                ],
                'designation_id'      => [
                    'description' => __( 'Designation ID', 'pcm' ),
                    'type'        => 'integer',
                    'required'    => true,
                ],
                'first_name'          => [
                    'description' => __( 'Employee First Name', 'pcm' ),
                    'type'        => 'string',
                    'required'    => true,
                ],
                'last_name'           => [
                    'description' => __( 'Employee Last Name', 'pcm' ),
                    'type'        => 'string',
                    'required'    => true,
                ],
                'email'               => [
                    'description' => __( 'Employee Email', 'pcm' ),
                    'type'        => 'string',
                    'required'    => true,
                ],
                'phone'               => [
                    'description' => __( 'Employee Phone Number', 'pcm' ),
                    'type'        => 'string',
                ],
                'address'             => [
                    'description' => __( 'Employee Address', 'pcm' ),
                    'type'        => 'string',
                ],
                'joining_date'        => [
                    'description' => __( 'Employee Joining Date', 'pcm' ),
                    'type'        => 'string',
                    'format'      => 'date',
                    'required'    => true,
                ],
                'joining_date_string' => [
                    'description' => __( 'Employee Joining Date String', 'pcm' ),
                    'type'        => 'string',
                    'context'     => [ 'view', 'edit', 'embed' ],
                    'readonly'    => true,
                ],
                'regine_date'         => [
                    'description' => __( 'Employee Regine Date', 'pcm' ),
                    'type'        => 'string',
                    'format'      => 'date',
                ],
                'status'              => [
                    'description' => __( 'Employee Status', 'pcm' ),
                    'type'        => 'integer',
                ],
                'created_on'          => [
                    'description' => __( 'Employee Created On', 'pcm' ),
                    'type'        => 'string',
                    'format'      => 'date',
                ],
                'updated_at'          => [
                    'description' => __( 'Employee Updated At', 'pcm' ),
                    'type'        => 'string',
                    'format'      => 'date',
                ],
            ],
        ];
    }
}