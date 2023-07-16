<?php

namespace PayCheckMate\Contracts;

interface EmployeeInterface {

    public function get_employee_id(): int;

    public function get_user_id(): string;
}
