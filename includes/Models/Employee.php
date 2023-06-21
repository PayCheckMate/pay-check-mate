<?php

namespace PayCheckMate\Models;

class Employee extends Model {

    protected static string $table = 'pay_check_mate_employees';

    /**
     * @var array|string[] $columns
     */
    protected static array $columns = [
        'employee_id'    => '%s',
        'department_id'  => '%d',
        'designation_id' => '%d',
        'first_name'     => '%s',
        'last_name'      => '%s',
        'email'          => '%s',
        'phone'          => '%s',
        'address'        => '%s',
        'joining_date'   => '%s',
        'regine_date'    => '%s',
        'status'         => '%d',
        'created_on'     => '%s',
        'updated_at'     => '%s',
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
     * Get employee full name
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @return string
     */
    public function get_full_name(): string {
        // @phpstan-ignore-next-line
        return $this->first_name . ' ' . $this->last_name;
    }

    /**
     * Get basic salary
     */
    public function get_basic_salary(): float {
        // @phpstan-ignore-next-line
        return doubleval( $this->basic_salary );
    }

    /**
     * Get employee joining date
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @return string
     */
    public function get_joining_date(): string {
        // @phpstan-ignore-next-line
        return get_date_from_gmt( $this->joining_date, 'd M Y' );
    }

    /**
     * Get employee regine date
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @return string
     */
    public function get_regine_date(): string {
        // @phpstan-ignore-next-line
        return get_date_from_gmt( $this->regine_date, 'd M Y' );
    }

    /**
     * Get employee status
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @return string
     */
    public function get_status(): string {
        // @phpstan-ignore-next-line
        return $this->status ? 'Active' : 'Inactive';
    }

    /**
     * Get employee salary heads
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @param string $salary_head_details
     * @param array<array<string>>  $salary_head_types
     *
     * @return array<array<string, mixed>>
     */
    public function get_salary_head_details( string $salary_head_details, array $salary_head_types ): array {
        $salary_head_details = json_decode( $salary_head_details, true );
        $salary              = [
            'salary_head_details' => [
                'earnings'    => [],
                'deductions'  => [],
                'non_taxable' => [],
            ],
        ];

        foreach ( $salary_head_details as $key => $amount ) {
            foreach ( array_keys( $salary_head_types ) as $type ) {
                if ( array_key_exists( $key, $salary_head_types[$type] ) ) {
                    $salary['salary_head_details'][$type][$key] = $amount;
                }
            }
        }

        return $salary;
    }

}