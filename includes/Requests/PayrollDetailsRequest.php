<?php

namespace PayCheckMate\Requests;

class PayrollDetailsRequest extends Request {

    protected static string $nonce = 'pay_check_mate_nonce';

    protected static array $fillable = [ 'payroll_id', 'employee_id', 'basic_salary', 'salary_details' ];

    // Have to create a rule that will validate $request in next.
    protected static array $rules = [
        'payroll_id'     => 'absint',
        'employee_id'    => 'sanitize_text_field',
        'basic_salary'   => 'sanitize_text_field',
        'salary_details' => 'sanitize_text_field',
        'status'         => 'absint',
        'created_on'     => 'sanitize_text_field',
        'updated_at'     => 'sanitize_text_field',
    ];
}
