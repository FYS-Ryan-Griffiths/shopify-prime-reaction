/**
 * Quick View Modal
 * Product quick view without leaving the page
 */

(function() {
  'use strict';

  class QuickView {
    constructor() {
      this.modal = document.querySelector('[data-quick-view-modal]');
      if (!this.modal) return;

      this.content = this.modal.querySelector('[data-quick-view-content]');
      this.isOpen = false;
      
      this.init();
    }

    init() {
      // Quick view triggers
      document.addEventListener('click', (e) => {
        const trigger = e.target.closest('[data-quick-view]');
        if (trigger) {
          e.preventDefault();
          this.open(trigger.dataset.productHandle || trigger.dataset.quickView);
        }
      });

      // Close triggers
      document.querySelectorAll('[data-quick-view-close]').forEach(close => {
        close.addEventListener('click', () => this.close());
      });

      // Escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.isOpen) this.close();
      });

      // Delegate events for dynamic content
      this.modal.addEventListener('click', (e) => {
        // Thumbnail clicks
        const thumb = e.target.closest('.quick-view__thumbnail');
        if (thumb) {
          this.handleThumbnailClick(thumb);
        }

        // Variant selection
        const variantOption = e.target.closest('.quick-view__variant-option');
        if (variantOption) {
          this.handleVariantClick(variantOption);
        }

        // Add to cart
        const addButton = e.target.closest('[data-quick-view-add]');
        if (addButton) {
          e.preventDefault();
          this.handleAddToCart(addButton);
        }
      });
    }

    async open(handle) {
      if (!handle) return;

      this.modal.classList.add('is-open');
      this.modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      this.isOpen = true;

      // Show loading state
      this.content.innerHTML = `
        <div class="quick-view-modal__loading">
          <div class="spinner"></div>
        </div>
      `;

      try {
        const response = await fetch(`/products/${handle}?section_id=quick-view`);
        const html = await response.text();
        
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const quickViewContent = doc.querySelector('.quick-view') || doc.body;
        
        this.content.innerHTML = quickViewContent.innerHTML;
        
        // Initialize variant handling
        this.initVariants();
        
      } catch (error) {
        console.error('Error loading quick view:', error);
        this.content.innerHTML = `
          <div class="quick-view-modal__error">
            <p>Sorry, there was an error loading this product.</p>
            <a href="/products/${handle}" class="button button--primary">View Product Page</a>
          </div>
        `;
      }
    }

    close() {
      this.modal.classList.remove('is-open');
      this.modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      this.isOpen = false;
    }

    handleThumbnailClick(thumb) {
      const src = thumb.dataset.src || thumb.src;
      const mainImage = this.content.querySelector('.quick-view__image');
      
      if (mainImage && src) {
        mainImage.src = src;
      }

      // Update active state
      this.content.querySelectorAll('.quick-view__thumbnail').forEach(t => {
        t.classList.remove('is-active');
      });
      thumb.classList.add('is-active');
    }

    handleVariantClick(option) {
      const optionGroup = option.closest('.quick-view__variants');
      const optionName = optionGroup?.dataset.optionName;
      
      // Update selected state
      optionGroup?.querySelectorAll('.quick-view__variant-option').forEach(opt => {
        opt.classList.remove('is-selected');
      });
      option.classList.add('is-selected');

      // Update variant
      this.updateSelectedVariant();
    }

    initVariants() {
      this.variants = [];
      const variantData = this.content.querySelector('[data-product-variants]');
      
      if (variantData) {
        try {
          this.variants = JSON.parse(variantData.textContent);
        } catch (e) {
          console.error('Error parsing variants:', e);
        }
      }
    }

    updateSelectedVariant() {
      const selectedOptions = [];
      this.content.querySelectorAll('.quick-view__variants').forEach(group => {
        const selected = group.querySelector('.quick-view__variant-option.is-selected');
        if (selected) {
          selectedOptions.push(selected.dataset.value);
        }
      });

      // Find matching variant
      const matchingVariant = this.variants.find(variant => {
        return variant.options.every((option, index) => option === selectedOptions[index]);
      });

      if (matchingVariant) {
        // Update price
        const priceEl = this.content.querySelector('.quick-view__price-current');
        if (priceEl) {
          priceEl.textContent = window.Theme.formatMoney(matchingVariant.price);
        }

        // Update add button
        const addButton = this.content.querySelector('[data-quick-view-add]');
        if (addButton) {
          addButton.dataset.variantId = matchingVariant.id;
          addButton.disabled = !matchingVariant.available;
          addButton.textContent = matchingVariant.available ? 
            addButton.dataset.addText : 
            addButton.dataset.soldOutText;
        }

        // Update image if variant has one
        if (matchingVariant.featured_image) {
          const mainImage = this.content.querySelector('.quick-view__image');
          if (mainImage) {
            mainImage.src = matchingVariant.featured_image.src;
          }
        }
      }
    }

    async handleAddToCart(button) {
      const variantId = button.dataset.variantId;
      if (!variantId) return;

      const originalText = button.textContent;
      button.disabled = true;
      button.textContent = 'Adding...';

      try {
        await window.Cart.add(variantId, 1);
        button.textContent = 'Added!';
        
        setTimeout(() => {
          this.close();
          button.textContent = originalText;
          button.disabled = false;
        }, 1000);

      } catch (error) {
        console.error('Error adding to cart:', error);
        button.textContent = 'Error';
        setTimeout(() => {
          button.textContent = originalText;
          button.disabled = false;
        }, 2000);
      }
    }
  }

  // Initialize
  document.addEventListener('DOMContentLoaded', () => {
    window.quickView = new QuickView();
  });

})();
