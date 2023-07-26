<?php

namespace PayCheckMate\Controllers\REST;

use PayCheckMate\Classes\Employee;
use PayCheckMate\Classes\PayrollDetails;
use WP_Error;
use WP_REST_Server;
use WP_REST_Request;
use WP_REST_Response;
use PayCheckMate\Requests\EmployeeRequest;
use PayCheckMate\Requests\SalaryHistoryRequest;
use PayCheckMate\Contracts\HookAbleApiInterface;
use PayCheckMate\Models\EmployeeModel;
use PayCheckMate\Models\SalaryHistoryModel;

class SalaryIncrementApi extends RestController implements HookAbleApiInterface {

    public function __construct() {
        $this->namespace = 'pay-check-mate/v1';
        $this->rest_base = 'salary-increment';
    }

    public function register_api_routes(): void {
        register_rest_route(
            $this->namespace, '/' . $this->rest_base,
            [
                'methods'             => WP_REST_Server::CREATABLE,
                'callback'            => [ $this, 'create_employee_increment' ],
                'permission_callback' => [ $this, 'create_employee_permissions_check' ],
                'args'                => $this->get_endpoint_args_for_item_schema( \WP_REST_Server::CREATABLE ),
            ]
        );
    }

    /**
     * Get the employee salary details permissions check.
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @return bool
     */
    public function create_employee_permissions_check(): bool {
        // phpcs:ignore
        return current_user_can( 'pay_check_mate_accountant' );
    }

    /**
     * Create a single employee increment from the data in the request.
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @param WP_REST_Request<array<string>> $request Full details about the request.
     *
     * @throws \Exception
     * @return WP_Error|WP_REST_Response
     */
    public function create_employee_increment( WP_REST_Request $request ) {
        $data = $request->get_params();
        if ( empty( $data['employee_id'] ) ) {
            return new WP_Error(
                'rest_invalid_employee_data', __( 'Invalid employee data', 'pcm' ), [
                    'data'   => $data,
                    'status' => 400,
                ]
            );
        }

        if ( ! empty( $data['salary_details'] ) ) {
            $data['salary_details'] = wp_json_encode( $data['salary_details'] );
        }
        $valid_data = new SalaryHistoryRequest( $data );
        if ( $valid_data->error ) {
            return new WP_Error(
                'rest_invalid_salary_data', __( 'Invalid salary data', 'pcm' ), [
                    'data'   => $valid_data->error,
                    'status' => 400,
                ]
            );
        }

        // @phpstan-ignore-next-line
        if ( ! empty( (string) $valid_data->designation_id ) ) {
            $employee = new EmployeeModel();
            // @phpstan-ignore-next-line
            $employee->update_by( [ 'employee_id' => $valid_data->employee_id ], [ 'designation_id' => $valid_data->designation_id ] );
        }

        $salary = new SalaryHistoryModel();
        $result = $salary->employee_salary_increment( $valid_data );

        return new WP_REST_Response( $result, 201 );
    }
}
