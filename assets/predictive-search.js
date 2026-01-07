/**
 * Predictive Search
 * Live search functionality with AJAX results
 */

class PredictiveSearch extends HTMLElement {
  constructor() {
    super();
    this.input = this.querySelector('input[type="search"]');
    this.results = this.querySelector('[data-predictive-search-results]');
    this.status = this.querySelector('[data-predictive-search-status]');
    this.abortController = null;
    this.cachedResults = {};
    
    this.setupEventListeners();
  }

  setupEventListeners() {
    if (!this.input) return;

    this.input.addEventListener('input', this.debounce((event) => {
      this.onChange(event);
    }, 300).bind(this));

    this.input.addEventListener('focus', this.onFocus.bind(this));
    
    this.addEventListener('focusout', this.onFocusOut.bind(this));
    
    this.addEventListener('keydown', this.onKeydown.bind(this));
  }

  onChange() {
    const searchTerm = this.input.value.trim();
    
    if (!searchTerm.length) {
      this.close();
      return;
    }

    if (searchTerm.length < 2) {
      return;
    }

    this.getSearchResults(searchTerm);
  }

  onFocus() {
    const searchTerm = this.input.value.trim();
    
    if (searchTerm.length >= 2) {
      if (this.cachedResults[searchTerm]) {
        this.renderSearchResults(this.cachedResults[searchTerm]);
      } else {
        this.getSearchResults(searchTerm);
      }
    }
  }

  onFocusOut() {
    setTimeout(() => {
      if (!this.contains(document.activeElement)) {
        this.close();
      }
    }, 200);
  }

  onKeydown(event) {
    if (!this.results) return;

    switch (event.key) {
      case 'ArrowUp':
        event.preventDefault();
        this.navigateResults('up');
        break;
      case 'ArrowDown':
        event.preventDefault();
        this.navigateResults('down');
        break;
      case 'Enter':
        this.selectResult();
        break;
      case 'Escape':
        this.close();
        this.input.focus();
        break;
    }
  }

  navigateResults(direction) {
    const items = this.results.querySelectorAll('[data-predictive-search-item]');
    if (!items.length) return;

    const current = this.results.querySelector('[aria-selected="true"]');
    let index = current ? Array.from(items).indexOf(current) : -1;

    if (direction === 'up') {
      index = index > 0 ? index - 1 : items.length - 1;
    } else {
      index = index < items.length - 1 ? index + 1 : 0;
    }

    items.forEach(item => item.setAttribute('aria-selected', 'false'));
    items[index].setAttribute('aria-selected', 'true');
    items[index].scrollIntoView({ block: 'nearest' });
  }

  selectResult() {
    const selected = this.results.querySelector('[aria-selected="true"]');
    if (selected) {
      const link = selected.querySelector('a');
      if (link) link.click();
    }
  }

  async getSearchResults(searchTerm) {
    if (this.cachedResults[searchTerm]) {
      this.renderSearchResults(this.cachedResults[searchTerm]);
      return;
    }

    // Abort previous request
    if (this.abortController) {
      this.abortController.abort();
    }
    this.abortController = new AbortController();

    this.setLoading(true);

    try {
      const response = await fetch(
        `/search/suggest.json?q=${encodeURIComponent(searchTerm)}&resources[type]=product,article,page&resources[limit]=10`,
        { signal: this.abortController.signal }
      );

      if (!response.ok) throw new Error('Search failed');

      const data = await response.json();
      this.cachedResults[searchTerm] = data;
      this.renderSearchResults(data);
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Search error:', error);
        this.renderError();
      }
    } finally {
      this.setLoading(false);
    }
  }

  renderSearchResults(data) {
    if (!this.results) return;

    const resources = data.resources?.results || {};
    const products = resources.products || [];
    const articles = resources.articles || [];
    const pages = resources.pages || [];
    
    const hasResults = products.length || articles.length || pages.length;

    if (!hasResults) {
      this.results.innerHTML = `
        <div class="predictive-search__no-results">
          <p>No results found for "${this.input.value}"</p>
        </div>
      `;
    } else {
      let html = '';

      if (products.length) {
        html += `
          <div class="predictive-search__group">
            <h3 class="predictive-search__heading">Products</h3>
            <ul class="predictive-search__list" role="listbox">
              ${products.map(product => this.renderProduct(product)).join('')}
            </ul>
          </div>
        `;
      }

      if (articles.length) {
        html += `
          <div class="predictive-search__group">
            <h3 class="predictive-search__heading">Articles</h3>
            <ul class="predictive-search__list" role="listbox">
              ${articles.map(article => this.renderArticle(article)).join('')}
            </ul>
          </div>
        `;
      }

      if (pages.length) {
        html += `
          <div class="predictive-search__group">
            <h3 class="predictive-search__heading">Pages</h3>
            <ul class="predictive-search__list" role="listbox">
              ${pages.map(page => this.renderPage(page)).join('')}
            </ul>
          </div>
        `;
      }

      this.results.innerHTML = html;
    }

    this.open();
    this.updateStatus(hasResults);
  }

  renderProduct(product) {
    const image = product.image || product.featured_image?.url || '';
    const price = this.formatMoney(product.price);
    
    return `
      <li data-predictive-search-item role="option" aria-selected="false">
        <a href="${product.url}" class="predictive-search__item predictive-search__item--product">
          ${image ? `
            <div class="predictive-search__image">
              <img src="${image}" alt="${product.title}" width="60" height="60" loading="lazy">
            </div>
          ` : ''}
          <div class="predictive-search__content">
            <span class="predictive-search__title">${product.title}</span>
            <span class="predictive-search__price">${price}</span>
          </div>
        </a>
      </li>
    `;
  }

  renderArticle(article) {
    return `
      <li data-predictive-search-item role="option" aria-selected="false">
        <a href="${article.url}" class="predictive-search__item">
          <span class="predictive-search__title">${article.title}</span>
        </a>
      </li>
    `;
  }

  renderPage(page) {
    return `
      <li data-predictive-search-item role="option" aria-selected="false">
        <a href="${page.url}" class="predictive-search__item">
          <span class="predictive-search__title">${page.title}</span>
        </a>
      </li>
    `;
  }

  renderError() {
    if (!this.results) return;
    
    this.results.innerHTML = `
      <div class="predictive-search__error">
        <p>An error occurred. Please try again.</p>
      </div>
    `;
    this.open();
  }

  setLoading(isLoading) {
    this.setAttribute('loading', isLoading);
    this.input?.setAttribute('aria-busy', isLoading);
  }

  updateStatus(hasResults) {
    if (!this.status) return;
    
    const count = this.results?.querySelectorAll('[data-predictive-search-item]').length || 0;
    this.status.textContent = hasResults 
      ? `${count} results found` 
      : 'No results found';
  }

  open() {
    this.setAttribute('open', '');
    this.input?.setAttribute('aria-expanded', 'true');
  }

  close() {
    this.removeAttribute('open');
    this.input?.setAttribute('aria-expanded', 'false');
    if (this.results) this.results.innerHTML = '';
  }

  formatMoney(cents) {
    if (typeof theme !== 'undefined' && theme.formatMoney) {
      return theme.formatMoney(cents);
    }
    return '$' + (cents / 100).toFixed(2);
  }

  debounce(fn, wait) {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => fn.apply(this, args), wait);
    };
  }
}

customElements.define('predictive-search', PredictiveSearch);
