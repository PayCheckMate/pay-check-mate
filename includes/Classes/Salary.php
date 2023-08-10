<?php

namespace PayCheckMate\Classes;

use PayCheckMate\Contracts\EmployeeInterface;
use PayCheckMate\Models\SalaryHistoryModel;

class Salary {

    private EmployeeInterface $employee;

    /**
     * @var \PayCheckMate\Models\SalaryHistoryModel
     */
    private SalaryHistoryModel $model;


    public function __construct( EmployeeInterface $employee ) {
        $this->model    = new SalaryHistoryModel();
        $this->employee = $employee;
    }

    public function get_employee_id(): string {
        return $this->employee->get_employee_id();
    }

    /**
     * Get salary history of the employee.
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @param array<string, mixed> $args
     *
     * @throws \Exception
     * @return array<object>
     */
    public function get_salary_history( array $args ): array {
        $args = wp_parse_args(
            $args,
            [
                'where' => [
                    'employee_id' => [
                        'operator' => '=',
                        'value'    => $this->get_employee_id(),
                        'type'     => 'AND',
                    ],
                ],
            ]
        );

        return $this->model->all( $args );
    }

    /**
     * Get date wise last salary.
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @param string $date
     *
     * @throws \Exception
     * @return object|\stdClass
     */
    public function get_date_wise_last_salary( string $date ): object {
        $args = [
            'where'    => [
                'employee_id' => [
                    'operator' => '=',
                    'value'    => $this->get_employee_id(),
                    'type'     => 'AND',
                ],
                'active_from' => [
                    'operator' => '<=',
                    'value'    => $date,
                    'type'     => 'AND',
                ],
            ],
            'order_by' => 'active_from',
            'order'    => 'DESC',
            'limit'    => 1,
        ];

        $salary_history = $this->get_salary_history( $args );
        if ( empty( $salary_history ) ) {
            return new \stdClass();
        }

        return $salary_history[0];
    }
}
