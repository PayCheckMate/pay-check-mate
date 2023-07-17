<?php

namespace PayCheckMate\Classes;

use PayCheckMate\Contracts\EmployeeInterface;

class PayrollDetails {

    /**
     * @var \PayCheckMate\Contracts\EmployeeInterface
     */
    protected EmployeeInterface $employee;
    /**
     * @var array|object|\PayCheckMate\Models\PayrollDetails
     */

    public array $data;

    public function __construct( EmployeeInterface $employee ) {
        $this->employee = $employee;
    }

    /**
     * __get.
     * @since PAY_CHECK_MATE_SINCE
     *
     * @param string $name
     *
     * @return mixed|null
     */
    public function __get( string $name ) {
        if ( isset( $this->data[ $name ] ) ) {
            return $this->data[ $name ];
        }

        return null;
    }

    /**
     * Get employee payroll details.
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @throws \Exception
     * @return PayrollDetails
     */
    public function get_payroll_details(): PayrollDetails {
        $payroll_details = new \PayCheckMate\Models\PayrollDetails();
        $details = $payroll_details->find_by( [ 'employee_id' => $this->employee->get_employee_id() ], [ 'limit' => '-1' ] );
        if ( empty( $details ) ) {
            $this->data = [];
            return $this;
        }

        $this->data = $details->toArray();

        return $this;
    }
}
