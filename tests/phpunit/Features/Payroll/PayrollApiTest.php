<?php

use PayCheckMate\REST\PayrollApi;

class PayrollApiTest extends WP_UnitTestCase {

    public function testGetPayrollsReturnsCorrectResponseWithDefaultParameters(): void {
        $request    = new WP_REST_Request();
        $payrollApi = new PayrollApi();

        $response = $payrollApi->get_payrolls( $request );

        $this->assertInstanceOf( WP_REST_Response::class, $response );
        $this->assertEquals( 200, $response->get_status() );
        $this->assertIsArray( $response->get_data()->data );
    }

    public function testGeneratePayrollReturnsErrorWhenDateIsMissing(): void {
        $request    = new WP_REST_Request();
        $payrollApi = new PayrollApi();

        $response = $payrollApi->generate_payroll( $request );

        $this->assertInstanceOf( WP_REST_Response::class, $response );
        $this->assertEquals( 400, $response->get_status() );
        $this->assertEquals( [ 'error' => 'The "date" parameter is required.' ], $response->get_data() );
    }

    public function testSavePayrollReturnsErrorWhenUnauthorized(): void {
        $request    = new WP_REST_Request();
        $payrollApi = new PayrollApi();

        $response = $payrollApi->save_payroll( $request );

        $this->assertInstanceOf( WP_Error::class, $response );
        $this->assertEquals( 400, $response->get_error_code() );
        $this->assertEquals( [
            'status' => 400,
            'error'  => 'You are not authorized to perform this action.',
        ], $response->get_error_data() );
    }

    public function testUpdatePayrollSheetReturnsErrorWhenPayrollIdIsMissing(): void {
        $request    = new WP_REST_Request();
        $payrollApi = new PayrollApi();

        $response = $payrollApi->update_payroll_sheet( $request );

        $this->assertInstanceOf( WP_REST_Response::class, $response );
        $this->assertEquals( 400, $response->get_status() );
        $this->assertEquals( [ 'error' => 'Payroll ID is required.' ], $response->get_data() );
    }

    public function testGetPayrollReturnsCorrectResponseWithDefaultParameters(): void {
        $request = new WP_REST_Request();
        $request->set_param( 'id', 1 );
        $payrollApi = new PayrollApi();

        $response = $payrollApi->get_payroll( $request );

        $this->assertInstanceOf( WP_REST_Response::class, $response );
        $this->assertEquals( 200, $response->get_status() );
        $this->assertIsArray( $response->get_data() );
    }

    public function testGetPayrollReportReturnsErrorWhenDateIsMissing(): void {
        $request    = new WP_REST_Request();
        $payrollApi = new PayrollApi();

        $response = $payrollApi->get_payroll_report( $request );

        $this->assertInstanceOf( WP_REST_Response::class, $response );
        $this->assertEquals( 400, $response->get_status() );
        $this->assertEquals( [ 'error' => 'Payroll Date is required.' ], $response->get_data() );
    }

    public function testGetPayrollLedgerReturnsErrorWhenEmployeeIdIsMissing(): void {
        $request    = new WP_REST_Request();
        $payrollApi = new PayrollApi();

        $response = $payrollApi->get_payroll_ledger( $request );

        $this->assertInstanceOf( WP_REST_Response::class, $response );
        $this->assertEquals( 400, $response->get_status() );
        $this->assertEquals( [ 'error' => 'Employee ID is required.' ], $response->get_data() );
    }

    public function testUpdatePayrollReturnsErrorWhenInvalidData(): void {
        $request = new WP_REST_Request();
        $request->set_param( 'id', 1 );
        $payrollApi = new PayrollApi();

        $response = $payrollApi->update_payroll( $request );

        $this->assertInstanceOf( WP_REST_Response::class, $response );
        $this->assertEquals( 500, $response->get_status() );
        $this->assertEquals( [ 'error' => 'Invalid data.' ], $response->get_data() );
    }

    public function testSavePayrollSavesCorrectly(): void {
        $request = new WP_REST_Request();
        $request->set_param( 'id', 1 );
        $request->set_param( 'payroll_date', '2022-12-31' );
        $request->set_param( 'designation_id', 1 );
        $request->set_param( 'department_id', 1 );
        $request->set_param( 'total_salary', 5000 );
        $request->set_param( 'remarks', 'Test Remarks' );
        $request->set_param( 'status', 1 );
        $request->set_param( 'created_user_id', 1 );
        $request->set_param( 'approved_user_id', 1 );

        $payrollApi = new PayrollApi();

        $response = $payrollApi->save_payroll( $request );

        $this->assertInstanceOf( WP_REST_Response::class, $response );
        $this->assertEquals( 200, $response->get_status() );
        $this->assertIsArray( $response->get_data() );
    }
}
