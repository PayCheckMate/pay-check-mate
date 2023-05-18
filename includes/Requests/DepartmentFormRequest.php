<?php

namespace PayCheckMate\Requests;

class DepartmentFormRequest {

	protected string $nonce = 'pay-check-mate-nonce';
	protected array $fillable = [ 'department_name' ];

}