<?php

namespace PayCheckMate\Abstracts;

use PayCheckMate\Contracts\FormRequestInterface;

class FormRequest implements FormRequestInterface {

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
	protected array $post;

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
	 * @param  array $post  Post Super Global.
	 */
	public function __construct( array $post ) {
		if ( empty( $this->nonce ) ) {
			wp_die( __( 'Nonce verification failed', 'pcm' ) );
		}

		$this->post = $post;
		if ( ! $this->validate() ) {
			$this->error = __( 'Nonce verification failed', 'pcm' );
		}
	}

	/**
	 * To get data like $request->title dynamically, we introduced this magic method.
	 *
	 * @since 1.0.0
	 *
	 * @param  string $name  property name.
	 *
	 * @return mixed|null
	 */
	public function __get( string $name ) {
		return $this->post[ $name ] ?? null;
	}


	/**
	 * Validate request as per fillable array.
	 *
	 * @since 1.0.0
	 *
	 * @return bool
	 */
	public function validate(): bool {
		if ( isset( $this->post['_wpnonce'] ) && wp_verify_nonce( $this->post['_wpnonce'], $this->nonce ) ) {
			$this->fillable_data();

			return true;
		}

		return false;
	}

	/**
	 * Get all fillable data.
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 */
	private function fillable_data() {
		if ( ! empty( $this->fillable ) ) {
			foreach ( $this->fillable as $item ) {
				if ( ! array_key_exists( $item, $this->post ) ) {
					wp_die( $item . __( ' key is required for this form request.', 'pcm' ) );
				}
			}
		}
	}

}