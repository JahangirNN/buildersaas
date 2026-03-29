export interface TemplateData {
  [key: string]: any;
}

export function ecommerceV1Template(data: TemplateData): string {
  const themeColor = data.THEME_COLOR || '#10b981'; // Green for nature theme
  const heroHeadline = data.HERO_HEADLINE || 'Handcrafted\\n<em>with Herbs</em>\\n& Nature';
  const subHeadline = data.SUB_HEADLINE || 'Pure care for your hair & skin — free from harsh chemicals, made with love from the finest Indian herbs.';
  const aboutSection = data.ABOUT_SECTION || 'At Abrra, we believe nature has all the answers. Our products are lovingly handcrafted using time-honoured Indian herbal traditions — every ingredient chosen for its purity and potency.';
  const whatsappLink = data.WHATSAPP_LINK || 'https://wa.me/919920355666?text=Hello%20Nature%20Products!%20I%20would%20like%20to%20place%20an%20order.';
  const contactPhone = data.CONTACT_PHONE || '+91 99203 55666';
  const instagramLink = data.INSTAGRAM_LINK || 'https://www.instagram.com/abrra.natureproducts';
  const name = data.name || 'Abrra Nature Products';
  const logoUrl = data.LOGO_URL || '/templates/ecommerce-v1/assets/logo.png';
  const heroBg = data.HERO_BG_IMAGE || '/templates/ecommerce-v1/assets/gallery1_new.png';

  let productsHtml = '';
  if (data.PRODUCT_LIST && Array.isArray(data.PRODUCT_LIST) && data.PRODUCT_LIST.length > 0) {
    productsHtml = data.PRODUCT_LIST.map((product, i) => `
      <div class="product-card">
        <div class="prod-img-wrap">
          <img src="${product.image_url || '/templates/ecommerce-v1/assets/gallery1_new.png'}" alt="${product.name}" data-field="PRODUCT_${i}_IMAGE"/>
          <div class="prod-overlay">
            <button class="prod-order add-to-cart" data-name="${product.name}" data-price="${product.price}" data-img="${product.image_url || '/templates/ecommerce-v1/assets/gallery1_new.png'}">Add to Cart</button>
          </div>
        </div>
        <div class="prod-info">
          <h3 data-field="PRODUCT_${i}_NAME">${product.name}</h3>
          <p data-field="PRODUCT_${i}_DESC">${product.desc}</p>
          <div class="prod-footer">
            <span class="price" data-field="PRODUCT_${i}_PRICE">${product.price}</span>
            <button class="prod-cta add-to-cart" data-name="${product.name}" data-price="${product.price}" data-img="${product.image_url || '/templates/ecommerce-v1/assets/gallery1_new.png'}">Add to Cart</button>
          </div>
        </div>
      </div>
    `).join('');
  } else {
    productsHtml = `
      <div class="product-card">
        <div class="prod-img-wrap">
          <img src="/templates/ecommerce-v1/assets/gallery1_new.png" alt="Herbal Hair Oil" data-field="PRODUCT_0_IMAGE"/>
          <div class="prod-badge">Best Seller</div>
          <div class="prod-overlay">
            <button class="prod-order add-to-cart" data-name="Herbal Hair Oil" data-price="499" data-img="/templates/ecommerce-v1/assets/gallery1_new.png">Add to Cart</button>
          </div>
        </div>
        <div class="prod-info">
          <h3 data-field="PRODUCT_0_NAME">Herbal Hair Oil</h3>
          <p data-field="PRODUCT_0_DESC">Deeply nourishing blend of amla, bhringraj & brahmi for strong, lustrous hair.</p>
          <div class="prod-footer">
            <span class="price" data-field="PRODUCT_0_PRICE">₹499</span>
            <button class="prod-cta add-to-cart" data-name="Herbal Hair Oil" data-price="499" data-img="/templates/ecommerce-v1/assets/gallery1_new.png">Add to Cart</button>
          </div>
        </div>
      </div>
    `;
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>${name}</title>
  <meta name="description" content="${subHeadline.replace(/"/g, '&quot;')}"/>
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet"/>
  <style>
    :root {
      --primary: ${themeColor} !important;
      --accent: ${themeColor} !important;
    }
  </style>
  <link rel="stylesheet" href="/templates/ecommerce-v1/css/styles.css"/>
