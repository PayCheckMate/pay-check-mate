<?php

namespace PayCheckMate\Contracts;

interface FormRequestInterface {

    /**
     * Validate the request.
     *
     * @since 1.0.0
     *
     * @return mixed
     */
    public function validate();
}
