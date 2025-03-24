// File: public/wallet-preload.js

// This script runs before React hydration to ensure crypto is available
(function() {
  try {
    // Polyfill crypto
    if (typeof window !== 'undefined') {
      // Ensure global.crypto exists
      if (typeof global !== 'undefined' && !global.crypto) {
        global.crypto = window.crypto || {};
      }
      
      // Ensure window.crypto exists
      if (!window.crypto) {
        window.crypto = {};
      }
      
      // Add getRandomValues if needed
      if (!window.crypto.getRandomValues) {
        window.crypto.getRandomValues = function(array) {
          for (let i = 0; i < array.length; i++) {
            array[i] = Math.floor(Math.random() * 256);
          }
          return array;
        };
      }
      
      // Create a custom solution for the 'nodeCrypto is not defined' error
      if (typeof window.nodeCrypto === 'undefined') {
        // Simple polyfill just to prevent the error
        window.nodeCrypto = {
          randomBytes: function(size) {
            const bytes = new Uint8Array(size);
            window.crypto.getRandomValues(bytes);
            return bytes;
          }
        };
      }
      
      console.log('Wallet preload script ran successfully');
    }
  } catch (e) {
    console.error('Error in wallet preload script:', e);
  }
})();