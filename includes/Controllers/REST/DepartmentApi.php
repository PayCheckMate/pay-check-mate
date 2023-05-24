<?php

namespace PayCheckMate\Controllers\REST;

use Exception;
use PayCheckMate\Contracts\HookAbleApiInterface;
use PayCheckMate\Models\Department;
use PayCheckMate\Requests\DepartmentFormRequest;
use WP_Error;
use WP_HTTP_Response;
use WP_REST_Controller;
use WP_REST_Request;
use WP_REST_Response;

class DepartmentApi extends WP_REST_Controller implements HookAbleApiInterface {

	protected $namespace = 'pay-check-mate/v1';
	protected $rest_base = 'departments';


	/**
	 * Register the necessary hooks.
	 *
	 * @since PAY_CHECK_MATE_SINCE
	 *
	 * @return void
	 */
	public function register_api_routes(): void {
		register_rest_route(
			$this->namespace, '/' . $this->rest_base, [
				[
					'methods'             => \WP_REST_Server::READABLE,
					'callback'            => [ $this, 'get_items' ],
					'args'                => $this->get_collection_params(),
					'permission_callback' => [ $this, 'get_items_permissions_check' ],
				],
				[
					'methods'             => \WP_REST_Server::CREATABLE,
					'callback'            => [ $this, 'create_item' ],
					'permission_callback' => [ $this, 'create_item_permissions_check' ],
					'args'                => $this->get_endpoint_args_for_item_schema( \WP_REST_Server::CREATABLE ),
				],
				'schema' => [ $this, 'get_public_item_schema' ],
			],
		);

		register_rest_route(
			$this->namespace, '/' . $this->rest_base . '/(?P<id>[\d]+)', [
				[
					'methods'             => \WP_REST_Server::READABLE,
					'callback'            => [ $this, 'get_item' ],
					'permission_callback' => [ $this, 'get_item_permissions_check' ],
					'args'                => [
						'id' => [
							'description' => __( 'Unique identifier for the object.', 'pcm' ),
							'type'        => 'integer',
							'required'    => true,
						],
					],
				],
				[
					'methods'             => \WP_REST_Server::EDITABLE,
					'callback'            => [ $this, 'update_item' ],
					'permission_callback' => [ $this, 'update_item_permissions_check' ],
					'args'                => [
						'id' => [
							'description' => __( 'Unique identifier for the object.', 'pcm' ),
							'type'        => 'integer',
							'required'    => true,
						],
						'department_name' => [
							'description' => __( 'Department name.', 'pcm' ),
							'type'        => 'string',
							'required'    => true,
						],
						'status' => [
							'description' => __( 'Department status.', 'pcm' ),
							'type'        => 'number',
						],
					],
				],
				[
					'methods'             => \WP_REST_Server::DELETABLE,
					'callback'            => [ $this, 'delete_item' ],
					'permission_callback' => [ $this, 'delete_item_permissions_check' ],
					'args'                => [
						'id' => [
							'description' => __( 'Unique identifier for the object.', 'pcm' ),
							'type'        => 'integer',
							'required'    => true,
						],
					],
				],
				'schema' => [ $this, 'get_public_item_schema' ],
			],
		);
	}

	/**
	 * Check if a given request has access to get items.
	 *
	 * @since PAY_CHECK_MATE_SINCE
	 *
	 * @param $request
	 *
	 * @return bool
	 */
	public function get_items_permissions_check( $request ): bool {
		// phpcs:ignore
		return current_user_can( 'pay_check_mate_accountant' );
	}

	/**
	 * Check if a given request has access to create items.
	 *
	 * @since PAY_CHECK_MATE_SINCE
	 *
	 * @param $request
	 *
	 * @return bool
	 */
	public function create_item_permissions_check( $request ): bool {
		// phpcs:ignore
		return current_user_can( 'pay_check_mate_accountant' );
	}

