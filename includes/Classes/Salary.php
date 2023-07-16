<?php

namespace PayCheckMate\Classes;

use PayCheckMate\Contracts\EmployeeInterface;
use PayCheckMate\Models\SalaryHistory;

class Salary {

    private EmployeeInterface $employee;

    /**
     * @var \PayCheckMate\Models\SalaryHistory
     */
    private SalaryHistory $model;


    public function __construct( EmployeeInterface $employee ) {
        $this->model = new SalaryHistory();
        $this->employee = $employee;
    }

    public function get_employee_id(): int {
        return $this->employee->get_employee_id();
    }

    /**
     * Get last salary of the employee.
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @throws \Exception
     */
	//    public function get_last_salary() {
	//        $args = [
	//            'fields'      => [
	//                'id as salary_history_id',
	//                'basic_salary',
	//                'gross_salary',
	//                'active_from',
	//                'remarks',
	//                'salary_details',
	//            ],
	//            'select_max'  => [
	//                'active_from' => [
	//                    'operator' => '=',
	//                    'compare'  => [
	//                        'key'      => 'employee_id',
	//                        'operator' => '=',
	//                        'value'    => $this->get_employee_id(),
	//                    ],
	//                ],
	//            ],
	//            'where'       => [
	//                'employee_id' => [
	//                    'operator' => '=',
	//                    'value'    => $this->get_employee_id(),
	//                    'type'     => 'AND',
	//                ],
	//            ],
	//        ];
	//
	//        return $this->model->find_by( [ 'employee_id' => "{$this->get_employee_id()}" ], $args );
	//    }

    /**
     * Get salary history of the employee.
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @throws \Exception
     * @return object|\PayCheckMate\Models\SalaryHistory
     */
    public function get_salary_history() {
        $args = [
            'where' => [
                'employee_id' => [
                    'operator' => '=',
                    'value'    => $this->get_employee_id(),
                    'type'     => 'AND',
                ],
            ],
        ];
        return $this->model->all( $args );
    }
}
