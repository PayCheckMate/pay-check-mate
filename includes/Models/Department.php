<?php

namespace PayCheckMate\Models;

class Department extends Model {

    /**
     * The table associated with the model.
     *
     * @since  1.0.0
     *
     * @var string
     *
     * @access protected
     * @abstract
     */
    protected static string $table = 'pay_check_mate_departments';

    /**
     * @var array|string[] $fillable
     */
    protected static array $fillable = [ 'department_name' ];

    /**
     * @var array|string[] $columns
     */
    protected static array $columns = [
        'department_name' => '%s',
        'status'          => '%d',
        'created_on'      => '%s',
        'updated_at'      => '%s',
    ];

    /**
     * Make crated at mutation
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @return string
     */
    public function set_created_on() : string {
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
    public function get_created_on( string $date ) : string {
        return date( 'd-m-Y', strtotime( $date ) );
    }

}