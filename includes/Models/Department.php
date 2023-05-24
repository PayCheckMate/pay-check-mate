<?php

namespace PayCheckMate\Models;

class Department extends Model {

	/**
	 * The table associated with the model.
	 *
	 * @since  1.0.0
	 *
	 * @var string
	 *
	 * @access protected
	 * @abstract
	 */
	protected static string $table = 'pay_check_mate_departments';

	protected static array $fillable = [ 'department_name' ];

	protected static array $columns = [
		'department_name' => '%s',
		'status'          => '%d',
		'created_at'      => '%s',
		'updated_at'      => '%s',
	];

}