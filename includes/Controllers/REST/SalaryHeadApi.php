<?php

namespace PayCheckMate\Controllers\REST;

use Exception;
use WP_Error;
use WP_REST_Request;
use WP_REST_Response;
use PayCheckMate\Classes\SalaryHead;
use PayCheckMate\Requests\SalaryHeadRequest;
use PayCheckMate\Contracts\HookAbleApiInterface;
use PayCheckMate\Models\SalaryHead as SalaryHeadModel;

class SalaryHeadApi extends RestController implements HookAbleApiInterface {

    public function __construct() {
        $this->namespace = 'pay-check-mate/v1';
        $this->rest_base = 'salary-heads';
    }

    /**
     * Register the routes for the objects of the controller.
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
						'head_name' => [
							'description' => __( 'Salary head name.', 'pcm' ),
							'type'        => 'string',
							'required'    => true,
						],
                        'head_type' => [
                            'description' => __( 'Salary head type.', 'pcm' ),
                            'type'        => 'integer',
                            'required'    => true,
                        ],
                        'head_amount' => [
                            'description' => __( 'Salary head amount.', 'pcm' ),
                            'type'        => 'number',
                            'required'    => true,
                        ],
                        'is_percentage' => [
                            'description' => __( 'Salary head is percentage.', 'pcm' ),
                            'type'        => 'boolean',
                            'required'    => true,
                        ],
                        'is_variable' => [
                            'description' => __( 'Is Changeable in every month?', 'pcm' ),
                            'type'        => 'boolean',
                            'required'    => true,
                        ],
                        'is_basic_affect' => [
                            'description' => __( 'Is basic salary affect?', 'pcm' ),
                            'type'        => 'boolean',
                            'required'    => true,
                        ],
                        'is_taxable' => [
                            'description' => __( 'Salary head is taxable.', 'pcm' ),
                            'type'        => 'boolean',
                            'required'    => true,
                        ],
                        'priority' => [
                            'description' => __( 'Salary head priority.', 'pcm' ),
                            'type'        => 'integer',
                            'required'    => true,
                        ],
						'status'          => [
							'description' => __( 'Department status.', 'pcm' ),
							'type'        => 'boolean',
                            'required'    => true,
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
     * Checks if a given request has access to create items.
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @param WP_REST_Request<array<string, mixed>> $request Full details about the request.
     *
     * @return bool
     */
    public function get_items_permissions_check( $request ): bool {
        return true;
    }

    /**
     * Checks if a given request has access to create items.
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @param WP_REST_Request<array<string, mixed>> $request Full details about the request.
     *
     * @return bool
     */
    public function create_item_permissions_check( $request ): bool {
        return true;
    }

    /**
     * Checks if a given request has access to read a item.
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @param WP_REST_Request<array<string, mixed>> $request Full details about the request.
     *
     * @return bool
     */
    public function get_item_permissions_check( $request ): bool {
        return true;
    }

    /**
     * Checks if a given request has access to update a item.
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @param WP_REST_Request<array<string, mixed>> $request Full details about the request.
     *
     * @return bool
     */
    public function update_item_permissions_check( $request ): bool {
        return true;
    }

    /**
     * Checks if a given request has access to delete a item.
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @param WP_REST_Request<array<string, mixed>> $request Full details about the request.
     *
     * @return bool
     */
    public function delete_item_permissions_check( $request ): bool {
        return true;
    }

