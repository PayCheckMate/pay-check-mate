<?php

namespace WpPayroll\Controllers\REST;

use WP_REST_Controller;
use WpPayroll\Contracts\HookAbleApiInterface;
use WpPayroll\Models\Department;

class DepartmentApi extends WP_REST_Controller implements HookAbleApiInterface {

	public function __construct() {
		$this->namespace = 'wp-payroll/v1';
		$this->rest_base = 'departments';
	}

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
			],
		);

		register_rest_route(
			$this->namespace, '/' . $this->rest_base . '/(?P<id>[\d]+)', [
				'args' => [
					'id' => [
						'description' => __( 'Unique identifier for the object', 'wp-payroll' ),
						'type'        => 'integer',
						'required'    => true,
					],
				],
				[
					'methods'             => \WP_REST_Server::READABLE,
					'callback'            => [ $this, 'get_item' ],
					'permission_callback' => [ $this, 'get_item_permissions_check' ],
					'args'                => $this->get_collection_params(),
				],
				[
					'methods'             => \WP_REST_Server::EDITABLE,
					'callback'            => [ $this, 'update_item' ],
					'permission_callback' => [ $this, 'update_item_permissions_check' ],
					'args'                => $this->get_endpoint_args_for_item_schema( \WP_REST_Server::EDITABLE ),
				],
				[
					'methods'             => \WP_REST_Server::DELETABLE,
					'callback'            => [ $this, 'delete_item' ],
					'permission_callback' => [ $this, 'delete_item_permissions_check' ],
					'args'                => $this->get_collection_params(),
				],
			],
		);
	}

	public function get_items_permissions_check( $request ): bool {
		return true;
	}

	public function get_item_permissions_check( $request ): bool {
		return true;
	}

	public function update_item_permissions_check( $request ): bool {
		return true;
	}

	public function delete_item_permissions_check( $request ): bool {
		return true;
	}

	public function get_items( $request ) {
		$departments = new Department();
		$departments = $departments->get_departments();
		$data = [];

		foreach ( $departments as $department ) {
			$data[] = $this->prepare_item_for_response( $department, $request );
		}

		return new \WP_REST_Response( $data, 200 );
	}

	public function create_item_permissions_check( $request ) {
		return true;
	}

	public function create_item( $request ) {
		$department = wp_insert_term( $request['name'], 'department' );

		if ( is_wp_error( $department ) ) {
			return new \WP_REST_Response( $department, 500 );
		}

		return new \WP_REST_Response( $department, 200 );
	}

	public function update_item( $request ) {
		$department = wp_update_term( $request['id'], 'department', [ 'name' => $request['name'] ] );

		if ( is_wp_error( $department ) ) {
			return new \WP_REST_Response( $department, 500 );
		}

		return new \WP_REST_Response( $department, 200 );
	}

	public function delete_item( $request ) {
		$department = new Department();
		return $request['id'];
		$department = $department->delete_department( $request['id'] );

		if ( is_wp_error( $department ) ) {
			return new \WP_REST_Response( $department, 500 );
		}

		return new \WP_REST_Response( $department, 200 );
	}

	public function get_item( $request ) {
		$department = get_term( $request['id'], 'department' );

		if ( is_wp_error( $department ) ) {
			return new \WP_REST_Response( $department, 500 );
		}

		return new \WP_REST_Response( $department, 200 );
	}

	public function prepare_item_for_response( $item, $request ) {
		$data = [
			'id'              => $item['id'],
			'department_name' => $item['department_name'],
			'status'          => $item['status'],
			'created_on'      => $item['created_on'],
		];

		return $data;
	}

	public function get_collection_params() {
		return [
			'context'  => $this->get_context_param(),
		];
	}

	public function get_item_schema() {
		return [
			'$schema'    => 'http://json-schema.org/draft-04/schema#',
			'title'      => 'department',
			'type'       => 'object',
			'properties' => [
				'id'              => [
					'description' => __( 'Unique identifier for the object', 'wp-payroll' ),
					'type'        => 'integer',
					'context'     => [ 'view', 'edit', 'embed' ],
					'readonly'    => true,
				],
				'department_name' => [
					'description' => __( 'Department name', 'wp-payroll' ),
					'type'        => 'string',
					'context'     => [ 'view', 'edit', 'embed' ],
					'readonly'    => false,
					'required'    => true,
				],
				'status'          => [
					'description' => __( 'Status', 'wp-payroll' ),
					'type'        => 'integer',
					'context'     => [ 'view', 'edit', 'embed' ],
					'readonly'    => false,
				],
				'created_on'      => [
					'description' => __( 'Created on', 'wp-payroll' ),
					'type'        => 'string',
					'context'     => [ 'view', 'edit', 'embed' ],
					'readonly'    => true,
				],
				'updated_at'      => [
					'description' => __( 'Updated on', 'wp-payroll' ),
					'type'        => 'string',
					'context'     => [ 'view', 'edit', 'embed' ],
					'readonly'    => true,
				],
			],
		];
	}
}
