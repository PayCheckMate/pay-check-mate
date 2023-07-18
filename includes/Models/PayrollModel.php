<?php

namespace PayCheckMate\Models;

class PayrollModel extends Model {

    protected static string $table = 'payroll';

    protected static array $columns = [
        'department_id'       => '%d',
        'designation_id'      => '%d',
        'payroll_date'        => '%s',
        'total_salary'        => '%d',
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
     * @return array<string, string>
     */
    public function get_payroll_date( string $date ): array {
        return [
            'payroll_date' => $date,
            'payroll_date_string' => get_date_from_gmt( $date, 'd M, Y' ),
        ];
    }

    /**
     * Get payroll by date
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @param string $date
     * @param array<string, mixed> $except
     *
     * @throws \Exception
     * @return array<string, mixed>
     */
    public function get_payroll_by_date( string $date, array $except = [] ): array {
        global $wpdb;

        $date              = gmdate( 'Y-m-d', strtotime( $date ) );
        $month             = gmdate( 'm', strtotime( $date ) );
        $year              = gmdate( 'Y', strtotime( $date ) );

        if( ! empty( $except ) ) {
            $except = implode( ' AND ', array_map( function( $value, $key ) {
                return "{$key} != {$value}";
            }, $except, array_keys( $except ) ) );
        } else {
            $except = '1=1';
        }

        $sql = $wpdb->prepare( "SELECT * FROM {$this->get_table()} WHERE MONTH(payroll_date) = %d AND YEAR(payroll_date) = %d AND {$except}", $month, $year );

        return $wpdb->get_results( $sql, ARRAY_A );
    }
}