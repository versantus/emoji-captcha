(function (Drupal, once) {
  'use strict';

  // Simple sentiment analysis function
  function analyzeSentiment(text) {
    const positiveWords = ['love', 'happy', 'great', 'amazing', 'wonderful', 'excellent', 'good', 'best', 'beautiful', 'fantastic'];
    const negativeWords = ['hate', 'bad', 'terrible', 'awful', 'horrible', 'worst', 'stupid', 'ugly', 'poor', 'disgusting'];
    
    let score = 0;
    const words = text.toLowerCase().split(/\s+/);
    
    words.forEach(word => {
      if (positiveWords.includes(word)) score += 1;
      if (negativeWords.includes(word)) score -= 1;
    });
    
    console.log('Analyzing sentiment for:', text, 'Score:', score);
    return score;
  }

  Drupal.behaviors.emojiCaptcha = {
    attach: function (context, settings) {
      console.log('Attaching emoji-captcha behavior');
      once('emoji-captcha', 'fieldset.captcha-type-challenge--emoji', context).forEach(function (fieldset) {
        console.log('Processing CAPTCHA fieldset:', fieldset);
        
        // Find the emoji text node
        const emojiNode = fieldset.querySelector('.emoji-captcha-display');
        if (!emojiNode) {
          console.log('No emoji node found in:', fieldset);
          return;
        }
        
        // Get the one-time token
        const token = settings.emojiCaptcha?.token;
        if (!token) {
          console.log('No token found in settings');
          return;
        }
        
        console.log('Found emoji node:', emojiNode.textContent);

        // Find the input field
        const input = fieldset.querySelector('#edit-captcha-response');
        if (!input) {
          console.log('No input field found');
          return;
        }
        console.log('Found input field:', input);

        console.log('Found all elements:', { fieldset, emojiNode, input });

        // Add event listener to input field
        input.addEventListener('input', function(e) {
          const text = e.target.value;
          console.log('Input text:', text);
          
          if (!text.trim()) {
            emojiNode.textContent = '😐';
            return;
          }

          const score = analyzeSentiment(text);
          console.log('Sentiment score:', score);
          
          if (score > 2) {
            emojiNode.textContent = '😊';
          } else if (score < 0) {
            emojiNode.textContent = '😠';
          } else {
            emojiNode.textContent = '😐';
          }
        });
      });
    }
  };
})(Drupal, once);
