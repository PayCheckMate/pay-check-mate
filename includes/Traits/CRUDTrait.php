<?php

namespace PayCheckMate\Traits;

use PayCheckMate\Contracts\ModelInterface;
use PayCheckMate\Requests\Request;

trait CRUDTrait {

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
     *
     * @return object
     */
    public function all( array $args ): object {
        $args = wp_parse_args(
            $args, [
                'limit'  => 20,
                'offset'  => 0,
                'order'   => 'DESC',
                'orderby' => 'id',
                'status'  => '',
            ]
        );

        return $this->model->all( $args );
    }

    /**
     * Get a single item.
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @param int $id
     *
     * @return object
     */
    public function get( int $id ): object {
        return $this->model->find( $id );
    }

    /**
     * Create a new item.
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @param Request $data
     *
     * @return int
     */
    public function create( Request $data ): int {
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
     * @return bool
     */
    public function update( int $id, Request $data ): bool {
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

    public function count(): int {
        return $this->model->count();
    }
}
