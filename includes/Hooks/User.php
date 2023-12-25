<?php

namespace PayCheckMate\Hooks;

use PayCheckMate\Classes\PayCheckMateUserRoles;
use PayCheckMate\Contracts\HookAbleInterface;

class User implements HookAbleInterface {

    /**
     * @inheritDoc
     */
    public function hooks(): void {
        add_action( 'show_user_profile', [ $this, 'display_user_role' ] );
        add_action( 'edit_user_profile', [ $this, 'display_user_role' ] );
        add_action( 'profile_update', [ $this, 'update_user_role' ] );
    }

    /**
     * Display user role.
     *
     * @param \WP_User $user
     *
     * @return void
     */
    public function display_user_role( $user ): void {
        ?>
        <h3><?php esc_html_e( 'Pay Check Mate', 'pay-check-mate' ); ?></h3>
        <table class="form-table">
            <tbody>
                <tr>
                    <th><label for="pay_check_mate_user_role"><?php esc_html_e( 'Pay Check Mate Role', 'pay-check-mate' ); ?></label></th>
                    <td>
                        <?php
                        $roles = PayCheckMateUserRoles::get_pay_check_mate_roles();
                        $user_roles = $user->roles;
                        foreach ( $roles as $key => $role ) {
                            $checked = in_array( $key, $user_roles, true ) ? 'checked' : '';
                            ?>
                                <label for="pay_check_mate_user_role_<?php echo esc_attr( $role ); ?>">
                                    <input type="checkbox" name="pay_check_mate_user_role[]" id="pay_check_mate_user_role_<?php echo esc_attr( $role ); ?>" value="<?php echo esc_attr( $key ); ?>" <?php echo esc_attr( $checked ); ?>>
                                    <?php echo esc_html( $role ); ?>
                                </label>
                            <?php
                        }
                        ?>
                        <?php wp_nonce_field( 'pay_check_mate_user_profile_update_role', '_pay_check_mate_nonce' ); ?>
                    </td>
                </tr>
            </tbody>
        </table>
        <?php
    }

    /**
     * Update user role.
     *
     * @param int $user_id
     *
     * @return void
     */
    public function update_user_role( int $user_id ): void {
        // verify nonce
        if ( ! isset( $_REQUEST['_pay_check_mate_nonce'] ) || ! wp_verify_nonce( sanitize_key( $_REQUEST['_pay_check_mate_nonce'] ), 'pay_check_mate_user_profile_update_role' ) ) {
            return;
        }

        $roles = isset( $_POST['pay_check_mate_user_role'] ) ? array_map( 'sanitize_text_field', wp_unslash( $_POST['pay_check_mate_user_role'] ) ) : [];

        // Bail if current user cannot promote the passing user
        if ( ! current_user_can( 'promote_user', $user_id ) ) {
            return;
        }

        $user = get_user_by( 'id', $user_id );
        if ( ! empty( $roles ) ) {
            foreach ( $roles as $role ) {
                $user->add_role( $role );
            }
        }

        $user_roles = PayCheckMateUserRoles::get_pay_check_mate_roles();
        foreach ( $user_roles as $key => $user_role ) {
            if ( ! in_array( $key, $roles, true ) ) {
                $user->remove_role( $key );
            }
        }
    }
}
