<?php

namespace PayCheckMate\Models;

class SalaryHead extends Model {

    /**
     * The table associated with the model.
     *
     * @since  1.0.0
     *
     * @var string
     *
     * @access protected
     */
    protected static string $table = 'pay_check_mate_salary_heads';

    /**
     * @var array|string[] $columns
     */
    protected static array $columns = [
        'head_name'                  => '%s',
        'head_type'                  => '%s',
        'head_amount'                => '%f',
        'is_percentage'              => '%d',
        'is_variable'                => '%d',
        'is_taxable'                 => '%d',
        'is_personal_savings'        => '%d',
        'should_affect_basic_salary' => '%d',
        'priority'                   => '%d',
        'status'                     => '%d',
        'created_on'                 => '%s',
        'updated_at'                 => '%s',
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
     * Get head type string
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @param string $head_type
     *
     * @return array<string, string>
     */
    public function get_head_type( string $head_type ): array {
        return [
            'head_type'      => $head_type,
            'head_type_text' => $head_type === '1' ? __( 'Earning', 'pay-check-mate' ) : __( 'Deduction', 'pay-check-mate' ),
        ];
    }

}