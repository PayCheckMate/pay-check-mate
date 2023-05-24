<?php

namespace PayCheckMate\Requests;

use PayCheckMate\Core\FormRequest;

class DepartmentFormRequest extends FormRequest {

    protected static string $nonce = 'pay_check_mate_nonce';

    protected static array $fillable = [ 'department_name' ];

    // Have to create a rule that will validate $request in next.
    protected static array $rules
        = [
            'department_name' => 'sanitize_text_field',
            'status'          => 'absint',
            'created_at'      => 'sanitize_text_field',
            'updated_at'      => 'sanitize_text_field',
        ];

}
