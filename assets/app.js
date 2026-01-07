/**
 * App.js - Main Application Entry Point
 * Initializes theme functionality and coordinates modules
 */

(function() {
  'use strict';

  // Theme namespace
  window.theme = window.theme || {};

  /**
   * Initialize all theme modules
   */
  theme.init = function() {
    theme.initAccessibility();
    theme.initFocusManagement();
    theme.initSmoothScroll();
    theme.initLazyLoad();
  };

  /**
   * Accessibility helpers
   */
  theme.initAccessibility = function() {
    // Add js class to html
    document.documentElement.classList.remove('no-js');
    document.documentElement.classList.add('js');

    // Skip to content link
    const skipLink = document.querySelector('.skip-to-content');
    if (skipLink) {
      skipLink.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.setAttribute('tabindex', '-1');
          target.focus();
        }
      });
    }
  };

  /**
   * Focus management for modals and drawers
   */
  theme.initFocusManagement = function() {
    theme.trapFocus = function(container, elementToFocus) {
      const focusableElements = container.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      const firstFocusable = focusableElements[0];
      const lastFocusable = focusableElements[focusableElements.length - 1];
      
      if (elementToFocus) {
        elementToFocus.focus();
      } else if (firstFocusable) {
        firstFocusable.focus();
      }

      container.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
          if (e.shiftKey) {
            if (document.activeElement === firstFocusable) {
              e.preventDefault();
              lastFocusable.focus();
            }
          } else {
            if (document.activeElement === lastFocusable) {
              e.preventDefault();
              firstFocusable.focus();
            }
          }
        }
      });
    };

    theme.removeTrapFocus = function(elementToFocus) {
      if (elementToFocus) elementToFocus.focus();
    };
  };

  /**
   * Smooth scrolling for anchor links
   */
  theme.initSmoothScroll = function() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  };

  /**
   * Initialize lazy loading for images
   */
  theme.initLazyLoad = function() {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
            }
            if (img.dataset.srcset) {
              img.srcset = img.dataset.srcset;
              img.removeAttribute('data-srcset');
            }
            img.classList.add('loaded');
            observer.unobserve(img);
          }
        });
      }, {
        rootMargin: '50px 0px',
        threshold: 0.01
      });

      document.querySelectorAll('img[data-src], img[data-srcset]').forEach(img => {
        imageObserver.observe(img);
      });
    }
  };

  /**
   * Utility: Debounce function
   */
  theme.debounce = function(func, wait, immediate) {
    let timeout;
    return function() {
      const context = this, args = arguments;
      const later = function() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  };

  /**
   * Utility: Throttle function
   */
  theme.throttle = function(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  };

  /**
   * Utility: Format money
   */
  theme.formatMoney = function(cents, format) {
    if (typeof cents === 'string') cents = cents.replace('.', '');
    
    const value = '';
    const placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;
    
    function formatWithDelimiters(number, precision, thousands, decimal) {
      precision = precision || 2;
      thousands = thousands || ',';
      decimal = decimal || '.';

      if (isNaN(number) || number == null) return 0;

      number = (number / 100.0).toFixed(precision);

      const parts = number.split('.');
      const dollarsAmount = parts[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1' + thousands);
      const centsAmount = parts[1] ? decimal + parts[1] : '';

      return dollarsAmount + centsAmount;
    }

    switch (format || '${{amount}}') {
      case '{{ amount }}':
      case '{{amount}}':
        return formatWithDelimiters(cents, 2);
      case '{{ amount_no_decimals }}':
      case '{{amount_no_decimals}}':
        return formatWithDelimiters(cents, 0);
      case '{{ amount_with_comma_separator }}':
      case '{{amount_with_comma_separator}}':
        return formatWithDelimiters(cents, 2, '.', ',');
      case '{{ amount_no_decimals_with_comma_separator }}':
      case '{{amount_no_decimals_with_comma_separator}}':
        return formatWithDelimiters(cents, 0, '.', ',');
      default:
        return format.replace(placeholderRegex, formatWithDelimiters(cents, 2));
    }
  };

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', theme.init);
  } else {
    theme.init();
  }
})();
