<?php

namespace PayCheckMate\Models;

class Employee extends Model {

    protected static string $table = 'pay_check_mate_employees';

    /**
     * @var array|string[] $columns
     */
    protected static array $columns = [
        'department_id'         => '%d',
        'designation_id'        => '%d',
        'employee_first_name'   => '%s',
        'employee_middle_name'  => '%s',
        'employee_last_name'    => '%s',
        'employee_email'        => '%s',
        'employee_phone'        => '%s',
        'employee_address'      => '%s',
        'employee_joining_date' => '%s',
        'employee_regine_date'  => '%s',
        'status'                => '%d',
        'created_on'            => '%s',
        'updated_at'            => '%s',
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
        return $this->employee_first_name . ' ' . $this->employee_last_name;
    }

    /**
     * Get employee joining date
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @return string
     */
    public function get_joining_date(): string {
        return get_date_from_gmt( $this->employee_joining_date, 'd M Y' );
    }

    /**
     * Get employee regine date
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @return string
     */
    public function get_regine_date(): string {
        return get_date_from_gmt( $this->employee_regine_date, 'd M Y' );
    }

    /**
     * Get employee status
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @return string
     */
    public function get_status(): string {
        return $this->status ? 'Active' : 'Inactive';
    }

    /**
     * Get employee salary heads
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @return string
     */
    //    public function get_salary_heads() : string {
    //
    //    }

}