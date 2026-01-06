/**
 * Facets (Collection Filtering)
 * AJAX-powered filtering and sorting
 */

(function() {
  'use strict';

  class Facets {
    constructor() {
      this.facets = document.querySelector('[data-facets]');
      if (!this.facets) return;

      this.drawer = this.facets.querySelector('[data-facets-drawer]');
      this.form = this.facets.querySelector('[data-facets-form]');
      this.sortSelect = this.facets.querySelector('[data-sort-by]');
      this.productsContainer = document.querySelector('[data-products-container]');
      
      this.init();
    }

    init() {
      // Toggle drawer
      document.querySelectorAll('[data-facets-toggle]').forEach(toggle => {
        toggle.addEventListener('click', () => this.toggleDrawer());
      });

      // Close drawer
      document.querySelectorAll('[data-facets-close]').forEach(close => {
        close.addEventListener('click', () => this.closeDrawer());
      });

      // Sort change
      this.sortSelect?.addEventListener('change', (e) => {
        this.handleSort(e.target.value);
      });

      // Form submission
      this.form?.addEventListener('submit', (e) => {
        e.preventDefault();
        this.applyFilters();
      });

      // Checkbox changes (for instant filtering on desktop)
      this.form?.addEventListener('change', (e) => {
        if (e.target.matches('input[type="checkbox"]')) {
          // Only auto-apply on larger screens
          if (window.innerWidth >= 768) {
            this.applyFilters();
          }
        }
      });

      // Price range changes (debounced)
      let priceTimeout;
      this.form?.addEventListener('input', (e) => {
        if (e.target.matches('.facets__price-field input')) {
          clearTimeout(priceTimeout);
          priceTimeout = setTimeout(() => {
            if (window.innerWidth >= 768) {
              this.applyFilters();
            }
          }, 500);
        }
      });

      // Escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.drawer?.classList.contains('is-open')) {
          this.closeDrawer();
        }
      });

      // Handle browser back/forward
      window.addEventListener('popstate', () => {
        this.loadPage(window.location.href, false);
      });
    }

    toggleDrawer() {
      this.drawer?.classList.toggle('is-open');
      const isOpen = this.drawer?.classList.contains('is-open');
      document.body.style.overflow = isOpen ? 'hidden' : '';
    }

    closeDrawer() {
      this.drawer?.classList.remove('is-open');
      document.body.style.overflow = '';
    }

    handleSort(sortValue) {
      const url = new URL(window.location.href);
      url.searchParams.set('sort_by', sortValue);
      this.loadPage(url.toString());
    }

    applyFilters() {
      const formData = new FormData(this.form);
      const url = new URL(window.location.href);
      
      // Clear existing filter params
      const keysToRemove = [];
      url.searchParams.forEach((value, key) => {
        if (key.startsWith('filter.')) {
          keysToRemove.push(key);
        }
      });
      keysToRemove.forEach(key => url.searchParams.delete(key));

      // Add new filter params
      formData.forEach((value, key) => {
        if (value) {
          url.searchParams.append(key, value);
        }
      });

      this.loadPage(url.toString());
      this.closeDrawer();
    }

    async loadPage(url, pushState = true) {
      // Show loading state
      this.productsContainer?.classList.add('is-loading');
      
      try {
        const response = await fetch(url);
        const html = await response.text();
        
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        
        // Update products
        const newProducts = doc.querySelector('[data-products-container]');
        if (newProducts && this.productsContainer) {
          this.productsContainer.innerHTML = newProducts.innerHTML;
        }

        // Update facets
        const newFacets = doc.querySelector('[data-facets]');
        if (newFacets && this.facets) {
          this.facets.innerHTML = newFacets.innerHTML;
          // Reinitialize
          this.drawer = this.facets.querySelector('[data-facets-drawer]');
          this.form = this.facets.querySelector('[data-facets-form]');
          this.sortSelect = this.facets.querySelector('[data-sort-by]');
        }

        // Update URL
        if (pushState) {
          window.history.pushState({}, '', url);
        }

        // Scroll to top of products
        this.productsContainer?.scrollIntoView({ behavior: 'smooth', block: 'start' });

      } catch (error) {
        console.error('Error loading page:', error);
      } finally {
        this.productsContainer?.classList.remove('is-loading');
      }
    }
  }

  // Initialize
  document.addEventListener('DOMContentLoaded', () => {
    window.facets = new Facets();
  });

})();
