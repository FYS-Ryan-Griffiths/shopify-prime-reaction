/**
 * Collection (Load More / Infinite Scroll)
 * AJAX pagination for collection pages
 */

(function() {
  'use strict';

  class CollectionPagination {
    constructor() {
      this.container = document.querySelector('[data-products-container]');
      this.loadMoreBtn = document.querySelector('[data-load-more]');
      this.infiniteScroll = document.querySelector('[data-infinite-scroll]');
      
      if (!this.container) return;

      this.currentPage = 1;
      this.isLoading = false;
      
      this.init();
    }

    init() {
      // Load More button
      if (this.loadMoreBtn) {
        this.loadMoreBtn.addEventListener('click', () => this.loadMore());
      }

      // Infinite Scroll
      if (this.infiniteScroll) {
        this.setupInfiniteScroll();
      }
    }

    setupInfiniteScroll() {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !this.isLoading) {
            this.loadMore();
          }
        });
      }, {
        rootMargin: '200px'
      });

      observer.observe(this.infiniteScroll);
    }

    async loadMore() {
      if (this.isLoading) return;

      const nextPageUrl = this.loadMoreBtn?.dataset.nextPage || 
                          this.infiniteScroll?.dataset.nextPage;
      
      if (!nextPageUrl) {
        // No more pages
        if (this.loadMoreBtn) this.loadMoreBtn.style.display = 'none';
        if (this.infiniteScroll) this.infiniteScroll.style.display = 'none';
        return;
      }

      this.isLoading = true;
      
      // Show loading state
      if (this.loadMoreBtn) {
        this.loadMoreBtn.disabled = true;
        this.loadMoreBtn.innerHTML = `
          <span class="spinner spinner--small"></span>
          Loading...
        `;
      }

      try {
        const response = await fetch(nextPageUrl);
        const html = await response.text();
        
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        
        // Get new products
        const newProducts = doc.querySelectorAll('[data-product-card]');
        
        // Append to container
        newProducts.forEach(product => {
          this.container.appendChild(product.cloneNode(true));
        });

        // Update next page URL
        const newLoadMore = doc.querySelector('[data-load-more]');
        const newInfiniteScroll = doc.querySelector('[data-infinite-scroll]');
        
        if (newLoadMore) {
          const newNextPage = newLoadMore.dataset.nextPage;
          if (this.loadMoreBtn) {
            this.loadMoreBtn.dataset.nextPage = newNextPage || '';
          }
          if (this.infiniteScroll) {
            this.infiniteScroll.dataset.nextPage = newNextPage || '';
          }
        } else {
          // No more pages
          if (this.loadMoreBtn) this.loadMoreBtn.style.display = 'none';
          if (this.infiniteScroll) this.infiniteScroll.style.display = 'none';
        }

        // Trigger animation for new items
        newProducts.forEach((product, index) => {
          const clonedProduct = this.container.querySelector(
            `[data-product-card]:nth-last-child(${newProducts.length - index})`
          );
          if (clonedProduct) {
            clonedProduct.classList.add('animate-fade-in-up');
          }
        });

        this.currentPage++;

      } catch (error) {
        console.error('Error loading more products:', error);
      } finally {
        this.isLoading = false;
        
        if (this.loadMoreBtn) {
          this.loadMoreBtn.disabled = false;
          this.loadMoreBtn.innerHTML = 'Load More';
        }
      }
    }
  }

  // Initialize
  document.addEventListener('DOMContentLoaded', () => {
    window.collectionPagination = new CollectionPagination();
  });

})();
