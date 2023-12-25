<?php

namespace PayCheckMate\Classes;

/**
 * Installer class
 *
 * @since 1.0.0
 */
class Installer {

    public function __construct() {
        new PayCheckMateUserRoles();
        new Databases();
    }
}
