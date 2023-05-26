<?php

namespace PayCheckMate\Controllers;

use PayCheckMate\Contracts\HookAbleInterface;

class Assets implements HookAbleInterface {

    public function hooks(): void {
        add_action( 'init', [ $this, 'register_scripts' ] );
        add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_scripts' ] );
    }

    /**
     * Register scripts.
     *
     * @since PAY_CHECK_MATE_SINCE
     * @return void
     */
    public function register_scripts(): void {
        $asset_file = require_once PAY_CHECK_MATE_DIR . '/dist/index.asset.php';

        wp_register_script(
            'pay-check-mate-js',
            PAY_CHECK_MATE_URL . '/dist/index.js',
            $asset_file['dependencies'],
            $asset_file['version'],
            true,
        );

        wp_register_style(
            'pay-check-mate-css',
            PAY_CHECK_MATE_URL . '/dist/index.css',
            [],
            $asset_file['version'],
        );
    }

    /**
     * Enqueue scripts.
     *
     * @since DOKAN_PRO_SINCE
     * @return void
     */
    public function enqueue_scripts(): void {
        if ( 'toplevel_page_pay-check-mate' !== get_current_screen()->id ) {
            return;
        }

        $this->register_translations();
        wp_enqueue_script( 'pay-check-mate-js' );
        wp_enqueue_style( 'pay-check-mate-css' );
    }

    /**
     * Register translations.
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @return void
     */
    public function register_translations(): void {
        wp_localize_script(
            'pay-check-mate-js', 'payCheckMate', [
				'ajaxUrl'              => admin_url( 'admin-ajax.php' ),
				'pay_check_mate_nonce' => wp_create_nonce( 'pay_check_mate_nonce' ),
				'currentUser'          => wp_get_current_user(),
			],
        );
    }

}
