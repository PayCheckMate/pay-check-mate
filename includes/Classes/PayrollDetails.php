<?php

namespace PayCheckMate\Classes;

use PayCheckMate\Contracts\EmployeeInterface;
use PayCheckMate\Models\PayrollDetailsModel;

class PayrollDetails {

    /**
     * @var \PayCheckMate\Contracts\EmployeeInterface
     */
    protected EmployeeInterface $employee;

    /**
     * @var array<object>
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
     * @param array<string, string> $args
     *
     * @throws \Exception
     * @return PayrollDetails
     */
    public function get_payroll_details( array $args ): PayrollDetails {
        $args = wp_parse_args(
            $args, [
				'limit'       => '-1',
				'offset'      => '0',
				'order_by'    => 'id',
				'order'       => 'DESC',
				'status'      => 1,
			]
        );
        $payroll_details = new PayrollDetailsModel();
        $details = $payroll_details->find_by( [ 'employee_id' => $this->employee->get_employee_id() ], $args );
        if ( empty( $details ) ) {
            $this->data = [];
            return $this;
        }

        $this->data = $details;

        return $this;
    }

    /**
     * Count employee payroll details.
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @throws \Exception
     * @return int
     */
    public function count_payroll_details(): int {
        $model = new PayrollDetailsModel();

        return $model->count_payroll_details( $this->employee->get_employee_id() );
    }
}
