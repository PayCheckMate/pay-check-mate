<?php

namespace PayCheckMate\Hooks;

use PayCheckMate\Contracts\HookAbleInterface;

class Admin implements HookAbleInterface {

    /**
     * All the necessary hooks.
     *
     * @since 1.0.0
     * @return void
     */
    public function hooks(): void {
        add_action( 'admin_init', [ $this, 'redirect_after_activation' ], 9999 );
    }

    /**
     * Redirect to set up page after plugin installation
     *
     * @return void
     */
    public function redirect_after_activation() {
        if ( ! get_transient( 'pay_check_mate_redirect_after_activation' ) ) {
            return;
        }

        delete_transient( 'pay_check_mate_redirect_after_activation' );

        wp_safe_redirect( admin_url( 'admin.php?page=pay-check-mate' ) );
        exit;
    }
}
