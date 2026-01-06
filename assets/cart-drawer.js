/**
 * Cart Drawer
 * AJAX-powered slide-out cart drawer
 */

(function() {
  'use strict';

  class CartDrawer {
    constructor() {
      this.drawer = document.querySelector('[data-cart-drawer]');
      if (!this.drawer) return;

      this.overlay = this.drawer.querySelector('[data-cart-drawer-close]');
      this.body = this.drawer.querySelector('[data-cart-drawer-body]');
      this.footer = this.drawer.querySelector('[data-cart-footer]');
      this.itemsContainer = this.drawer.querySelector('[data-cart-items]');
      this.emptyState = this.drawer.querySelector('[data-cart-empty]');
      this.countEl = this.drawer.querySelector('[data-cart-count]');
      this.subtotalEl = this.drawer.querySelector('[data-cart-subtotal]');
      
      this.isOpen = false;
      this.init();
    }

    init() {
      // Open triggers
      document.querySelectorAll('[data-cart-toggle]').forEach(toggle => {
        toggle.addEventListener('click', (e) => {
          e.preventDefault();
          this.open();
        });
      });

      // Close triggers
      document.querySelectorAll('[data-cart-drawer-close]').forEach(close => {
        close.addEventListener('click', () => this.close());
      });

      // Escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.isOpen) this.close();
      });

      // Quantity controls
      this.drawer.addEventListener('click', (e) => {
        const minusBtn = e.target.closest('[data-quantity-minus]');
        const plusBtn = e.target.closest('[data-quantity-plus]');
        const removeBtn = e.target.closest('[data-remove-item]');
        const quickAddBtn = e.target.closest('[data-add-to-cart-quick]');

        if (minusBtn) this.handleQuantityChange(minusBtn, -1);
        if (plusBtn) this.handleQuantityChange(plusBtn, 1);
        if (removeBtn) this.handleRemove(removeBtn);
        if (quickAddBtn) this.handleQuickAdd(quickAddBtn);
      });

      // Quantity input change
      this.drawer.addEventListener('change', (e) => {
        if (e.target.matches('[data-quantity-input]')) {
          this.handleQuantityInput(e.target);
        }
      });

      // Listen for cart updates
      document.addEventListener('cart:updated', (e) => {
        if (e.detail.openDrawer !== false) {
          this.open();
        }
        this.refresh();
      });

      // Listen for cart open events
      document.addEventListener('cart:open', () => this.open());
    }

    open() {
      this.drawer.classList.add('is-open');
      this.drawer.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      this.isOpen = true;
      
      // Focus first focusable element
      const firstFocusable = this.drawer.querySelector('button, [href], input');
      if (firstFocusable) firstFocusable.focus();
    }

    close() {
      this.drawer.classList.remove('is-open');
      this.drawer.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      this.isOpen = false;
    }

    async handleQuantityChange(button, change) {
      const item = button.closest('[data-cart-item]');
      const input = item.querySelector('[data-quantity-input]');
      const key = item.dataset.key;
      const newQuantity = Math.max(0, parseInt(input.value) + change);
      
      await this.updateItem(key, newQuantity);
    }

    async handleQuantityInput(input) {
      const item = input.closest('[data-cart-item]');
      const key = item.dataset.key;
      const newQuantity = Math.max(0, parseInt(input.value) || 0);
      
      await this.updateItem(key, newQuantity);
    }

    async handleRemove(button) {
      const item = button.closest('[data-cart-item]');
      const key = item.dataset.key;
      
      item.style.opacity = '0.5';
      await this.updateItem(key, 0);
    }

    async handleQuickAdd(button) {
      const variantId = button.dataset.variantId;
      button.disabled = true;
      
      try {
        await window.Cart.add(variantId, 1);
      } catch (error) {
        console.error('Error adding to cart:', error);
      } finally {
        button.disabled = false;
      }
    }

    async updateItem(key, quantity) {
      try {
        const response = await fetch('/cart/change.js', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: key, quantity })
        });

        const cart = await response.json();
        
        document.dispatchEvent(new CustomEvent('cart:updated', { 
          detail: { itemCount: cart.item_count, cart: cart, openDrawer: false }
        }));

      } catch (error) {
        console.error('Error updating cart:', error);
      }
    }

    async refresh() {
      try {
        const response = await fetch('/?section_id=cart-drawer-ajax');
        const html = await response.text();
        
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        
        // Update cart items
        const newItems = doc.querySelector('[data-cart-drawer-body]');
        if (newItems && this.body) {
          this.body.innerHTML = newItems.innerHTML;
        }

        // Update footer
        const newFooter = doc.querySelector('[data-cart-footer]');
        if (newFooter && this.footer) {
          this.footer.innerHTML = newFooter.innerHTML;
        } else if (!newFooter && this.footer) {
          this.footer.style.display = 'none';
        } else if (newFooter && this.footer) {
          this.footer.style.display = '';
        }

        // Update count in header
        const cart = await fetch('/cart.js').then(r => r.json());
        document.querySelectorAll('[data-cart-count]').forEach(el => {
          el.textContent = cart.item_count;
        });

      } catch (error) {
        console.error('Error refreshing cart:', error);
      }
    }
  }

  // Initialize
  document.addEventListener('DOMContentLoaded', () => {
    window.cartDrawer = new CartDrawer();
  });

})();
