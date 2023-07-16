<?php

namespace PayCheckMate\Classes;

use PayCheckMate\Contracts\EmployeeInterface;

class Payroll {

    /**
     * @var \PayCheckMate\Contracts\EmployeeInterface
     */
    // @phpstan-ignore-next-line
    private EmployeeInterface $employee;

    public function __construct( EmployeeInterface $employee ) {
        $this->employee = $employee;
    }
}
