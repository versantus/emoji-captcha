(function (Drupal) {
  'use strict';

  Drupal.behaviors.emojiCaptcha = {
    attach: function (context, settings) {
      const containers = context.querySelectorAll('#emoji-verification');
      containers.forEach(container => {
        if (container.hasAttribute('data-processed')) {
          return;
        }

        // Create emoji display element
        const emojiDisplay = document.createElement('div');
        emojiDisplay.style.fontSize = '2em';
        emojiDisplay.textContent = '😐';
        container.appendChild(emojiDisplay);

        // Create input element
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'Type something nice to make the emoji smile...';
        input.className = 'form-text';
        container.appendChild(input);

        // Hidden input for form submission
        const hiddenInput = document.createElement('input');
        hiddenInput.type = 'hidden';
        hiddenInput.name = 'captcha_response';
        container.appendChild(hiddenInput);

        // Initialize sentiment analysis
        const sentiment = require('sentiment');
        const analyzer = new sentiment();

        input.addEventListener('input', function(e) {
          const text = e.target.value;
          if (!text.trim()) {
            emojiDisplay.textContent = '😐';
            hiddenInput.value = '0';
            return;
          }

          const result = analyzer.analyze(text);
          hiddenInput.value = result.score.toString();

          if (result.score > 2) {
            emojiDisplay.textContent = '😊';
          } else if (result.score < 0) {
            emojiDisplay.textContent = '😠';
          } else {
            emojiDisplay.textContent = '😐';
          }
        });

        container.setAttribute('data-processed', 'true');
      });
    }
  };
})(Drupal);
