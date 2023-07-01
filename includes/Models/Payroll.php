<?php

namespace PayCheckMate\Models;

class Payroll extends Model {

    protected static string $table = 'payroll';

    protected static array $columns = [
        'department_id'       => '%d',
        'designation_id'      => '%d',
        'payroll_date'        => '%s',
        'remarks'             => '%s',
        'status'              => '%d',
        'created_employee_id' => '%s',
        'approved_employee_id'=> '%s',
        'created_on'          => '%s',
        'updated_at'          => '%s',
    ];

    /**
     * Make crated on mutation
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @return string
     */
    public function set_created_on(): string {
        return current_time( 'mysql', true );
    }

    /**
     * Make updated at mutation
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @return string
     */
    public function set_updated_at(): string {
        return current_time( 'mysql', true );
    }

    /**
     * Get created at mutated date.
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @param string $date
     *
     * @return string
     */
    public function get_created_on( string $date ): string {
        return get_date_from_gmt( $date, 'd M Y' );
    }

    /**
     * Get payroll date mutated date.
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @param string $date
     *
     * @return string
     */
    public function get_payroll_date( string $date ): string {
        return get_date_from_gmt( $date, 'd M Y' );
    }
}
