<?php

namespace PayCheckMate\Classes;

use PayCheckMate\Contracts\EmployeeInterface;

class Employee {
    /**
     * @var EmployeeInterface
     */
    protected EmployeeInterface $employee;

    /**
     * Employee constructor.
     *
     * @param EmployeeInterface | int $employee
     *
     * @throws \Exception
     */
    public function __construct( $employee ) {
        if ( ! $employee ) {
            throw new \Exception( 'Employee id is required.' );
        }

        if ( is_numeric( $employee ) ) {
            $model = new \PayCheckMate\Models\Employee();
            $this->employee = $model->find_employee( $employee );
        } elseif ( $employee instanceof EmployeeInterface ) {
            $this->employee = $employee;
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
        return $this->employee->get_data();
    }


    /**
     * Get employee salary history.
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @return array<string, mixed>
     */
    public function get_salary_history(): array {
        $salary = new Salary( $this->employee );
        return $salary->get_salary_history()->toArray();
    }
}
