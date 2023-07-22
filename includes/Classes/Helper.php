<?php

namespace PayCheckMate\Classes;

use PayCheckMate\Models\SalaryHeadModel;

class Helper {

    /**
     * Get all salary heads.
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @param array<string, mixed> $args
     *
     * @return array<string, mixed>
     */
    public static function get_salary_head( array $args ): array {
        $args              = wp_parse_args(
            $args, [
                'status'   => 1,
                'limit'    => '-1',
                'order'    => 'ASC',
                'order_by' => 'priority',
            ]
        );
        $salary_heads      = new SalaryHeadModel();
        $salary_heads      = $salary_heads->all( $args );
        $salary_head_types = [];
        foreach ( $salary_heads as $salary_head ) {
            if ( $salary_head->is_taxable ) {
                if ( 1 === absint( $salary_head->head_type ) ) {
                    $salary_head_types['earnings'][ $salary_head->id ] = $salary_head;
                } else {
                    $salary_head_types['deductions'][ $salary_head->id ] = $salary_head;
                }
            } else {
                $salary_head_types['non_taxable'][ $salary_head->id ] = $salary_head;
            }
        }

        return $salary_head_types;
    }
}
