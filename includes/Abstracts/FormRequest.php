<?php

namespace PayCheckMate\Abstracts;

use Exception;
use PayCheckMate\Contracts\FormRequestInterface;

class FormRequest implements FormRequestInterface {

    // Here we will check nonce, validate data and fill the model.

    /**
     * Nonce property.
     *
     * @var string
     */
    protected static string $nonce;

    /**
     * Rules for request validation.
     *
     * @var array
     */
    protected static array $rules;

    /**
     * All the fillable.
     *
     * @var array
     */
    protected static array $fillable;

    /**
     * Post property.
     *
     * @var array
     */
    protected array $data;

    /**
     * Any error.
     *
     * @var string[]|null
     */
    public ?array $error = [];

    /**
     * Construct method for SupportFormStoreRequest class.
     * This will get a $_POST Super Global as an argument.
     *
     * @param array $data Post Super Global.
     *
     * @throws Exception
     */
    public function __construct(array $data) {
        $this->data = $data;
        $this->validate();
    }

    /**
     * To get data like $request->title dynamically, we introduced this magic method.
     *
     * @param string $name property name.
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @return mixed|null
     */
    public function __get(string $name) {
        return $this->data[$name] ?? null;
    }


    /**
     * Validate nonce.
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @throws Exception
     *
     * @return void
     */
    public function validate() {
        if (!isset($this->data['_wpnonce']) || !wp_verify_nonce($this->data['_wpnonce'], $this->get_nonce())) {
            $this->addError(__('Nonce verification failed', 'pcm'));
        }
        
        $this->validate_fillable();
        $this->sanitize();
    }

    /**
     * Validate fillable.
     *
     * @since PAY_CHECK_MATE_SINCE
     * @throws Exception
     * @return void
     */
    public function validate_fillable() {
        $fillable = $this->get_fillable();
        if (!empty($fillable)) {
            foreach ($fillable as $item) {
                if (!array_key_exists($item, $this->data)) {
                    $this->addError($item . __(' key is required for this form request.', 'pcm'));
                }
            }
        }
    }

    /**
     * Sanitize data.
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @throws Exception
     * @return void
     */
    public function sanitize() {
        $rules = $this->get_rules();
        array_map(function ($value, $key) use ($rules) {
            if (isset($rules[$key])) {
                return $this->data[$key] = call_user_func($rules[$key], $value);
            }

            return $this->data[$key] = $value;
        }, $this->data, array_keys($this->data));
    }

    /**
     * Convert to array.
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @return array
     */
    public function to_array(): array {
        return $this->data;
    }

    /**
     * Add error.
     *
     * @param string $error Error message.
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @return void
     */
    public function addError(string $error) {
        $this->error[] = $error;
    }

    /**
     * Get nonce.
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @throws Exception
     *
     * @return string
     */
    public static function get_nonce(): string {
        if (empty(static::$nonce)) {
            throw new Exception(__('Nonce is not defined for this form request.', 'pcm'));
        }

        return static::$nonce;
    }

    /**
     * Get rules.
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @throws Exception
     *
     * @return array
     */
    public static function get_rules(): array {
        if (empty(static::$rules)) {
            throw new Exception(__('Make sure you have defined rules for this form request.', 'pcm'));
        }

        return static::$rules;
    }

    /**
     * Get fillable.
     *
     * @since PAY_CHECK_MATE_SINCE
     *
     * @throws Exception
     *
     * @return array
     */
    public static function get_fillable(): array {
        if (empty(static::$fillable)) {
            throw new Exception(__('Fillable are not defined for this form request.', 'pcm'));
        }

        return static::$fillable;
    }
}
