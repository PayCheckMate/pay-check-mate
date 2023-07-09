<?php

namespace PayCheckMate\Traits;

use PayCheckMate\Contracts\ModelInterface;
use PayCheckMate\Requests\Request;

trait CrudTrait {

    protected ModelInterface $model;

    public function __construct( ModelInterface $model ) {
        $this->model = $model;
    }

    /**
     * Get all the items.
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @param array<string, mixed> $args
     *                                            - 'status'    => int,
     *                                            - 'limit'     => string|int,
     *                                            - 'order'     => 'ASC',
     *                                            - 'order_by'   => string,
     *                                            - 'mutation_fields' => ['string'], this will call get_{field_name} method
     *                                            - 'relations' => [
     *                                            [
     *                                            'table'       => '{RELATION_TABLE_NAME}',
     *                                            'local_key'   => '{{RELATION_TABLE_LOCAL_KEY}',
     *                                            'foreign_key' => '{CURRENT_TABLE_FOREIGN_KEY}',
     *                                            'join_type'   => '{JOIN_TYPE}',
     *                                            'where'       => [
     *                                            '{FIELD}' => [
     *                                            'operator' => '{OPERATOR}',
     *                                            'value'    => {VALUE},
     *                                            ],
     *                                            ],
     *                                            'fields'      => [
     *                                            '{FIELD_NAME}',
     *                                            ],
     *                                            ],
     *                                            // Add more relations if needed
     *                                            ],
     * @param string[]             $fields
     * @param array<string, mixed> $additional_logical_data
     *
     * @return object
     */

    public function all( array $args = [], array $fields = [ '*' ], array $additional_logical_data = [] ): object {
        $args = wp_parse_args(
            $args, [
                'limit'           => 10,
                'offset'          => 0,
                'order'           => 'DESC',
                'order_by'        => 'id',
                'status'          => 'all',
                'search'          => '',
                'groupby'         => '',
                'relations'       => [],
                'mutation_fields' => [],
            ]
        );

        // @phpstan-ignore-next-line
        return $this->model->all( $args, $fields, $additional_logical_data );
    }

    /**
     * Get a single item.
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @param int $id
     * @param array<string, mixed> $args
     *
     * @return object
     */
    public function find( int $id, array $args = [] ): object {
        $args = wp_parse_args(
            $args, [
                'fields' => [ '*' ],
            ]
        );

        return $this->model->find( $id, $args );
    }

    /**
     * Get the items from the database by.
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @param array $find_by
     * @param array $args
     * @param array $fields
     *
     * @throws \Exception
     * @return object
     */
    public function find_by( array $find_by, array $args, array $fields = [ '*' ] ): object {
        if ( empty( $find_by ) ) {
            throw new \Exception( __( 'Arguments cannot be empty', 'pcm' ) );
        }

        $args = wp_parse_args(
            $args, [
                'order_by' => 'id',
                'order'    => 'DESC',
                'limit'    => 1,
                'offset'   => 0,
            ]
        );
        return $this->model->find_by( $find_by, $args, $fields );
    }

    /**
     * Create a new item.
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @param Request $data
     *
     * @return object
     */
    public function create( Request $data ): object {
        return $this->model->create( $data );
    }

    /**
     * Update an item.
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @param Request $data
     * @param int     $id
     *
     * @return object
     */
    public function update( int $id, Request $data ): object {
        return $this->model->update( $id, $data );
    }

    /**
     * Delete an item.
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @param int $id
     *
     * @return int
     */
    public function delete( int $id ): int {
        return $this->model->delete( $id );
    }

    /**
     * Count the number of items.
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @param array<string> $args
     *
     * @return int
     */
    public function count( array $args = [] ): int {
        return $this->model->count( $args );
    }
}
