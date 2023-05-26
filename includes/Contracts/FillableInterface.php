<?php

namespace PayCheckMate\Contracts;

interface FillableInterface {

    /**
     * Get the fillable attributes.
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @return array<string>
     */
    public function fillable(): array;

}
