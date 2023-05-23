<?php

namespace PayCheckMate\Requests;

use PayCheckMate\Abstracts\FormRequest;

class DepartmentFormRequest extends FormRequest {

	protected string $nonce = 'pay-check-mate-noncess';

}