<?php

namespace PayCheckMate\Contracts;

interface HookAbleInterface {

    /**
     * Call the necessary hooks.
     *
     * @since 1.0.0
     * @return void
     */
    public function hooks(): void;
}
