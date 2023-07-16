<?php

namespace PayCheckMate\Contracts;

interface EmployeeInterface {

    /**
     * Get employee data.
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @return array<string, mixed>
     */
    public function get_data(): array;

    public function get_employee_id(): int;

    public function get_user_id(): string;
}
