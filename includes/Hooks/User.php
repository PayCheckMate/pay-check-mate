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
        <h3><?php esc_html_e( 'Pay Check Mate', 'pcm' ); ?></h3>
        <table class="form-table">
            <tbody>
                <tr>
                    <th><label for="pay_check_mate_user_role"><?php esc_html_e( 'Pay Check Mate Role', 'pcm' ); ?></label></th>
                    <td>
                        <?php
                        $roles = PayCheckMateUserRoles::get_pcm_roles();
                        foreach ( $roles as $role ) {
                            $checked = in_array( $role, $user->roles, true ) ? 'checked' : '';
                            ?>
                                <label for="pay_check_mate_user_role_<?php echo esc_attr( $role ); ?>">
                                    <input type="checkbox" name="pay_check_mate_user_role[]" id="pay_check_mate_user_role_<?php echo esc_attr( $role ); ?>" value="<?php echo esc_attr( $role ); ?>" <?php echo esc_attr( $checked ); ?>>
                                    <?php echo esc_html( $role ); ?>
                                </label>
                            <?php
                        }
                        ?>
                    </td>
                </tr>
            </tbody>
        </table>
        <?php
    }
}
