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
     * @param EmployeeInterface|int|null $employee
     *
     * @throws \Exception
     */
    public function __construct( $employee = null ) {
        $this->set_employee( $employee );
    }

    /**
     * Set employee.
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @param EmployeeInterface|int|null $employee
     *
     * @return void
     */
    public function set_employee( $employee = null ) {
        if ( is_numeric( $employee ) ) {
            $model          = new \PayCheckMate\Models\Employee();
            $this->employee = $model->find_employee( $employee );
        } elseif ( $employee instanceof EmployeeInterface ) {
            $this->employee = $employee;
        } else {
            $this->employee = new \PayCheckMate\Models\Employee();
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
     * @throws \Exception
     * @return array<string, mixed>
     */
    public function get_salary_history(): array {
        $salary = new Salary( $this->employee );

        return $salary->get_salary_history()->toArray();
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
     * @return EmployeeInterface
     */
    public function get_employee_by_user_id( int $user_id ): EmployeeInterface {
        return $this->employee->get_employee_by_user_id( $user_id );
    }
}
