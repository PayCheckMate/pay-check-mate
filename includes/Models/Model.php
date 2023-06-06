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

    protected object $results;
    protected object $result;
    protected array $mutation_fields = [];
    protected array $additional_logical_data = [];

    /**
     * @var mixed
     */
    private $data;

    /**
     * Get all the items.
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @param array<string, mixed> $args
     * @param array<string>        $fields
     * @param array<string, mixed> $additional_logical_data
     *
     * @throws \Exception
     * @return object Array of stdClass objects or null if no results.
     */
    public function all( array $args, array $fields = [ '*' ], array $additional_logical_data = [] ): object {
        global $wpdb;
        $args = wp_parse_args(
            $args, [
                'limit'     => 20,
                'offset'    => 0,
                'order'     => 'DESC',
                'orderby'   => 'id',
                'status'    => '',
                'groupby'   => '',
                'relations' => [],
            ]
        );

        if ( ! empty( $args['mutation_fields'] ) ) {
            $this->mutation_fields = $args['mutation_fields'];
            unset( $args['mutation_fields'] );
        }

        if ( ! empty( $additional_logical_data ) ) {
            $this->additional_logical_data = $additional_logical_data;
        }

        $relations         = '';
        $where             = 'WHERE 1=1';
        $relational_fields = [];
        if ( ! empty( $args['relations'] ) ) {
            // Get relational and where clause from get_relations() method.
            $relational        = $this->get_relational( $args );
            $relations         = $relational->relations;
            $where             = $relational->where;
            $relational_fields = $relational->fields;
        }
        if ( ! empty( $args['status'] ) ) {
            $where .= $wpdb->prepare( " AND {$this->get_table()}.status = %d", $args['status'] );
        }

        $groupby = '';
        if ( ! empty( $args['groupby'] ) ) {
            $groupby = $wpdb->prepare( 'GROUP BY %s', $args['groupby'] );
        }

        // If fields has column name id, then add the table name as prefix and esc_sql the fields.
        if ( in_array( 'id', $fields, true ) ) {
            $fields = array_map(
                function ( $field ) {
                    return $this->get_table() . '.' . esc_sql( $field );
                }, $fields
            );
        }

        $relational_fields = array_merge( ...$relational_fields );
        $fields            = array_merge( $fields, $relational_fields );
        $fields            = implode( ', ', esc_sql( $fields ) );
        if ( - 1 === $args['limit'] ) {
            $query = $wpdb->prepare(
                "SELECT $fields FROM {$this->get_table()} {$relations} {$where} {$groupby} ORDER BY {$args['orderby']} {$args['order']}",
            );
        } else {
            $query = $wpdb->prepare(
                "SELECT $fields FROM {$this->get_table()} {$relations} {$where} {$groupby} ORDER BY {$args['orderby']} {$args['order']} LIMIT %d OFFSET %d",
                $args['limit'],
                $args['offset']
            );
        }

        $results       = $wpdb->get_results( $query );
        $this->results = $this->process_items( $results );

        return $this;
    }

    public function get_relational( array $args = [] ): object {
        global $wpdb;

        $where             = 'WHERE 1=1';
        $relations         = '';
        $relational_fields = [];
        foreach ( $args['relations'] as $relation ) {
            // Add table prefix on the table name.
            $relation['table'] = $wpdb->prefix . $relation['table'];
            $relations         .= " {$relation['join_type']} JOIN {$relation['table']} ON {$relation['table']}.{$relation['foreign_key']} = {$this->get_table()}.{$relation['local_key']}";

            if ( ! empty( $relation['where'] ) ) {
                foreach ( $relation['where'] as $key => $value ) {
                    $where .= $wpdb->prepare( " AND {$relation['table']}.{$key} {$value['operator']} %s", $value['value'] );
                }
            }

            if ( ! empty( $relation['select_max'] ) ) {
                foreach ( $relation['select_max'] as $key => $value ) {
                    $subquery = $wpdb->prepare( "SELECT MAX({$key}) FROM {$relation['table']} WHERE {$value['compare']['key']} {$value['compare']['operator']} '{$value['compare']['value']}' AND {$relation['table']}.{$relation['foreign_key']} = {$this->get_table()}.{$relation['local_key']}", $value['value'] );
                    $where    .= $wpdb->prepare( " AND {$relation['table']}.{$key} = ({$subquery})", $value['value'] );
                }
            }

            if ( ! empty( $relation['where_in'] ) ) {
                foreach ( $relation['where_in'] as $key => $value ) {
                    $where .= $wpdb->prepare( " AND {$relation['table']}.{$key} IN (%s)", $value );
                }
            }

            if ( ! empty( $relation['where_not_in'] ) ) {
                foreach ( $relation['where_not_in'] as $key => $value ) {
                    $where .= $wpdb->prepare( " AND {$relation['table']}.{$key} NOT IN (%s)", $value );
                }
            }

            if ( ! empty( $relation['where_like'] ) ) {
                foreach ( $relation['where_like'] as $key => $value ) {
                    $where .= $wpdb->prepare( " AND {$relation['table']}.{$key} LIKE %s", $value );
                }
            }

            if ( ! empty( $relation['where_not_like'] ) ) {
                foreach ( $relation['where_not_like'] as $key => $value ) {
                    $where .= $wpdb->prepare( " AND {$relation['table']}.{$key} NOT LIKE %s", $value );
                }
            }

            if ( ! empty( $relation['where_between'] ) ) {
                foreach ( $relation['where_between'] as $key => $value ) {
                    $where .= $wpdb->prepare( " AND {$relation['table']}.{$key} BETWEEN %s AND %s", $value );
                }
            }

            if ( ! empty( $relation['where_not_between'] ) ) {
                foreach ( $relation['where_not_between'] as $key => $value ) {
                    $where .= $wpdb->prepare( " AND {$relation['table']}.{$key} NOT BETWEEN %s AND %s", $value );
                }
            }

            if ( ! empty( $relation['fields'] ) ) {
                $relational_fields[] = array_map(
                    function ( $field ) use ( $relation ) {
                        return $relation['table'] . '.' . esc_sql( $field );
                    }, $relation['fields']
                );
            }
        }

        // Return relations and where.
        return (object) [
            'relations' => $relations,
            'where'     => $where,
            'fields'    => $relational_fields,
        ];
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
    public function count( array $args = [] ): int {
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
     * @param int           $id
     * @param array<string> $fields
     *
     *
     * @throws \Exception
     * @return object
     */
    public function find( int $id, array $fields = [ '*' ] ): object {
        global $wpdb;

        $fields  = implode( ',', esc_sql( $fields ) );
        $query   = $wpdb->prepare( "SELECT $fields FROM {$this->get_table()} WHERE id = %d", $id );
        $results = $wpdb->get_row( $query );

        $this->result = $this->process_item( $results );

        return $this;
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

        return $this->find( $last_id );
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
    public function update( int $id, Request $data ): bool {
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
    public function delete( int $id ): int {
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
     * @return array<string>
     */
    public static function get_columns(): array {
        if ( empty( static::$columns ) ) {
            return [];
        }

        return static::$columns;
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
    private function get_where_format( $data ): array {
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
    private function filter_data( array $data ): array {
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
    public function process_items( array $data ): object {
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
    private function process_item( object $item ): object {
        $this->data = $item;
        foreach ( (array) $item as $column => $type ) {
            $method = "get_$column";
            if ( method_exists( $this, $method ) ) {
                // Check if the column has any mutation like, get_created_on, get_updated_at etc.
                $value = call_user_func( [ $this, $method ], $item->$column, $this->additional_logical_data );
                if ( is_array( $value ) ) {
                    foreach ( $value as $key => $val ) {
                        $item->$key = $val;
                    }
                    continue;
                }

                $item->$column = $value;
            }
        }

        if ( ! empty( $this->mutation_fields ) ) {
            foreach ( $this->mutation_fields as $mutation_field ) {
                $method = "get_$mutation_field";
                if ( method_exists( $this, $method ) ) {
                    // Check if the column has any mutation like, get_created_on, get_updated_at etc.
                    $value = call_user_func( [ $this, $method ], $this->additional_logical_data );
                    if ( is_array( $value ) ) {
                        foreach ( $value as $key => $val ) {
                            $item->$key = $val;
                        }
                        continue;
                    }

                    $item->$mutation_field = $value;
                }
            }
        }

        return $item;
    }

    /**
     * Magic method to get the data. This will return the data if it exists.
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @param string $name
     *
     * @return mixed|null
     */
    public function __get( string $name ) {
        if ( isset( $this->data->$name ) ) {
            return $this->data->$name;
        }

        return null;
    }

    /**
     * Magic method to set the data. This will set the data if it exists.
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @param string $name
     * @param mixed  $value
     *
     * @return void
     */
    public function __set( string $name, $value ) {
        $this->data[$name] = $value;
    }


    /**
     * Convert the object to an array.
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @return array
     */
    public function toArray(): array {
        return (array) $this->results;
    }

    /**
     * Convert the object to a json string.
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @return string
     */
    public function toJson(): string {
        return json_encode( $this->results );
    }

}