	/**
	 * Check if a given request has access to get a specific item.
	 *
	 * @since PAY_CHECK_MATE_SINCE
	 *
	 * @param $request
	 *
	 * @return bool
	 */
	public function get_item_permissions_check( $request ): bool {
		// phpcs:ignore
		return current_user_can( 'pay_check_mate_accountant' );
	}

	/**
	 * Check if a given request has access to update a specific item.
	 *
	 * @since PAY_CHECK_MATE_SINCE
	 *
	 * @param $request
	 *
	 * @return bool
	 */
	public function update_item_permissions_check( $request ): bool {
		// phpcs:ignore
		return current_user_can( 'pay_check_mate_accountant' );
	}

	/**
	 * Check if a given request has access to delete a specific item.
	 *
	 * @since PAY_CHECK_MATE_SINCE
	 *
	 * @param $request
	 *
	 * @return bool
	 */
	public function delete_item_permissions_check( $request ): bool {
		// phpcs:ignore
		return current_user_can( 'pay_check_mate_accountant' );
	}

	/**
	 * Get a collection of items.
	 *
	 * @since PAY_CHECK_MATE_SINCE
	 *
	 * @param $request WP_REST_Request
	 *
	 * @return WP_HTTP_Response
	 */
	public function get_items( $request ): WP_HTTP_Response {
		$departments = new \PayCheckMate\Core\Department( new Department() );
		$departments = $departments->all();
		$data        = [];

		foreach ( $departments as $department ) {
			$item   = $this->prepare_item_for_response( $department, $request );
			$data[] = $this->prepare_response_for_collection( $item );
		}

		$total     = count( $data );
		$max_pages = ceil( $total / (int) 10 );

		$response = new WP_HTTP_Response( $data );

		$response->header( 'X-WP-Total', (int) $total );
		$response->header( 'X-WP-TotalPages', (int) $max_pages );

		return new WP_HTTP_Response( $response, 200 );
	}

    /**
     * Create a new item.
     *
     * @param $request
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @throws Exception
     *
     * @return WP_HTTP_Response
     */
	public function create_item( $request ): WP_HTTP_Response {
		$department = new \PayCheckMate\Core\Department( new Department() );
		$validated_data = new DepartmentFormRequest( $request->get_params() );
		if ( ! empty( $validated_data->error ) ) {
			return new WP_HTTP_Response( $validated_data->error, 500 );
		}

		$department = $department->create( $validated_data );

		if ( is_wp_error( $department ) ) {
			return new WP_HTTP_Response( $department, 500 );
		}

		return new WP_HTTP_Response( $department, 200 );
	}

	/**
	 * Get one item from the collection.
	 *
	 * @since PAY_CHECK_MATE_SINCE
	 *
	 * @param $request WP_REST_Request
	 *
	 * @return WP_HTTP_Response
	 */
	public function get_item( $request ): WP_HTTP_Response {
		$department = new \PayCheckMate\Core\Department( new Department() );
		$department = $department->get( $request->get_param( 'id' ) );

		if ( is_wp_error( $department ) ) {
			return new WP_HTTP_Response( $department, 500 );
		}

		$item   = $this->prepare_item_for_response( $department, $request );
		$data = $this->prepare_response_for_collection( $item );

		return new WP_HTTP_Response( $data, 200 );
	}

    /**
     * Update one item from the collection.
     *
     * @param $request WP_REST_Request
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @throws Exception
     *
     * @return void
     */
	public function update_item( $request ) {
		$department = new \PayCheckMate\Core\Department( new Department() );
		$validated_data = new DepartmentFormRequest( $request->get_params() );
		if ( ! empty( $validated_data->error ) ) {
			wp_send_json_error( $validated_data->error, 500 );
		}

		$department = $department->update( $request->get_param( 'id' ), $validated_data );

		if ( is_wp_error( $department ) ) {
			wp_send_json_error( $department, 500 );
		}

		wp_send_json_success( $department, 200 );
	}

