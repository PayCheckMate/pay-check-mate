<?php

namespace PayCheckMate\Core;

use PayCheckMate\Contracts\ModelInterface;

class Department {

    protected ModelInterface $model;

    public function __construct( ModelInterface $model ) {
        $this->model = $model;
    }

    /**
     * Get all the items.
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @return object
     */
    public function all(): object {
        return $this->model->all();
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
        return $this->model->get( $id );
    }

    /**
     * Create a new item.
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @param FormRequest $data
     *
     * @return int
     */
    public function create( FormRequest $data ): int {
        return $this->model->create( $data );
    }

    /**
     * Update an item.
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @param FormRequest $data
     * @param int         $id
     *
     * @return bool
     */
    public function update( int $id, FormRequest $data ): bool {
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

}
