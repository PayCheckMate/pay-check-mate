<?php

namespace PayCheckMate\Hooks;

use PayCheckMate\Contracts\HookAbleInterface;

class AdminMenu implements HookAbleInterface {

    /**
     * All the necessary hooks.
     *
     * @since PAY_CHECK_MATE_SINCE
     * @return void
     */
    public function hooks(): void {
        $capabilities = 'pay_check_mate_manage_menu';
        if ( ! current_user_can( $capabilities ) ) {
            return;
        }

        add_action( 'admin_menu', [ $this, 'admin_menu' ] );
    }

    /**
     * Add menu page.
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @return void
     */
    public function admin_menu(): void {
        $capabilities = 'pay_check_mate_manage_menu';
        add_menu_page(
            __( 'PayCheckMate', 'pcm' ),
            __( 'PayCheckMate', 'pcm' ),
            $capabilities,
            'pay-check-mate',
            [ $this, 'menu_page' ],
            'dashicons-money-alt',
            20
        );
    }

    /**
     * Menu page callback.
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @return void
     */
    public function menu_page(): void {
        echo '<div id="pcm-root" class="h-full wrap custom-font"></div>';
    }
}
