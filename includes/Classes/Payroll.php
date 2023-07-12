<?php

namespace PayCheckMate\Classes;

use PayCheckMate\Traits\CrudTrait;

class Payroll {
    use CrudTrait;

    /**
     * Get payroll by date.
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @param string $date
     * @param array<string, mixed> $except
     *
     * @return array<string, mixed>
     */
    public function get_payroll_by_date( string $date, array $except = [] ): array {
        // @phpstan-ignore-next-line
        return $this->model->get_payroll_by_date( $date, $except );
    }
}
