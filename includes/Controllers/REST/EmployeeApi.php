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

class EmployeeApi extends RestController implements HookAbleApiInterface {

    public function __construct() {
        $this->namespace = 'pay-check-mate/v1';
        $this->rest_base = 'employees';
    }

    public function register_api_routes(): void {
        register_rest_route(
            $this->namespace,
            '/' . $this->rest_base, [
                [
                    'methods'             => WP_REST_Server::READABLE,
                    'callback'            => [ $this, 'get_employees' ],
                    'permission_callback' => [ $this, 'get_employees_permissions_check' ],
                    'args'                => $this->get_collection_params(),
                ],
                [
                    'methods'             => WP_REST_Server::CREATABLE,
                    'callback'            => [ $this, 'create_employee' ],
                    'permission_callback' => [ $this, 'create_employee_permissions_check' ],
                    'args'                => $this->get_endpoint_args_for_item_schema( \WP_REST_Server::CREATABLE ),
                ],
                'schema' => [ $this, 'get_public_item_schema' ],
            ]
        );
        register_rest_route(
            $this->namespace, '/' . $this->rest_base . '/(?P<employee_id>[\d]+)', [
                [
                    'methods'             => WP_REST_Server::READABLE,
                    'callback'            => [ $this, 'get_employee' ],
                    'permission_callback' => [ $this, 'get_employee_permissions_check' ],
                    'args'                => [
                        'context' => $this->get_context_param( [ 'default' => 'view' ] ),
                    ],
                ],
                [
                    'methods'             => WP_REST_Server::EDITABLE,
                    'callback'            => [ $this, 'update_employee' ],
                    'permission_callback' => [ $this, 'update_employee_permissions_check' ],
                    'args'                => $this->get_endpoint_args_for_item_schema( \WP_REST_Server::EDITABLE ),
                ],
                'schema' => [ $this, 'get_public_item_schema' ],
            ]
        );

        register_rest_route(
            $this->namespace, '/' . $this->rest_base . '/(?P<employee_id>[\d]+)/salary-details', [
                [
                    'methods'             => WP_REST_Server::READABLE,
                    'callback'            => [ $this, 'get_employee_salary_details' ],
                    'permission_callback' => [ $this, 'get_employee_salary_details_permissions_check' ],
                    'args'                => [
                        'context' => $this->get_context_param( [ 'default' => 'view' ] ),
                    ],
                ],
            ]
        );

        register_rest_route(
            $this->namespace, '/' . $this->rest_base . '/payslip', [
                [
                    'methods'             => WP_REST_Server::READABLE,
                    'callback'            => [ $this, 'get_employee_payslip' ],
                    'permission_callback' => [ $this, 'get_employee_payslip_permissions_check' ],
                    'args'                => [
                        'context' => $this->get_context_param( [ 'default' => 'view' ] ),
                    ],
                ],
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
    public function get_employees_permissions_check(): bool {
        // phpcs:ignore
        return current_user_can( 'pay_check_mate_accountant' );
    }

    /**
     * Create employee permissions check.
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @return bool
     */
    public function create_employee_permissions_check(): bool {
        // phpcs:ignore
        return current_user_can( 'pay_check_mate_accountant' );
    }

    /**
     * Get the employee permissions check.
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @return bool
     */
    public function get_employee_permissions_check(): bool {
        // phpcs:ignore
        return current_user_can( 'pay_check_mate_accountant' );
    }

    /**
     * Update employee permissions check.
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @return bool
     */
    public function update_employee_permissions_check(): bool {
        // phpcs:ignore
        return current_user_can( 'pay_check_mate_accountant' );
    }

    /**
     * Get the employee salary details permissions check.
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @return bool
     */
    public function get_employee_salary_details_permissions_check(): bool {
        // phpcs:ignore
        return current_user_can( 'pay_check_mate_accountant' );
    }

    /**
     * Get the employee payslip permissions check.
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @return bool
     */
    public function get_employee_payslip_permissions_check(): bool {
        // phpcs:ignore
        return current_user_can( 'pay_check_mate_employee' );
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
    public function get_employees( WP_REST_Request $request ): WP_REST_Response {
        $args           = [
            'limit'    => $request->get_param( 'per_page' ) ? $request->get_param( 'per_page' ) : 10,
            'offset'   => $request->get_param( 'page' ) ? ( $request->get_param( 'page' ) - 1 ) * $request->get_param( 'per_page' ) : 0,
            'order'    => $request->get_param( 'order' ) ? $request->get_param( 'order' ) : 'ASC',
            'order_by' => $request->get_param( 'order_by' ) ? $request->get_param( 'order_by' ) : 'id',
            'status'   => $request->get_param( 'status' ) ? $request->get_param( 'status' ) : 'all',
        ];
        $employees      = [];
        $employee_model = new EmployeeModel();
        $employee_data  = $employee_model->all( $args );
        foreach ( $employee_data->toArray() as $employee ) {
            $item        = $this->prepare_item_for_response( $employee, $request );
            $employees[] = $this->prepare_response_for_collection( $item );
        }

        $total     = $employee_data->count();
        $max_pages = ceil( $total / (int) $args['limit'] );

        $response = new WP_REST_Response( $employees );

        $response->header( 'X-WP-Total', (string) $total );
        $response->header( 'X-WP-TotalPages', (string) $max_pages );

        return new WP_REST_Response( $response, 200 );
    }

    /**
     * Create a single item from the data in the request.
     *
     * @param \WP_REST_Request<array<string>> $request Full details about the request.
     *
     * @throws \Exception
     * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
     */
    public function create_employee( WP_REST_Request $request ) {
        global $wpdb;
        $data                                = $request->get_params();
        $salary_information                  = $data['salaryInformation'];
        $salary_information['_wpnonce']    = $data['_wpnonce'];
        $salary_information['active_from'] = $salary_information['active_from'] ?? $data['joining_date'];
        unset( $data['salaryInformation'] );
        $employee_model = new EmployeeModel();
        $validated_data = new EmployeeRequest( $data );
        if ( $validated_data->error ) {
            return new WP_Error(
                'rest_invalid_employee_data', __( 'Invalid employee data', 'pcm' ), [
                    'data'   => $validated_data->error,
                    'status' => 400,
                ]
            );
        }

        $wpdb->query( 'START TRANSACTION' );
        if ( ! empty( $data['id'] ) ) {
            $employee = $employee_model->update( $data['id'], $validated_data );
        } else {
            $employee = $employee_model->create( $validated_data );
        }

        if ( is_wp_error( $employee ) ) {
            return new WP_Error( 'rest_invalid_data', $employee->get_error_message(), [ 'status' => 400 ] );
        }

        $salary_information['employee_id'] = $data['employee_id'];
        $salary_data                         = [
            'salary_history_id',
            'employee_id',
            'basic_salary',
            'gross_salary',
            'active_from',
            'remarks',
            '_wpnonce',
        ];
        $head_details                        = $salary_information;
        $salary_information                  = array_intersect_key( $salary_information, array_flip( $salary_data ) );
        $keys_to_remove                      = [ 'basic_salary', 'remarks', 'active_from', '_wpnonce', 'employee_id', 'gross_salary', 'salary_history_id' ];
        $salary_details                      = array_filter(
            $head_details, function ( $key ) use ( $keys_to_remove ) {
				return ! in_array( $key, $keys_to_remove, true );
			}, ARRAY_FILTER_USE_KEY
        );

        $salary_information['salary_details'] = wp_json_encode( $salary_details );
        $validate_salary_data                   = new SalaryHistoryRequest( $salary_information );
        if ( $validate_salary_data->error ) {
            return new WP_Error(
                'rest_invalid_salary_data', __( 'Invalid salary data', 'pcm' ), [
                    'data'   => $validate_salary_data->error,
                    'status' => 400,
                ]
            );
        }

        $salary_history_model = new SalaryHistoryModel();
        if ( ! empty( $salary_information['salary_history_id'] ) ) {
            $salary_history = $salary_history_model->update( $salary_information['salary_history_id'], $validate_salary_data );
        } else {
            $salary_history = $salary_history_model->create( $validate_salary_data );
        }

        if ( is_wp_error( $salary_history ) ) {
            return new WP_Error( 'rest_invalid_data', $salary_history->get_error_message(), [ 'status' => 400 ] );
        }

        // If everything is fine, then commit the data.
        $wpdb->query( 'COMMIT' );

        $item     = $this->prepare_item_for_response( $employee, $request );
        $data     = $this->prepare_response_for_collection( $item );
        $response = new WP_REST_Response( $data );
        $response->set_status( 201 );

        return new WP_REST_Response( $response, 201 );
    }

    /**
     * Get a single employee.
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @param \WP_REST_Request<array<string>> $request Full details about the request.
     *
     * @throws \Exception
     * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
     */
    public function get_employee( WP_REST_Request $request ) {
        $employee_id   = $request->get_param( 'employee_id' );
        $limit         = $request->get_param( 'per_page' ) ?? '-1';
        $employee      = new EmployeeModel();
        $employee_args = [
            'order_by'  => 'employee_id',
            'order'     => 'DESC',
            'limit'     => $limit,
            'relations' => [
                [
                    'table'       => 'pay_check_mate_employee_salary_history',
                    'local_key'   => 'employee_id',
                    'foreign_key' => 'employee_id',
                    'join_type'   => 'left',
                    'fields'      => [
                        'id as salary_history_id',
                        'basic_salary',
                        'gross_salary',
                        'active_from',
                        'remarks',
                        'salary_details',
                    ],
                    'select_max'  => [
                        'active_from' => [
                            'operator' => '=',
                            'compare'  => [
                                'key'      => 'employee_id',
                                'operator' => '=',
                                'value'    => $employee_id,
                            ],
                        ],
                    ],
                    'where'       => [
                        'employee_id' => [
                            'operator' => '=',
                            'value'    => $employee_id,
                            'type'     => 'AND',
                        ],
                    ],
                ],
            ],
        ];

        $employee = $employee->find_by( [ 'employee_id' => $employee_id ], $employee_args );
        if ( is_wp_error( $employee ) ) {
            return new WP_Error( 'rest_invalid_data', $employee->get_error_message(), [ 'status' => 400 ] );
        }

        $item                                               = $this->prepare_item_for_response( $employee, $request );
        $data                                               = $this->prepare_response_for_collection( $item );
        $data['salaryInformation']['salary_history_id'] = $employee->salary_history_id;
        $data['salaryInformation']['salary_details']    = $employee->salary_details;
        $data['salaryInformation']['basic_salary']      = $employee->basic_salary;
        $data['salaryInformation']['gross_salary']      = $employee->gross_salary;
        $data['salaryInformation']['active_from']       = $employee->active_from;
        $data['salaryInformation']['remarks']           = $employee->remarks;
        $response = new WP_REST_Response( $data );

        return new WP_REST_Response( $response, 200 );
    }

    /**
     * Get a single employee salary details.
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @param \WP_REST_Request<array<string>> $request Full details about the request.
     *
     * @throws \Exception
     * @return \WP_REST_Response
     */
    public function get_employee_salary_details( WP_REST_Request $request ): WP_REST_Response {
        $employee_id    = $request->get_param( 'employee_id' );
        $employee       = new Employee( $employee_id );
        $salary_details = $employee->get_salary_history();
        $item           = $this->prepare_item_for_response( (object) $employee->get_employee(), $request );
        $data           = $this->prepare_response_for_collection( $item );

        $data['salaryInformation'] = $salary_details;
        $response                    = new WP_REST_Response( $data );

        return new WP_REST_Response( $response, 200 );
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
    public function get_employee_payslip( WP_REST_Request $request ): WP_REST_Response {
        $user_id = get_current_user_id();
        //        if ( current_user_can( 'pay_check_mate_view_payslip_list' ) ) {
        //            $model = new \PayCheckMate\Models\Employee();
        //            $args      = [
        //                'limit'    => '-1',
        //                'status'   => 1,
        //                'order_by' => 'employee_id',
        //                'order'    => 'ASC',
        //            ];
        //            $employees = $model->all( $args );
        //            foreach ( $employees as $employee ) {
        //                $emp = $model->set_data( (array) $employee );
        //                $payroll_detail = new PayrollDetails( $emp );
        //                $payroll_detail = $payroll_detail->get_payroll_details();
        //                $data[]         = $payroll_detail->data;
        //            }
        //        }

        $employee       = new Employee();
        $emp            = $employee->get_employee_by_user_id( $user_id );
        $payroll_detail = new PayrollDetails( $emp );
        $payroll_detail = $payroll_detail->get_payroll_details();

        $response = new WP_REST_Response( $payroll_detail->data );

        return new WP_REST_Response( $response, 200 );
    }

    /**
     * Update an employee.
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @param \WP_REST_Request<array<string>> $request Full details about the request.
     *
     * @throws \Exception
     * @return \WP_Error|\WP_REST_Response
     */
    public function update_employee( WP_REST_Request $request ) {
        return $this->create_employee( $request );
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
