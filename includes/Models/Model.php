<?php

namespace PayCheckMate\Models;


use Exception;
use PayCheckMate\Contracts\FillableInterface;
use PayCheckMate\Contracts\ModelInterface;
use PayCheckMate\Core\FormRequest;
use stdClass;

/**
 * Base Model for all the models to extend with Late Static Binding.
 */
class Model implements ModelInterface, FillableInterface {

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
    protected static string $table;

    /**
     * @var array|string[] $columns
     */
    protected static array $columns;

    /**
     * @var array|string[] $fillable
     */
    protected static array $fillable;

    /**
     * Get all the items.
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @throws Exception
     * @return object Array of stdClass objects or null if no results.
     */
    public function all() : object {
        global $wpdb;

        $query = $wpdb->prepare( "SELECT * FROM {$this->get_table()}" );

        return (object) $wpdb->get_results( $query, OBJECT );
    }


    /**
     * Get the fillable attributes.
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @param int $id
     *
     * @throws \Exception
     * @return object
     */
    public function get( int $id ) : object {
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
     * @return int The number of rows inserted, or false on error.
     */
    public function create( FormRequest $data ) : int {
        global $wpdb;

        $data         = $data->to_array();
        $filteredData = $this->filter_data( $data );
        return $wpdb->insert(
            $this->get_table(),
            $filteredData,
            $this->get_where_format( $filteredData ),
        );
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
    public function update( int $id, FormRequest $data ) : bool {
        global $wpdb;

        $data         = $data->to_array();
        $filteredData = $this->filter_data( $data );

        return $wpdb->update(
            $this->get_table(),
            $filteredData,
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
     * @return int The number of rows deleted, or false on error.
     */
    public function delete( int $id ) : int {
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
    public static function get_table() : string {
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
     * @return array<string>
     */
    public static function get_columns() : array {
        if ( empty( static::$columns ) ) {
            return [];
        }

        return static::$columns;
    }

    /**
     * Get the table's fillable column names.
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @return array<string>
     */
    public function fillable() : array {
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
     * @param array<string> $data
     *
     * @return array<string>
     */
    private function get_where_format( $data ) : array {
        $format = [];
        foreach ( $data as $key => $value ) {
            if ( isset( static::$columns[$key] ) ) {
                $format[] = static::$columns[$key];
            }
        }

        return $format;
    }

    /**
     * Filter the data to only include the available columns.
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @param array<string> $data
     *
     * @throws Exception
     * @return array<string>
     */
    private function filter_data( array $data ) : array {
        return array_intersect_key( $data, $this->get_columns() );
    }

}