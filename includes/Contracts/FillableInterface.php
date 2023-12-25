<?php

namespace PayCheckMate\Contracts;

interface FillableInterface {

    /**
     * Get the fillable attributes.
     *
     * @since 1.0.0
     *
     * @return array<string>
     */
    public function fillable(): array;
}
