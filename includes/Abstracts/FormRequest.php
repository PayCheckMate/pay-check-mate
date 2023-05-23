<?php

namespace PayCheckMate\Abstracts;

use PayCheckMate\Contracts\FillableInterface;
use PayCheckMate\Contracts\FormRequestInterface;

class FormRequest implements FormRequestInterface {

	// Here we will check nonce, validate data and fill the model.

	/**
	 * Nonce property.
	 *
	 * @var string
	 */
	protected string $nonce;

	/**
	 * Post property.
	 *
	 * @var array
	 */
	protected array $data;

	/**
	 * All the fillable.
	 *
	 * @var array
	 */
	protected array $fillable = [];

	/**
	 * Any error.
	 *
	 * @var string|null
	 */
	public ?string $error;

	/**
	 * Construct method for SupportFormStoreRequest class.
	 * This will get a Post Super Global as an argument.
	 *
	 * @param  array $data  Post Super Global.
	 */
	public function __construct( array $data ) {
		if ( empty( $this->nonce ) ) {
			wp_die( __( 'Nonce is required for this form request.', 'pcm' ) );
		}

		$this->data = $data;
		if ( ! isset( $this->data['_wpnonce'] ) || wp_verify_nonce( $this->data['_wpnonce'], $this->nonce ) ) {
			wp_die( __( 'Nonce verification failed', 'pcm' ) );
		}

		$this->fillable = $this->get_fillable_data();

		$this->validate();
	}

	/**
	 * To get data like $request->title dynamically, we introduced this magic method.
	 *
	 * @since PAY_CHECK_MATE_SINCE
	 *
	 * @param  string $name  property name.
	 *
	 * @return mixed|null
	 */
	public function __get( string $name ) {
		return $this->data[ $name ] ?? null;
	}


	/**
	 * Validate request as per fillable array.
	 *
	 * @since PAY_CHECK_MATE_SINCE
	 *
	 * @return void
	 */
	public function validate() {
		if ( ! empty( $this->fillable ) ) {
			foreach ( $this->fillable as $item ) {
				if ( ! array_key_exists( $item, $this->data ) ) {
					wp_die( $item . __( ' key is required for this form request.', 'pcm' ) );
				}
			}
		}
	}

	/**
	 * Get fillable data.
	 *
	 * @since PAY_CHECK_MATE_SINCE
	 *
	 * @return array
	 */
	private function get_fillable_data(): array {
		$class = get_called_class();
		$class_name = basename( str_replace( '\\', '/', $class ) );
		$model = str_replace( 'FormRequest', '', $class_name );
		$model = 'PayCheckMate\\Models\\' . $model;
		if ( ! class_exists( $model ) ) {
			wp_die( __( 'Model not found for this form request.', 'pcm' ) );
		}

		$model = new $model();
		if ( $model instanceof FillableInterface ) {
			$this->fillable = $model->fillable();
		}

		return $this->fillable;
	}

	public function to_array(): array {
		return $this->data;
	}
}
