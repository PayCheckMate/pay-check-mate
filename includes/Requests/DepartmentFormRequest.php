<?php

namespace PayCheckMate\Requests;

use PayCheckMate\Abstracts\FormRequest;

class DepartmentFormRequest extends FormRequest {

	protected string $nonce = 'pay_check_mate_nonce';

	// Have to create a rule that will validate $request in next.
	protected array $rules = [
		'department_name' => 'sanitize_text_field',
		'status'          => 'absint',
		'created_at'      => 'sanitize_text_field',
		'updated_at'      => 'sanitize_text_field',
	];
}