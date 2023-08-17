<?php

namespace PayCheckMate\Models;

class PayrollDetailsModel extends Model {

    protected static string $table = 'payroll_details';

    protected static array $columns = [
        'payroll_id'     => '%d',
        'employee_id'    => '%d',
        'basic_salary'   => '%d',
        'salary_details' => '%s',
        'status'         => '%d',
        'created_on'     => '%s',
        'updated_at'     => '%s',
    ];

    /**
     * @var array|string[] $search_by
     */
    protected static array $search_by = [ 'employee_id', 'payroll_id', 'basic_salary' ];

    /**
     * @var mixed
     */
    // @phpstan-ignore-next-line
    private $payroll_id = null;

    public function __construct( int $payroll_id = null ) {
        if ( $payroll_id ) {
            $this->payroll_id = $payroll_id;
        }
    }

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
     * Get employee salary heads
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @param string               $salary_details
     * @param array<array<string>> $salary_head_types
     *
     * @return array<array<string, mixed>>
     */
    public function get_salary_details( string $salary_details, array $salary_head_types ): array {
        $salary_details = json_decode( $salary_details, true );
        if ( empty( $salary_head_types ) ) {
            return [
                'salary_details' => $salary_details,
            ];
        }

        $salary = [
            'salary_details' => [
                'earnings'    => [],
                'deductions'  => [],
                'non_taxable' => [],
            ],
        ];

        foreach ( $salary_details as $key => $amount ) {
            foreach ( array_keys( $salary_head_types ) as $type ) {
                if ( array_key_exists( $key, $salary_head_types[ $type ] ) ) {
                    $salary['salary_details'][ $type ][ $key ] = $amount;
                }
            }
        }

        return $salary;
    }


    /**
     * Count employee payroll details.
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @param string $employee_id
     *
     * @throws \Exception
     * @return int
     */
    public function count_payroll_details( string $employee_id = '' ): int {
        global $wpdb;

        $where = "employee_id = $employee_id";
        if ( empty( $employee_id ) ) {
            $where = '';
        }

        $sql = "SELECT COUNT(*) FROM {$this->get_table()} WHERE $where";

        return (int) $wpdb->get_var( $sql );
    }
}
