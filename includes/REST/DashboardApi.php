<?php

namespace PayCheckMate\REST;

use PayCheckMate\Classes\Employee;
use PayCheckMate\Models\PayrollModel;
use PayCheckMate\REST\RestController;
use WP_Error;
use WP_REST_Server;
use WP_REST_Request;
use WP_REST_Response;
use PayCheckMate\Requests\EmployeeRequest;
use PayCheckMate\Requests\SalaryHistoryRequest;
use PayCheckMate\Contracts\HookAbleApiInterface;
use PayCheckMate\Models\EmployeeModel;
use PayCheckMate\Models\SalaryHistoryModel;

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
    }

    /**
     * Get the employee permissions check.
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @return bool
     */
    public function get_dashboard_permissions_check(): bool {
        // phpcs:ignore
        return current_user_can( 'pay_check_mate_admin' );
    }

    /**
     * Get a collection of items
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @param \WP_REST_Request<array<string>> $request Full details about the request.
     *
     * @throws \Exception
     * @return WP_REST_Response
     */
    public function get_dashboard( WP_REST_Request $request ): WP_REST_Response {
        $employee_model = new EmployeeModel();
        $all_employees = $employee_model->count(
            [
				'status' => 1,
			]
        );

        $payroll_model = new PayrollModel();
        $args = [
            'limit' => 12,
            'status' => 1,
            'order_by' => 'payroll_date',
            'order' => 'DESC',
        ];
        $salary = $payroll_model->all( $args );
        // Now sort this in reverse order.
        $salary = array_reverse( $salary );

        // Get total salary amount of last month.
        $last_month_salary = end( $salary );

        $data = [
            'all_payrolls' => $salary,
            'total_employees' => $all_employees,
            'last_payroll' => $last_month_salary,
        ];

        return new WP_REST_Response( $data, 200 );
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
            'title'      => 'dashboard',
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
                'department_name'     => [
                    'description' => __( 'Department ID', 'pcm' ),
                    'type'        => 'integer',
                    'context'     => [ 'view', 'edit', 'embed' ],
                ],
                'designation_name'      => [
                    'description' => __( 'Designation ID', 'pcm' ),
                    'type'        => 'integer',
                    'context'     => [ 'view', 'edit', 'embed' ],
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
