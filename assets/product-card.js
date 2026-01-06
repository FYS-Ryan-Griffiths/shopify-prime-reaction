/**
 * Product Card JS
 * Video hover previews and interactions
 */
(function() {
  'use strict';

  class ProductCard {
    constructor(card) {
      this.card = card;
      this.media = card.querySelector('[data-product-media]');
      this.video = card.querySelector('[data-product-video]');
      this.quickView = card.querySelector('[data-quick-view]');
      this.init();
    }

    init() {
      if (this.video) this.setupVideoHover();
      if (this.quickView) this.setupQuickView();
    }

    setupVideoHover() {
      const videoEl = this.video.querySelector('video');
      if (!videoEl) return;

      this.card.addEventListener('mouseenter', () => {
        this.video.style.opacity = '1';
        videoEl.play().catch(() => {});
      });

      this.card.addEventListener('mouseleave', () => {
        this.video.style.opacity = '0';
        videoEl.pause();
        videoEl.currentTime = 0;
      });
    }

    setupQuickView() {
      this.quickView.addEventListener('click', (e) => {
        e.preventDefault();
        const url = this.card.dataset.productUrl;
        if (url) {
          document.dispatchEvent(new CustomEvent('quickview:open', { detail: { url } }));
        }
      });
    }
  }

  // Initialize all product cards
  function initProductCards() {
    document.querySelectorAll('[data-product-card]').forEach(card => {
      if (!card.dataset.initialized) {
        new ProductCard(card);
        card.dataset.initialized = 'true';
      }
    });
  }

  // Run on load and after AJAX updates
  document.addEventListener('DOMContentLoaded', initProductCards);
  document.addEventListener('shopify:section:load', initProductCards);

  // Expose for external use
  window.ProductCard = ProductCard;
})();
