/**
 * Global JavaScript
 * Theme utilities, event handling, and core functionality
 */

(function() {
  'use strict';

  // ==========================================================================
  // THEME UTILITIES
  // ==========================================================================

  const Theme = {
    // Debounce function for performance
    debounce(fn, wait) {
      let timer;
      return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => fn.apply(this, args), wait);
      };
    },

    // Throttle function
    throttle(fn, limit) {
      let inThrottle;
      return (...args) => {
        if (!inThrottle) {
          fn.apply(this, args);
          inThrottle = true;
          setTimeout(() => inThrottle = false, limit);
        }
      };
    },

    // Fetch with error handling
    async fetchJSON(url, options = {}) {
      try {
        const response = await fetch(url, {
          ...options,
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...options.headers
          }
        });
        if (!response.ok) throw new Error(response.statusText);
        return await response.json();
      } catch (error) {
        console.error('Fetch error:', error);
        throw error;
      }
    },

    // Format money
    formatMoney(cents, format) {
      if (typeof cents === 'string') cents = cents.replace('.', '');
      const value = (cents / 100).toFixed(2);
      return format ? format.replace('{{amount}}', value) : `$${value}`;
    },

    // Trap focus within element (for modals/drawers)
    trapFocus(element) {
      const focusableElements = element.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstFocusable = focusableElements[0];
      const lastFocusable = focusableElements[focusableElements.length - 1];

      element.addEventListener('keydown', (e) => {
        if (e.key !== 'Tab') return;

        if (e.shiftKey) {
          if (document.activeElement === firstFocusable) {
            lastFocusable.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastFocusable) {
            firstFocusable.focus();
            e.preventDefault();
          }
        }
      });
    }
  };

  // ==========================================================================
  // HEADER
  // ==========================================================================

  class Header {
    constructor() {
      this.header = document.querySelector('[data-header]');
      if (!this.header) return;

      this.lastScrollY = 0;
      this.scrollThreshold = 100;

      this.init();
    }

    init() {
      this.handleScroll = Theme.throttle(() => {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > this.scrollThreshold) {
          this.header.classList.add('is-scrolled');
        } else {
          this.header.classList.remove('is-scrolled');
        }

        this.lastScrollY = currentScrollY;
      }, 100);

      window.addEventListener('scroll', this.handleScroll, { passive: true });
    }
  }

  // ==========================================================================
  // MOBILE NAVIGATION
  // ==========================================================================

  class MobileNav {
    constructor() {
      this.nav = document.querySelector('[data-mobile-nav]');
      this.toggle = document.querySelector('[data-menu-toggle]');
      this.close = document.querySelector('[data-mobile-nav-close]');
      this.overlay = document.querySelector('[data-mobile-nav-overlay]');

      if (!this.nav || !this.toggle) return;

      this.init();
    }

    init() {
      this.toggle.addEventListener('click', () => this.open());
      this.close?.addEventListener('click', () => this.closeNav());
      this.overlay?.addEventListener('click', () => this.closeNav());

      // Accordion toggles
      this.nav.querySelectorAll('[data-mobile-accordion-toggle]').forEach(toggle => {
        toggle.addEventListener('click', (e) => {
          const content = toggle.nextElementSibling;
          const isOpen = toggle.getAttribute('aria-expanded') === 'true';
          
          toggle.setAttribute('aria-expanded', !isOpen);
          content.classList.toggle('is-open', !isOpen);
        });
      });

      // Close on escape
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.nav.classList.contains('is-open')) {
          this.closeNav();
        }
      });
    }

    open() {
      this.nav.classList.add('is-open');
      this.toggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
      Theme.trapFocus(this.nav);
    }

    closeNav() {
      this.nav.classList.remove('is-open');
      this.toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  }

  // ==========================================================================
  // THEME TOGGLE (Dark/Light Mode)
  // ==========================================================================

  class ThemeToggle {
    constructor() {
      this.toggles = document.querySelectorAll('[data-theme-toggle]');
      if (!this.toggles.length) return;

      this.init();
    }

    init() {
      this.toggles.forEach(toggle => {
        toggle.addEventListener('click', () => this.toggle());
      });
    }

    toggle() {
      const isDark = document.documentElement.classList.toggle('dark-mode');
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    }
  }

  // ==========================================================================
  // DROPDOWN MENUS
  // ==========================================================================

  class DropdownMenus {
    constructor() {
      this.dropdowns = document.querySelectorAll('[data-dropdown-toggle]');
      if (!this.dropdowns.length) return;

      this.init();
    }

    init() {
      this.dropdowns.forEach(toggle => {
        const parent = toggle.closest('.has-dropdown');
        
        // Mouse events
        parent.addEventListener('mouseenter', () => {
          toggle.setAttribute('aria-expanded', 'true');
        });
        
        parent.addEventListener('mouseleave', () => {
          toggle.setAttribute('aria-expanded', 'false');
        });

        // Keyboard events
        toggle.addEventListener('click', (e) => {
          e.preventDefault();
          const isOpen = toggle.getAttribute('aria-expanded') === 'true';
          toggle.setAttribute('aria-expanded', !isOpen);
        });
      });
    }
  }

  // ==========================================================================
  // SCROLL ANIMATIONS
  // ==========================================================================

  class ScrollAnimations {
    constructor() {
      this.animatedElements = document.querySelectorAll('[data-animate], [data-animate-stagger]');
      if (!this.animatedElements.length) return;

      this.init();
    }

    init() {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      });

      this.animatedElements.forEach(el => observer.observe(el));
    }
  }

  // ==========================================================================
  // CART (Basic cart count update)
  // ==========================================================================

  class Cart {
    constructor() {
      this.countElements = document.querySelectorAll('[data-cart-count]');
      this.cartToggles = document.querySelectorAll('[data-cart-toggle]');
      
      this.init();
    }

    init() {
      // Listen for cart updates
      document.addEventListener('cart:updated', (e) => {
        this.updateCount(e.detail.itemCount);
      });

      // Cart toggle click
      this.cartToggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
          e.preventDefault();
          document.dispatchEvent(new CustomEvent('cart:open'));
        });
      });
    }

    updateCount(count) {
      this.countElements.forEach(el => {
        el.textContent = count;
        el.classList.toggle('hidden', count === 0);
      });
    }

    static async add(variantId, quantity = 1) {
      const response = await Theme.fetchJSON('/cart/add.js', {
        method: 'POST',
        body: JSON.stringify({
          id: variantId,
          quantity: quantity
        })
      });

      const cart = await Theme.fetchJSON('/cart.js');
      document.dispatchEvent(new CustomEvent('cart:updated', { 
        detail: { itemCount: cart.item_count, cart: cart }
      }));

      return response;
    }
  }

  // ==========================================================================
  // INITIALIZE
  // ==========================================================================

  document.addEventListener('DOMContentLoaded', () => {
    new Header();
    new MobileNav();
    new ThemeToggle();
    new DropdownMenus();
    new ScrollAnimations();
    new Cart();
  });

  // Expose Theme utilities globally
  window.Theme = Theme;
  window.Cart = Cart;

})();
