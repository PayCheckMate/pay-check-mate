<?php

namespace PayCheckMate\Contracts;

use PayCheckMate\Abstracts\FormRequest;

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
	 * @param FormRequest $data
	 *
	 * @return int
	 */
	public function create( FormRequest $data ): int;

	/**
	 * Update an item.
	 *
	 * @since PAY_CHECK_MATE_SINCE
	 *
	 * @param int         $id
	 * @param FormRequest $data
	 *
	 * @return bool
	 */
	public function update( int $id, FormRequest $data ): bool;

	/**
	 * Delete an item.
	 *
	 * @since PAY_CHECK_MATE_SINCE
	 *
	 * @param int $id
	 *
	 * @return bool
	 */
	public function delete( int $id ): bool;
}