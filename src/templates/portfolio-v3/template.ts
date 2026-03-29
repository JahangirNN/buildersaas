import { PortfolioV3Data } from './schema';

const s = (v: unknown): string => String(v || '');

// Unsplash fallback images for the gallery
const fallbackImages = [
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
  'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800&q=80',
  'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
  'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80',
];

export function portfolioV3Template(data: PortfolioV3Data): string {
  const themeColor = s(data.THEME_COLOR || '#1a1a1a');
  const name = s(data.name || 'Studio Blanc');
  const tagline = s(data.TAGLINE || 'Visual Storytelling Studio');
  const heroHeadline = s(data.HERO_HEADLINE || 'We craft images\nthat stop the scroll.');
  const subHeadline = s(data.SUB_HEADLINE || 'A boutique creative studio.');
  const aboutSection = s(data.ABOUT_SECTION || 'Founded in 2018, we create imagery that sells.');
  const whatsappLink = s(data.WHATSAPP_LINK || '#');
  const heroBg = s(data.HERO_BG_IMAGE || fallbackImages[0]);

  const products = data.PRODUCT_LIST && Array.isArray(data.PRODUCT_LIST) ? data.PRODUCT_LIST : [];
  const displayProducts = products.length > 0 ? products : [
    { name: 'Fashion Edit', desc: 'Campaign photography for luxury fashion brands.', price: 'View', image_url: fallbackImages[1] },
    { name: 'Brand Film', desc: 'Short-form documentary for hospitality brands.', price: 'View', image_url: fallbackImages[2] },
    { name: 'Product Studio', desc: 'Clean, lifestyle product photography.', price: 'View', image_url: fallbackImages[3] },
    { name: 'Architecture', desc: 'Interior and exterior architectural photography.', price: 'View', image_url: fallbackImages[4] },
  ];

  const galleryHtml = (displayProducts as Array<Record<string, unknown>>).map((p, i) => {
    const img = s(p.image_url || fallbackImages[i % fallbackImages.length]);
    const tall = i % 3 === 0;
    return `
    <div class="gallery-item ${tall ? 'gallery-tall' : ''}" data-field="PRODUCT_${i}_NAME">
      <div class="gallery-img-wrap">
        <img src="${img}" alt="${s(p.name)}" loading="lazy" data-field="PRODUCT_${i}_IMAGE_URL">
        <div class="gallery-overlay">
          <div class="gallery-meta">
            <span class="gallery-name">${s(p.name)}</span>
            <span class="gallery-desc" data-field="PRODUCT_${i}_DESC">${s(p.desc)}</span>
            <a href="${whatsappLink}" class="gallery-cta" target="_blank">Enquire →</a>
          </div>
        </div>
      </div>
    </div>`;
  }).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${name} — ${tagline}</title>
  <meta name="description" content="${subHeadline}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
  <style>
    :root {
      --ink: ${themeColor};
      --paper: #fafaf8;
      --muted: #888;
      --border: #e8e8e4;
      --font-serif: 'Cormorant Garamond', Georgia, serif;
      --font-sans: 'Inter', sans-serif;
    }
    *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
    html { scroll-behavior: smooth; }
    body {
      font-family: var(--font-sans);
      background: var(--paper);
      color: var(--ink);
      line-height: 1.6;
      overflow-x: hidden;
    }
    .container { max-width: 1180px; margin: 0 auto; padding: 0 32px; }

    /* ─── NAV ─── */
    nav {
      position: fixed; top: 0; left: 0; right: 0; z-index: 100;
      background: rgba(250,250,248,0.88);
      backdrop-filter: blur(16px);
      border-bottom: 1px solid var(--border);
    }
    .nav-inner {
      display: flex; align-items: center; justify-content: space-between;
      height: 72px;
    }
    .nav-logo {
      font-family: var(--font-serif);
      font-size: 1.35rem; font-weight: 600; letter-spacing: -0.01em;
      color: var(--ink); text-decoration: none;
    }
    .nav-links { display: flex; gap: 36px; }
    .nav-links a {
      text-decoration: none; color: var(--muted);
      font-size: 0.82rem; font-weight: 500;
      letter-spacing: .04em; text-transform: uppercase;
      transition: color .2s;
    }
    .nav-links a:hover { color: var(--ink); }
    .btn-nav {
      padding: 10px 24px; border: 1.5px solid var(--ink);
      font-size: 0.78rem; font-weight: 600; color: var(--ink);
      text-decoration: none; letter-spacing: .06em; text-transform: uppercase;
      transition: all .2s; border-radius: 2px;
    }
    .btn-nav:hover { background: var(--ink); color: var(--paper); }

    /* ─── HERO ─── */
    .hero {
      height: 100vh; position: relative;
      display: flex; align-items: flex-end;
      overflow: hidden;
    }
    .hero-bg {
      position: absolute; inset: 0;
      background: var(--ink);
    }
    .hero-bg img {
      width: 100%; height: 100%;
      object-fit: cover; opacity: 0.65;
      display: block;
    }
    .hero-overlay {
      position: absolute; inset: 0;
      background: linear-gradient(to top, rgba(20,20,20,0.95) 0%, rgba(20,20,20,0.1) 50%, transparent 100%);
    }
    .hero-content {
      position: relative; z-index: 1;
      padding-bottom: 80px;
    }
    .hero-label {
      font-size: 0.72rem; font-weight: 600; letter-spacing: .2em;
      text-transform: uppercase; color: rgba(255,255,255,0.5);
      margin-bottom: 24px;
    }
    .hero h1 {
      font-family: var(--font-serif);
      font-size: clamp(3rem, 7vw, 6.5rem);
      font-weight: 600; line-height: 1.02;
      letter-spacing: -0.02em; color: #fff;
    }
    .hero-sub {
      color: rgba(255,255,255,0.55); font-size: 1rem;
      max-width: 480px; line-height: 1.75; margin-top: 24px;
    }
    .hero-actions {
      display: flex; gap: 20px; margin-top: 40px; align-items: center;
    }
    .btn-hero-primary {
      padding: 16px 36px;
      background: #fff; color: #111;
      font-size: 0.82rem; font-weight: 700;
      letter-spacing: .06em; text-transform: uppercase;
      text-decoration: none; border-radius: 2px;
      transition: all .2s;
    }
    .btn-hero-primary:hover { background: var(--ink); color: var(--paper); }
    .btn-hero-ghost {
      padding: 16px 36px;
      border: 1.5px solid rgba(255,255,255,0.3); color: #fff;
      font-size: 0.82rem; font-weight: 600;
      letter-spacing: .06em; text-transform: uppercase;
      text-decoration: none; border-radius: 2px;
      transition: all .2s;
    }
    .btn-hero-ghost:hover { border-color: #fff; }

    /* ─── INTRO STRIP ─── */
    .intro-strip {
      padding: 80px 0;
      border-bottom: 1px solid var(--border);
    }
    .intro-grid {
      display: grid; grid-template-columns: 1.2fr 1fr;
      gap: 100px; align-items: center;
    }
    .intro-tagline {
      font-family: var(--font-serif);
      font-size: clamp(1.8rem, 3vw, 2.8rem);
      font-weight: 600; letter-spacing: -0.02em; line-height: 1.2;
    }
    .intro-text { color: var(--muted); line-height: 1.8; font-size: 0.95rem; }
    .stats-row {
      display: flex; gap: 48px; margin-top: 40px;
    }
    .stat-mini { display: flex; flex-direction: column; gap: 4px; }
    .stat-mini .val {
      font-size: 2.2rem; font-weight: 700; letter-spacing: -0.05em;
      font-family: var(--font-serif);
    }
    .stat-mini .lbl {
      font-size: 0.75rem; color: var(--muted); font-weight: 500;
      text-transform: uppercase; letter-spacing: .08em;
    }

    /* ─── GALLERY ─── */
    .gallery-section { padding: 80px 0; }
    .section-eyebrow {
      font-size: 0.72rem; font-weight: 600; letter-spacing: .2em;
      text-transform: uppercase; color: var(--muted);
      margin-bottom: 40px; display: flex; align-items: center; gap: 16px;
    }
    .section-eyebrow::after { content:''; flex:1; height:1px; background:var(--border); }
    .gallery-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-auto-rows: 300px;
      gap: 12px;
    }
    .gallery-tall { grid-row: span 2; }
    .gallery-item { overflow: hidden; border-radius: 4px; cursor: pointer; }
    .gallery-img-wrap { position: relative; width: 100%; height: 100%; overflow: hidden; }
    .gallery-img-wrap img {
      width: 100%; height: 100%; object-fit: cover;
      transition: transform .6s cubic-bezier(.25,.46,.45,.94);
      display: block;
    }
    .gallery-item:hover img { transform: scale(1.06); }
    .gallery-overlay {
      position: absolute; inset: 0;
      background: linear-gradient(to top, rgba(10,10,10,0.85) 0%, transparent 60%);
      opacity: 0; transition: opacity .3s;
      display: flex; align-items: flex-end;
    }
    .gallery-item:hover .gallery-overlay { opacity: 1; }
    .gallery-meta { padding: 24px; }
    .gallery-name {
      display: block; font-family: var(--font-serif);
      font-size: 1.15rem; color: #fff; font-weight: 600; margin-bottom: 4px;
    }
    .gallery-desc { display: block; font-size: 0.78rem; color: rgba(255,255,255,0.6); margin-bottom: 12px; }
    .gallery-cta {
      display: inline-block; font-size: 0.72rem; font-weight: 700;
      letter-spacing: .1em; text-transform: uppercase;
      color: #fff; text-decoration: none; border-bottom: 1px solid rgba(255,255,255,0.4);
      padding-bottom: 2px; transition: border-color .2s;
    }
    .gallery-cta:hover { border-color: #fff; }

    /* ─── ABOUT ─── */
    .about-section {
      padding: 100px 0; border-top: 1px solid var(--border);
    }
    .about-grid {
      display: grid; grid-template-columns: 1fr 1fr;
      gap: 80px; align-items: center;
    }
    .about-img-wrap {
      aspect-ratio: 4/5; overflow: hidden; border-radius: 4px;
    }
    .about-img-wrap img { width: 100%; height: 100%; object-fit: cover; display: block; }
    .about-placeholder {
      width: 100%; height: 100%;
      background: var(--border); display: flex;
      align-items: center; justify-content: center;
      color: var(--muted); font-size: 0.85rem;
    }
    .about-label {
      font-size: 0.72rem; font-weight: 600; letter-spacing: .15em;
      text-transform: uppercase; color: var(--muted); margin-bottom: 20px;
    }
    .about-heading {
      font-family: var(--font-serif);
      font-size: clamp(2rem, 3.5vw, 3.2rem);
      font-weight: 600; letter-spacing: -0.02em;
      line-height: 1.1; margin-bottom: 28px;
    }
    .about-text { color: var(--muted); line-height: 1.85; font-size: 0.95rem; }
    .about-cta {
      display: inline-flex; align-items: center; gap: 12px;
      margin-top: 36px; text-decoration: none; color: var(--ink);
      font-size: 0.82rem; font-weight: 600; letter-spacing: .06em;
      text-transform: uppercase; border-bottom: 1.5px solid var(--ink);
      padding-bottom: 4px; transition: opacity .2s;
    }
    .about-cta:hover { opacity: 0.6; }

    /* ─── CONTACT ─── */
    .contact-section {
      padding: 100px 0; border-top: 1px solid var(--border);
      text-align: center;
    }
    .contact-section h2 {
      font-family: var(--font-serif);
      font-size: clamp(2.5rem, 5vw, 5rem);
      font-weight: 600; letter-spacing: -0.03em;
      line-height: 1.05; margin-bottom: 28px;
    }
    .contact-section p {
      color: var(--muted); font-size: 1rem;
      max-width: 400px; margin: 0 auto 40px; line-height: 1.75;
    }
    .btn-contact {
      display: inline-flex; align-items: center; gap: 12px;
      padding: 18px 48px; background: var(--ink); color: var(--paper);
      font-size: 0.85rem; font-weight: 700; letter-spacing: .08em;
      text-transform: uppercase; text-decoration: none; border-radius: 2px;
      transition: opacity .2s;
    }
    .btn-contact:hover { opacity: 0.85; }

    /* ─── FOOTER ─── */
    footer {
      border-top: 1px solid var(--border);
      padding: 36px 0;
    }
    .footer-inner {
      display: flex; justify-content: space-between; align-items: center;
    }
    .footer-logo { font-family: var(--font-serif); font-size: 1.1rem; font-weight: 600; }
    footer p { font-size: 0.78rem; color: var(--muted); }

    /* ─── WhatsApp FAB ─── */
    .wa-fab {
      position: fixed; bottom: 28px; right: 28px; z-index: 999;
      width: 58px; height: 58px; border-radius: 50%;
      background: #25d366; display: flex; align-items: center; justify-content: center;
      box-shadow: 0 8px 32px #25d36640; transition: transform .2s;
      text-decoration: none;
    }
    .wa-fab:hover { transform: scale(1.1); }
    .wa-fab svg { width: 26px; height: 26px; fill: #fff; }

    /* ─── RESPONSIVE ─── */
    @media(max-width: 768px) {
      .nav-links { display: none; }
      .intro-grid { grid-template-columns: 1fr; gap: 40px; }
      .stats-row { gap: 28px; }
      .gallery-grid { grid-template-columns: 1fr 1fr; grid-auto-rows: 220px; }
      .gallery-tall { grid-row: span 1; }
      .about-grid { grid-template-columns: 1fr; gap: 40px; }
      .footer-inner { flex-direction: column; gap: 12px; text-align: center; }
    }
  </style>
</head>
<body>

  <!-- WhatsApp FAB -->
  <a href="${whatsappLink}" class="wa-fab" target="_blank" aria-label="Contact via WhatsApp">
    <svg viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
  </a>

  <!-- NAV -->
  <nav>
    <div class="container nav-inner">
      <a class="nav-logo" href="#" data-field="name">${name}</a>
      <div class="nav-links">
        <a href="#work">Work</a>
        <a href="#about">About</a>
        <a href="#contact">Contact</a>
      </div>
      <a href="${whatsappLink}" class="btn-nav" target="_blank">${s(data.CTA_PRIMARY_TEXT || 'Start a Project')}</a>
    </div>
  </nav>

  <!-- HERO -->
  <section class="hero" id="top">
    <div class="hero-bg">
      <img src="${heroBg}" alt="${name}" data-field="HERO_BG_IMAGE">
    </div>
    <div class="hero-overlay"></div>
    <div class="hero-content container">
      <div class="hero-label" data-field="TAGLINE">${tagline}</div>
      <h1 data-field="HERO_HEADLINE">${heroHeadline.replace(/\\n/g, '<br>')}</h1>
      <p class="hero-sub" data-field="SUB_HEADLINE">${subHeadline}</p>
      <div class="hero-actions">
        <a href="#work" class="btn-hero-primary" data-field="CTA_SECONDARY_TEXT">${s(data.CTA_SECONDARY_TEXT || 'View Portfolio')}</a>
        <a href="${whatsappLink}" class="btn-hero-ghost" target="_blank" data-field="CTA_PRIMARY_TEXT">${s(data.CTA_PRIMARY_TEXT || 'Start a Project')}</a>
      </div>
    </div>
  </section>

  <!-- INTRO STRIP -->
  <section class="intro-strip">
    <div class="container">
      <div class="intro-grid">
        <div class="intro-tagline" data-field="TAGLINE">${tagline}</div>
        <div>
          <p class="intro-text" data-field="SUB_HEADLINE">${subHeadline}</p>
          <div class="stats-row">
            <div class="stat-mini">
              <span class="val" data-field="STAT_1_VAL">${s(data.STAT_1_VAL || '80+')}</span>
              <span class="lbl" data-field="STAT_1_LABEL">${s(data.STAT_1_LABEL || 'Brand Partners')}</span>
            </div>
            <div class="stat-mini">
              <span class="val" data-field="STAT_2_VAL">${s(data.STAT_2_VAL || '5')}</span>
              <span class="lbl" data-field="STAT_2_LABEL">${s(data.STAT_2_LABEL || 'Years Active')}</span>
            </div>
            <div class="stat-mini">
              <span class="val" data-field="STAT_3_VAL">${s(data.STAT_3_VAL || '12')}</span>
              <span class="lbl" data-field="STAT_3_LABEL">${s(data.STAT_3_LABEL || 'Awards')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- WORK GALLERY -->
  <section id="work" class="gallery-section container">
    <div class="section-eyebrow">Selected Works</div>
    <div class="gallery-grid">
      ${galleryHtml}
    </div>
  </section>

  <!-- ABOUT -->
  <section id="about" class="about-section">
    <div class="container">
      <div class="about-grid">
        <div class="about-img-wrap" data-field="ABOUT_IMAGE">
          <img src="${s(data.ABOUT_IMAGE)}" alt="${name}" style="${s(data.ABOUT_IMAGE) ? 'display:block' : 'display:none'}">
          <div class="about-placeholder" style="${s(data.ABOUT_IMAGE) ? 'display:none' : 'display:flex'}">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
          </div>
        </div>
        <div>
          <div class="about-label">Our Story</div>
          <h2 class="about-heading">${name}</h2>
          <p class="about-text" data-field="ABOUT_SECTION">${aboutSection}</p>
          <a href="${whatsappLink}" class="about-cta" target="_blank">Let's Collaborate →</a>
        </div>
      </div>
    </div>
  </section>

  <!-- CONTACT -->
  <section id="contact" class="contact-section">
    <div class="container">
      <h2>Let's make<br><em>something together.</em></h2>
      <p>Ready to build your visual story? We'd love to hear about your project.</p>
      <a href="${whatsappLink}" class="btn-contact" target="_blank">
        ${s(data.CTA_PRIMARY_TEXT || 'Start a Project')} →
      </a>
    </div>
  </section>

  <!-- FOOTER -->
  <footer>
    <div class="container footer-inner">
      <div class="footer-logo">${name}</div>
      <p>© 2026 ${name}. All rights reserved.</p>
    </div>
  </footer>

</body>
</html>`;
}
