<?php

namespace PayCheckMate\Classes;

class Salary {

    /**
     * @var \PayCheckMate\Classes\Employee
     */
    private Employee $employee;

    public function __construct( Employee $employee ) {
        $this->employee = $employee;
    }
}
