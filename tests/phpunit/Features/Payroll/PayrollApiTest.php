<?php

use PayCheckMate\Controllers\REST\PayrollApi;

class PayrollApiTest extends WP_UnitTestCase {

    private $payroll_api;

    public function setUp() : void {
        parent::setUp();

        $this->payroll_api = new PayrollApi();
        // Create a user with the accountant role.
        $user = $this->factory()->user->create(
            [
                'role' => 'pay_check_mate_accountant',
            ]
        );
        do_action( 'rest_api_init' );

        // Use this user to authenticate the request.
        wp_set_current_user( $user );
    }

    public function tearDown() : void {
        parent::tearDown();

        $this->payroll_api = null;
    }

    public function test_register_api_routes() {
        global $wp_rest_server;

        $wp_rest_server = new WP_REST_Server();

        $this->payroll_api->register_api_routes();

        $routes = $wp_rest_server->get_routes();
        $this->assertArrayHasKey( '/pay-check-mate/v1/payroll/create-payroll', $routes );
        $this->assertCount( 1, $routes['/pay-check-mate/v1/payroll/create-payroll'] );
        $this->assertArrayHasKey( 'POST', $routes['/pay-check-mate/v1/payroll/create-payroll'][0]['methods'] );
        $this->assertEquals( [ $this->payroll_api, 'create_payroll' ], $routes['/pay-check-mate/v1/payroll/create-payroll'][0]['callback'] );
        $this->assertEquals( [ $this->payroll_api, 'create_payroll_permissions_check' ], $routes['/pay-check-mate/v1/payroll/create-payroll'][0]['permission_callback'] );
        $this->assertArrayHasKey( 'date', $routes['/pay-check-mate/v1/payroll/create-payroll'][0]['args'] );
    }

    public function test_create_payroll_permissions_check() {
        $request  = new WP_REST_Request( 'POST', '/pay-check-mate/v1/payroll/create-payroll' );
        $response = $this->payroll_api->create_payroll_permissions_check( $request );

        $this->assertTrue( $response );
    }

    public function test_create_payroll_with_valid_date() {
        $request = new WP_REST_Request( 'POST', '/pay-check-mate/v1/payroll/create-payroll' );
        $request->set_param( 'date', '2023-05-31' );

        $response = $this->payroll_api->create_payroll( $request );
        $data     = $response->get_data();

        $this->assertArrayHasKey( 'salary_head_details', $data );
        $this->assertArrayHasKey( 'employee_salary_history', $data );

        $this->assertCount( 5, $data['employee_salary_history'] );
        $this->assertArrayHasKey( 'id', $data['employee_salary_history'][0] );
        $this->assertArrayHasKey( 'employee_id', $data['employee_salary_history'][0] );
    }

    public function test_create_payroll_without_date() {
        $request = new WP_REST_Request( 'POST', '/pay-check-mate/v1/payroll/create-payroll' );

        $response = $this->payroll_api->create_payroll( $request );
        $data     = $response->get_data();

        $this->assertArrayHasKey( 'error', $data );
        $this->assertEquals( 'The "date" parameter is required.', $data['error'] );
    }

    public function test_get_collection_params() {
        $params = $this->payroll_api->get_item_schema();
        $this->assertArrayHasKey( 'date', $params['properties'] );
        $this->assertArrayHasKey( 'description', $params['properties']['date'] );
        $this->assertArrayHasKey( 'type', $params['properties']['date'] );
        $this->assertArrayHasKey( 'format', $params['properties']['date'] );
        $this->assertArrayHasKey( 'required', $params['properties']['date'] );
    }

}