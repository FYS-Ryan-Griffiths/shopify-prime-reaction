/**
 * Product Finder Quiz
 * Multi-step quiz with product recommendations
 */

(function() {
  'use strict';

  class ProductQuiz {
    constructor(container) {
      this.container = container;
      this.sectionId = container.dataset.sectionId;
      
      // Elements
      this.progressFill = container.querySelector('[data-quiz-progress-fill]');
      this.currentStepEl = container.querySelector('[data-quiz-current-step]');
      this.totalStepsEl = container.querySelector('[data-quiz-total-steps]');
      this.quizContainer = container.querySelector('[data-quiz-container]');
      this.nav = container.querySelector('[data-quiz-nav]');
      this.resultsContainer = container.querySelector('[data-quiz-results]');
      
      // Get steps (excluding results)
      this.steps = Array.from(container.querySelectorAll('[data-quiz-step]')).filter(
        step => step.dataset.quizStep !== 'results'
      );
      this.resultsStep = container.querySelector('[data-quiz-step="results"]');
      
      // State
      this.currentStep = 1;
      this.totalSteps = this.steps.length;
      this.answers = {};
      this.email = null;
      
      // Products data
      this.products = this.loadProducts();
      
      // Settings
      this.resultsCount = parseInt(container.closest('.section-quiz')?.dataset.resultsCount) || 3;
      
      this.init();
    }

    init() {
      // Update total steps display
      if (this.totalStepsEl) {
        this.totalStepsEl.textContent = this.totalSteps;
      }

      // Single choice options
      this.container.addEventListener('click', (e) => {
        const option = e.target.closest('[data-quiz-option]');
        if (option) {
          this.handleSingleChoice(option);
        }
      });

      // Multiple choice options
      this.container.addEventListener('click', (e) => {
        const option = e.target.closest('[data-quiz-option-multi]');
        if (option) {
          this.handleMultipleChoice(option);
        }
      });

      // Slider input
      this.container.addEventListener('input', (e) => {
        if (e.target.matches('[data-quiz-slider]')) {
          this.handleSlider(e.target);
        }
      });

      // Continue button (for multi-select and slider)
      this.container.addEventListener('click', (e) => {
        const continueBtn = e.target.closest('[data-quiz-continue]');
        if (continueBtn && !continueBtn.disabled) {
          this.saveCurrentAnswer();
          this.nextStep();
        }
      });

      // Back button
      this.container.addEventListener('click', (e) => {
        if (e.target.closest('[data-quiz-back]')) {
          this.prevStep();
        }
      });

      // Email form
      const emailForm = this.container.querySelector('[data-quiz-email-form]');
      if (emailForm) {
        emailForm.addEventListener('submit', (e) => {
          e.preventDefault();
          this.handleEmailSubmit(e.target);
        });
      }

      // Skip email
      this.container.addEventListener('click', (e) => {
        if (e.target.closest('[data-quiz-skip-email]')) {
          this.showResults();
        }
      });

      // Restart quiz
      this.container.addEventListener('click', (e) => {
        if (e.target.closest('[data-quiz-restart]')) {
          this.restart();
        }
      });

      // Initial progress update
      this.updateProgress();
    }

    loadProducts() {
      const dataEl = this.container.querySelector('[data-quiz-products]');
      if (!dataEl) return [];
      
      try {
        return JSON.parse(dataEl.textContent);
      } catch (e) {
        console.error('Failed to parse quiz products:', e);
        return [];
      }
    }

    getCurrentStepElement() {
      return this.steps[this.currentStep - 1];
    }

    handleSingleChoice(option) {
      const step = option.closest('[data-quiz-step]');
      const options = step.querySelectorAll('[data-quiz-option]');
      
      // Deselect all
      options.forEach(opt => opt.classList.remove('is-selected'));
      
      // Select clicked
      option.classList.add('is-selected');
      
      // Save answer
      const key = step.dataset.questionKey;
      const value = option.dataset.value;
      this.answers[key] = value;
      
      // Auto-advance after short delay
      setTimeout(() => this.nextStep(), 300);
    }

    handleMultipleChoice(option) {
      const step = option.closest('[data-quiz-step]');
      const maxSelections = parseInt(step.dataset.maxSelections) || 3;
      const minSelections = parseInt(step.dataset.minSelections) || 1;
      const selectedOptions = step.querySelectorAll('[data-quiz-option-multi].is-selected');
      const continueBtn = step.querySelector('[data-quiz-continue]');
      
      if (option.classList.contains('is-selected')) {
        // Deselect
        option.classList.remove('is-selected');
      } else {
        // Check max selections
        if (selectedOptions.length >= maxSelections) {
          // Remove oldest selection
          selectedOptions[0].classList.remove('is-selected');
        }
        option.classList.add('is-selected');
      }
      
      // Update continue button state
      const currentSelected = step.querySelectorAll('[data-quiz-option-multi].is-selected').length;
      if (continueBtn) {
        continueBtn.disabled = currentSelected < minSelections;
      }
    }

    handleSlider(slider) {
      const step = slider.closest('[data-quiz-step]');
      const valueDisplay = step.querySelector('[data-quiz-slider-value]');
      
      if (valueDisplay) {
        valueDisplay.textContent = slider.value;
      }
    }

    saveCurrentAnswer() {
      const step = this.getCurrentStepElement();
      if (!step) return;
      
      const key = step.dataset.questionKey;
      const type = step.dataset.questionType;
      
      if (type === 'multiple') {
        const selected = step.querySelectorAll('[data-quiz-option-multi].is-selected');
        this.answers[key] = Array.from(selected).map(opt => opt.dataset.value);
      } else if (type === 'slider') {
        const slider = step.querySelector('[data-quiz-slider]');
        if (slider) {
          this.answers[key] = parseInt(slider.value);
        }
      }
    }

    nextStep() {
      if (this.currentStep >= this.totalSteps) {
        // Check if last step is email
        const lastStep = this.steps[this.totalSteps - 1];
        if (lastStep.dataset.questionType === 'email') {
          // Already on email step, don't auto-advance
          return;
        }
        this.showResults();
        return;
      }
      
      // Hide current step
      const currentStepEl = this.getCurrentStepElement();
      if (currentStepEl) {
        currentStepEl.hidden = true;
      }
      
      // Show next step
      this.currentStep++;
      const nextStepEl = this.getCurrentStepElement();
      if (nextStepEl) {
        nextStepEl.hidden = false;
      }
      
      // Show nav
      if (this.nav) {
        this.nav.hidden = false;
      }
      
      this.updateProgress();
      
      // Track event
      this.trackEvent('quiz_step_completed', {
        step: this.currentStep - 1,
        answers: this.answers
      });
    }

    prevStep() {
      if (this.currentStep <= 1) return;
      
      // Hide current step
      const currentStepEl = this.getCurrentStepElement();
      if (currentStepEl) {
        currentStepEl.hidden = true;
      }
      
      // Show previous step
      this.currentStep--;
      const prevStepEl = this.getCurrentStepElement();
      if (prevStepEl) {
        prevStepEl.hidden = false;
      }
      
      // Hide nav on first step
      if (this.nav && this.currentStep === 1) {
        this.nav.hidden = true;
      }
      
      this.updateProgress();
    }

    handleEmailSubmit(form) {
      const formData = new FormData(form);
      this.email = formData.get('email');
      const firstName = formData.get('first_name');
      
      // Track email capture
      this.trackEvent('quiz_email_captured', {
        email: this.email,
        firstName: firstName
      });
      
      // Send to Klaviyo/email platform if available
      if (window._learnq) {
        window._learnq.push(['identify', {
          '$email': this.email,
          '$first_name': firstName,
          'Quiz Answers': this.answers
        }]);
      }
      
      this.showResults();
    }

    showResults() {
      // Hide current step
      const currentStepEl = this.getCurrentStepElement();
      if (currentStepEl) {
        currentStepEl.hidden = true;
      }
      
      // Hide nav
      if (this.nav) {
        this.nav.hidden = true;
      }
      
      // Calculate recommendations
      const recommendations = this.getRecommendations();
      
      // Render results
      this.renderResults(recommendations);
      
      // Show results step
      if (this.resultsStep) {
        this.resultsStep.hidden = false;
      }
      
      // Update progress to 100%
      if (this.progressFill) {
        this.progressFill.style.width = '100%';
      }
      
      // Track completion
      this.trackEvent('quiz_completed', {
        answers: this.answers,
        recommendations: recommendations.map(p => p.handle),
        email: this.email
      });
    }

    getRecommendations() {
      const scored = this.products.map(product => {
        let score = 0;
        
        // Goal matching (primary weight)
        if (this.answers.goal) {
          const goalScore = product.metafields[`quiz_score_${this.answers.goal}`];
          if (goalScore) {
            score += goalScore * 3;
          }
          
          // Tag matching for goal
          if (product.tags.includes(this.answers.goal)) {
            score += 10;
          }
        }
        
        // Experience level matching
        if (this.answers.experience) {
          const expLevel = this.answers.experience;
          const productExp = product.metafields.quiz_experience_level;
          
          if (productExp === 'all') {
            score += 5;
          } else if (productExp === 'beginner' && expLevel <= 4) {
            score += 8;
          } else if (productExp === 'intermediate' && expLevel >= 4 && expLevel <= 7) {
            score += 8;
          } else if (productExp === 'advanced' && expLevel >= 7) {
            score += 8;
          }
        }
        
        // Space matching
        if (this.answers.space) {
          const productSpace = product.metafields.quiz_space_required;
          if (productSpace === this.answers.space) {
            score += 6;
          } else if (productSpace === 'small') {
            score += 3; // Small works everywhere
          }
        }
        
        // Focus areas (multi-select)
        if (this.answers.focus && Array.isArray(this.answers.focus)) {
          this.answers.focus.forEach(focus => {
            if (product.tags.includes(focus)) {
              score += 4;
            }
          });
        }
        
        // Bonus for available products
        if (product.available) {
          score += 2;
        }
        
        return { ...product, score };
      });
      
      // Sort by score and return top results
      return scored
        .filter(p => p.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, this.resultsCount);
    }

    renderResults(products) {
      if (!this.resultsContainer) return;
      
      if (products.length === 0) {
        this.resultsContainer.innerHTML = `
          <div class="quiz__no-results">
            <p>We couldn't find a perfect match based on your preferences.</p>
            <a href="/collections/all" class="button button--primary">Browse All Products</a>
          </div>
        `;
        return;
      }
      
      const maxScore = Math.max(...products.map(p => p.score));
      
      this.resultsContainer.innerHTML = products.map((product, index) => {
        const matchPercent = Math.round((product.score / maxScore) * 100);
        
        return `
          <div class="quiz__result-card">
            <div class="quiz__result-card__image">
              <a href="${product.url}">
                <img src="${product.image}" alt="${product.title}" loading="lazy" width="300" height="300">
              </a>
            </div>
            <div class="quiz__result-card__content">
              <span class="quiz__result-card__match">${matchPercent}% Match</span>
              <h4 class="quiz__result-card__title">
                <a href="${product.url}">${product.title}</a>
              </h4>
              <p class="quiz__result-card__price">${product.priceFormatted}</p>
              <div class="quiz__result-card__action">
                <a href="${product.url}" class="button button--primary button--small">View Product</a>
              </div>
            </div>
          </div>
        `;
      }).join('');
    }

    updateProgress() {
      const progress = (this.currentStep / this.totalSteps) * 100;
      
      if (this.progressFill) {
        this.progressFill.style.width = `${progress}%`;
      }
      
      if (this.currentStepEl) {
        this.currentStepEl.textContent = this.currentStep;
      }
    }

    restart() {
      // Reset state
      this.currentStep = 1;
      this.answers = {};
      this.email = null;
      
      // Hide results
      if (this.resultsStep) {
        this.resultsStep.hidden = true;
      }
      
      // Reset all steps
      this.steps.forEach((step, index) => {
        step.hidden = index !== 0;
        
        // Reset selections
        step.querySelectorAll('.is-selected').forEach(el => {
          el.classList.remove('is-selected');
        });
        
        // Reset sliders
        const slider = step.querySelector('[data-quiz-slider]');
        if (slider) {
          slider.value = slider.getAttribute('value') || 5;
          const valueDisplay = step.querySelector('[data-quiz-slider-value]');
          if (valueDisplay) {
            valueDisplay.textContent = slider.value;
          }
        }
        
        // Reset continue buttons
        const continueBtn = step.querySelector('[data-quiz-continue]');
        if (continueBtn) {
          continueBtn.disabled = true;
        }
      });
      
      // Hide nav
      if (this.nav) {
        this.nav.hidden = true;
      }
      
      // Reset progress
      this.updateProgress();
      
      // Track restart
      this.trackEvent('quiz_restarted');
    }

    trackEvent(eventName, data = {}) {
      // Google Analytics / GTM
      if (window.dataLayer) {
        window.dataLayer.push({
          event: eventName,
          quiz_id: this.sectionId,
          ...data
        });
      }
      
      // Klaviyo
      if (window._learnq) {
        window._learnq.push(['track', eventName, {
          quiz_id: this.sectionId,
          ...data
        }]);
      }
    }
  }

  // Initialize all quizzes
  function initQuizzes() {
    document.querySelectorAll('[data-quiz]').forEach(quiz => {
      new ProductQuiz(quiz);
    });
  }

  // Init on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initQuizzes);
  } else {
    initQuizzes();
  }

  // Reinit on Shopify section reload
  if (window.Shopify && Shopify.designMode) {
    document.addEventListener('shopify:section:load', (e) => {
      const quiz = e.target.querySelector('[data-quiz]');
      if (quiz) {
        new ProductQuiz(quiz);
      }
    });
  }
})();
