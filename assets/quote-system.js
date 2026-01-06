/**
 * Quote System
 * B2B request for quote functionality
 */

(function() {
  'use strict';

  class QuoteSystem {
    constructor() {
      this.modal = document.querySelector('[data-quote-modal]');
      if (!this.modal) return;

      this.itemsList = this.modal.querySelector('[data-quote-items-list]');
      this.formItemsInput = this.modal.querySelector('[data-quote-form-items]');
      this.form = this.modal.querySelector('[data-quote-form]');
      
      this.items = this.loadItems();
      this.isOpen = false;
      
      this.init();
    }

    init() {
      // Quote button triggers
      document.addEventListener('click', (e) => {
        const quoteBtn = e.target.closest('[data-quote-button]');
        if (quoteBtn) {
          e.preventDefault();
          this.addItem(quoteBtn);
          this.open();
        }

        // Convert cart to quote
        const convertBtn = e.target.closest('[data-convert-to-quote]');
        if (convertBtn) {
          e.preventDefault();
          this.convertCartToQuote();
        }
      });

      // Close triggers
      document.querySelectorAll('[data-quote-modal-close]').forEach(close => {
        close.addEventListener('click', () => this.close());
      });

      // Escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.isOpen) this.close();
      });

      // Remove item
      this.modal.addEventListener('click', (e) => {
        const removeBtn = e.target.closest('[data-quote-item-remove]');
        if (removeBtn) {
          const itemId = removeBtn.closest('.quote-modal__item').dataset.itemId;
          this.removeItem(itemId);
        }
      });

      // Form submission
      this.form?.addEventListener('submit', (e) => {
        this.handleSubmit(e);
      });
    }

    loadItems() {
      try {
        return JSON.parse(localStorage.getItem('quoteItems')) || [];
      } catch (e) {
        return [];
      }
    }

    saveItems() {
      localStorage.setItem('quoteItems', JSON.stringify(this.items));
    }

    addItem(button) {
      const item = {
        id: Date.now().toString(),
        productId: button.dataset.productId,
        productTitle: button.dataset.productTitle,
        productHandle: button.dataset.productHandle,
        productImage: button.dataset.productImage,
        variantId: button.dataset.variantId,
        variantTitle: button.dataset.variantTitle,
        variantPrice: button.dataset.variantPrice
      };

      // Check if already exists
      const exists = this.items.find(i => 
        i.productId === item.productId && i.variantId === item.variantId
      );

      if (!exists) {
        this.items.push(item);
        this.saveItems();
      }

      this.renderItems();
    }

    removeItem(itemId) {
      this.items = this.items.filter(item => item.id !== itemId);
      this.saveItems();
      this.renderItems();
    }

    async convertCartToQuote() {
      try {
        const cart = await fetch('/cart.js').then(r => r.json());
        
        cart.items.forEach(item => {
          const exists = this.items.find(i => 
            i.productId === item.product_id.toString() && 
            i.variantId === item.variant_id.toString()
          );

          if (!exists) {
            this.items.push({
              id: Date.now().toString() + item.variant_id,
              productId: item.product_id.toString(),
              productTitle: item.product_title,
              productHandle: item.handle,
              productImage: item.image,
              variantId: item.variant_id.toString(),
              variantTitle: item.variant_title,
              variantPrice: window.Theme.formatMoney(item.price),
              quantity: item.quantity
            });
          }
        });

        this.saveItems();
        this.renderItems();
        this.open();

      } catch (error) {
        console.error('Error converting cart to quote:', error);
      }
    }

    renderItems() {
      if (!this.itemsList) return;

      if (this.items.length === 0) {
        this.itemsList.innerHTML = `
          <p class="quote-modal__empty-items">No items added to quote yet.</p>
        `;
      } else {
        this.itemsList.innerHTML = this.items.map(item => `
          <div class="quote-modal__item" data-item-id="${item.id}">
            <img 
              src="${item.productImage || '/cdn/shop/products/placeholder.png'}" 
              alt="${item.productTitle}"
              class="quote-modal__item-image"
              width="60"
              height="60"
            >
            <div class="quote-modal__item-details">
              <span class="quote-modal__item-title">${item.productTitle}</span>
              ${item.variantTitle && item.variantTitle !== 'Default Title' ? 
                `<span class="quote-modal__item-variant">${item.variantTitle}</span>` : ''}
            </div>
            <button type="button" class="quote-modal__item-remove" data-quote-item-remove aria-label="Remove">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        `).join('');
      }

      // Update form hidden field
      if (this.formItemsInput) {
        const itemsSummary = this.items.map(item => 
          `${item.productTitle}${item.variantTitle && item.variantTitle !== 'Default Title' ? ` - ${item.variantTitle}` : ''}`
        ).join(', ');
        this.formItemsInput.value = itemsSummary;
      }
    }

    open() {
      this.renderItems();
      this.modal.classList.add('is-open');
      this.modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      this.isOpen = true;
    }

    close() {
      this.modal.classList.remove('is-open');
      this.modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      this.isOpen = false;
    }

    handleSubmit(e) {
      // The form will submit normally to Shopify's contact form
      // Clear items after successful submission
      // Note: In a real implementation, you'd want to handle this via AJAX
      // and clear items only after confirmed submission
      
      // For now, we'll clear on submit
      setTimeout(() => {
        this.items = [];
        this.saveItems();
      }, 100);
    }
  }

  // Initialize
  document.addEventListener('DOMContentLoaded', () => {
    window.quoteSystem = new QuoteSystem();
  });

})();
