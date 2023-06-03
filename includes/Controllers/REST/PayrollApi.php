<?php

namespace PayCheckMate\Controllers\REST;

use PayCheckMate\Classes\Employee;
use PayCheckMate\Models\Employee as EmployeeModel;
use PayCheckMate\Classes\SalaryHead;
use PayCheckMate\Models\SalaryHead as SalaryHeadModel;
use PayCheckMate\Contracts\HookAbleApiInterface;
use WP_REST_Response;
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

    public function create_payroll_permissions_check( $request ): bool {
        return true;
    }

    public function create_payroll( \WP_REST_Request $request ) {
        $parameters = $request->get_params();

        if ( ! isset( $parameters['date'] ) ) {
            return new WP_REST_Response( [ 'error' => 'The "date" parameter is required.' ], 400 );
        }

        $args              = [
            'status'  => 1,
            'limit'   => - 1,
            'order'   => 'ASC',
            'orderby' => 'priority',
        ];
        $salary_heads      = new SalaryHead( new SalaryHeadModel() );
        $salary_heads      = $salary_heads->all( $args );
        $salary_head_types = [];
        foreach ( $salary_heads->toArray() as $salary_head ) {
            if ( 1 === absint( $salary_head->head_type ) ) {
                $salary_head_types['earnings'][] = $salary_head;
            } else {
                $salary_head_types['deductions'][] = $salary_head;
            }
        }

        $args = [
            'status'    => 1,
            'limit'     => - 1,
            'order'     => 'ASC',
            'orderby'   => 'employee_id',
            'relations' => [
                [
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
                        'designation_name',
                    ],
                ],
                [
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
                        'department_name',
                    ],
                ],
                [
                    'table'       => 'pay_check_mate_employee_salary_history',
                    'local_key'   => 'employee_id',
                    'foreign_key' => 'employee_id',
                    'join_type'   => 'left',
                    'where'       => [
                        'active_from' => [
                            'operator' => '<=',
                            'value'    => $parameters['date'],
                        ],
                    ],
                    'fields'      => [
                        'basic_salary',
                        'gross_salary',
                        'salary_head_details',
                    ],
                ],
            ],
        ];

        $employees = new Employee( new EmployeeModel() );
        $employees = $employees->all(
            $args, [
                'id',
                'employee_id',
                'employee_first_name',
                'employee_middle_name',
                'employee_last_name',
                'designation_id',
                'department_id',
            ]
        );
        echo '<pre>';
        print_r( $employees );
        exit();
        $employee_salary_history = [
            [
                'id'              => 1,
                'employee_id'     => 1,
                'employee_name'   => 'John Doe',
                'designation'     => 'Software Engineer',
                'department'      => 'Development',
                'salary_head_ids' => [
                    'earnings'   => [
                        1 => 10000,
                        2 => 5000,
                        3 => 2000,
                        4 => 1000,
                        5 => 1000,
                        6 => 1000,
                        8 => 1000,
                    ],
                    'deductions' => [
                        9  => 1000,
                        10 => 1000,
                        11 => 1000,
                    ],
                ],
            ],
            [
                'id'              => 2,
                'employee_id'     => 2,
                'employee_name'   => 'Jane Smith',
                'designation'     => 'Software Engineer',
                'department'      => 'Development',
                'salary_head_ids' => [
                    'earnings'   => [
                        1 => 10000,
                        2 => 5000,
                        3 => 2000,
                        4 => 1000,
                        5 => 1000,
                        6 => 100,
                        8 => 1000,
                    ],
                    'deductions' => [
                        9  => 100,
                        10 => 1000,
                        11 => 1000,
                    ],
                ],
            ],
            [
                'id'              => 3,
                'employee_id'     => 3,
                'employee_name'   => 'Michael Johnson',
                'designation'     => 'Designer',
                'department'      => 'Design',
                'salary_head_ids' => [
                    'earnings'   => [
                        1 => 10000,
                        2 => 5000,
                        3 => 2000,
                        4 => 1000,
                        5 => 100,
                        6 => 1000,
                        8 => 1000,
                    ],
                    'deductions' => [
                        9  => 100,
                        10 => 1000,
                        11 => 1000,
                    ],
                ],
            ],
            [
                'id'              => 4,
                'employee_id'     => 4,
                'employee_name'   => 'Jane Smith',
                'designation'     => 'Software Engineer',
                'department'      => 'Development',
                'salary_head_ids' => [
                    'earnings'   => [
                        1 => 10000,
                        2 => 5000,
                        3 => 2000,
                        4 => 1000,
                        5 => 1000,
                        6 => 100,
                        8 => 1000,
                    ],
                    'deductions' => [
                        9  => 100,
                        10 => 1000,
                        11 => 1000,
                    ],
                ],
            ],
            [
                'id'              => 5,
                'employee_id'     => 5,
                'employee_name'   => 'John Doe',
                'designation'     => 'Software Engineer',
                'department'      => 'Development',
                'salary_head_ids' => [
                    'earnings'   => [
                        1 => 10000,
                        2 => 5000,
                        3 => 2000,
                        4 => 1000,
                        5 => 1000,
                        6 => 1000,
                        8 => 1000,
                    ],
                    'deductions' => [
                        9  => 1000,
                        10 => 1000,
                        11 => 1000,
                    ],
                ],
            ],
        ];

        return new WP_REST_Response(
            [
                'salary_head_types'       => $salary_head_types,
                'employee_salary_history' => $employee_salary_history,
            ], 200
        );
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
                'date' => [
                    'description' => __( 'The date of the payroll', 'pcm' ),
                    'type'        => 'string',
                    'format'      => 'Y-m-d',
                    'required'    => true,
                ],
            ],
        ];
    }

}