    /**
     * Retrieves a collection of designations.
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @param WP_REST_Request<array<string>> $request Full details about the request.
     *
     * @return WP_REST_Response Response object on success, or WP_Error object on failure.
     */
    public function get_items( $request ): WP_REST_Response {
        $salary_head = new SalaryHead( new SalaryHeadModel() );
        $args        = [
            'limit'   => $request->get_param( 'per_page' ) ? $request->get_param( 'per_page' ) : 10,
            'offset'  => $request->get_param( 'page' ) ? ( $request->get_param( 'page' ) - 1 ) * $request->get_param( 'per_page' ) : 0,
            'order'   => $request->get_param( 'order' ) ? $request->get_param( 'order' ) : 'DESC',
            'orderby' => $request->get_param( 'orderby' ) ? $request->get_param( 'orderby' ) : 'id',
            'status'  => $request->get_param( 'status' ) ? $request->get_param( 'status' ) : '',
        ];

        $salary_heads = $salary_head->all( $args );
        $data         = [];
        foreach ( $salary_heads->toArray() as $value ) {
            $item   = $this->prepare_item_for_response( $value, $request );
            $data[] = $this->prepare_response_for_collection( $item );
        }

        $total     = $salary_head->count();
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
        $salary_head = new SalaryHead( new SalaryHeadModel() );
        $validated_data = new SalaryHeadRequest( $request->get_params() );
        if ( ! empty( $validated_data->error ) ) {
            return new WP_Error( 500, __( 'Invalid data.', 'pcm' ), [ $validated_data->error ] );
        }

        $head = $salary_head->create( $validated_data );

        if ( is_wp_error( $head ) ) {
            return new WP_Error( 500, __( 'Could not create department.', 'pcm' ) );
        }

        return new WP_REST_Response( $head, 201 );
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
        $department = new SalaryHead( new SalaryHeadModel() );
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
        $salary_head     = new SalaryHead( new SalaryHeadModel() );
        $validated_data = new SalaryHeadRequest( $request->get_params() );
        if ( ! empty( $validated_data->error ) ) {
            return new WP_Error( 500, __( 'Invalid data.', 'pcm' ), [ $validated_data->error ] );
        }

        $salary_heads = $salary_head->update( $request->get_param( 'id' ), $validated_data );

        if ( ! $salary_heads ) {
            return new WP_Error( 500, __( 'Could not update department.', 'pcm' ) );
        }

        return new WP_REST_Response( __( 'Salary head updated', 'pcm' ), 200 );
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
        $department = new SalaryHead( new SalaryHeadModel() );
        $department = $department->delete( $request->get_param( 'id' ) );

        if ( ! $department ) {
            return new WP_Error( 500, __( 'Could not delete designation.', 'pcm' ) );
        }

        return new WP_REST_Response( __( 'Department deleted', 'pcm' ), 200 );
    }

    /**
     * Retrieves the item's schema, conforming to JSON Schema.
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @return array<string, mixed> Item schema data.
     */
    public function get_item_schema(): array {
        return [
            '$schema'    => 'http://json-schema.org/draft-04/schema#',
            'title'      => 'designation',
            'type'       => 'object',
            'properties' => [
                'id'             => [
                    'description' => __( 'Unique identifier for the object.', 'pcm' ),
                    'type'        => 'integer',
                    'context'     => [ 'view', 'edit', 'embed' ],
                    'readonly'    => true,
                ],
                'head_name'      => [
                    'description' => __( 'Salary Head Name', 'pcm' ),
                    'type'        => 'string',
                    'context'     => [ 'view', 'edit', 'embed' ],
                    'required'    => true,
                ],
                'head_type'      => [
                    'description' => __( 'Salary Head Type', 'pcm' ),
                    'type'        => 'integer',
                    'context'     => [ 'view', 'edit', 'embed' ],
                ],
                'head_type_text' => [
                    'description' => __( 'Salary Head Type in Text', 'pcm' ),
                    'type'        => 'string',
                    'context'     => [ 'view' ],
                    'readonly'    => true,
                ],
                'head_amount'    => [
                    'description' => __( 'Salary Head Amount', 'pcm' ),
                    'type'        => 'number',
                    'context'     => [ 'view', 'edit', 'embed' ],
                    'required'    => true,
                ],
                'is_percentage'  => [
                    'description' => __( 'Salary Head is Percentage', 'pcm' ),
                    'type'        => 'boolean',
                    'context'     => [ 'view', 'edit', 'embed' ],
                ],
                'is_variable'  => [
                    'description' => __( 'Is Changeable in every month?', 'pcm' ),
                    'type'        => 'boolean',
                    'context'     => [ 'view', 'edit', 'embed' ],
                ],
                'is_basic_affect'  => [
                    'description' => __( 'Is Basic Salary Affect?', 'pcm' ),
                    'type'        => 'boolean',
                    'context'     => [ 'view', 'edit', 'embed' ],
                ],
                'is_taxable'     => [
                    'description' => __( 'Salary Head is Taxable', 'pcm' ),
                    'type'        => 'boolean',
                    'context'     => [ 'view', 'edit', 'embed' ],
                ],
                'priority'       => [
                    'description' => __( 'Salary Head Priority', 'pcm' ),
                    'type'        => 'integer',
                    'context'     => [ 'view', 'edit', 'embed' ],
                ],
                'status'         => [
                    'description' => __( 'Salary Head Status', 'pcm' ),
                    'type'        => 'boolean',
                    'context'     => [ 'view', 'edit', 'embed' ],
                ],
                'created_on'     => [
                    'description' => __( 'The date the object was created.', 'pcm' ),
                    'type'        => 'string',
                    'format'      => 'date-time',
                    'context'     => [ 'view', 'edit', 'embed' ],
                ],
                'updated_at'     => [
                    'description' => __( 'The date the object was last updated.', 'pcm' ),
                    'type'        => 'string',
                    'format'      => 'date-time',
                    'context'     => [ 'view', 'edit' ],
                ],
            ],
        ];
    }

}
