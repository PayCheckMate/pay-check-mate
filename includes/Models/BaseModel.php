<?php

namespace PayCheckMate\Models;


use Exception;
use PayCheckMate\Abstracts\FormRequest;
use PayCheckMate\Contracts\FillableInterface;
use PayCheckMate\Contracts\ModelInterface;
use stdClass;

/**
 * Base Model for all the models to extend with Late Static Binding.
 */
class BaseModel implements ModelInterface, FillableInterface {

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

	protected static $columns;

	protected static $fillable;

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

		return (object) $wpdb->get_results( $query, OBJECT );
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
	 * @param FormRequest $data
	 *
	 * @throws Exception
	 * @return int
	 */
	public function create( FormRequest $data ): int {
		global $wpdb;
		$data = $data->to_array();

		$wpdb->insert(
			$this->get_table(),
			$data,
			$this->get_where_format( $data ),
		);

		return $wpdb->insert_id;
	}

	/**
	 * Update an item.
	 *
	 * @since PAY_CHECK_MATE_SINCE
	 *
	 * @param int         $id
	 * @param FormRequest $data
	 *
	 * @throws Exception
	 * @return bool
	 */
	public function update( int $id, FormRequest $data ): bool {
		global $wpdb;

		$data = $data->to_array();
		unset( $data['id'], $data['_wpnonce'] );

		return $wpdb->update(
			$this->get_table(),
			$data,
			[
				'id' => $id,
			],
			$this->get_where_format( $data ),
			[
				'%d',
			],
		);
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
	public static function get_table(): string {
		global $wpdb;
		if ( empty( static::$table ) ) {
			throw new Exception( 'Table name is not defined' );
		}

		return $wpdb->prefix . static::$table;
	}

	/**
	 * Get the table column names.
	 *
	 * @since PAY_CHECK_MATE_SINCE
	 *
	 * @throws Exception
	 * @return array
	 */
	public static function get_columns(): array {
		if ( empty( static::$columns ) ) {
			throw new Exception( 'Table columns are not defined' );
		}

		return static::$columns;
	}

	/**
	 * Get the table's fillable column names.
	 *
	 * @since PAY_CHECK_MATE_SINCE
	 *
	 * @return array
	 */
	public function fillable(): array {
		if ( ! static::$fillable ) {
			return [];
		}

		return static::$fillable;
	}

	/**
	 * Get the table's where format.
	 *
	 * @since PAY_CHECK_MATE_SINCE
	 *
	 * @param $data
	 *
	 * @return array
	 */
	private function get_where_format( $data ): array {
		$format = [];
		foreach ( $data as $key => $value ) {
			if ( isset( static::$columns[ $key ] ) ) {
				$format[] = static::$columns[ $key ];
			}
		}

		return $format;
	}
}