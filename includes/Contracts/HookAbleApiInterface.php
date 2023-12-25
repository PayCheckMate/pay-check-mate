<?php

namespace PayCheckMate\Contracts;

interface HookAbleApiInterface {

    /**
     * Call the necessary hooks.
     *
     * @since 1.0.0
     * @return void
     */
    public function register_api_routes(): void;
}