	/**
	 * Delete one item from the collection.
	 *
	 * @since PAY_CHECK_MATE_SINCE
	 *
	 * @param $request WP_REST_Request
	 *
	 * @return void
	 */
	public function delete_item( $request ) {
		$department = new \PayCheckMate\Core\Department( new Department() );
		$department = $department->delete( $request->get_param( 'id' ) );

		if ( is_wp_error( $department ) ) {
			wp_send_json_error( $department, 500 );
		}

		wp_send_json_success( $department, 200 );
	}

	/**
	 * Prepare the item for the REST response.
	 *
	 * @since PAY_CHECK_MATE_SINCE
	 *
	 * @param $request
	 *
	 * @param $item
	 *
	 * @return WP_Error|WP_HTTP_Response|WP_REST_Response
	 */
	public function prepare_item_for_response( $item, $request ) {
		$data   = [];
		$fields = $this->get_fields_for_response( $request );

		$schema = $this->get_item_schema();
		foreach ( $schema['properties'] as $key => $value ) {
			if ( ! in_array( $key, $fields, true ) ) {
				continue;
			}

			$data[ $key ] = $item->{$key};
		}

		$context = ! empty( $request['context'] ) ? $request['context'] : 'view';
		$data    = $this->add_additional_fields_to_object( $data, $request );
		$data    = $this->filter_response_by_context( $data, $context );

		// Wrap the data in a response object.
		$response = rest_ensure_response( $data );

		$response->add_links( $this->prepare_links( $item ) );

		return $response;
	}

	protected function prepare_links( $item ): array {
		$base = sprintf( '%s/%s', $this->namespace, $this->rest_base );

		return [
			'self'       => [
				'href' => rest_url( trailingslashit( $base ) . $item->id ),
			],
			'collection' => [
				'href' => rest_url( $base ),
			],
		];
	}

	/**
	 * Get the query params for collections. These are query params that are used for every collection request.
	 *
	 * @since PAY_CHECK_MATE_SINCE
	 *
	 * @return array
	 */
	public function get_item_schema(): array {
		return [
			'$schema'    => 'http://json-schema.org/draft-04/schema#',
			'title'      => 'department',
			'type'       => 'object',
			'properties' => [
				'id'              => [
					'description' => __( 'Unique identifier for the object', 'pcm' ),
					'type'        => 'integer',
					'context'     => [ 'view', 'edit', 'embed' ],
					'readonly'    => true,
				],
				'department_name' => [
					'description' => __( 'Department name', 'pcm' ),
					'type'        => 'string',
					'context'     => [ 'view', 'edit', 'embed' ],
					'readonly'    => false,
					'required'    => true,
				],
				'status'          => [
					'description' => __( 'Status', 'pcm' ),
					'type'        => 'integer',
					'context'     => [ 'view', 'edit', 'embed' ],
					'readonly'    => false,
				],
				'created_on'      => [
					'description' => __( 'Created on', 'pcm' ),
					'type'        => 'string',
					'context'     => [ 'view', 'edit', 'embed' ],
					'readonly'    => true,
				],
				'updated_at'      => [
					'description' => __( 'Updated on', 'pcm' ),
					'type'        => 'string',
					'context'     => [ 'view', 'edit', 'embed' ],
					'readonly'    => true,
				],
			],
		];
	}

	/**
	 * Prepare a response for inserting into a collection of responses.
	 *
	 * @since PAY_CHECK_MATE_SINCE
	 *
	 * @param WP_REST_Response $response Response object.
	 *
	 * @return array|WP_REST_Response Response data, ready for insertion into collection data.
	 */
	public function prepare_response_for_collection( $response ) {
		if ( ! ( $response instanceof WP_REST_Response ) ) {
			return $response;
		}

		$data   = (array) $response->get_data();
		$server = rest_get_server();

		if ( method_exists( $server, 'get_compact_response_links' ) ) {
			$links = call_user_func( [ $server, 'get_compact_response_links' ], $response );
		} else {
			$links = call_user_func( [ $server, 'get_response_links' ], $response );
		}

		if ( ! empty( $links ) ) {
			$data['_links'] = $links;
		}

		return $data;
	}
}
