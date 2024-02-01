<?php

namespace PayCheckMate\Models;

class PayrollModel extends Model {

    protected static string $table = 'payroll';

    /**
     * @var array|string[] $search_by
     */
    protected static array $search_by = [ 'department_id', 'designation_id', 'payroll_date', 'total_salary', 'created_user_id' ];

    protected static array $columns = [
        'department_id'    => '%d',
        'designation_id'   => '%d',
        'payroll_date'     => '%s',
        'total_salary'     => '%d',
        'remarks'          => '%s',
        'status'           => '%d',
        'created_user_id'  => '%d',
        'approved_user_id' => '%d',
        'created_on'       => '%s',
        'updated_at'       => '%s',
    ];

    /**
     * Make crated on mutation
     *
     * @since 1.0.0
     *
     * @return string
     */
    public function set_created_on(): string {
        return current_time( 'mysql', true );
    }

    /**
     * Make updated at mutation
     *
     * @since 1.0.0
     *
     * @return string
     */
    public function set_updated_at(): string {
        return current_time( 'mysql', true );
    }

    /**
     * Get created at mutated date.
     *
     * @since 1.0.0
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
     * @since 1.0.0
     *
     * @param string $date
     *
     * @return array<string, string>
     */
    public function get_payroll_date( string $date ): array {
        return [
            'payroll_date'        => $date,
            'payroll_date_string' => get_date_from_gmt( $date, 'd M, Y' ),
        ];
    }

    /**
     * Get payroll by date
     *
     * @since 1.0.0
     *
     * @param string               $date
     * @param array<string, mixed> $except
     *
     * @throws \Exception
     * @return array<string, mixed>
     */
    public function get_payroll_by_date( string $date, array $except = [] ): array {
        global $wpdb;

        $date  = gmdate( 'Y-m-d', strtotime( $date ) );
        $month = gmdate( 'm', strtotime( $date ) );
        $year  = gmdate( 'Y', strtotime( $date ) );

        if ( ! empty( $except ) ) {
            $except = implode( ' AND ', array_map( function ( $value, $key ) {
                if ( is_array( $value ) ) {
                    return "{$key} NOT IN ('" . implode( "','", $value ) . "')";
                } else {
                    return "{$key} != '{$value}'";
                }
            }, $except, array_keys( $except ) ) );
        } else {
            $except = '1=1';
        }

        $sql = $wpdb->prepare( "SELECT * FROM %i WHERE MONTH(payroll_date) = %d AND YEAR(payroll_date) = %d AND {$except}", $this->get_table(), $month, $year );

        return $wpdb->get_results( $sql, ARRAY_A );
    }

    /**
     * Get crated user id.
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @param int $user_id
     *
     * @return array|void
     */
    public function get_created_user_id( int $user_id ) {
        if ( ! empty( $user_id ) ) {
            return [
                'created_user_id' => $user_id,
                'created_user'    => get_user_by( 'ID', $user_id )->display_name,
            ];
        }
    }

    /**
     * Get approved user id.
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @param int|null $user_id
     *
     * @return array|void
     */
    public function get_approved_user_id( ?int $user_id ) {
        if ( ! empty( $user_id ) ) {
            return [
                'approved_user_id' => $user_id,
                'approved_user'    => get_user_by( 'ID', $user_id )->display_name,
            ];
        }
    }
}
