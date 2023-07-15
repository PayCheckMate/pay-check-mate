<?php

namespace PayCheckMate\Classes;

use Exception;
use PayCheckMate\Contracts\EmployeeInterface;

class Employee {

    /**
     * @var \PayCheckMate\Contracts\EmployeeInterface
     */
    private EmployeeInterface $employee;

    /**
     * Employee constructor.
     * @param EmployeeInterface $employee
     */
    public function __construct( EmployeeInterface $employee ) {
        $this->employee = $employee;
    }
}
