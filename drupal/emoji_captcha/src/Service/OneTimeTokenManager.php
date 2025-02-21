<?php

namespace Drupal\emoji_captcha\Service;

use Drupal\Core\State\StateInterface;

/**
 * Service for managing one-time tokens for emoji captcha.
 */
class OneTimeTokenManager {
  
  /**
   * The state service.
   *
   * @var \Drupal\Core\State\StateInterface
   */
  protected $state;

  /**
   * Constructs a new OneTimeTokenManager.
   *
   * @param \Drupal\Core\State\StateInterface $state
   *   The state service.
   */
  public function __construct(StateInterface $state) {
    $this->state = $state;
  }

  /**
   * Generates a one-time token.
   *
   * @return string
   *   The generated token.
   */
  public function generateToken() {
    $token = bin2hex(random_bytes(16));
    $this->state->set('emoji_captcha.token.' . $token, time());
    return $token;
  }

  /**
   * Validates a one-time token.
   *
   * @param string $token
   *   The token to validate.
   *
   * @return bool
   *   TRUE if the token is valid, FALSE otherwise.
   */
  public function validateToken($token) {
    $key = 'emoji_captcha.token.' . $token;
    $timestamp = $this->state->get($key);
    
    if (!$timestamp) {
      return FALSE;
    }
    
    // Token expires after 5 minutes
    if (time() - $timestamp > 300) {
      $this->state->delete($key);
      return FALSE;
    }
    
    // Delete the token after use
    $this->state->delete($key);
    return TRUE;
  }
}
