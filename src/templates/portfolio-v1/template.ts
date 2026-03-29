export interface TemplateData {
  [key: string]: string | number | boolean | any[] | undefined | Record<string, any>;
}

const s = (v: unknown): string => String(v || '');

export function portfolioV1Template(data: TemplateData): string {
  // Destructure with fallbacks
  const themeColor = s(data.THEME_COLOR || '#CA8A04');
  const heroHeadline = s(data.HERO_HEADLINE || 'Welcome to my world.');
  const subHeadline = s(data.SUB_HEADLINE || 'Discover the best works.');
  const aboutSection = s(data.ABOUT_SECTION || 'An expert in my field.');
  const whatsappLink = s(data.WHATSAPP_LINK || '#');
  const name = s(data.name || 'Portfolio');

  // Build the product list HTML dynamically
  let productsHtml = '';
  if (data.PRODUCT_LIST && Array.isArray(data.PRODUCT_LIST) && data.PRODUCT_LIST.length > 0) {
    productsHtml = data.PRODUCT_LIST.map((product, i) => `
      <article class="product-card">
          <div class="product-img-box">
              <img src="${product.image_url || '/templates/portfolio-v1/story_1.jpg'}" alt="${product.name}" loading="lazy" data-field="PRODUCT_${i}_IMAGE">
          </div>
          <div class="product-info">
              <span class="product-type">Featured Work</span>
              <h3 class="product-title" data-field="PRODUCT_${i}_NAME">${product.name}</h3>
              <p class="product-desc" data-field="PRODUCT_${i}_DESC">${product.desc}</p>
              <button class="btn-cta add-to-cart" data-product="${product.name}" style="width:100%; margin-top: auto; justify-content: space-between;">
                  Add to Cart <span data-field="PRODUCT_${i}_PRICE">${product.price}</span>
              </button>
          </div>
      </article>
    `).join('');
  } else {
    // Default placeholder product if empty
    productsHtml = `
      <article class="product-card">
          <div class="product-img-box">
              <img src="/templates/portfolio-v1/story_1.jpg" alt="Default Work" loading="lazy" data-field="PRODUCT_0_IMAGE">
          </div>
          <div class="product-info">
              <h3 class="product-title" data-field="PRODUCT_0_NAME">Sample Work</h3>
              <p class="product-desc" data-field="PRODUCT_0_DESC">A sample description of this great piece.</p>
              <button class="btn-cta add-to-cart" data-product="Sample Work" style="width:100%; margin-top: auto; justify-content: space-between;">
                  Add to Cart <span data-field="PRODUCT_0_PRICE">Custom</span>
              </button>
          </div>
      </article>
    `;
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${name} | Portfolio</title>
    <meta name="description" content="${subHeadline}">
    
    <!-- Modern Typography: DM Sans -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,700;9..40,800&display=swap" rel="stylesheet">
    
    <style>
      :root {
        --cta: ${themeColor} !important;
      }
    </style>
    <link rel="stylesheet" href="/templates/portfolio-v1/css/styles.css">
</head>
<body>

    <!-- WhatsApp Floating Action -->
    <a href="${whatsappLink}" class="wa-float" target="_blank" aria-label="Contact via WhatsApp">
        <svg viewBox="0 0 24 24" class="icon icon-fill" style="width: 32px; height: 32px;"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
    </a>

    <!-- Navigation -->
    <nav>
        <div class="nav-wrapper container">
            <div class="nav-logo" data-field="LOGO_TEXT">${s(data.LOGO_TEXT || name).toUpperCase()}.</div>
            <div class="nav-links">
                <a href="#books">Works</a>
                <a href="#about">Philosophy</a>
                <a href="#contact">Contact</a>
            </div>
            <div class="nav-actions">
                <a href="${whatsappLink}" class="btn-cta">
                    <span data-field="CTA_NAV_TEXT">${data.CTA_NAV_TEXT || 'Author Booking'}</span>
                    <svg viewBox="0 0 24 24" class="icon"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"/></svg>
                </a>
                
                <button class="menu-toggle" aria-label="Toggle Menu">
                    <span></span><span></span><span></span>
                </button>
            </div>
        </div>
    </nav>

    <!-- Mobile Navigation Overlay -->
    <div class="mobile-menu">
        <button class="menu-close" aria-label="Close Menu">
            <svg viewBox="0 0 24 24" class="icon"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" stroke-width="2"/></svg>
        </button>

        <a href="#books">Works</a>
        <a href="#about">Philosophy</a>
        <a href="#contact">Contact</a>
        
        <div class="spacer-y" style="flex-grow:1"></div>
        <a href="${whatsappLink}" class="btn-cta" style="width: 100%; text-align: center;">Book the Author</a>
    </div>

    <main>
        <!-- Hero Section -->
        <header class="hero">
            <!-- Background Video -->
            <video class="hero-video-bg" id="bg-vid" autoplay muted loop playsinline poster="/templates/portfolio-v1/story_1.jpg">
                <source src="/templates/portfolio-v1/intro.mp4" type="video/mp4">
            </video>
            <div class="hero-gradient"></div>
            
            <div class="hero-content container reveal">
                <h1 data-field="HERO_HEADLINE">${heroHeadline.replace(/\\n/g, '<br>')}</h1>
                <p class="text-sub" data-field="SUB_HEADLINE">${subHeadline}</p>
                <div class="actions">
                    <a href="#books" class="btn-cta"><span data-field="CTA_PRIMARY_TEXT">${data.CTA_PRIMARY_TEXT || 'Discover Works'}</span></a>
                    <a href="#about" class="btn-ghost" style="padding: 14px 28px; border-radius: 12px; font-weight: 700;"><span data-field="CTA_SECONDARY_TEXT">${data.CTA_SECONDARY_TEXT || 'My Philosophy'}</span></a>
                </div>
            </div>
        </header>

        <!-- Dynamic Carousel Section -->
        <section id="books" class="container section-spacing">
            <h2 class="reveal" data-field="WORKS_TITLE">Selected Works.</h2>
            
            <div class="product-carousel reveal" id="dynamic-product-list">
                ${productsHtml}
            </div>
        </section>

        <!-- About/Impact Section -->
        <section id="about" class="container section-spacing">
            <div class="about-grid reveal">
                <div>
                    <h2 data-field="ABOUT_TITLE">Every story <br>is a journey.</h2>
                    <p class="text-sub" data-field="ABOUT_SECTION">${aboutSection}</p>
                </div>
                <div>
                    <!-- Bold Graphic Stat Block -->
                    <div class="stat-group">
                        <div class="stat-box">
                            <span class="stat-val" data-field="STAT_1_VAL">${data.STAT_1_VAL || '03'}</span>
                            <span class="stat-label" data-field="STAT_1_LABEL">${data.STAT_1_LABEL || 'Published Epics'}</span>
                        </div>
                        <div class="stat-box">
                            <span class="stat-val" data-field="STAT_2_VAL">${data.STAT_2_VAL || '100+'}</span>
                            <span class="stat-label" data-field="STAT_2_LABEL">${data.STAT_2_LABEL || 'Cult Followers'}</span>
                        </div>
                        <div class="stat-box">
                            <span class="stat-val" data-field="STAT_3_VAL">${data.STAT_3_VAL || '14'}</span>
                            <span class="stat-label" data-field="STAT_3_LABEL">${data.STAT_3_LABEL || 'Lost Stories'}</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <div class="spacer-y"></div>
    </main>

    <footer class="container reveal">
        <h4 style="font-family:var(--heading-font); letter-spacing:-0.05em;" data-field="FOOTER_LOGO">${s(data.FOOTER_LOGO || name).toUpperCase()}.</h4>
        <div class="foot-links">
            <a href="#books">Works</a> &middot; 
            <a href="${whatsappLink}">Contact</a> &middot; 
            <a href="#">Instagram</a>
        </div>
        <p style="font-size:0.75rem; color:var(--text-muted);" data-field="FOOTER_CREDITS">&copy; 2026 ${name}. All Rights Reserved.</p>
    </footer>

    <!-- CART MODAL INJECTION -->
    <div class="cart-overlay"></div>
    <div class="cart-modal">
        <div class="cart-header">
            <h3 style="margin-bottom:0">Your Selection</h3>
            <button class="cart-close">&times;</button>
        </div>
        <div class="cart-items">
            <!-- Injected via JS -->
        </div>
        <button class="btn-cta cart-checkout" data-wa="${whatsappLink}" style="width:100%">Proceed via WhatsApp</button>
    </div>

    <!-- MAIN APP SCRIPT -->
    <script src="/templates/portfolio-v1/js/main.js"></script>
</body>
</html>`;
}
