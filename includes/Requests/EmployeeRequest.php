<?php

namespace PayCheckMate\Requests;

class EmployeeRequest extends Request {

    protected static string $nonce = 'pay_check_mate_nonce';

    protected static array $fillable = [ 'department_id', 'designation_id', 'first_name', 'last_name', 'email', 'joining_date' ];

    // Have to create a rule that will validate $request in next.
    protected static array $rules = [
        'employee_id'         => 'sanitize_text_field',
        'department_id'       => 'absint',
        'designation_id'      => 'absint',
        'user_id'             => 'absint',
        'first_name'          => 'sanitize_text_field',
        'last_name'           => 'sanitize_text_field',
        'email'               => 'sanitize_email',
        'phone'               => 'sanitize_text_field',
        'bank_name'           => 'sanitize_text_field',
        'bank_account_number' => 'sanitize_text_field',
        'tax_number'          => 'sanitize_text_field',
        'address'             => 'sanitize_text_field',
        'joining_date'        => 'sanitize_text_field',
        'resign_date'         => 'sanitize_text_field',
        'status'              => 'absint',
        'created_on'          => 'sanitize_text_field',
        'updated_at'          => 'sanitize_text_field',
    ];
}
