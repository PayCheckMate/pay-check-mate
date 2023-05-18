<?php

namespace PayCheckMate\Hooks;

use PayCheckMate\Contracts\HookAbleInterface;

class AdminMenu implements HookAbleInterface {

	/**
	 * All the necessary hooks.
	 *
	 * @return void
	 * @since PAY_CHECK_MATE_SINCE
	 */
	public function hooks(): void {
		// phpcs:ignore
		if ( ! current_user_can( 'pay_check_mate_manage_menu' ) ) {
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
		add_menu_page(
            __( 'PayCheckMate', 'pcm' ),
            __( 'PayCheckMate', 'pcm' ),
            'pay_check_mate_manage_menu',
            'pay-check-mate',
            [ $this, 'menu_page' ],
            'dashicons-money-alt',
            '20'
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
		echo '<div id="root" class="h-full wrap custom-font"></div>';
	}
}
