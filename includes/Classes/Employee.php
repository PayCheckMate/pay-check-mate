<?php

namespace PayCheckMate\Classes;

use PayCheckMate\Models\DepartmentModel;
use PayCheckMate\Models\DesignationModel;
use PayCheckMate\Models\SalaryHistoryModel;
use WP_Error;
use WP_REST_Request;
use PayCheckMate\Contracts\EmployeeInterface;
use PayCheckMate\Models\EmployeeModel;

class Employee implements EmployeeInterface {

    /**
     * @var array<string, mixed>
     */
    protected array $employee;

    protected EmployeeModel $model;

    /**
     * Employee constructor.
     *
     * @param array<string, mixed>|int|null $employee
     *
     * @throws \Exception
     */
    public function __construct( $employee = null ) {
        $this->model = new EmployeeModel();
        $this->set_employee( $employee );
    }

    /**
     * Set employee.
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @param array<string, mixed>|int|null $employee
     *
     * @throws \Exception
     * @return void
     */
    public function set_employee( $employee = null ) {
        if ( is_numeric( $employee ) ) {
            $model          = new EmployeeModel();
            $employee       = $model->find_employee( $employee );
            $this->employee = $employee->get_data();
        } elseif ( is_array( $employee ) ) {
            $this->employee = $employee;
        } else {
            $this->employee = [];
        }
    }

    /**
     * Get employee data.
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @return array<string, mixed>
     */
    public function get_employee(): array {
        return $this->employee;
    }


    /**
     * Get employee salary history.
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @param array<string, mixed> $args
     *
     * @throws \Exception
     * @return array<string, mixed>
     */
    public function get_salary_history( array $args ): array {
        $salary = new Salary( $this );

        return $salary->get_salary_history( $args );
    }

    /**
     * Get employee by user id.
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @param int $user_id
     *
     * @throws \Exception
     *
     * @return Employee
     */
    public function get_employee_by_user_id( int $user_id ): Employee {
        $employee       = $this->model->get_employee_by_user_id( $user_id );
        $this->employee = $employee->get_data();

        return $this;
    }

    /**
     * Get all employees.
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @param WP_REST_Request<array<string>> $request Full details about the request.
     *
     * @throws \Exception
     * @return array<string, mixed>
     */
    public function get_all_employees( WP_REST_Request $request ): array {
        $args = [
            'limit'     => $request->get_param( 'per_page' ) ? $request->get_param( 'per_page' ) : 1,
            'offset'    => $request->get_param( 'page' ) ? ( $request->get_param( 'page' ) - 1 ) * $request->get_param( 'per_page' ) : 0,
            'order'     => $request->get_param( 'order' ) ? $request->get_param( 'order' ) : 'ASC',
            'order_by'  => $request->get_param( 'order_by' ) ? $request->get_param( 'order_by' ) : 'id',
            'status'    => $request->get_param( 'status' ) ? $request->get_param( 'status' ) : 'all',
            'search'    => $request->get_param( 'search' ) ? $request->get_param( 'search' ) : '',
            'relations' => [
                [
                    'table'       => DesignationModel::get_table(),
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
                ],
                [
                    'table'       => DepartmentModel::get_table(),
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
                ],
            ],
        ];

        $employee_model = new EmployeeModel();

        return $employee_model->all( $args );
    }

    /**
     * Get employee id.
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @return string
     */
    public function get_employee_id(): string {
        if ( ! empty( $this->employee['employee_id'] ) ) {
            return $this->employee['employee_id'];
        }

        return '0';
    }

    /**
     * Get user id.
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @return int
     */
    public function get_user_id(): int {
        if ( ! empty( $this->employee['user_id'] ) ) {
            return $this->employee['user_id'];
        }

        return 0;
    }

    /**
     * Count all employees.
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @param \WP_REST_Request<array<string>> $request Full details about the request.
     *
     * @throws \Exception
     * @return int
     */
    public function count_employee( WP_REST_Request $request ): int {
        $args = [
            'limit'    => $request->get_param( 'per_page' ) ? $request->get_param( 'per_page' ) : 1,
            'offset'   => $request->get_param( 'page' ) ? ( $request->get_param( 'page' ) - 1 ) * $request->get_param( 'per_page' ) : 0,
            'order'    => $request->get_param( 'order' ) ? $request->get_param( 'order' ) : 'ASC',
            'order_by' => $request->get_param( 'order_by' ) ? $request->get_param( 'order_by' ) : 'id',
            'status'   => $request->get_param( 'status' ) ? $request->get_param( 'status' ) : 'all',
            'search'   => $request->get_param( 'search' ) ? $request->get_param( 'search' ) : '',
        ];

        $employee_model = new EmployeeModel();

        return $employee_model->count( $args );
    }

    /**
     * Get an employee with salary history.
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @param int                             $employee_id
     * @param \WP_REST_Request<array<string>> $request Full details about the request.
     *
     * @throws \Exception
     * @return \WP_Error|object
     */
    public function get_an_employee_with_salary_history( int $employee_id, WP_REST_Request $request ) {
        $limit         = $request->get_param( 'per_page' ) ?? '-1';
        $employee      = new EmployeeModel();
        $employee_args = [
            'order_by'  => 'employee_id',
            'order'     => 'DESC',
            'limit'     => $limit,
            'relations' => [
                [
                    'table'       => SalaryHistoryModel::get_table(),
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
                [
                    'table'       => DesignationModel::get_table(),
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
                ],
                [
                    'table'       => DepartmentModel::get_table(),
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
                ],
            ],
        ];

        $employee = $employee->find( $employee_id, $employee_args );
        if ( is_wp_error( $employee ) ) {
            return new WP_Error( 'rest_invalid_data', $employee->get_error_message(), [ 'status' => 400 ] );
        }

        return $employee;
    }

    /**
     * Update employee.
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @param int    $employee_id
     * @param string $status
     *
     * @throws \Exception
     * @return object|\WP_Error
     */
    public function update_employee_status( int $employee_id, string $status ) {
        return $this->model->update_by( [ 'employee_id' => $employee_id ], [ 'status' => $status ] );
    }

    /**
     * Resign employee.
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @param int    $employee_id
     * @param string $resign_date
     *
     * @throws \Exception
     * @return object|\WP_Error
     */
    public function resign_employee( int $employee_id, string $resign_date ) {
        $data = [
            'status' => 0,
            'resign_date' => $resign_date,
        ];
        return $this->model->update_by( [ 'employee_id' => $employee_id ], $data );
    }
}
