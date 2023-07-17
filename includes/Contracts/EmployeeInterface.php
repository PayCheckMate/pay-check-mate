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

    public function get_employee_id(): string;

    public function get_user_id(): string;

    /**
     * Get employee by user id.
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @param int $user_id
     *
     * @return EmployeeInterface
     */
    public function get_employee_by_user_id( int $user_id ): EmployeeInterface;
}
