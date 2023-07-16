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

    public function get_employee() {
        return $this->employee->data;
    }

    /**
     * @throws \Exception
     */
    public function get_last_salary() {
        $salary = new Salary( $this->employee );
        $salary->get_last_salary();
    }

    public function get_salary_history() {
        $salary = new Salary( $this->employee );
        return $salary->get_salary_history()->toArray();
    }
}
