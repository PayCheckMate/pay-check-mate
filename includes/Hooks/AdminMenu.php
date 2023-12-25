<?php

namespace PayCheckMate\Hooks;

use PayCheckMate\Contracts\HookAbleInterface;

class AdminMenu implements HookAbleInterface {

    /**
     * All the necessary hooks.
     *
     * @since 1.0.0
     * @return void
     */
    public function hooks(): void {
        $capabilities = 'pay_check_mate_manage_menu';
        if ( ! current_user_can( $capabilities ) ) {
            return;
        }

        add_action( 'admin_menu', [ $this, 'admin_menu' ] );
        add_filter( 'plugin_row_meta', [ $this, 'add_plugin_row_meta' ], 10, 2 );
    }

    /**
     * Add menu page.
     *
     * @since 1.0.0
     *
     * @return void
     */
    public function admin_menu(): void {
        $capabilities = 'pay_check_mate_manage_menu';
        add_menu_page(
            __( 'PayCheckMate', 'pay-check-mate' ),
            __( 'PayCheckMate', 'pay-check-mate' ),
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
     * @since 1.0.0
     *
     * @return void
     */
    public function menu_page(): void {
        echo '<div id="pay_check_mate-root" class="h-full wrap custom-font"></div>';
    }

    /**
     * Add plugin row meta. Upgrade to pro link.
     *
     * @since 1.0.0
     *
     * @param array<string, mixed> $plugin_meta
     * @param string               $plugin_file
     *
     * @return mixed
     */
    public function add_plugin_row_meta( array $plugin_meta, string $plugin_file ) {
        if ( 'pay-check-mate/pay-check-mate.php' !== $plugin_file ) {
            return $plugin_meta;
        }

        $ref           = 'plugin-row-meta';
        $medium        = 'plugin';
        $plugin_meta[] = sprintf(
            '<a href="%1$s"><span class="dashicons dashicons-star-filled" aria-hidden="true" style="font-size: 14px; line-height: 1.3"></span>%2$s</a>',
            "https://paycheckmate.com/?ref={$ref}&utm_source=wp-plugin&utm_medium={$medium}",
            esc_html_x( 'Upgrade to Pro', 'verb', 'pay-check-mate' )
        );

        // Add donation link
//        $plugin_meta[] = sprintf(
//            '<a href="%1$s" target="_blank"><span class="dashicons dashicons-heart" aria-hidden="true" style="font-size: 14px; line-height: 1.3"></span>%2$s</a>',
//            "https://paycheckmate.com/donate/?ref={$ref}&utm_source=wp-plugin&utm_medium={$medium}",
//            esc_html_x( 'Donate', 'verb', 'pay-check-mate' )
//        );

        return $plugin_meta;
    }
}
