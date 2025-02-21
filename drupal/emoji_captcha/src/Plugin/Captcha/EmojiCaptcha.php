<?php

namespace Drupal\emoji_captcha\Plugin\Captcha;

use Drupal\Core\Form\FormStateInterface;
use Drupal\captcha\Plugin\CaptchaBase;
use Drupal\Core\Plugin\ContainerFactoryPluginInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Drupal\emoji_captcha\Service\OneTimeTokenManager;

/**
 * Provides emoji captcha.
 *
 * @Captcha(
 *   id = "Emoji",
 *   admin_label = @Translation("Emoji (from module emoji_captcha)"),
 *   module = "emoji_captcha"
 * )
 */
class EmojiCaptcha extends CaptchaBase implements ContainerFactoryPluginInterface {
  
  /**
   * The one-time token manager.
   *
   * @var \Drupal\emoji_captcha\Service\OneTimeTokenManager
   */
  protected $tokenManager;

  /**
   * Constructs a new EmojiCaptcha.
   *
   * @param array $configuration
   *   A configuration array containing information about the plugin instance.
   * @param string $plugin_id
   *   The plugin_id for the plugin instance.
   * @param mixed $plugin_definition
   *   The plugin implementation definition.
   * @param \Drupal\emoji_captcha\Service\OneTimeTokenManager $token_manager
   *   The one-time token manager service.
   */
  public function __construct(array $configuration, $plugin_id, $plugin_definition, OneTimeTokenManager $token_manager) {
    parent::__construct($configuration, $plugin_id, $plugin_definition);
    $this->tokenManager = $token_manager;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container, array $configuration, $plugin_id, $plugin_definition) {
    return new static(
      $configuration,
      $plugin_id,
      $plugin_definition,
      $container->get('emoji_captcha.token_manager')
    );
  }

  /**
   * {@inheritdoc}
   */
  public function buildCaptchaForm() {
    $token = $this->tokenManager->generateToken();
    
    $form['captcha_response'] = [
      '#type' => 'container',
      '#attributes' => [
        'id' => 'emoji-verification',
      ],
    ];
    
    $form['captcha_token'] = [
      '#type' => 'hidden',
      '#value' => $token,
    ];
    
    $form['#attached']['library'][] = 'emoji_captcha/emoji-captcha';
    $form['#attached']['drupalSettings']['emojiCaptcha']['token'] = $token;
    
    return $form;
  }
  
  /**
   * {@inheritdoc}
   */
  public function validateResponse($response) {
    // Get the token from the form state
    $token = \Drupal::request()->request->get('captcha_token');
    
    // Validate the token first
    if (!$this->tokenManager->validateToken($token)) {
      return FALSE;
    }
    
    // Then validate the sentiment score
    return $response > 2; // Using same threshold as emoji-captcha
  }
}
