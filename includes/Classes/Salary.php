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

    public function get_salary_heads() {

    }

}
