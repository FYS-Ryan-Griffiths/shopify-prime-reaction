/**
 * Analytics Data Layer
 * GTM/GA4 event tracking and email platform integration
 */

(function() {
  'use strict';

  // Initialize data layer
  window.dataLayer = window.dataLayer || [];

  /**
   * Analytics Manager
   */
  class Analytics {
    constructor() {
      this.init();
    }

    init() {
      this.trackPageView();
      this.setupEcommerceTracking();
      this.setupFormTracking();
      this.setupSearchTracking();
      this.setupCartTracking();
      this.setupQuoteTracking();
    }

    /**
     * Push event to data layer
     */
    push(event, data = {}) {
      window.dataLayer.push({
        event: event,
        ...data,
        timestamp: new Date().toISOString()
      });
    }

    /**
     * Track page view
     */
    trackPageView() {
      const pageData = {
        event: 'page_view',
        page_type: window.Shopify?.designMode ? 'theme_editor' : this.getPageType(),
        page_title: document.title,
        page_path: window.location.pathname
      };

      // Add template info
      const body = document.body;
      if (body.classList.contains('template-product')) {
        pageData.product_id = this.getMetaContent('product:id');
        pageData.product_name = this.getMetaContent('og:title');
      } else if (body.classList.contains('template-collection')) {
        pageData.collection_handle = window.location.pathname.split('/').pop();
      }

      this.push('page_view', pageData);
    }

    /**
     * Get page type from body class
     */
    getPageType() {
      const body = document.body;
      if (body.classList.contains('template-index')) return 'home';
      if (body.classList.contains('template-product')) return 'product';
      if (body.classList.contains('template-collection')) return 'collection';
      if (body.classList.contains('template-cart')) return 'cart';
      if (body.classList.contains('template-search')) return 'search';
      if (body.classList.contains('template-page')) return 'page';
      if (body.classList.contains('template-blog')) return 'blog';
      if (body.classList.contains('template-article')) return 'article';
      if (body.classList.contains('template-customers-login')) return 'login';
      if (body.classList.contains('template-customers-account')) return 'account';
      return 'other';
    }

    /**
     * Get meta tag content
     */
    getMetaContent(name) {
      const meta = document.querySelector(`meta[property="${name}"], meta[name="${name}"]`);
      return meta ? meta.content : null;
    }

    /**
     * E-commerce tracking
     */
    setupEcommerceTracking() {
      // Product view
      if (document.body.classList.contains('template-product')) {
        this.trackProductView();
      }

      // Collection view
      if (document.body.classList.contains('template-collection')) {
        this.trackCollectionView();
      }
    }

    trackProductView() {
      const productJson = document.querySelector('[data-product-json]');
      if (!productJson) return;

      try {
        const product = JSON.parse(productJson.textContent);
        this.push('view_item', {
          currency: window.Shopify?.currency?.active || 'USD',
          value: product.price / 100,
          items: [{
            item_id: product.id,
            item_name: product.title,
            item_brand: product.vendor,
            item_category: product.type,
            price: product.price / 100,
            quantity: 1
          }]
        });

        // Klaviyo viewed product
        if (window._learnq) {
          window._learnq.push(['track', 'Viewed Product', {
            ProductID: product.id,
            ProductName: product.title,
            ProductURL: window.location.href,
            ImageURL: product.featured_image,
            Brand: product.vendor,
            Price: product.price / 100,
            Categories: [product.type]
          }]);
        }
      } catch (e) {
        console.error('Analytics: Error tracking product view', e);
      }
    }

    trackCollectionView() {
      const collectionTitle = document.querySelector('.collection-header__title, h1')?.textContent;
      const productCards = document.querySelectorAll('[data-product-card]');
      
      const items = [];
      productCards.forEach((card, index) => {
        const id = card.dataset.productId;
        const title = card.querySelector('.product-card__title')?.textContent;
        const price = card.querySelector('.product-card__price')?.dataset.price;
        
        if (id && title) {
          items.push({
            item_id: id,
            item_name: title.trim(),
            price: price ? parseFloat(price) / 100 : 0,
            index: index
          });
        }
      });

      if (items.length) {
        this.push('view_item_list', {
          item_list_name: collectionTitle || 'Collection',
          items: items.slice(0, 20) // Limit to first 20
        });
      }
    }

    /**
     * Form tracking
     */
    setupFormTracking() {
      // Newsletter forms
      document.querySelectorAll('.newsletter-signup-form, [action*="contact"]').forEach(form => {
        form.addEventListener('submit', (e) => {
          const formType = form.classList.contains('newsletter-signup-form') ? 'newsletter' : 'contact';
          this.push('form_submit', {
            form_type: formType,
            form_id: form.id || 'unknown'
          });
        });
      });

      // Customer login
      document.querySelectorAll('form[action*="login"]').forEach(form => {
        form.addEventListener('submit', () => {
          this.push('login_attempt', { method: 'email' });
        });
      });

      // Customer registration
      document.querySelectorAll('form[action*="register"]').forEach(form => {
        form.addEventListener('submit', () => {
          this.push('sign_up', { method: 'email' });
        });
      });
    }

    /**
     * Search tracking
     */
    setupSearchTracking() {
      // Track search queries
      const searchInput = document.querySelector('[name="q"]');
      if (searchInput) {
        const form = searchInput.closest('form');
        if (form) {
          form.addEventListener('submit', () => {
            const query = searchInput.value.trim();
            if (query) {
              this.push('search', {
                search_term: query
              });

              // Klaviyo search
              if (window._learnq) {
                window._learnq.push(['track', 'Searched Site', {
                  SearchTerm: query
                }]);
              }
            }
          });
        }
      }

      // Track search results page
      if (window.location.pathname.includes('/search')) {
        const params = new URLSearchParams(window.location.search);
        const query = params.get('q');
        const resultsCount = document.querySelectorAll('.search-results__item').length;
        
        if (query) {
          this.push('view_search_results', {
            search_term: query,
            results_count: resultsCount
          });
        }
      }
    }

    /**
     * Cart tracking
     */
    setupCartTracking() {
      // Listen for cart updates
      document.addEventListener('cart:updated', (e) => {
        const cart = e.detail?.cart;
        if (cart) {
          this.push('cart_updated', {
            currency: cart.currency || 'USD',
            value: cart.total_price / 100,
            items_count: cart.item_count
          });
        }
      });

      // Add to cart
      document.addEventListener('cart:add', (e) => {
        const item = e.detail?.item;
        if (item) {
          this.push('add_to_cart', {
            currency: window.Shopify?.currency?.active || 'USD',
            value: item.price / 100,
            items: [{
              item_id: item.product_id,
              item_name: item.product_title,
              item_variant: item.variant_title,
              price: item.price / 100,
              quantity: item.quantity
            }]
          });

          // Klaviyo added to cart
          if (window._learnq) {
            window._learnq.push(['track', 'Added to Cart', {
              ProductID: item.product_id,
              ProductName: item.product_title,
              Quantity: item.quantity,
              Price: item.price / 100,
              AddedItemImageURL: item.image
            }]);
          }
        }
      });

      // Remove from cart
      document.addEventListener('cart:remove', (e) => {
        const item = e.detail?.item;
        if (item) {
          this.push('remove_from_cart', {
            currency: window.Shopify?.currency?.active || 'USD',
            value: item.price / 100,
            items: [{
              item_id: item.product_id,
              item_name: item.product_title,
              item_variant: item.variant_title,
              price: item.price / 100,
              quantity: item.quantity
            }]
          });
        }
      });

      // Begin checkout (cart page)
      if (document.body.classList.contains('template-cart')) {
        this.trackBeginCheckout();
      }

      // Checkout button clicks
      document.querySelectorAll('[name="checkout"], .cart__checkout-button').forEach(btn => {
        btn.addEventListener('click', () => this.trackBeginCheckout());
      });
    }

    trackBeginCheckout() {
      fetch('/cart.js')
        .then(r => r.json())
        .then(cart => {
          const items = cart.items.map(item => ({
            item_id: item.product_id,
            item_name: item.product_title,
            item_variant: item.variant_title,
            price: item.price / 100,
            quantity: item.quantity
          }));

          this.push('begin_checkout', {
            currency: cart.currency || 'USD',
            value: cart.total_price / 100,
            items: items
          });

          // Klaviyo started checkout
          if (window._learnq) {
            window._learnq.push(['track', 'Started Checkout', {
              ItemCount: cart.item_count,
              CartTotal: cart.total_price / 100,
              Items: cart.items.map(i => ({
                ProductID: i.product_id,
                ProductName: i.product_title,
                Quantity: i.quantity,
                Price: i.price / 100
              }))
            }]);
          }
        });
    }

    /**
     * Quote tracking (B2B)
     */
    setupQuoteTracking() {
      // Quote form submissions
      document.addEventListener('quote:submitted', (e) => {
        const data = e.detail || {};
        this.push('quote_request', {
          items_count: data.items?.length || 0,
          total_value: data.total || 0
        });

        // Klaviyo quote request
        if (window._learnq && data.email) {
          window._learnq.push(['identify', { $email: data.email }]);
          window._learnq.push(['track', 'Quote Requested', {
            ItemCount: data.items?.length || 0,
            Items: data.items || []
          }]);
        }
      });

      // Quote add item
      document.addEventListener('quote:add', (e) => {
        const item = e.detail?.item;
        if (item) {
          this.push('add_to_quote', {
            item_id: item.product_id,
            item_name: item.title
          });
        }
      });
    }
  }

  // Initialize when DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new Analytics());
  } else {
    new Analytics();
  }

  // Expose for external use
  window.Analytics = Analytics;

})();
