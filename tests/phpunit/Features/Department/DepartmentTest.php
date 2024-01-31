<?php
namespace PayCheckMate\Tests\Features\Department;

use PayCheckMate\REST\DepartmentApi;
use WP_REST_Request;
use WP_REST_Response;

class DepartmentTest extends \WP_UnitTestCase {

    /**
     * @throws \Exception
     */
    public function testGetItemsReturnsCorrectResponseWithDefaultParameters(): void {
    $request       = new WP_REST_Request();
    $departmentApi = new DepartmentApi();

    $response = $departmentApi->get_items( $request );

    $this->assertInstanceOf( WP_REST_Response::class, $response );
    $this->assertEquals( 200, $response->get_status() );
    $this->assertIsArray( $response->get_data()->data );
}

    public function testGetItemsReturnsCorrectResponseWithCustomParameters(): void {
        $request = new WP_REST_Request();
        $request->set_param( 'per_page', 5 );
        $request->set_param( 'page', 2 );
        $request->set_param( 'order', 'DESC' );
        $request->set_param( 'order_by', 'name' );
        $request->set_param( 'status', 'active' );
        $request->set_param( 'search', 'test' );

        $departmentApi = new DepartmentApi();

        $response = $departmentApi->get_items( $request );

        $this->assertInstanceOf( WP_REST_Response::class, $response );
        $this->assertEquals( 200, $response->get_status() );
        $this->assertIsArray( $response->get_data()->data );
    }

    public function testGetItemsReturnsEmptyArrayWhenNoDepartmentsExist(): void {
        $request       = new WP_REST_Request();
        $departmentApi = new DepartmentApi();

        // Assuming the DepartmentModel::all() method returns an empty array when no departments exist
        $response = $departmentApi->get_items( $request );

        $this->assertInstanceOf( WP_REST_Response::class, $response );
        $this->assertEquals( 200, $response->get_status() );
        $this->assertEmpty( $response->get_data()->data );
    }
}