</head>
<body>

  <!-- ===== NAVBAR ===== -->
  <header class="navbar" id="navbar">
    <div class="nav-inner">
      <a href="#hero" class="brand">
        <img src="${logoUrl}" alt="${name} Logo" class="brand-logo" onerror="this.onerror=null; this.src='/templates/ecommerce-v1/assets/logo.png';"/>
      </a>
      <nav class="desk-nav">
        <a href="#about">About</a>
        <a href="#products">Products</a>
        <a href="#why-us">Why Us</a>
        <a href="#contact">Contact</a>
      </nav>
      <div class="nav-actions">
        <a href="${whatsappLink}" class="btn-order desk-order" target="_blank" rel="noopener">
          <span data-field="CTA_NAV_TEXT">${data.CTA_NAV_TEXT || 'Order Now'}</span>
        </a>
        <button class="cart-trigger" id="cartTrigger" aria-label="View Cart">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 20a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm7 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm-7-4h10l1-9H5m-2-3h4l1 4"/></svg>
          <span class="cart-count" id="cartCount">0</span>
        </button>
        <button class="burger" id="burger" aria-label="Open Menu">
          <span></span><span></span><span></span>
        </button>
      </div>
    </div>
  </header>

  <!-- ===== CART MODAL ===== -->
  <div class="cart-modal" id="cartModal">
    <div class="cart-content">
      <div class="cart-header">
        <h2>Your Cart</h2>
        <button class="btn-close-cart" id="closeCart">&times;</button>
      </div>
      <div class="cart-items" id="cartItems">
        <!-- Items injected by JS -->
      </div>
      <div class="cart-footer">
        <div class="cart-total">Total: <span id="cartTotalText">₹0</span></div>
        <button class="btn-checkout" id="checkoutBtn" data-wa="${whatsappLink}">Checkout on WhatsApp</button>
      </div>
    </div>
  </div>

  <!-- ===== MOBILE MENU OVERLAY ===== -->
  <div class="mob-overlay" id="mobOverlay">
    <button class="mob-close" id="mobClose">&times;</button>
    <nav class="mob-nav">
      <a href="#about" class="mob-link">About</a>
      <a href="#products" class="mob-link">Products</a>
      <a href="#why-us" class="mob-link">Why Us</a>
      <a href="#contact" class="mob-link">Contact</a>
    </nav>
  </div>

  <main>
    <!-- ===== HERO ===== -->
    <section id="hero" class="hero">
      <div class="hero-bg">
        <div class="orb orb1"></div>
        <div class="orb orb2"></div>
        <div class="orb orb3"></div>
        <div class="leaf-pattern"></div>
      </div>
      <div class="hero-content">
        <div class="hero-badge">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15v-4H7l5-8v4h4l-5 8z" fill="currentColor"/></svg>
          100% Natural &amp; Handcrafted
        </div>
        <h1 class="hero-title" data-field="HERO_HEADLINE">${heroHeadline.replace(/\\n/g, '<br/>')}</h1>
        <p class="hero-sub" data-field="SUB_HEADLINE">${subHeadline}</p>
        <div class="hero-actions">
          <a href="${whatsappLink}" class="btn-cta" target="_blank" rel="noopener">
            <svg viewBox="0 0 24 24" width="18" height="18"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" fill="currentColor"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.556 4.12 1.528 5.855L.057 23.57l5.88-1.538A11.954 11.954 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.91 0-3.7-.497-5.254-1.367l-.376-.222-3.49.913.929-3.396-.245-.393A9.951 9.951 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" fill="currentColor"/></svg>
            <span data-field="CTA_PRIMARY_TEXT">${data.CTA_PRIMARY_TEXT || 'DM to Order'}</span>
          </a>
          <a href="#products" class="btn-ghost">
            <span data-field="CTA_SECONDARY_TEXT">${data.CTA_SECONDARY_TEXT || 'View Products'}</span>
          </a>
        </div>
        <div class="hero-stats">
          <div class="stat"><span class="stat-num">100%</span><span class="stat-lbl">Natural</span></div>
          <div class="stat-div"></div>
          <div class="stat"><span class="stat-num">Pan</span><span class="stat-lbl">India Delivery</span></div>
          <div class="stat-div"></div>
          <div class="stat"><span class="stat-num">Herb</span><span class="stat-lbl">Powered Care</span></div>
        </div>
      </div>
      <div class="hero-image-wrap">
        <div class="hero-img-frame">
          <img src="${heroBg}" alt="Herbal Care" class="hero-img" data-field="HERO_BG_IMAGE" onerror="this.onerror=null; this.src='/templates/ecommerce-v1/assets/gallery1_new.png';"/>
          <div class="img-glow"></div>
        </div>
        <div class="float-card fc1">
          <svg viewBox="0 0 24 24" width="16" height="16"><path d="M17 8C8 10 5.9 16.17 3.82 19.82L5.71 21 7 19c1-1 2-2 3.5-2 2 0 3 1 4 1 3 0 4-3 4-5 1 0 1 1 1 1s1-2 1-4-2-4-4-4z" fill="currentColor"/></svg>
          Herbal Infused
        </div>
        <div class="float-card fc2">
          <svg viewBox="0 0 24 24" width="16" height="16"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="currentColor"/></svg>
          Pan India
        </div>
      </div>
    </section>

    <!-- ===== MARQUEE ===== -->
    <div class="marquee-wrap">
      <div class="marquee-track">
        <span>🌿 Handcrafted with Love</span>
        <span>✦ Hair Care</span>
        <span>✦ Skin Care</span>
        <span>✦ 100% Natural</span>
        <span>✦ No Harsh Chemicals</span>
        <span>✦ Indian Herbs</span>
        <span>✦ Pan India Delivery</span>
        <span>🌿 Handcrafted with Love</span>
        <span>✦ Hair Care</span>
        <span>✦ Skin Care</span>
        <span>✦ 100% Natural</span>
        <span>✦ No Harsh Chemicals</span>
        <span>✦ Indian Herbs</span>
        <span>✦ Pan India Delivery</span>
      </div>
    </div>

    <!-- ===== ABOUT ===== -->
    <section id="about" class="about">
      <div class="container">
        <div class="about-grid">
          <div class="about-imgs" data-anim="slide-left">
            <img src="/templates/ecommerce-v1/assets/gallery2_new.png" alt="Herbal skin care" class="about-img ai1" data-field="ABOUT_IMAGE_1"/>
            <img src="/templates/ecommerce-v1/assets/gallery3_new.png" alt="Herbal hair mask" class="about-img ai2" data-field="ABOUT_IMAGE_2"/>
            <div class="about-badge">
              <span class="badge-num">🌿</span>
              <span class="badge-txt">Pure & Natural</span>
            </div>
          </div>
          <div class="about-txt" data-anim="slide-right">
            <p class="section-eyebrow" data-anim="fade-up">Our Story</p>
            <h2 class="section-title word-reveal" data-field="ABOUT_TITLE">Born from nature,<br/><em>crafted with care</em></h2>
            <p class="about-desc" data-anim="fade-up" data-field="ABOUT_SECTION">${aboutSection}</p>
            <ul class="about-list" data-anim-stagger>
              <li>
                <svg viewBox="0 0 24 24" width="18" height="18"><path d="M9 11l3 3L22 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/></svg>
                Free from sulphates, parabens &amp; artificial colours
              </li>
              <li>
                <svg viewBox="0 0 24 24" width="18" height="18"><path d="M9 11l3 3L22 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/></svg>
                Small-batch, handcrafted for freshness
              </li>
              <li>
                <svg viewBox="0 0 24 24" width="18" height="18"><path d="M9 11l3 3L22 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/></svg>
                Ethically sourced Indian botanicals
              </li>
            </ul>
            <a href="${whatsappLink}" class="btn-cta" target="_blank" rel="noopener">Learn More</a>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== PRODUCTS ===== -->
    <section id="products" class="products">
      <div class="container">
        <p class="section-eyebrow center" data-anim="fade-up">Our Range</p>
        <h2 class="section-title center word-reveal">Nature's best,<br/><em>bottled for you</em></h2>
        <div class="products-grid" data-anim-stagger>
          ${productsHtml}
        </div>
      </div>
    </section>

    <!-- ===== WHY US ===== -->
    <section id="why-us" class="why-us">
      <div class="container">
        <p class="section-eyebrow center" data-anim="blur">Why ${name}</p>
        <h2 class="section-title center word-reveal">The purity you<br/><em>can trust</em></h2>
        <div class="why-grid" data-anim-stagger>
          <div class="why-card">
            <div class="why-icon">
              <svg viewBox="0 0 24 24" width="28" height="28" fill="none"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>
            </div>
            <h3 data-field="WHY_1_TITLE">Chemical Free</h3>
            <p data-field="WHY_1_DESC">Zero sulphates, zero parabens. Only pure herbal ingredients on your skin and hair.</p>
          </div>
          <div class="why-card">
            <div class="why-icon">
              <svg viewBox="0 0 24 24" width="28" height="28" fill="none"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM9.29 16.29L5.7 12.7a1 1 0 011.41-1.41L10 14.17l6.88-6.88a1 1 0 011.41 1.41l-7.59 7.59a1 1 0 01-1.41 0z" fill="currentColor"/></svg>
            </div>
            <h3 data-field="WHY_2_TITLE">Handcrafted</h3>
            <p data-field="WHY_2_DESC">Every product is made in small batches with attention to detail and quality you can feel.</p>
          </div>
          <div class="why-card">
            <div class="why-icon">
              <svg viewBox="0 0 24 24" width="28" height="28" fill="none"><path d="M17 8C8 10 5.9 16.17 3.82 19.82L5.71 21 7 19c1-1 2-2 3.5-2 2 0 3 1 4 1 3 0 4-3 4-5 1 0 1 1 1 1s1-2 1-4-2-4-4-4z" stroke="currentColor" stroke-width="1.5" fill="none"/></svg>
            </div>
            <h3 data-field="WHY_3_TITLE">Best Herbs</h3>
            <p data-field="WHY_3_DESC">Sourced from the finest botanical traditions — ancient wisdom, modern formulas.</p>
          </div>
          <div class="why-card">
            <div class="why-icon">
              <svg viewBox="0 0 24 24" width="28" height="28" fill="none"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><polyline points="9 22 9 12 15 12 15 22" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>
            </div>
            <h3 data-field="WHY_4_TITLE">Quality Delivery</h3>
            <p data-field="WHY_4_DESC">We ship far and wide — your order, delivered safely to your doorstep.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== CONTACT ===== -->
    <section id="contact" class="contact">
      <div class="container">
        <div class="contact-inner">
          <div class="contact-txt" data-anim="slide-left">
            <p class="section-eyebrow" data-anim="fade-up">Get In Touch</p>
            <h2 class="section-title word-reveal" data-field="CONTACT_TITLE">Ready to go<br/><em>natural?</em></h2>
            <p data-anim="fade-up" data-field="CONTACT_DESC">Place your order directly via WhatsApp or follow us on Instagram for updates and new arrivals.</p>
            <div class="contact-links" data-anim-stagger>
              <a href="${whatsappLink}" class="contact-item" target="_blank" rel="noopener">
                <div class="ci-icon wa-icon">
                  <svg viewBox="0 0 24 24" width="22" height="22"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" fill="currentColor"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.556 4.12 1.528 5.855L.057 23.57l5.88-1.538A11.954 11.954 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.91 0-3.7-.497-5.254-1.367l-.376-.222-3.49.913.929-3.396-.245-.393A9.951 9.951 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" fill="currentColor"/></svg>
                </div>
                <div class="ci-txt">
                  <span class="ci-label">WhatsApp Order</span>
                  <span class="ci-val">Message Us</span>
                </div>
              </a>
              <a href="tel:${contactPhone.replace(/\\s+/g, '')}" class="contact-item">
                <div class="ci-icon ph-icon">
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="none"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.9 12.5a19.79 19.79 0 01-3-8.57A2 2 0 012.88 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L7.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </div>
                <div class="ci-txt">
                  <span class="ci-label">Call Us</span>
                  <span class="ci-val">${contactPhone}</span>
                </div>
              </a>
              <a href="${instagramLink}" class="contact-item" target="_blank" rel="noopener">
                <div class="ci-icon ig-icon">
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="none"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" stroke="currentColor" stroke-width="1.5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" stroke="currentColor" stroke-width="1.5"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>
                </div>
                <div class="ci-txt">
                  <span class="ci-label">Instagram</span>
                  <span class="ci-val">Follow Us</span>
                </div>
              </a>
            </div>
          </div>
          <div class="contact-cta-wrap" data-anim="scale">
            <div class="contact-cta-card">
              <img src="${logoUrl}" alt="${name} logo" class="cta-card-logo" onerror="this.onerror=null; this.src='/templates/ecommerce-v1/assets/logo.png';"/>
              <h3>Start your journey today</h3>
              <p>DM us on Whatsapp or Instagram to find the perfect product for your needs.</p>
              <a href="${whatsappLink}" class="btn-cta full-w" target="_blank" rel="noopener">
                <svg viewBox="0 0 24 24" width="18" height="18"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" fill="currentColor"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.556 4.12 1.528 5.855L.057 23.57l5.88-1.538A11.954 11.954 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" fill="currentColor"/></svg>
                WhatsApp Order
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>

  <!-- ===== FOOTER ===== -->
  <footer class="footer">
    <div class="container footer-inner">
      <img src="${logoUrl}" alt="${name}" class="footer-logo" data-field="LOGO_URL" onerror="this.onerror=null; this.src='/templates/ecommerce-v1/assets/logo.png';"/>
      <p class="footer-tagline" data-field="FOOTER_TAGLINE">Quality &amp; Care 🌿</p>
      <div class="footer-links">
        <a href="#about">About</a>
        <a href="#products">Products</a>
        <a href="#contact">Contact</a>
        <a href="${instagramLink}" target="_blank" rel="noopener">Instagram</a>
      </div>
      <p class="footer-copy" data-field="FOOTER_CREDITS">&copy; 2026 ${name}. All rights reserved.</p>
    </div>
  </footer>

  <!-- ===== FLOATING WHATSAPP ===== -->
  <a href="${whatsappLink}" class="wa-float" id="waFloat" target="_blank" rel="noopener" aria-label="Order on WhatsApp">
    <svg viewBox="0 0 24 24" width="28" height="28"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" fill="currentColor"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.556 4.12 1.528 5.855L.057 23.57l5.88-1.538A11.954 11.954 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.91 0-3.7-.497-5.254-1.367l-.376-.222-3.49.913.929-3.396-.245-.393A9.951 9.951 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" fill="currentColor"/></svg>
    <span class="wa-pulse"></span>
  </a>

  <script src="/templates/ecommerce-v1/js/main.js"></script>
</body>
</html>`;
}
