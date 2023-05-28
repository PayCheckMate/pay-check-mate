<?php

namespace PayCheckMate\Controllers\REST;

use PayCheckMate\Classes\SalaryHead;
use PayCheckMate\Models\SalaryHead as SalaryHeadModel;
use PayCheckMate\Contracts\HookAbleApiInterface;
use WP_REST_Request;
use WP_REST_Response;

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
            'order'   => 'DESC',
            'orderby' => 'id',
            'status'  => $request->get_param( 'status' ) ? $request->get_param( 'status' ) : '',
        ];

        $salary_heads = $salary_head->all( $args );
        $data         = [];
        foreach ( $salary_heads as $value ) {
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
                'id'               => [
                    'description' => __( 'Unique identifier for the object.', 'pcm' ),
                    'type'        => 'integer',
                    'context'     => [ 'view', 'edit', 'embed' ],
                    'readonly'    => true,
                ],
                'head_name'             => [
                    'description' => __( 'Salary Head Name', 'pcm' ),
                    'type'        => 'string',
                    'context'     => [ 'view', 'edit', 'embed' ],
                    'required'    => true,
                ],
                'head_type'             => [
                    'description' => __( 'Salary Head Type', 'pcm' ),
                    'type'        => 'string',
                    'context'     => [ 'view', 'edit', 'embed' ],
                ],
                'head_type_text'             => [
                    'description' => __( 'Salary Head Type in Text', 'pcm' ),
                    'type'        => 'string',
                    'context'     => [ 'view' ],
                ],
                'status'             => [
                    'description' => __( 'Salary Head Status', 'pcm' ),
                    'type'        => 'string',
                    'context'     => [ 'view', 'edit', 'embed' ],
                ],
                'created_on' => [
                    'description' => __( 'The date the object was created.', 'pcm' ),
                    'type'        => 'string',
                    'format'      => 'date-time',
                    'context'     => [ 'view', 'edit', 'embed' ],
                ],
                'updated_at' => [
                    'description' => __( 'The date the object was last updated.', 'pcm' ),
                    'type'        => 'string',
                    'format'      => 'date-time',
                    'context'     => [ 'view', 'edit' ],
                ],
            ],
        ];
    }

}
