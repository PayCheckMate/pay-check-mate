<?php

namespace PayCheckMate\Contracts;

use PayCheckMate\Requests\Request;

interface ModelInterface {

    /**
     * Get all the items.
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @return object
     */
    public function all(): object;

    /**
     * Get a single item.
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @param int $id
     *
     * @return object
     */
    public function get( int $id ): object;

    /**
     * Create a new item.
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @param Request $data
     *
     * @return int
     */
    public function create( Request $data ): int;

    /**
     * Update an item.
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @param int     $id
     * @param Request $data
     *
     * @return bool
     */
    public function update( int $id, Request $data ): bool;

    /**
     * Delete an item.
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @param int $id
     *
     * @return int
     */
    public function delete( int $id ): int;

}