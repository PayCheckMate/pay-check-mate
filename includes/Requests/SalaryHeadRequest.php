<?php

namespace PayCheckMate\Requests;

class SalaryHeadRequest extends Request {

    protected static string $nonce = 'pay_check_mate_nonce';

    protected static array $fillable = [ 'head_name', 'head_type' ];

    // Have to create a rule that will validate $request in next.
    protected static array $rules = [
        'head_name'  => 'sanitize_text_field',
        'head_type'  => 'sanitize_text_field',
        'status'     => 'sanitize_text_field',
        'created_on' => 'sanitize_text_field',
        'updated_at' => 'sanitize_text_field',
    ];

}
