# 🏋️ Reaxing Prime Reaction - Shopify Theme v1.a

> **Premium Shopify Theme for Neuromuscular Training Equipment**  
> Editorial, typography-forward design inspired by [postfamiliar.com](https://postfamiliar.com/)  
> For [prime-reaction-3.myshopify.com](https://prime-reaction-3.myshopify.com/)

![Shopify](https://img.shields.io/badge/Shopify-Online%20Store%202.0-7AB55C?style=flat&logo=shopify)
![License](https://img.shields.io/badge/License-MIT-blue.svg)
![Version](https://img.shields.io/badge/Version-1.0.0-orange.svg)

---

## 🎨 Design Philosophy

The Reaxing theme embodies a premium, editorial aesthetic perfect for showcasing high-end fitness equipment:

- **Bold Serif Headlines** — Instrument Serif for impactful headers
- **Clean Sans-Serif Body** — Inter for excellent readability
- **Generous Whitespace** — Let products breathe
- **Fluid Motion Effects** — Water/liquid animations matching the Fluiball brand
- **Dark/Light Mode** — Premium gym aesthetic with system preference detection
- **Mobile-First** — Responsive design that works on all devices

---

## ✨ Feature Highlights

### 🛍️ E-commerce Features
- **AJAX Cart Drawer** — Seamless shopping without page reloads
- **Quick View Modal** — Preview products without leaving the page
- **Faceted Filtering** — Filter by price, vendor, tags with AJAX updates
- **Infinite Scroll** — Load more products automatically
- **Back in Stock Alerts** — Email notifications when products return
- **Product Comparison** — Visual weight/size comparison tools

### 💼 B2B Features
- **Quote Request System** — Full RFQ workflow for business customers
- **Hide Prices Option** — "Request Quote" instead of prices
- **B2B Customer Detection** — Tag-based customer segmentation
- **Quote Cart** — Convert cart items to quote requests
- **Company Information Capture** — Business details on quotes

### 📧 Email Marketing
- **Multi-Platform Support** — Seguno, Klaviyo, Mailchimp, HubSpot
- **Newsletter Sections** — Multiple layout options
- **Exit Intent Popup** — Capture emails before visitors leave
- **Browse Abandonment** — Track and recover abandoned sessions
- **Customer Preferences** — Subscription management in account

### ⚡ Performance
- **Critical CSS** — Inline above-the-fold styles
- **Lazy Loading** — Images, videos, iframes on demand
- **Skeleton States** — Visual loading placeholders
- **Core Web Vitals** — LCP, FID, CLS tracking
- **Connection-Aware** — Adapt to network conditions
- **Resource Hints** — Prefetch, preconnect, preload

### ♿ Accessibility
- **WCAG 2.1 AA** — Full compliance
- **Skip Links** — Jump to main content
- **ARIA Labels** — Screen reader support
- **Focus Management** — Visible focus indicators
- **Reduced Motion** — Respects user preferences
- **Keyboard Navigation** — Full keyboard support

### 🔍 SEO
- **Open Graph Tags** — Facebook/social sharing
- **Twitter Cards** — Rich Twitter previews
- **JSON-LD Schemas** — Organization, Product, Article, FAQ, HowTo
- **Canonical URLs** — Proper pagination handling
- **Site Verification** — Google, Bing, Pinterest, Yandex

---

## 📁 Theme Structure

```
reaxing-theme/
├── assets/                    # Stylesheets & JavaScript (30 files)
│   ├── animations.css         # All animations & micro-interactions
│   ├── base.css               # Reset & base styles
│   ├── cart.css               # Cart page styles
│   ├── collection.css         # Collection page styles
│   ├── customer.css           # Customer account styles
│   ├── facility-locator.css   # Gym finder map styles
│   ├── footer.css             # Footer styles
│   ├── header.css             # Header styles
│   ├── hero.css               # Hero section styles
│   ├── pages.css              # Supporting page styles
│   ├── product-card.css       # Product card styles
│   ├── product-main.css       # Product page styles
│   ├── search.css             # Search styles
│   ├── skeleton.css           # Loading skeleton states
│   ├── training-library.css   # Training library styles
│   ├── typography.css         # Font & text styles
│   ├── variables.css          # CSS custom properties
│   ├── analytics.js           # Analytics & email tracking
│   ├── cart-drawer.js         # AJAX cart functionality
│   ├── collection-pagination.js  # Load more / infinite scroll
│   ├── facets.js              # AJAX filtering & sorting
│   ├── global.js              # Site-wide functionality
│   ├── lazy-load.js           # Image/video lazy loading
│   ├── liquid-effects.js      # Water/fluid motion effects
│   ├── product-card.js        # Product card hover/video
│   ├── quick-view.js          # Quick view modal
│   ├── quiz.js                # Product finder quiz
│   ├── quote-system.js        # B2B quote system
│   ├── search.js              # Predictive search
│   └── theme-toggle.js        # Dark/light mode toggle
│
├── config/
│   ├── settings_data.json     # Theme settings values
│   └── settings_schema.json   # Theme settings definitions
│
├── layout/
│   └── theme.liquid           # Main theme wrapper
│
├── locales/
│   └── en.default.json        # English translations
│
├── sections/                  # Customizable sections (40 files)
│   ├── 404.liquid
│   ├── announcement-bar.liquid
│   ├── bento-grid.liquid      # Dynamic asymmetric grid
│   ├── brand-values.liquid
│   ├── cart-drawer.liquid
│   ├── cart-drawer-ajax.liquid
│   ├── cart-main.liquid
│   ├── collection-banner.liquid
│   ├── collection-grid.liquid
│   ├── collection-hero.liquid # Category banners
│   ├── contact-form.liquid
│   ├── facility-locator.liquid
│   ├── faq.liquid
│   ├── featured-collection.liquid
│   ├── featured-products.liquid
│   ├── footer.liquid
│   ├── header.liquid
│   ├── hero.liquid
│   ├── image-with-text.liquid
│   ├── marquee.liquid
│   ├── newsletter.liquid
│   ├── page-banner.liquid
│   ├── popup.liquid
│   ├── predictive-search.liquid
│   ├── product-comparison.liquid # Visual size/weight comparison
│   ├── product-description.liquid
│   ├── product-main.liquid
│   ├── quick-view.liquid
│   ├── quiz.liquid
│   ├── quote-drawer.liquid
│   ├── quote-form.liquid
│   ├── quote-modal.liquid
│   ├── related-products.liquid
│   ├── reviews.liquid         # Customer reviews with media
│   ├── rich-text.liquid
│   ├── science-explainer.liquid # SDI technology explainer
│   ├── search-results.liquid
│   ├── training-library.liquid
│   └── customer-*.liquid      # 8 customer account sections
│
├── snippets/                  # Reusable components (28 files)
│   ├── accessibility.liquid   # Skip links, ARIA
│   ├── add-to-cart.liquid     # Add to cart with quantity
│   ├── address-form.liquid    # Customer address form
│   ├── back-in-stock.liquid   # Restock alert form
│   ├── back-to-top.liquid     # Scroll to top button
│   ├── b2b-detect.liquid      # B2B customer detection
│   ├── b2b-toggle.liquid      # Quote mode toggle
│   ├── cart-line-item.liquid  # Cart item component
│   ├── cart-note.liquid       # Order notes
│   ├── cart-quote.liquid      # Convert cart to RFQ
│   ├── cart-trust.liquid      # Trust badges
│   ├── cart-upsells.liquid    # Smart recommendations
│   ├── collection-empty.liquid # Empty collection state
│   ├── critical-css.liquid    # Inline critical styles
│   ├── email-preferences.liquid # Subscription management
│   ├── facets.liquid          # Filter drawer
│   ├── json-ld.liquid         # Structured data schemas
│   ├── marquee.liquid         # Scrolling text
│   ├── mega-menu.liquid       # Navigation dropdown
│   ├── meta-tags.liquid       # Meta tag output
│   ├── mobile-nav.liquid      # Mobile bottom navigation
│   ├── performance.liquid     # Resource hints, Web Vitals
│   ├── price.liquid           # Price display
│   ├── price-display.liquid   # B2B price visibility
│   ├── product-card.liquid    # Product card component
│   ├── product-gallery.liquid # Product image gallery
│   ├── product-price.liquid   # Product pricing
│   ├── quick-view.liquid      # Quick view modal
│   ├── quote-button.liquid    # Quote CTA button
│   ├── quote-confirmation.liquid # Quote success
│   ├── quote-history.liquid   # Past quotes (B2B)
│   ├── scroll-progress.liquid # Page scroll indicator
│   ├── seo.liquid             # OG & Twitter meta
│   ├── seo-meta.liquid        # SEO meta tags
│   ├── shipping-calc.liquid   # Shipping estimator
│   └── variant-picker.liquid  # Variant selection
│
└── templates/                 # Page templates (JSON - 18 files)
    ├── 404.json
    ├── cart.json
    ├── collection.json
    ├── index.json
    ├── page.json
    ├── page.about.json
    ├── page.contact.json
    ├── page.faq.json
    ├── page.quiz.json
    ├── page.quote.json
    ├── page.shipping.json
    ├── page.training.json
    ├── product.json
    ├── search.json
    └── customers/             # Customer account templates
        ├── account.json
        ├── activate_account.json
        ├── addresses.json
        ├── login.json
        ├── order.json
        ├── register.json
        └── reset_password.json
```

**Total: 120+ files** across all theme directories.

---

## 🚀 Getting Started

### Prerequisites

- Shopify Partner account or development store
- Node.js 18+ (for local development with Shopify CLI)
- Git (for version control)

### Option 1: GitHub Integration (Recommended)

1. **Fork or clone this repository**
   ```bash
   git clone https://github.com/Mx7Zero/shopify-prime-reaction.git
   ```

2. **Connect to Shopify**
   - Go to **Shopify Admin** → **Online Store** → **Themes**
   - Click **Add theme** → **Connect from GitHub**
   - Authorize Shopify and select this repository
   - Choose the `main` branch

3. **Auto-sync**
   - Changes pushed to `main` automatically deploy to your preview theme
   - Test in preview, then **Publish** when ready

### Option 2: Shopify CLI (Local Development)

```bash
# Install Shopify CLI
npm install -g @shopify/cli @shopify/theme

# Navigate to theme directory
cd shopify-prime-reaction

# Connect to your store
shopify theme dev --store your-store.myshopify.com

# Push changes to live theme
shopify theme push --live
```

### Option 3: Direct Upload

1. Download theme as ZIP
2. Go to **Shopify Admin** → **Online Store** → **Themes**
3. Click **Add theme** → **Upload ZIP file**

---

## ⚙️ Configuration

### Theme Settings

Access via **Shopify Admin** → **Online Store** → **Themes** → **Customize**

#### Colors
| Setting | Description | Default |
|---------|-------------|---------|
| Primary | Main brand color | `#1a1a1a` |
| Secondary | Secondary color | `#f5f5f0` |
| Accent | Highlight color | `#c9a87c` |
| Background | Page background | `#ffffff` |
| Text | Body text color | `#1a1a1a` |

#### Typography
| Setting | Description |
|---------|-------------|
| Heading Font | Serif font for headlines |
| Body Font | Sans-serif for body text |
| Text Direction | LTR or RTL support |

#### Cart & Checkout
| Setting | Description | Default |
|---------|-------------|---------|
| Cart Type | Drawer or page | Drawer |
| Free Shipping | Threshold amount | Disabled |
| Order Notes | Allow notes | Enabled |
| Upsells | Show recommendations | Enabled |

#### B2B & Quotes
| Setting | Description | Default |
|---------|-------------|---------|
| Enable Quotes | Show quote buttons | Enabled |
| Hide Prices | Replace with "Request Quote" | Disabled |
| Quote Email | Notification recipient | Store email |

#### Email Marketing
| Setting | Description |
|---------|-------------|
| Platform | Seguno, Klaviyo, Mailchimp, HubSpot |
| Klaviyo Key | Public API key for Klaviyo |
| Popup | Enable/disable exit popup |
| Back in Stock | Enable restock alerts |

#### Performance & SEO
| Setting | Description | Default |
|---------|-------------|---------|
| Web Vitals | Track Core Web Vitals | Disabled |
| Liquid Effects | Enable fluid animations | Enabled |
| Site Verification | Google, Bing, Pinterest codes | — |

---

## 🎨 Customization Guide

### CSS Custom Properties

All design tokens are defined in `variables.css`:

```css
:root {
  /* Colors */
  --color-primary: #1a1a1a;
  --color-secondary: #f5f5f0;
  --color-accent: #c9a87c;
  --color-background: #ffffff;
  --color-text: #1a1a1a;
  --color-text-muted: #6b6b6b;
  --color-border: #e5e5e0;

  /* Typography */
  --font-heading: 'Instrument Serif', Georgia, serif;
  --font-body: 'Inter', -apple-system, sans-serif;
  --font-size-base: 1rem;

  /* Spacing */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-4: 1rem;
  --space-8: 2rem;

  /* Transitions */
  --transition-fast: 150ms ease;
  --transition-base: 200ms ease;
  --transition-slow: 300ms ease;

  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
}
```

### Adding Liquid Effects

Use data attributes to enable fluid animations:

```html
<!-- Blob background -->
<div data-liquid-blob>
  <!-- Content -->
</div>

<!-- Wave divider -->
<div data-liquid-wave class="liquid-wave-section"></div>

<!-- Ripple on click -->
<button data-ripple>Click me</button>

<!-- 3D hover effect -->
<div data-liquid-hover>
  <img src="..." alt="...">
</div>

<!-- Text reveal animation -->
<h2 data-liquid-text>Animated Heading</h2>
```

### Creating New Sections

1. Create file in `/sections/`:
   ```liquid
   <div class="my-section">
     {{ section.settings.title }}
   </div>

   {% schema %}
   {
     "name": "My Section",
     "settings": [
       {
         "type": "text",
         "id": "title",
         "label": "Title"
       }
     ]
   }
   {% endschema %}
   ```

2. Add to templates via JSON or Theme Editor

### Creating New Snippets

1. Create file in `/snippets/`:
   ```liquid
   {%- comment -%}
     My Snippet
     @param title {String} - Title text
   {%- endcomment -%}
   
   <div class="my-component">
     {{ title }}
   </div>
   ```

2. Render in sections:
   ```liquid
   {% render 'my-snippet', title: 'Hello' %}
   ```

---

## 📈 Performance Optimization

### Implemented Optimizations

1. **Critical CSS** — Above-the-fold styles inlined in `<head>`
2. **Lazy Loading** — Images, videos, iframes load on scroll
3. **Preconnect** — Early connections to Shopify CDN, Google Fonts
4. **Prefetch** — Next pages prefetched on link hover
5. **Deferred Scripts** — All JS loads with `defer` attribute
6. **Skeleton States** — Visual placeholders during load
7. **Connection-Aware** — Adapts to slow networks

### Core Web Vitals Targets

| Metric | Target | Description |
|--------|--------|-------------|
| LCP | < 2.5s | Largest Contentful Paint |
| FID | < 100ms | First Input Delay |
| CLS | < 0.1 | Cumulative Layout Shift |
| INP | < 200ms | Interaction to Next Paint |

### Tips for Best Performance

- Use WebP images where possible
- Keep hero images under 200KB
- Minimize third-party scripts
- Enable performance tracking to monitor

---

## ♿ Accessibility Features

### WCAG 2.1 AA Compliance

- **Skip Links** — Jump to main content and footer
- **ARIA Labels** — All interactive elements labeled
- **Focus Indicators** — Visible `:focus-visible` styles
- **Keyboard Navigation** — Full Tab support
- **Screen Reader** — ARIA live regions for updates
- **Reduced Motion** — Respects `prefers-reduced-motion`
- **High Contrast** — Supports forced colors mode
- **Alt Text** — Required for all images

### Testing

```bash
# Run Lighthouse accessibility audit
lighthouse https://your-store.myshopify.com --only-categories=accessibility

# Test with axe DevTools
# Install browser extension and run audit
```

---

## 🔍 SEO Features

### Structured Data (JSON-LD)

- **Organization** — Business info, social links
- **WebSite** — Site search integration
- **BreadcrumbList** — Navigation path
- **Product** — Price, availability, reviews
- **Article** — Blog post markup
- **CollectionPage** — Category listings
- **ItemList** — Product lists in collections
- **FAQPage** — Question/answer markup
- **HowTo** — Training/tutorial steps
- **VideoObject** — Product videos
- **LocalBusiness** — Physical location (optional)

### Meta Tags

- Open Graph (Facebook, LinkedIn)
- Twitter Cards (summary_large_image)
- Canonical URLs
- Pagination (prev/next)
- Robots directives
- Hreflang for multilingual

---

## 🛠️ Development Phases

### ✅ Phase 1: Foundation & Core Structure
- Theme scaffold (Online Store 2.0)
- CSS architecture & variables
- Typography system
- Header & footer
- Dark/light mode
- Mobile navigation

### ✅ Phase 2: Homepage & Bento Grid
- Hero slideshow
- Bento grid layouts
- Featured products
- Scrolling marquee
- Science explainer section
- Newsletter signup

### ✅ Phase 3: Product Pages
- Product gallery with zoom
- Variant picker (color-coded)
- Size comparison tool
- Add to cart (AJAX)
- Back in stock signup
- Related products
- Reviews section

### ✅ Phase 4: Collection & Catalog
- Collection grid/list views
- Faceted filtering (AJAX)
- Quick view modal
- Infinite scroll
- Price display logic

### ✅ Phase 5: Cart & Checkout
- Cart drawer (slide-out)
- Cart page (fallback)
- Upsell recommendations
- Shipping calculator
- Cart notes
- Trust badges

### ✅ Phase 6: Quote System (B2B)
- Quote button component
- Quote form modal
- Quote drawer
- Quote cart conversion
- B2B customer detection
- Hide prices option

### ✅ Phase 7: Supporting Pages
- About/Story page
- Contact page
- FAQ page (accordion)
- Product finder quiz
- Training library
- Facility locator
- Shipping info

### ✅ Phase 8: Search & Account
- Predictive search
- Search results page
- Customer login/register
- Account dashboard
- Order history
- Address book
- Quote history (B2B)

### ✅ Phase 9: Email Integration
- Newsletter forms
- Exit intent popup
- Back in stock alerts
- Email preferences
- Multi-platform tracking
- Browse abandonment

### ✅ Phase 10: Polish & Performance
- Lazy loading (images, video)
- Skeleton loading states
- Micro-interactions
- Liquid/water effects
- Accessibility audit
- Core Web Vitals
- SEO meta tags
- JSON-LD schemas
- Documentation

---

## 🐛 Troubleshooting

### Common Issues

**Cart drawer not opening**
- Check browser console for JS errors
- Ensure `cart-drawer.js` is loaded
- Verify cart drawer section is rendered

**Images not lazy loading**
- Add `loading="lazy"` or `data-src` attribute
- Check IntersectionObserver support

**Quote system not working**
- Enable in Theme Settings → B2B & Quotes
- Ensure quote sections are included

**Dark mode not switching**
- Check localStorage for `theme` key
- Verify CSS custom properties in dark mode

### Debug Mode

Enable in Theme Settings → Performance & SEO → Debug Mode

```javascript
// Console will show:
// [Web Vitals] LCP 1234 good
// [Analytics] page_view { ... }
```

---

## 📄 License

MIT License — Feel free to use and modify for your projects.

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing`)
5. Open a Pull Request

---

## 📞 Support

- **Documentation**: This README
- **Issues**: [GitHub Issues](https://github.com/Mx7Zero/shopify-prime-reaction/issues)
- **Shopify Help**: [Shopify Help Center](https://help.shopify.com)

---

## 🙏 Credits

- Design inspiration: [Post Familiar](https://postfamiliar.com/)
- Fonts: [Google Fonts](https://fonts.google.com/) (Instrument Serif, Inter)
- Icons: [Heroicons](https://heroicons.com/)

---

*Built with ❤️ for Reaxing Prime Reaction*

*Last updated: January 2026 — Version 1.0.0*
