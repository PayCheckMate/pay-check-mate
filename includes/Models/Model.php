<?php

namespace PayCheckMate\Models;


use Exception;
use PayCheckMate\Contracts\ModelInterface;
use PayCheckMate\Requests\Request;
use WP_Error;

/**
 * Base Model for all the models to extend with Late Static Binding.
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
     * @param array<string, mixed> $args
     *
     * @throws Exception
     * @return object Array of stdClass objects or null if no results.
     */
    public function all( array $args ) : object {
        global $wpdb;
        $args = wp_parse_args(
            $args, [
                'limit'  => 20,
                'offset'  => 0,
                'order'   => 'DESC',
                'orderby' => 'id',
                'status'  => '',
            ]
        );

        $where = '';
        if ( ! empty( $args['status'] ) ) {
            $where = $wpdb->prepare( 'WHERE status = %d', $args['status'] );
        }

        $query = $wpdb->prepare(
            "SELECT * FROM {$this->get_table()} {$where} ORDER BY {$args['orderby']} {$args['order']} LIMIT %d OFFSET %d",
            $args['limit'],
            $args['offset'],
        );

        return $this->process_items( $wpdb->get_results( $query ) );
    }

    /**
     * Get the total number of items.
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @param array<string> $args
     *
     * @throws Exception
     * @return int
     */
    public function count( array $args = [] ) : int {
        global $wpdb;
        $args = wp_parse_args(
            $args, [
                'status' => '',
            ]
        );

        $where = '';
        if ( ! empty( $args['status'] ) ) {
            $where = $wpdb->prepare( 'WHERE status = %d', $args['status'] );
        }

        $query = $wpdb->prepare( "SELECT COUNT(*) FROM {$this->get_table()} {$where}", );

        return $wpdb->get_var( $query );
    }


    /**
     * Get the item from the database.
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @param int $id
     *
     * @throws \Exception
     * @return object
     */
    public function find( int $id ) : object {
        global $wpdb;

        $query = $wpdb->prepare( "SELECT * FROM {$this->get_table()} WHERE id = %d", $id );

        return $this->process_item( $wpdb->get_row( $query ) );
    }

    /**
     * Create a new item.
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @param Request $data
     *
     * @throws Exception
     * @return object|WP_Error The number of rows inserted, or false on error.
     */
    public function create( Request $data ): object {
        global $wpdb;

        $data         = $data->to_array();
        $filteredData = $this->filter_data( $data );

        $wpdb->insert(
            $this->get_table(),
            $filteredData,
            $this->get_where_format( $filteredData ),
        );

        $last_id = $wpdb->insert_id;

        if ( ! $last_id ) {
            return new WP_Error( 'db_insert_error', __( 'Could not insert row into the database table.', 'pcm' ) );
        }

        return $this->find($last_id);
    }

    /**
     * Update an item.
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @param int     $id
     * @param Request $data
     *
     * @throws Exception
     * @return bool
     */
    public function update( int $id, Request $data ) : bool {
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
        // Loop through columns and, check if the model has mutations.
        // Like set_created_on, set_updated_at, etc.
        foreach ( $this->get_columns() as $key => $value ) {
            if ( method_exists( $this, "set_$key" ) ) {
                $data["$key"] = call_user_func( [ $this, "set_$key" ] );
            }
        }

        return array_intersect_key( $data, $this->get_columns() );
    }

    /**
     * Process the data before returning it to the response.
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @param array<object> $data
     *
     * @throws \Exception
     * @return object
     */
    public function process_items( array $data ) : object {
        if ( empty( $data ) ) {
            return (object) [];
        }

        foreach ( $data as &$item ) {
            $item = $this->process_item( $item );
        }

        return (object) $data;
    }

    /**
     * Process the item before returning it to the response.
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @param object $item
     *
     * @throws \Exception
     * @return object
     */
    private function process_item( object $item ) : object {
        $columns = $this->get_columns();
        foreach ( $columns as $column => $type ) {
            $method = "get_$column";
            if ( method_exists( $this, $method ) ) {
                // Check if the column has any mutation like, get_created_on, get_updated_at etc.
                $value = call_user_func( [ $this, $method ], $item->$column );
                if( is_array( $value ) ) {
                    foreach ( $value as $key => $val ) {
                        $item->$key = $val;
                    }
                    continue;
                }

                $item->$column = $value;
            }
        }

        return $item;
    }


}