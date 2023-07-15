<?php

namespace PayCheckMate\Models;

use PayCheckMate\Contracts\EmployeeInterface;

class Employee extends Model implements EmployeeInterface{

    protected static string $table = 'employees';

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
     * Get gross salary
     */
    public function get_gross_salary(): float {
        // @phpstan-ignore-next-line
        return doubleval( $this->gross_salary );
    }

    /**
     * Get employee joining date
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @param string $date
     *
     * @return string
     */
    public function get_joining_date( string $date ): string {
        return $date;
    }

    /**
     * Get employee joining date
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @param string $date
     *
     * @return string
     */
    public function get_joining_date_string( string $date ): string {
        return get_date_from_gmt( $date, 'd M, Y' );
    }

    /**
     * Get employee regine date
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @param string|null $date
     *
     * @return string
     */
    public function get_regine_date( ?string $date ): string {
        if ( ! $date ) {
            return 'N/A';
        }
        return get_date_from_gmt( $date, 'd M Y' );
    }

    /**
     * Get employee status
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @return string
     */
//    public function get_status(): string {
//        return $this->status ? 'Active' : 'Inactive';
//    }

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
        if(empty( $salary_head_types ) ){
            return $salary_details;
        }

        $salary         = [
            'salary_details' => [
                'earnings'    => [],
                'deductions'  => [],
                'non_taxable' => [],
            ],
        ];

        foreach ( $salary_details as $key => $amount ) {
            foreach ( array_keys( $salary_head_types ) as $type ) {
                if ( array_key_exists( $key, $salary_head_types[$type] ) ) {
                    $salary['salary_details'][$type][$key] = $amount;
                }
            }
        }

        return $salary;
    }

    public function get_employee_id(): int {
        return $this->employee_id;
    }
}
