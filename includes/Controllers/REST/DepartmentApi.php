<?php

namespace PayCheckMate\Controllers\REST;

use Exception;
use PayCheckMate\Classes\Department;
use PayCheckMate\Contracts\HookAbleApiInterface;
use PayCheckMate\Models\Department as DepartmentModel;
use PayCheckMate\Requests\DepartmentRequest;
use WP_Error;
use WP_HTTP_Response;
use WP_REST_Request;
use WP_REST_Response;

class DepartmentApi extends RestController implements HookAbleApiInterface {

    protected $namespace = 'pay-check-mate/v1';
    protected $rest_base = 'departments';


    /**
     * Register the necessary Routes.
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
						'id'              => [
							'description' => __( 'Unique identifier for the object.', 'pcm' ),
							'type'        => 'integer',
							'required'    => true,
						],
						'department_name' => [
							'description' => __( 'Department name.', 'pcm' ),
							'type'        => 'string',
							'required'    => true,
						],
						'status'          => [
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
     * @param WP_REST_Request<array<string>> $request
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
     * @param WP_REST_Request<array<string>> $request
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
     * @param WP_REST_Request<array<string>> $request
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
     * @param WP_REST_Request<array<string>> $request
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
     * @param WP_REST_Request<array<string>> $request
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
     * @param WP_REST_Request<array<string>> $request Request object.
     *
     * @return WP_REST_Response
     */
    public function get_items( $request ): WP_REST_Response {
        $department = new Department( new DepartmentModel() );
        $args        = [
            'limit'   => $request->get_param( 'per_page' ) ? $request->get_param( 'per_page' ) : 10,
            'offset'  => $request->get_param( 'page' ) ? ( $request->get_param( 'page' ) - 1 ) * $request->get_param( 'per_page' ) : 0,
            'order'   => 'DESC',
            'orderby' => 'id',
            'status'  => $request->get_param( 'status' ) ? $request->get_param( 'status' ) : '1',
        ];

        $departments = $department->all( $args );
        $data        = [];

        foreach ( $departments as $item ) {
            $item   = $this->prepare_item_for_response( $item, $request );
            $data[] = $this->prepare_response_for_collection( $item );
        }

        $total     = $department->count();
        $max_pages = ceil( $total / (int) 10 );

        $response = new WP_REST_Response( $data );

        $response->header( 'X-WP-Total', (string) $total );
        $response->header( 'X-WP-TotalPages', (string) $max_pages );

        return new WP_REST_Response( $response, 200 );
    }

    /**
     * Create a new item.
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @param WP_REST_Request<array<string>> $request
     *
     * @throws Exception
     *
     * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
     */
    public function create_item( $request ) {
        $department     = new Department( new DepartmentModel() );
        $validated_data = new DepartmentRequest( $request->get_params() );
        if ( ! empty( $validated_data->error ) ) {
            return new WP_Error( 500, __( 'Invalid data.', 'pcm' ), [ $validated_data->error ] );
        }

        $department = $department->create( $validated_data );

        if ( ! $department ) {
            return new WP_Error( 500, __( 'Could not create department.', 'pcm' ) );
        }

        return new WP_REST_Response( $department, 201 );
    }

    /**
     * Get one item from the collection.
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @param WP_REST_Request<array<string>> $request Request object.
     *
     * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
     */
    public function get_item( $request ) {
        $department = new Department( new DepartmentModel() );
        $department = $department->find( $request->get_param( 'id' ) );

        if ( is_wp_error( $department ) ) {
            return new WP_Error( 404, $department->get_error_message(), [ 'status' => 404 ] );
        }

        $item = $this->prepare_item_for_response( $department, $request );
        $data = $this->prepare_response_for_collection( $item );

        return new WP_REST_Response( $data, 200 );
    }

    /**
     * Update one item from the collection.
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @param WP_REST_Request<array<string>> $request Request object.
     *
     * @throws Exception
     *
     * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
     */
    public function update_item( $request ) {
        $department     = new Department( new DepartmentModel() );
        $validated_data = new DepartmentRequest( $request->get_params() );
        if ( ! empty( $validated_data->error ) ) {
            return new WP_Error( 500, __( 'Invalid data.', 'pcm' ), [ $validated_data->error ] );
        }

        $department = $department->update( $request->get_param( 'id' ), $validated_data );

        if ( ! $department ) {
            return new WP_REST_Response( __( 'Department not found', 'pcm' ), 500 );
        }

        return new WP_REST_Response( $department, 200 );
    }

    /**
     * Delete one item from the collection.
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @param WP_REST_Request<array<string>> $request Request object.
     *
     * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
     */
    public function delete_item( $request ) {
        $department = new Department( new DepartmentModel() );
        $department = $department->delete( $request->get_param( 'id' ) );

        if ( ! $department ) {
            return new WP_Error( 500, __( 'Could not delete designation.', 'pcm' ) );
        }

        return new WP_REST_Response( __( 'Department deleted', 'pcm' ), 200 );
    }

    /**
     * Get the query params for collections. These are query params that are used for every collection request.
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @return array<string, array<string, array<string, array<int, string>|bool|string>>|string> Collection parameters.
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

}
