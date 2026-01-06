# Reaxing Prime Reaction - Shopify Theme

> Editorial, typography-forward Shopify theme inspired by [postfamiliar.com](https://postfamiliar.com/)  
> For [prime-reaction-3.myshopify.com](https://prime-reaction-3.myshopify.com/)

## 🎨 Design Philosophy

- **Bold serif headlines** (Instrument Serif) with clean sans-serif body text (Inter)
- **Generous whitespace** and minimal aesthetic
- **Dark/Light mode** with system preference detection
- **Smooth animations** and scroll effects with reduced motion support
- **Clean product cards** with hover effects and quick view
- **B2B Ready** with quote request system

## ✨ Features

### Core
- 📱 **Mobile-first responsive design** - Works beautifully on all devices
- 🌙 **Dark/Light mode** - Respects system preferences with manual toggle
- ♿ **Accessible** - WCAG 2.1 compliant with skip links, ARIA, keyboard navigation
- 🔍 **SEO optimized** - Open Graph, Twitter Cards, JSON-LD structured data
- ⚡ **Performance focused** - Critical CSS, lazy loading, skeleton states

### E-commerce
- 🛒 **AJAX cart drawer** - No page reloads, smooth animations
- 👁️ **Quick view** - View products without leaving the page
- 🔎 **Faceted filtering** - Filter by price, vendor, tags
- 📄 **Infinite scroll & load more** - For collection pages
- 📧 **Quote system** - B2B quote requests with form

### Customer
- 👤 **Full customer accounts** - Login, register, orders, addresses
- 📬 **Contact & FAQ pages** - With customizable sections
- 🔍 **Predictive search** - Products, pages, articles

## 📁 Theme Structure

```
├── assets/                 # CSS, JS, images
│   ├── animations.css      # All animations & transitions
│   ├── base.css            # Reset & base styles
│   ├── cart.css            # Cart page styles
│   ├── collection.css      # Collection page styles
│   ├── customer.css        # Customer account styles
│   ├── pages.css           # Supporting page styles
│   ├── product-main.css    # Product page styles
│   ├── skeleton.css        # Loading skeleton states
│   ├── typography.css      # Font & text styles
│   ├── variables.css       # CSS custom properties
│   ├── cart-drawer.js      # AJAX cart functionality
│   ├── collection-pagination.js  # Load more / infinite scroll
│   ├── facets.js           # AJAX filtering & sorting
│   ├── global.js           # Site-wide functionality
│   ├── lazy-load.js        # Image/video lazy loading
│   ├── quick-view.js       # Quick view modal
│   └── quote-system.js     # Quote request system
│
├── config/
│   ├── settings_data.json  # Theme settings values
│   └── settings_schema.json # Theme settings definitions
│
├── layout/
│   └── theme.liquid        # Main theme wrapper
│
├── locales/
│   └── en.default.json     # English translations
│
├── sections/               # Customizable sections
│   ├── announcement-bar.liquid
│   ├── header.liquid
│   ├── footer.liquid
│   ├── hero-slideshow.liquid
│   ├── featured-collection.liquid
│   ├── product-main.liquid
│   ├── collection-template.liquid
│   ├── cart-drawer-ajax.liquid
│   ├── quote-modal.liquid
│   ├── customer-*.liquid   # 8 customer account sections
│   └── ...more
│
├── snippets/               # Reusable components
│   ├── accessibility.liquid # Skip links, ARIA
│   ├── critical-css.liquid  # Inline critical styles
│   ├── facets.liquid        # Filter drawer
│   ├── json-ld.liquid       # Structured data
│   ├── product-card.liquid  # Product card component
│   ├── quick-view.liquid    # Quick view modal
│   ├── quote-button.liquid  # Quote CTA button
│   ├── seo-meta.liquid      # OG & Twitter meta
│   └── ...more
│
└── templates/              # Page templates (JSON)
    ├── index.json
    ├── product.json
    ├── collection.json
    ├── cart.json
    ├── page.*.json         # Contact, FAQ, About
    ├── 404.json
    ├── search.json
    └── customers/          # Customer account templates
```

## 🚀 Getting Started

### Prerequisites
- Shopify Partner account or development store
- Node.js 18+ (for local development)

### Connect to Shopify

1. Go to **Shopify Admin** → **Online Store** → **Themes**
2. Click **Add theme** → **Connect from GitHub**
3. Select this repository and the `main` branch
4. Changes auto-deploy to preview theme

### Local Development

```bash
# Install Shopify CLI
npm install -g @shopify/cli @shopify/theme

# Clone the repository
git clone https://github.com/Mx7Zero/shopify-prime-reaction.git
cd shopify-prime-reaction

# Connect to your store and start development server
shopify theme dev --store your-store.myshopify.com
```

### Deploy to Production

```bash
# Push to live theme
shopify theme push --live
```

## ⚙️ Theme Settings

Access via **Shopify Admin** → **Online Store** → **Themes** → **Customize**

### Colors
- Primary, secondary, accent colors
- Background and text colors
- Border colors

### Typography
- Heading and body font selection
- Text direction (LTR/RTL)

### Layout
- Max page width (1000-1800px)
- Section spacing

### Cart
- Cart type (drawer or page)
- Order notes toggle
- Upsell products
- Free shipping threshold

### B2B & Quotes
- Enable/disable quote system
- Hide prices option
- Quote button text
- Quote notification email

### SEO
- Default social share image
- Google/Bing/Pinterest verification
- Local business schema (optional)

## 🎨 Customization

### CSS Custom Properties

All design tokens are in `variables.css`:

```css
:root {
  /* Colors */
  --color-primary: #1a1a1a;
  --color-background: #ffffff;
  
  /* Typography */
  --font-heading: 'Instrument Serif', serif;
  --font-body: 'Inter', sans-serif;
  
  /* Spacing */
  --space-1: 0.25rem;
  --space-4: 1rem;
  
  /* Transitions */
  --transition-base: 200ms ease;
}
```

### Adding New Sections

1. Create a new `.liquid` file in `/sections/`
2. Add schema at the bottom for settings
3. Reference in templates via JSON

### Adding New Snippets

1. Create a new `.liquid` file in `/snippets/`
2. Render in sections with `{% render 'snippet-name' %}`

## ♿ Accessibility

This theme follows WCAG 2.1 AA guidelines:

- **Skip links** - Jump to main content and footer
- **ARIA labels** - All interactive elements properly labeled
- **Keyboard navigation** - Full keyboard support
- **Focus indicators** - Visible focus states
- **Reduced motion** - Respects `prefers-reduced-motion`
- **High contrast** - Supports forced colors mode
- **Screen reader** - ARIA live regions for dynamic updates

## 📈 Performance

- **Critical CSS** - Inline above-the-fold styles
- **Lazy loading** - Images, videos, iframes
- **Skeleton states** - Visual loading placeholders
- **Deferred scripts** - Non-blocking JavaScript
- **Preconnect** - Early connection to CDNs
- **Native lazy loading** - Uses browser's native `loading="lazy"`

## ✅ Development Phases

### Phase 1: Foundation ✓
- Theme scaffold and base CSS
- Typography system
- Header & footer
- Homepage sections

### Phase 2: Products & Collections ✓
- Product page template
- Collection pages
- Cart page

### Phase 3: Customer & Pages ✓
- Customer accounts (7 templates)
- Contact, FAQ, About pages
- 404 and Search

### Phase 4: Enhancements ✓
- Quote system (B2B)
- AJAX cart drawer
- Quick view modal
- Faceted filtering
- Infinite scroll

### Phase 5: Polish & Performance ✓
- Skeleton loading states
- Lazy loading
- SEO meta tags
- JSON-LD structured data
- Accessibility improvements
- Documentation

## 📄 License

MIT License - Feel free to use and modify for your projects.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

*Built with ❤️ for Prime Reaction*