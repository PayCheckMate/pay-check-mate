<?php

namespace PayCheckMate\Abstracts;


use Exception;
use PayCheckMate\Contracts\ModelInterface;
use stdClass;

/**
 * Model abstraction for all the models to extend with Late Static Binding
 */
class Model implements ModelInterface {

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
	protected static $table;

	/**
	 * Get all the items.
	 *
	 * @since PAY_CHECK_MATE_SINCE
	 *
	 * @throws Exception
	 * @return object Array of stdClass objects or null if no results.
	 */
	public function all(): object {
		global $wpdb;

		$query = $wpdb->prepare( "SELECT * FROM {$this->get_table()}" );

		return (object)$wpdb->get_results( $query, OBJECT );
	}


	/**
	 * Get a single item.
	 *
	 * @since PAY_CHECK_MATE_SINCE
	 *
	 * @param int $id
	 *
	 * @throws Exception
	 * @return object|array|stdClass|null
	 */
	public function get( int $id ): object {
		global $wpdb;

		$query = $wpdb->prepare( "SELECT * FROM {$this->get_table()} WHERE id = %d", $id );

		return $wpdb->get_row( $query );
	}

	/**
	 * Create a new item.
	 *
	 * @since PAY_CHECK_MATE_SINCE
	 *
	 * @param array $data
	 *
	 * @throws Exception
	 * @return int
	 */
	public function create( array $data ): int {
		global $wpdb;

		$wpdb->insert(
			$this->get_table(),
			$data,
			[
				'%s',
				'%d',
				'%s',
				'%s',
			],
		);

		return $wpdb->insert_id;
	}

	/**
	 * Update an item.
	 *
	 * @since PAY_CHECK_MATE_SINCE
	 *
	 * @param int   $id
	 * @param array $data
	 *
	 * @throws Exception
	 * @return bool
	 */
	public function update( int $id, array $data ): bool {
		global $wpdb;

		$wpdb->update(
			$this->get_table(),
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
			],
		);

		return true;
	}

	/**
	 * Delete an item.
	 *
	 * @since PAY_CHECK_MATE_SINCE
	 *
	 * @param int $id
	 *
	 * @throws Exception
	 * @return bool
	 */
	public function delete( int $id ): bool {
		global $wpdb;

		return $wpdb->delete(
			$this->get_table(),
			[
				'id' => $id,
			],
			[
				'%d',
			],
		);
	}

	/**
	 * Get the table name.
	 *
	 * @since PAY_CHECK_MATE_SINCE
	 *
	 * @throws Exception
	 * @return string
	 */
	public function get_table(): string {
		global $wpdb;
		if ( ! static::$table ) {
			throw new Exception( 'Table name is not defined' );
		}

		return $wpdb->prefix . static::$table;
	}
}