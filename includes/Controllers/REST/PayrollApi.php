<?php

namespace PayCheckMate\Controllers\REST;

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

        $salary_heads = [
            'earnings'   => [
                [
                    'id'        => 1,
                    'head_name' => 'Basic',
                    'head_type' => '1',
                ],
                [
                    'id'        => 2,
                    'head_name' => 'House Rent',
                    'head_type' => '1',
                ],
                [
                    'id'        => 3,
                    'head_name' => 'Medical',
                    'head_type' => '1',
                ],
                [
                    'id'        => 4,
                    'head_name' => 'Conveyance',
                    'head_type' => '1',
                ],
                [
                    'id'        => 5,
                    'head_name' => 'Allowance',
                    'head_type' => '1',
                ],
                [
                    'id'        => 6,
                    'head_name' => 'Provident Fund',
                    'head_type' => '1',
                ],
                [
                    'id'        => 8,
                    'head_name' => 'Others',
                    'head_type' => '1',
                ],
            ],
            'deductions' => [
                [
                    'id'        => 9,
                    'head_name' => 'Provident Fund',
                    'head_type' => '2',
                ],
                [
                    'id'        => 10,
                    'head_name' => 'Tax',
                    'head_type' => '2',
                ],
                [
                    'id'        => 11,
                    'head_name' => 'Others',
                    'head_type' => '2',
                ],
            ],
        ];

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

        return new WP_REST_Response( [
            'salary_heads'           => $salary_heads,
            'employee_salary_history' => $employee_salary_history,
        ], 200 );
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
