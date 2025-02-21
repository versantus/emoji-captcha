<?php

namespace Drupal\emoji_captcha\Plugin\Captcha;

use Drupal\captcha\Plugin\CaptchaBase;

/**
 * Emoji Captcha.
 *
 * @Captcha(
 *   id = "emoji_captcha",
 *   title = @Translation("Emoji Captcha"),
 *   description = @Translation("Emoji-based CAPTCHA using sentiment analysis.")
 * )
 */
class EmojiCaptcha extends CaptchaBase {
  
  /**
   * {@inheritdoc}
   */
  public function buildCaptchaForm() {
    $form['captcha_response'] = [
      '#type' => 'container',
      '#attributes' => [
        'id' => 'emoji-verification',
      ],
    ];
    
    $form['#attached']['library'][] = 'emoji_captcha/emoji-captcha';
    
    return $form;
  }
  
  /**
   * {@inheritdoc}
   */
  public function validateResponse($response) {
    // Implement sentiment validation logic
    return $response > 2; // Using same threshold as emoji-captcha
  }
}
