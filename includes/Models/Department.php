<?php

namespace WpPayroll\Models;

class Department {
	/**
	 * Department table name.
	 *
	 * @var string table name.
	 */
	protected string $table = 'departments';

	public function __construct() {
		global $wpdb;

		$this->table = $wpdb->prefix . 'wp_payroll_' . $this->table;
	}

	/**
	 * Get all the departments.
	 *
	 * @since WP_PAYROLL_SINCE
	 *
	 * @return array
	 */
	public function get_departments(): array {
		global $wpdb;

		$query = "SELECT * FROM {$this->table}";

		return $wpdb->get_results( $query, ARRAY_A );
	}

	/**
	 * Get a single department.
	 *
	 * @since WP_PAYROLL_SINCE
	 *
	 * @param int $id department id.
	 *
	 * @return array
	 */
	public function get_department( int $id ): array {
		global $wpdb;

		$query = "SELECT * FROM {$this->table} WHERE id = %d";

		return $wpdb->get_row( $wpdb->prepare( $query, $id ), ARRAY_A );
	}

	/**
	 * Create a new department.
	 *
	 * @since WP_PAYROLL_SINCE
	 *
	 * @param array $data department data.
	 *
	 * @return int
	 */
	public function create_department( array $data ): int {
		global $wpdb;

		$wpdb->insert(
			$this->table,
			$data,
			[
				'%s',
				'%d',
				'%s',
				'%s',
			]
		);

		return $wpdb->insert_id;
	}

	/**
	 * Update a department.
	 *
	 * @since WP_PAYROLL_SINCE
	 *
	 * @param int   $id   department id.
	 * @param array $data department data.
	 *
	 * @return int
	 */
	public function update_department( int $id, array $data ): int {
		global $wpdb;

		$wpdb->update(
			$this->table,
			$data,
			[
				'id' => $id,
			],
			[
				'%s',
				'%d',
				'%s',
				'%s',
			],
			[
				'%d',
			]
		);

		return $wpdb->insert_id;
	}

	/**
	 * Delete a department.
	 *
	 * @since WP_PAYROLL_SINCE
	 *
	 * @param int $id department id.
	 *
	 * @return int
	 */
	public function delete_department( int $id ): int {
		global $wpdb;

		return $wpdb->delete(
			$this->table,
			[
				'id' => $id,
			],
			[
				'%d',
			]
		);
	}
}