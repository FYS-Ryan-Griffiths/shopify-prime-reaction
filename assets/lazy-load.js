/**
 * Lazy Load
 * Native lazy loading enhancement with Intersection Observer
 * Handles images, videos, and iframes
 */

(function() {
  'use strict';

  class LazyLoad {
    constructor(options = {}) {
      this.options = {
        rootMargin: options.rootMargin || '200px 0px',
        threshold: options.threshold || 0.01,
        loadedClass: options.loadedClass || 'is-loaded',
        errorClass: options.errorClass || 'is-error'
      };

      this.observer = null;
      this.init();
    }

    init() {
      // Check for native lazy loading support
      if ('loading' in HTMLImageElement.prototype) {
        // Native lazy loading is supported, enhance with intersection observer for animations
        this.setupNativeLazy();
      }

      // Setup intersection observer for custom lazy loading
      this.setupObserver();

      // Observe all lazy elements
      this.observeElements();

      // Re-observe on dynamic content
      this.setupMutationObserver();
    }

    setupNativeLazy() {
      // Add loaded class when native lazy images load
      document.querySelectorAll('img[loading="lazy"]').forEach(img => {
        if (img.complete) {
          img.classList.add(this.options.loadedClass);
        } else {
          img.addEventListener('load', () => {
            img.classList.add(this.options.loadedClass);
          }, { once: true });
        }
      });
    }

    setupObserver() {
      this.observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.loadElement(entry.target);
            this.observer.unobserve(entry.target);
          }
        });
      }, {
        rootMargin: this.options.rootMargin,
        threshold: this.options.threshold
      });
    }

    observeElements() {
      // Images with data-src
      document.querySelectorAll('[data-src]:not(.is-loaded)').forEach(el => {
        this.observer.observe(el);
      });

      // Background images
      document.querySelectorAll('[data-bg]:not(.is-loaded)').forEach(el => {
        this.observer.observe(el);
      });

      // Videos
      document.querySelectorAll('video[data-src]:not(.is-loaded)').forEach(el => {
        this.observer.observe(el);
      });

      // Iframes
      document.querySelectorAll('iframe[data-src]:not(.is-loaded)').forEach(el => {
        this.observer.observe(el);
      });

      // Responsive images with data-srcset
      document.querySelectorAll('[data-srcset]:not(.is-loaded)').forEach(el => {
        this.observer.observe(el);
      });
    }

    loadElement(element) {
      const tagName = element.tagName.toLowerCase();

      switch (tagName) {
        case 'img':
          this.loadImage(element);
          break;
        case 'video':
          this.loadVideo(element);
          break;
        case 'iframe':
          this.loadIframe(element);
          break;
        default:
          if (element.dataset.bg) {
            this.loadBackground(element);
          }
      }
    }

    loadImage(img) {
      const src = img.dataset.src;
      const srcset = img.dataset.srcset;
      const sizes = img.dataset.sizes;

      if (srcset) {
        img.srcset = srcset;
      }

      if (sizes) {
        img.sizes = sizes;
      }

      if (src) {
        img.src = src;
      }

      img.addEventListener('load', () => {
        img.classList.add(this.options.loadedClass);
        img.removeAttribute('data-src');
        img.removeAttribute('data-srcset');
        img.removeAttribute('data-sizes');
        
        // Dispatch custom event
        img.dispatchEvent(new CustomEvent('lazyloaded'));
      }, { once: true });

      img.addEventListener('error', () => {
        img.classList.add(this.options.errorClass);
      }, { once: true });
    }

    loadVideo(video) {
      const sources = video.querySelectorAll('source[data-src]');
      
      sources.forEach(source => {
        source.src = source.dataset.src;
        source.removeAttribute('data-src');
      });

      if (video.dataset.src) {
        video.src = video.dataset.src;
        video.removeAttribute('data-src');
      }

      video.load();

      video.addEventListener('loadeddata', () => {
        video.classList.add(this.options.loadedClass);
        video.dispatchEvent(new CustomEvent('lazyloaded'));
      }, { once: true });

      // Autoplay if specified
      if (video.dataset.autoplay !== undefined) {
        video.play().catch(() => {
          // Autoplay was prevented
        });
      }
    }

    loadIframe(iframe) {
      if (iframe.dataset.src) {
        iframe.src = iframe.dataset.src;
        iframe.removeAttribute('data-src');
      }

      iframe.addEventListener('load', () => {
        iframe.classList.add(this.options.loadedClass);
        iframe.dispatchEvent(new CustomEvent('lazyloaded'));
      }, { once: true });
    }

    loadBackground(element) {
      const bg = element.dataset.bg;
      
      if (bg) {
        // Preload the image
        const img = new Image();
        img.src = bg;
        
        img.onload = () => {
          element.style.backgroundImage = `url(${bg})`;
          element.classList.add(this.options.loadedClass);
          element.removeAttribute('data-bg');
          element.dispatchEvent(new CustomEvent('lazyloaded'));
        };

        img.onerror = () => {
          element.classList.add(this.options.errorClass);
        };
      }
    }

    setupMutationObserver() {
      const mutationObserver = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
          mutation.addedNodes.forEach(node => {
            if (node.nodeType === 1) {
              // Check if the added node is a lazy element
              if (node.dataset && (node.dataset.src || node.dataset.bg)) {
                this.observer.observe(node);
              }
              // Check children
              node.querySelectorAll?.('[data-src], [data-bg]').forEach(el => {
                if (!el.classList.contains(this.options.loadedClass)) {
                  this.observer.observe(el);
                }
              });
            }
          });
        });
      });

      mutationObserver.observe(document.body, {
        childList: true,
        subtree: true
      });
    }

    // Public method to manually trigger loading
    load(element) {
      this.loadElement(element);
    }

    // Public method to observe new elements
    observe(element) {
      this.observer.observe(element);
    }
  }

  // Video Hover Preview
  class VideoHover {
    constructor() {
      this.videos = document.querySelectorAll('[data-video-hover]');
      if (!this.videos.length) return;

      this.init();
    }

    init() {
      this.videos.forEach(container => {
        const video = container.querySelector('video');
        if (!video) return;

        container.addEventListener('mouseenter', () => {
          video.play().catch(() => {});
        });

        container.addEventListener('mouseleave', () => {
          video.pause();
          video.currentTime = 0;
        });
      });
    }
  }

  // Progressive Image Loading (blur-up effect)
  class ProgressiveImage {
    constructor() {
      this.images = document.querySelectorAll('[data-progressive]');
      if (!this.images.length) return;

      this.init();
    }

    init() {
      this.images.forEach(container => {
        const placeholder = container.querySelector('.progressive-placeholder');
        const fullImage = container.querySelector('.progressive-full');
        
        if (!placeholder || !fullImage) return;

        // Load full image
        const src = fullImage.dataset.src;
        if (!src) return;

        const img = new Image();
        img.src = src;
        
        img.onload = () => {
          fullImage.src = src;
          fullImage.classList.add('is-loaded');
          placeholder.classList.add('is-hidden');
        };
      });
    }
  }

  // Initialize
  document.addEventListener('DOMContentLoaded', () => {
    window.lazyLoad = new LazyLoad();
    new VideoHover();
    new ProgressiveImage();
  });

})();
