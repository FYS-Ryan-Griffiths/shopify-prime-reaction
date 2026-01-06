/**
 * Predictive Search
 * Instant search with keyboard navigation and product/page results
 */

(function() {
  'use strict';

  class PredictiveSearch {
    constructor() {
      this.modal = document.querySelector('[data-search-modal]');
      this.input = document.querySelector('[data-search-input]');
      this.resultsContainer = document.querySelector('[data-search-results]');
      this.openTriggers = document.querySelectorAll('[data-search-open]');
      this.closeTriggers = document.querySelectorAll('[data-search-close]');
      
      if (!this.modal || !this.input) return;

      this.cache = {};
      this.selectedIndex = -1;
      this.debounceTimeout = null;
      this.abortController = null;
      
      this.init();
    }

    init() {
      // Open triggers
      this.openTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
          e.preventDefault();
          this.open();
        });
      });

      // Close triggers
      this.closeTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => this.close());
      });

      // Keyboard shortcuts
      document.addEventListener('keydown', (e) => {
        // Open with Cmd/Ctrl + K
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
          e.preventDefault();
          this.open();
        }
        
        // Close with Escape
        if (e.key === 'Escape' && this.modal.classList.contains('is-active')) {
          this.close();
        }
      });

      // Input events
      this.input.addEventListener('input', (e) => this.handleInput(e));
      this.input.addEventListener('keydown', (e) => this.handleKeydown(e));

      // Click outside
      this.modal.addEventListener('click', (e) => {
        if (e.target === this.modal.querySelector('.search-modal__overlay')) {
          this.close();
        }
      });
    }

    open() {
      this.modal.classList.add('is-active');
      document.body.classList.add('overflow-hidden');
      
      // Focus input after animation
      setTimeout(() => {
        this.input.focus();
      }, 100);

      // Track event
      this.trackEvent('search_opened');
    }

    close() {
      this.modal.classList.remove('is-active');
      document.body.classList.remove('overflow-hidden');
      this.input.value = '';
      this.resultsContainer.innerHTML = '';
      this.selectedIndex = -1;
    }

    handleInput(e) {
      const query = e.target.value.trim();
      
      clearTimeout(this.debounceTimeout);
      
      if (query.length < 2) {
        this.resultsContainer.innerHTML = '';
        return;
      }

      // Show loading state
      this.resultsContainer.innerHTML = `
        <div class="search-results__loading">
          <span class="spinner"></span>
          Searching...
        </div>
      `;

      // Debounce search
      this.debounceTimeout = setTimeout(() => {
        this.search(query);
      }, 200);
    }

    handleKeydown(e) {
      const results = this.resultsContainer.querySelectorAll('[data-search-result]');
      
      if (!results.length) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          this.selectedIndex = Math.min(this.selectedIndex + 1, results.length - 1);
          this.updateSelection(results);
          break;
          
        case 'ArrowUp':
          e.preventDefault();
          this.selectedIndex = Math.max(this.selectedIndex - 1, -1);
          this.updateSelection(results);
          break;
          
        case 'Enter':
          if (this.selectedIndex >= 0 && results[this.selectedIndex]) {
            e.preventDefault();
            const link = results[this.selectedIndex].querySelector('a');
            if (link) {
              window.location.href = link.href;
            }
          }
          break;
      }
    }

    updateSelection(results) {
      results.forEach((result, index) => {
        result.classList.toggle('is-selected', index === this.selectedIndex);
      });

      // Scroll selected into view
      if (this.selectedIndex >= 0 && results[this.selectedIndex]) {
        results[this.selectedIndex].scrollIntoView({ block: 'nearest' });
      }
    }

    async search(query) {
      // Check cache
      if (this.cache[query]) {
        this.renderResults(this.cache[query], query);
        return;
      }

      // Cancel previous request
      if (this.abortController) {
        this.abortController.abort();
      }
      this.abortController = new AbortController();

      try {
        const response = await fetch(
          `/search/suggest.json?q=${encodeURIComponent(query)}&resources[type]=product,article,page&resources[limit]=8&resources[options][unavailable_products]=last`,
          { signal: this.abortController.signal }
        );

        if (!response.ok) throw new Error('Search failed');

        const data = await response.json();
        
        // Cache results
        this.cache[query] = data;
        
        this.renderResults(data, query);
        
        // Track search
        this.trackEvent('search_performed', { query, results_count: this.getResultsCount(data) });
        
      } catch (error) {
        if (error.name === 'AbortError') return;
        
        console.error('Search error:', error);
        this.resultsContainer.innerHTML = `
          <div class="search-results__error">
            <p>Something went wrong. Please try again.</p>
          </div>
        `;
      }
    }

    getResultsCount(data) {
      let count = 0;
      if (data.resources?.results) {
        count += data.resources.results.products?.length || 0;
        count += data.resources.results.articles?.length || 0;
        count += data.resources.results.pages?.length || 0;
      }
      return count;
    }

    renderResults(data, query) {
      const resources = data.resources?.results || {};
      const products = resources.products || [];
      const articles = resources.articles || [];
      const pages = resources.pages || [];

      if (!products.length && !articles.length && !pages.length) {
        this.resultsContainer.innerHTML = `
          <div class="search-results__empty">
            <p>No results found for "<strong>${this.escapeHtml(query)}</strong>"</p>
            <p class="search-results__empty-hint">Try different keywords or browse our collections</p>
          </div>
        `;
        return;
      }

      let html = '';

      // Products
      if (products.length) {
        html += `
          <div class="search-results__section">
            <h3 class="search-results__section-title">Products</h3>
            <div class="search-results__products">
              ${products.map(product => this.renderProductResult(product)).join('')}
            </div>
          </div>
        `;
      }

      // Articles
      if (articles.length) {
        html += `
          <div class="search-results__section">
            <h3 class="search-results__section-title">Articles</h3>
            <div class="search-results__articles">
              ${articles.map(article => this.renderArticleResult(article)).join('')}
            </div>
          </div>
        `;
      }

      // Pages
      if (pages.length) {
        html += `
          <div class="search-results__section">
            <h3 class="search-results__section-title">Pages</h3>
            <div class="search-results__pages">
              ${pages.map(page => this.renderPageResult(page)).join('')}
            </div>
          </div>
        `;
      }

      // View all link
      html += `
        <div class="search-results__footer">
          <a href="/search?q=${encodeURIComponent(query)}" class="search-results__view-all">
            View all results
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 12l4-4-4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </a>
        </div>
      `;

      this.resultsContainer.innerHTML = html;
      this.selectedIndex = -1;
    }

    renderProductResult(product) {
      const image = product.featured_image?.url 
        ? product.featured_image.url.replace(/\.([^.]+)$/, '_200x200.$1')
        : '/assets/placeholder.svg';
      
      const price = this.formatMoney(product.price);
      const comparePrice = product.compare_at_price_max > product.price 
        ? this.formatMoney(product.compare_at_price_max) 
        : null;

      return `
        <div class="search-result search-result--product" data-search-result>
          <a href="${product.url}" class="search-result__link">
            <div class="search-result__image">
              <img src="${image}" alt="${this.escapeHtml(product.title)}" loading="lazy" width="60" height="60">
            </div>
            <div class="search-result__content">
              <h4 class="search-result__title">${this.highlightMatch(product.title)}</h4>
              ${product.vendor ? `<span class="search-result__vendor">${this.escapeHtml(product.vendor)}</span>` : ''}
              <div class="search-result__price">
                ${comparePrice ? `<s class="search-result__compare-price">${comparePrice}</s>` : ''}
                <span class="search-result__current-price${comparePrice ? ' search-result__current-price--sale' : ''}">${price}</span>
              </div>
            </div>
          </a>
        </div>
      `;
    }

    renderArticleResult(article) {
      const image = article.featured_image?.url
        ? article.featured_image.url.replace(/\.([^.]+)$/, '_100x100.$1')
        : null;

      return `
        <div class="search-result search-result--article" data-search-result>
          <a href="${article.url}" class="search-result__link">
            ${image ? `
              <div class="search-result__image">
                <img src="${image}" alt="${this.escapeHtml(article.title)}" loading="lazy" width="60" height="60">
              </div>
            ` : ''}
            <div class="search-result__content">
              <span class="search-result__type">Article</span>
              <h4 class="search-result__title">${this.highlightMatch(article.title)}</h4>
            </div>
          </a>
        </div>
      `;
    }

    renderPageResult(page) {
      return `
        <div class="search-result search-result--page" data-search-result>
          <a href="${page.url}" class="search-result__link">
            <div class="search-result__content">
              <span class="search-result__type">Page</span>
              <h4 class="search-result__title">${this.highlightMatch(page.title)}</h4>
            </div>
          </a>
        </div>
      `;
    }

    highlightMatch(text) {
      const query = this.input.value.trim();
      if (!query) return this.escapeHtml(text);
      
      const regex = new RegExp(`(${this.escapeRegex(query)})`, 'gi');
      return this.escapeHtml(text).replace(regex, '<mark>$1</mark>');
    }

    escapeHtml(text) {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    }

    escapeRegex(string) {
      return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    formatMoney(cents) {
      const amount = cents / 100;
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: window.Shopify?.currency?.active || 'USD'
      }).format(amount);
    }

    trackEvent(eventName, data = {}) {
      if (window.dataLayer) {
        window.dataLayer.push({
          event: eventName,
          ...data
        });
      }
    }
  }

  // Initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new PredictiveSearch());
  } else {
    new PredictiveSearch();
  }
})();
