<?php

namespace PayCheckMate\REST;

use PayCheckMate\Contracts\HookAbleApiInterface;

class SettingsApi  extends RestController implements HookAbleApiInterface {

    public function __construct() {
        $this->namespace = 'pay-check-mate/v1';
        $this->rest_base = 'settings';
    }

    public function register_api_routes(): void {
        register_rest_route(
            $this->namespace, '/' . $this->rest_base, [
                [
                    'methods'             => \WP_REST_Server::READABLE,
                    'callback'            => [ $this, 'get_settings' ],
                    'permission_callback' => [ $this, 'get_settings_permissions_check' ],
                ],
                [
                    'methods'             => \WP_REST_Server::EDITABLE,
                    'callback'            => [ $this, 'update_settings' ],
                    'permission_callback' => [ $this, 'update_settings_permissions_check' ],
                ],
            ]
        );
    }

    /**
     * Get settings permissions check.
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @return bool
     */
    public function get_settings_permissions_check(): bool {
        return current_user_can( 'manage_options' );
    }

    /**
     * Get settings.
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @return \WP_REST_Response
     */
    public function get_settings(): \WP_REST_Response {
        $settings = get_option( 'pay_check_mate_settings' );
        return rest_ensure_response( $settings );
    }

    /**
     * Update settings permissions check.
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @return bool
     */
    public function update_settings_permissions_check(): bool {
        return current_user_can( 'manage_options' );
    }

    /**
     * Update settings.
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @param \WP_REST_Request<array<string>> $request Full details about the request.
     *
     * @return \WP_REST_Response
     */
    public function update_settings( \WP_REST_Request $request ): \WP_REST_Response {
        if ( empty( $request->get_param( '_wpnonce' ) ) || ! wp_verify_nonce( $request->get_param( '_wpnonce' ), 'pay_check_mate_nonce' ) ) {
            wp_die( __( 'Nonce verification failed', 'pay-check-mate' ) );
        }

        $settings = $request->get_param( 'settings' );
        update_option( 'pay_check_mate_settings', $settings );

        return rest_ensure_response( $settings );
    }
}