/**
 * Theme Toggle
 * Handles dark/light mode switching with user preference persistence
 * 
 * Features:
 * - Respects system preference (prefers-color-scheme)
 * - Saves user preference to localStorage
 * - Smooth transition between themes
 * - Accessible toggle controls
 */

(function() {
  'use strict';

  const STORAGE_KEY = 'reaxing-theme-preference';
  const DARK_CLASS = 'dark-mode';
  const LIGHT_CLASS = 'light-mode';
  const TRANSITION_CLASS = 'theme-transitioning';

  class ThemeToggle {
    constructor() {
      this.html = document.documentElement;
      this.toggles = [];
      this.currentTheme = this.getInitialTheme();
      
      this.init();
    }

    /**
     * Initialize theme toggle
     */
    init() {
      // Apply initial theme
      this.applyTheme(this.currentTheme, false);

      // Set up toggle buttons
      this.setupToggles();

      // Listen for system preference changes
      this.watchSystemPreference();

      // Listen for storage changes (sync across tabs)
      this.watchStorageChanges();

      // Expose for external use
      window.themeToggle = {
        setTheme: (theme) => this.setTheme(theme),
        getTheme: () => this.currentTheme,
        toggle: () => this.toggle()
      };
    }

    /**
     * Get the initial theme based on saved preference or system preference
     */
    getInitialTheme() {
      // Check for saved preference
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && (saved === 'dark' || saved === 'light')) {
        return saved;
      }

      // Check for system preference
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }

      // Default to light
      return 'light';
    }

    /**
     * Apply theme to document
     */
    applyTheme(theme, animate = true) {
      // Add transition class for smooth change
      if (animate) {
        this.html.classList.add(TRANSITION_CLASS);
        
        // Remove transition class after animation
        setTimeout(() => {
          this.html.classList.remove(TRANSITION_CLASS);
        }, 300);
      }

      // Update classes
      if (theme === 'dark') {
        this.html.classList.add(DARK_CLASS);
        this.html.classList.remove(LIGHT_CLASS);
      } else {
        this.html.classList.add(LIGHT_CLASS);
        this.html.classList.remove(DARK_CLASS);
      }

      // Update color-scheme meta
      this.html.style.colorScheme = theme;

      // Update meta theme-color
      const metaThemeColor = document.querySelector('meta[name="theme-color"]');
      if (metaThemeColor) {
        metaThemeColor.content = theme === 'dark' ? '#1a1a1a' : '#ffffff';
      }

      // Update toggle button states
      this.updateToggleStates(theme);

      // Dispatch event
      document.dispatchEvent(new CustomEvent('theme:changed', {
        detail: { theme }
      }));
    }

    /**
     * Set up all toggle buttons
     */
    setupToggles() {
      // Find all toggle buttons
      this.toggles = document.querySelectorAll('[data-theme-toggle]');

      this.toggles.forEach(toggle => {
        // Set initial state
        toggle.setAttribute('aria-pressed', this.currentTheme === 'dark');

        // Add click handler
        toggle.addEventListener('click', (e) => {
          e.preventDefault();
          this.toggle();
        });

        // Keyboard support
        toggle.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.toggle();
          }
        });
      });

      // Watch for dynamically added toggles
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const newToggles = node.querySelectorAll?.('[data-theme-toggle]') || [];
              newToggles.forEach(toggle => {
                if (!this.toggles.includes(toggle)) {
                  toggle.setAttribute('aria-pressed', this.currentTheme === 'dark');
                  toggle.addEventListener('click', () => this.toggle());
                }
              });
            }
          });
        });
      });

      observer.observe(document.body, { childList: true, subtree: true });
    }

    /**
     * Update toggle button states
     */
    updateToggleStates(theme) {
      this.toggles.forEach(toggle => {
        toggle.setAttribute('aria-pressed', theme === 'dark');
        
        // Update icon visibility
        const lightIcon = toggle.querySelector('.theme-toggle__icon--light');
        const darkIcon = toggle.querySelector('.theme-toggle__icon--dark');
        
        if (lightIcon) lightIcon.style.display = theme === 'dark' ? 'block' : 'none';
        if (darkIcon) darkIcon.style.display = theme === 'light' ? 'block' : 'none';
      });
    }

    /**
     * Toggle between themes
     */
    toggle() {
      const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
      this.setTheme(newTheme);
    }

    /**
     * Set specific theme
     */
    setTheme(theme) {
      if (theme !== 'dark' && theme !== 'light') {
        console.warn('Invalid theme:', theme);
        return;
      }

      this.currentTheme = theme;
      localStorage.setItem(STORAGE_KEY, theme);
      this.applyTheme(theme);
    }

    /**
     * Watch for system preference changes
     */
    watchSystemPreference() {
      if (!window.matchMedia) return;

      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      mediaQuery.addEventListener('change', (e) => {
        // Only auto-switch if user hasn't set a preference
        const saved = localStorage.getItem(STORAGE_KEY);
        if (!saved) {
          this.currentTheme = e.matches ? 'dark' : 'light';
          this.applyTheme(this.currentTheme);
        }
      });
    }

    /**
     * Watch for storage changes (sync across tabs)
     */
    watchStorageChanges() {
      window.addEventListener('storage', (e) => {
        if (e.key === STORAGE_KEY && e.newValue) {
          this.currentTheme = e.newValue;
          this.applyTheme(this.currentTheme);
        }
      });
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new ThemeToggle());
  } else {
    new ThemeToggle();
  }
})();

/**
 * CSS for theme transitions (add to your stylesheet or keep here)
 * 
 * .theme-transitioning,
 * .theme-transitioning *,
 * .theme-transitioning *::before,
 * .theme-transitioning *::after {
 *   transition: 
 *     background-color 0.3s ease,
 *     border-color 0.3s ease,
 *     color 0.3s ease !important;
 * }
 * 
 * [data-theme-toggle] {
 *   position: relative;
 *   display: inline-flex;
 *   align-items: center;
 *   justify-content: center;
 *   width: 40px;
 *   height: 40px;
 *   padding: 0;
 *   background: transparent;
 *   border: none;
 *   border-radius: var(--radius-full);
 *   cursor: pointer;
 *   color: var(--color-foreground);
 *   transition: background-color var(--duration-short) ease;
 * }
 * 
 * [data-theme-toggle]:hover {
 *   background-color: var(--color-background-secondary);
 * }
 * 
 * [data-theme-toggle]:focus-visible {
 *   outline: 2px solid var(--color-focus);
 *   outline-offset: 2px;
 * }
 * 
 * .theme-toggle__icon {
 *   width: 20px;
 *   height: 20px;
 * }
 * 
 * .dark-mode .theme-toggle__icon--light {
 *   display: block;
 * }
 * 
 * .dark-mode .theme-toggle__icon--dark {
 *   display: none;
 * }
 * 
 * .light-mode .theme-toggle__icon--light {
 *   display: none;
 * }
 * 
 * .light-mode .theme-toggle__icon--dark {
 *   display: block;
 * }
 */
