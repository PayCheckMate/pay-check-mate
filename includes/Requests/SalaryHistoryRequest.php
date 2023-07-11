<?php

namespace PayCheckMate\Requests;

class SalaryHistoryRequest extends Request {

    protected static string $nonce = 'pay_check_mate_nonce';

    protected static array $fillable = [ 'employee_id', 'basic_salary', 'gross_salary', 'salary_details', 'active_from' ];

    // Have to create a rule that will validate $request in next.
    protected static array $rules = [
        'employee_id'    => 'absint',
        'basic_salary'   => 'absint',
        'gross_salary'   => 'absint',
        'salary_details' => 'sanitize_text_field',
        'status'         => 'absint',
        'active_from'    => 'sanitize_text_field',
        'created_on'     => 'sanitize_text_field',
        'updated_at'     => 'sanitize_text_field',
    ];
}
