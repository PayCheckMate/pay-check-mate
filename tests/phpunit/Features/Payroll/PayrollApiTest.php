<?php

use PayCheckMate\Controllers\REST\PayrollApi;

class PayrollApiTest extends WP_UnitTestCase {
    private $payroll_api;

    public function setUp(): void {
        parent::setUp();

        $this->payroll_api = new PayrollApi();
        // Create a user with the accountant role.
        $user = $this->factory()->user->create(
            [
                'role' => 'pay_check_mate_accountant',
            ]
        );
        do_action('rest_api_init');

        // Use this user to authenticate the request.
        wp_set_current_user( $user );
    }

    public function tearDown(): void {
        parent::tearDown();

        $this->payroll_api = null;
    }

    public function test_register_api_routes() {
        global $wp_rest_server;

        $wp_rest_server = new WP_REST_Server();

        $this->payroll_api->register_api_routes();

        $routes = $wp_rest_server->get_routes();
        $this->assertArrayHasKey('/pay-check-mate/v1/payroll/create-payroll', $routes);
        $this->assertCount(1, $routes['/pay-check-mate/v1/payroll/create-payroll']);
        $this->assertArrayHasKey('POST', $routes['/pay-check-mate/v1/payroll/create-payroll'][0]['methods']);
        $this->assertEquals([ $this->payroll_api, 'create_payroll' ], $routes['/pay-check-mate/v1/payroll/create-payroll'][0]['callback']);
        $this->assertEquals([ $this->payroll_api, 'create_payroll_permissions_check' ], $routes['/pay-check-mate/v1/payroll/create-payroll'][0]['permission_callback']);
        $this->assertArrayHasKey('date', $routes['/pay-check-mate/v1/payroll/create-payroll'][0]['args']);
    }

    public function test_create_payroll_permissions_check() {
        $request = new WP_REST_Request('POST', '/pay-check-mate/v1/payroll/create-payroll');
        $response = $this->payroll_api->create_payroll_permissions_check($request);

        $this->assertTrue($response);
    }

    public function test_create_payroll() {
        $request = new WP_REST_Request('POST', '/pay-check-mate/v1/payroll/create-payroll');
//        $request->set_body_params([
//            'date' => '2020-01-01',
//        ]);
        $response = $this->payroll_api->create_payroll($request);
echo '<pre>';
print_r( $response );
exit();
        $data = $response->get_data();
        $this->assertArrayHasKey('message', $data);
        $this->assertEquals('Hello World!', $data['message']);
    }

    public function test_get_collection_params() {
        $params = $this->payroll_api->get_collection_params();

        $this->assertArrayHasKey('date', $params);
        $this->assertArrayHasKey('description', $params['date']);
        $this->assertArrayHasKey('type', $params['date']);
        $this->assertArrayHasKey('format', $params['date']);
        $this->assertArrayHasKey('required', $params['date']);
        $this->assertArrayHasKey('sanitize_callback', $params['date']);
        $this->assertArrayHasKey('validate_callback', $params['date']);
    }
}


/**
 * <?php


$salary_heads = [
'earnings' => [
[
'id' => 1,
'head_name' => 'Basic',
'head_type' => '1',
],
[
'id' => 2,
'head_name' => 'House Rent',
'head_type' => '1',
],
[
'id' => 3,
'head_name' => 'Medical',
'head_type' => '1',
],
[
'id' => 4,
'head_name' => 'Conveyance',
'head_type' => '1',
],
[
'id' => 5,
'head_name' => 'Allowance',
'head_type' => '1',
],
[
'id' => 6,
'head_name' => 'Provident Fund',
'head_type' => '1',
],
[
'id' => 8,
'head_name' => 'Others',
'head_type' => '1',
],
],
'deductions' => [
[
'id' => 9,
'head_name' => 'Provident Fund',
'head_type' => '2',
],
[
'id' => 10,
'head_name' => 'Tax',
'head_type' => '2',
],
[
'id' => 11,
'head_name' => 'Others',
'head_type' => '2',
],
],
];

$employee_salary_history = [
[
'id' => 1,
'employee_id' => 1,
'employee_name' => 'John Doe',
'designation' => 'Software Engineer',
'department' => 'Development',
'salary_head_ids' => [
'earnings' => [
1 => 10000,
2 => 5000,
3 => 2000,
4 => 1000,
5 => 1000,
6 => 1000,
8 => 1000,
],
'deductions' => [
9 => 1000,
10 => 1000,
11 => 1000,
],
],
],
[
'id' => 2,
'employee_id' => 2,
'employee_name' => 'Jane Smith',
'designation' => 'Software Engineer',
'department' => 'Development',
'salary_head_ids' => [
'earnings' => [
1 => 10000,
2 => 5000,
3 => 2000,
4 => 1000,
5 => 1000,
6 => 100,
8 => 1000,
],
'deductions' => [
9 => 100,
10 => 1000,
11 => 1000,
],
],
],
[
'id' => 3,
'employee_id' => 3,
'employee_name' => 'Michael Johnson',
'designation' => 'Designer',
'department' => 'Design',
'salary_head_ids' => [
'earnings' => [
1 => 10000,
2 => 5000,
3 => 2000,
4 => 1000,
5 => 100,
6 => 1000,
8 => 1000,
],
'deductions' => [
9 => 100,
10 => 1000,
11 => 1000,
],
],
],
[
'id' => 4,
'employee_id' => 4,
'employee_name' => 'Jane Smith',
'designation' => 'Software Engineer',
'department' => 'Development',
'salary_head_ids' => [
'earnings' => [
1 => 10000,
2 => 5000,
3 => 2000,
4 => 1000,
5 => 1000,
6 => 100,
8 => 1000,
],
'deductions' => [
9 => 100,
10 => 1000,
11 => 1000,
],
],
],
[
'id' => 5,
'employee_id' => 5,
'employee_name' => 'John Doe',
'designation' => 'Software Engineer',
'department' => 'Development',
'salary_head_ids' => [
'earnings' => [
1 => 10000,
2 => 5000,
3 => 2000,
4 => 1000,
5 => 1000,
6 => 1000,
8 => 1000,
],
'deductions' => [
9 => 1000,
10 => 1000,
11 => 1000,
],
],
],
];

 */
