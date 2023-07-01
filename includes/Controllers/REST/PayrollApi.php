<?php

namespace PayCheckMate\Controllers\REST;

use PayCheckMate\Classes\Employee;
use PayCheckMate\Classes\Payroll;
use PayCheckMate\Classes\PayrollDetails;
use PayCheckMate\Models\Payroll as PayrollModel;
use PayCheckMate\Models\PayrollDetails as PayrollDetailsModel;
use PayCheckMate\Models\Employee as EmployeeModel;
use PayCheckMate\Classes\SalaryHead;
use PayCheckMate\Models\SalaryHead as SalaryHeadModel;
use PayCheckMate\Contracts\HookAbleApiInterface;
use PayCheckMate\Requests\PayrollDetailsRequest;
use PayCheckMate\Requests\PayrollRequest;
use WP_Error;
use WP_REST_Request;
use WP_REST_Response;
use WP_REST_Server;

class PayrollApi extends RestController implements HookAbleApiInterface {

    public function __construct() {
        $this->namespace = 'pay-check-mate/v1';
        $this->rest_base = 'payrolls';
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
            '/' . $this->rest_base, [
                [
                    'methods'             => WP_REST_Server::READABLE,
                    'callback'            => [ $this, 'get_payrolls' ],
                    'permission_callback' => [ $this, 'get_payrolls_permissions_check' ],
                    'args'                => $this->get_collection_params(),
                ],
                [
                    'methods'             => WP_REST_Server::CREATABLE,
                    'callback'            => [ $this, 'generate_payroll' ],
                    'permission_callback' => [ $this, 'generate_payroll_permissions_check' ],
                    'args'                => $this->get_endpoint_args_for_item_schema( \WP_REST_Server::CREATABLE ),
                ],
                'schema' => [ $this, 'get_public_item_schema' ],
            ]
        );
        register_rest_route(
            $this->namespace,
            '/' . $this->rest_base . '/save-payroll', [
                [
                    'methods'             => WP_REST_Server::CREATABLE,
                    'callback'            => [ $this, 'save_payroll' ],
                    'permission_callback' => [ $this, 'save_payroll_permissions_check' ],
                    'args'                => $this->get_endpoint_args_for_item_schema( \WP_REST_Server::CREATABLE ),
                ],
                'schema' => [ $this, 'get_public_item_schema' ],
            ]
        );
        register_rest_route(
            $this->namespace,
            '/' . $this->rest_base . '/(?P<id>[\d]+)', [
                [
                    'methods'             => WP_REST_Server::READABLE,
                    'callback'            => [ $this, 'get_payroll' ],
                    'permission_callback' => [ $this, 'get_payroll_permissions_check' ],
                    'args'                => $this->get_collection_params(),
                ],
                [
                    'methods'             => WP_REST_Server::EDITABLE,
                    'callback'            => [ $this, 'update_payroll' ],
                    'permission_callback' => [ $this, 'update_payroll_permissions_check' ],
                    'args'                => $this->get_endpoint_args_for_item_schema( \WP_REST_Server::EDITABLE ),
                ],
                [
                    'methods'             => WP_REST_Server::DELETABLE,
                    'callback'            => [ $this, 'delete_payroll' ],
                    'permission_callback' => [ $this, 'delete_payroll_permissions_check' ],
                    'args'                => $this->get_endpoint_args_for_item_schema( \WP_REST_Server::DELETABLE ),
                ],
                'schema' => [ $this, 'get_public_item_schema' ],
            ]
        );
    }

    public function get_payrolls_permissions_check(): bool {
        return true;
    }

    public function generate_payroll_permissions_check(): bool {
        return true;
    }

    public function save_payroll_permissions_check(): bool {
        return true;
    }

    public function get_payroll_permissions_check(): bool {
        return true;
    }

    public function update_payroll_permissions_check(): bool {
        return true;
    }

    public function delete_payroll_permissions_check(): bool {
        return true;
    }

    /**
     * Get a collection of items
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @param WP_REST_Request<array<string>> $request Full details about the request.
     *
     * @return \WP_REST_Response Response object on success, or WP_Error object on failure.
     */
    public function get_payrolls( WP_REST_Request $request ): WP_REST_Response {
        $args = [
            'status'   => $request->get_param( 'status' ) ? sanitize_text_field( $request->get_param( 'status' ) ) : 'all',
            'limit'    => $request->get_param( 'per_page' ) ? sanitize_text_field( $request->get_param( 'per_page' ) ) : 10,
            'page'     => $request->get_param( 'page' ) ? sanitize_text_field( $request->get_param( 'page' ) ) : 1,
            'order'    => $request->get_param( 'order' ) ? sanitize_text_field( $request->get_param( 'order' ) ) : 'DESC',
            'order_by' => $request->get_param( 'order_by' ) ? sanitize_text_field( $request->get_param( 'order_by' ) ) : 'id',
            'search'   => $request->get_param( 'search' ) ? sanitize_text_field( $request->get_param( 'search' ) ) : '',
        ];

        $payrolls = new Payroll( new PayrollModel() );
        $payrolls = $payrolls->all( $args );

        $data = [];
        foreach ( $payrolls->toArray() as $payroll ) {
            $item   = $this->prepare_item_for_response( $payroll, $request );
            $data[] = $this->prepare_response_for_collection( $item );
        }

        $total     = $payrolls->count();
        $max_pages = ceil( $total / (int) $args['limit'] );

        $response = new WP_REST_Response( $data );

        $response->header( 'X-WP-Total', (string) $total );
        $response->header( 'X-WP-TotalPages', (string) $max_pages );

        return new WP_REST_Response( $response, 200 );
    }

    /**
     * Create payroll.
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @param WP_REST_Request<array<string>> $request Full details about the request.
     *
     * @return \WP_REST_Response
     */
    public function generate_payroll( WP_REST_Request $request ): WP_REST_Response {
        $parameters = $request->get_params();

        if ( ! isset( $parameters['payroll_date'] ) ) {
            return new WP_REST_Response( [ 'error' => 'The "date" parameter is required.' ], 400 );
        }

        $date              = gmdate( 'Y-m-d', strtotime( $parameters['payroll_date'] ) );
        $month             = gmdate( 'm', strtotime( $date ) );
        $year              = gmdate( 'Y', strtotime( $date ) );
        $last_day_of_month = gmdate( 't', strtotime( $date ) );

        $parameters['payroll_date'] = gmdate( 'Y-m-d', strtotime( $year . '-' . $month . '-' . $last_day_of_month ) );

        $args              = [
            'status'   => 1,
            'limit'    => '-1',
            'order'    => 'ASC',
            'order_by' => 'priority',
        ];
        $salary_heads      = new SalaryHead( new SalaryHeadModel() );
        $salary_heads      = $salary_heads->all( $args );
        $salary_head_types = [];
        foreach ( $salary_heads->toArray() as $salary_head ) {
            if ( $salary_head->is_taxable ) {
                if ( 1 === absint( $salary_head->head_type ) ) {
                    $salary_head_types['earnings'][ $salary_head->id ] = $salary_head;
                } else {
                    $salary_head_types['deductions'][ $salary_head->id ] = $salary_head;
                }
            } else {
                $salary_head_types['non_taxable'][ $salary_head->id ] = $salary_head;
            }
        }

        $department_args = [
            'table'       => 'pay_check_mate_departments',
            'local_key'   => 'department_id',
            'foreign_key' => 'id',
            'join_type'   => 'left',
            'where'       => [
                'status' => [
                    'operator' => '=',
                    'value'    => 1,
                ],
            ],
            'fields'      => [
                'name as department_name',
            ],
        ];

        $designation_args = [
            'table'       => 'pay_check_mate_designations',
            'local_key'   => 'designation_id',
            'foreign_key' => 'id',
            'join_type'   => 'left',
            'where'       => [
                'status' => [
                    'operator' => '=',
                    'value'    => 1,
                ],
            ],
            'fields'      => [
                'name as designation_name',
            ],
        ];

        if ( ! empty( $parameters['department_id'] ) ) {
            $department_args['where']['id'] = [
                'operator' => '=',
                'value'    => $parameters['department_id'],
            ];
        }

        if ( ! empty( $parameters['designation_id'] ) ) {
            $designation_args['where']['id'] = [
                'operator' => '=',
                'value'    => $parameters['designation_id'],
            ];
        }

        $args = [
            'status'          => 1,
            'limit'           => - 1,
            'order'           => 'ASC',
            'order_by'        => 'employee_id',
            'mutation_fields' => [
                'full_name',
            ],
            'where'           => [
                'joining_date' => [
                    'operator' => '<=',
                    'value'    => $parameters['payroll_date'],
                    'type'     => 'AND',
                ],
            ],
            'relations'       => [
                $designation_args,
                $department_args,
                [
                    'table'       => 'pay_check_mate_employee_salary_history',
                    'local_key'   => 'employee_id',
                    'foreign_key' => 'employee_id',
                    'join_type'   => 'left',
                    'where'       => [
                        'status' => [
                            'operator' => '=',
                            'value'    => 1,
                            'type'     => 'AND',
                        ],
                    ],
                    'select_max'  => [
                        'active_from' => [
                            'operator' => '<=',
                            'value'    => $parameters['payroll_date'],
                            'compare'  => [
                                'key'      => 'active_from',
                                'operator' => '<=',
                                'value'    => $parameters['payroll_date'],
                            ],
                        ],
                    ],
                    'fields'      => [
                        'basic_salary',
                        'salary_head_details',
                        'active_from',
                    ],
                ],
            ],
        ];

        $employees = new Employee( new EmployeeModel() );
        $employees = $employees->all(
            $args, [
				'id',
				'employee_id',
				'first_name',
				'last_name',
				'designation_id',
				'department_id',
			], $salary_head_types
        );

        return new WP_REST_Response(
            [
                'salary_head_types'       => $salary_head_types,
                'employee_salary_history' => $employees->toArray(),
            ], 200
        );
    }

    /**
     * Saves the payroll.
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @param WP_REST_Request<array<string>> $request Full details about the request.
     *
     * @throws \Exception
     *
     * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
     */
    public function save_payroll( WP_REST_Request $request ) {
        global $wpdb;
        $parameters                        = $request->get_params();
        $parameters['created_employee_id'] = get_current_user_id();

        $validated_data = new PayrollRequest( $parameters );
        if ( $validated_data->error ) {
            return new WP_Error(
                400, implode( ', ', $validated_data->error ), [
                    'status' => 400,
                    'error'  => $validated_data->error,
                ]
            );
        }

        // Start the transaction.
        $wpdb->query( 'START TRANSACTION' );

        $payroll          = new Payroll( new PayrollModel() );
        $inserted_payroll = $payroll->create( $validated_data );
        if ( is_wp_error( $inserted_payroll ) ) {
            return new WP_Error( 400, $inserted_payroll->get_error_message(), [ 'status' => 400 ] );
        }

        $payroll_details    = new PayrollDetails( new PayrollDetailsModel() );
        $details_parameters = $parameters['employee_salary_history'];
        $data['_wpnonce']   = $parameters['_wpnonce'];
        $data['payroll_id'] = $inserted_payroll->id;
        foreach ( $details_parameters as $detail ) {
            $data['employee_id']  = $detail['employee_id'];
            $data['basic_salary'] = $detail['basic_salary'];
            $merged_array         = [];
            array_walk_recursive(
                $detail['salary_head_details'], function ( $value, $key ) use ( &$merged_array ) {
					$merged_array[ $key ] = $value;
				}
            );
            $data['salary_details'] = wp_json_encode( $merged_array );

            $validated_data = new PayrollDetailsRequest( $data );
            if ( $validated_data->error ) {
                return new WP_Error(
                    400, implode( ', ', $validated_data->error ), [
                        'status' => 400,
                        'error'  => $validated_data->error,
                    ]
                );
            }

            $inserted_payroll_details = $payroll_details->create( $validated_data );
        }

        // If everything is fine, then commit the data.
        $wpdb->query( 'COMMIT' );

        return new WP_REST_Response(
            [
                'message' => __( 'Payroll saved successfully.', 'pcm' ),
            ], 200
        );
    }

    /**
     * Updates the payroll.
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @param \WP_REST_Request<array<string>> $request Full details about the request.
     *
     * @throws \Exception
     * @return \WP_REST_Response|\WP_Error
     */
    public function update_payroll( WP_REST_Request $request ) {
        $validated_data = new PayrollRequest( $request->get_params() );
        if ( ! empty( $validated_data->error ) ) {
            return new WP_Error( 500, __( 'Invalid data.', 'pcm' ), [ $validated_data->error ] );
        }

        // Do not update the payroll date.
        unset( $validated_data->payroll_date );
        $payroll = new Payroll( new PayrollModel() );
        if ( ! $payroll->update( $request->get_param( 'id' ), $validated_data ) ) {
            return new WP_Error( 500, __( 'Could not update designation.', 'pcm' ) );
        }

        $payroll  = $payroll->find( $request->get_param( 'id' ) );
        $item     = $this->prepare_item_for_response( $payroll, $request );
        $data     = $this->prepare_response_for_collection( $item );
        $response = new WP_REST_Response( $data );
        $response->set_status( 201 );

        return new WP_REST_Response( $response, 201 );
    }

    /**
     * Retrieves the item's schema, conforming to JSON Schema.
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @return array<string, mixed> Item schema data.
     */
    public function get_item_schema(): array {
        return [
            '$schema'    => 'http://json-schema.org/draft-04/schema#',
            'title'      => 'designation',
            'type'       => 'object',
            'properties' => [
                'id'                   => [
                    'description' => __( 'Unique identifier for the payroll.', 'pcm' ),
                    'type'        => 'integer',
                    'context'     => [ 'view', 'edit', 'embed' ],
                    'readonly'    => true,
                ],
                'payroll_date'         => [
                    'description' => __( 'The date of the payroll', 'pcm' ),
                    'type'        => 'string',
                    'format'      => 'Y-m-d',
                    'required'    => true,
                    'readonly'    => true,
                    'context'     => [ 'view', 'embed' ],
                ],
                'designation_id'       => [
                    'description' => __( 'Unique identifier for the designation.', 'pcm' ),
                    'type'        => 'integer',
                    'required'    => true,
                ],
                'department_id'        => [
                    'description' => __( 'Unique identifier for the department.', 'pcm' ),
                    'type'        => 'integer',
                    'required'    => true,
                ],
                'remarks'              => [
                    'description' => __( 'Remarks for the payroll.', 'pcm' ),
                    'type'        => 'string',
                ],
                'status'               => [
                    'description' => __( 'Status of the payroll.', 'pcm' ),
                    'type'        => 'integer',
                ],
                'created_employee_id'  => [
                    'description' => __( 'Unique identifier for the employee who created the payroll.', 'pcm' ),
                    'type'        => 'integer',
                ],
                'approved_employee_id' => [
                    'description' => __( 'Unique identifier for the employee who approved the payroll.', 'pcm' ),
                    'type'        => 'integer',
                ],
                'created_on'           => [
                    'description' => __( 'The date the payroll was created.', 'pcm' ),
                    'type'        => 'string',
                    'format'      => 'date-time',
                    'readonly'    => true,
                ],
                'updated_at'           => [
                    'description' => __( 'The date the payroll was last updated.', 'pcm' ),
                    'type'        => 'string',
                    'format'      => 'date-time',
                    'readonly'    => true,
                ],
            ],
        ];
    }
}
