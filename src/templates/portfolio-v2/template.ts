import { PortfolioV2Data } from './schema';

const s = (v: unknown): string => String(v || '');

export function portfolioV2Template(data: PortfolioV2Data): string {
  const themeColor = s(data.THEME_COLOR || '#6366f1');
  const name = s(data.name || 'Alex Morgan');
  const roleTitle = s(data.ROLE_TITLE || 'Designer & Consultant');
  const heroHeadline = s(data.HERO_HEADLINE || 'I help brands build digital presence.');
  const subHeadline = s(data.SUB_HEADLINE || 'Senior designer with 7+ years experience.');
  const aboutSection = s(data.ABOUT_SECTION || 'Great design is invisible — it just works.');
  const whatsappLink = s(data.WHATSAPP_LINK || '#');
  const ctaPrimary = s(data.CTA_PRIMARY_TEXT || 'Book a Free Call');

  const profileImage = s(data.PROFILE_IMAGE || '');

  // Services
  let servicesHtml = '';
  const products = data.PRODUCT_LIST && Array.isArray(data.PRODUCT_LIST) ? data.PRODUCT_LIST : [];
  const displayProducts = products.length > 0 ? products : [
    { name: 'Brand Strategy', desc: 'Complete brand positioning and visual identity framework.', price: '₹25,000', image_url: '' },
    { name: 'UI/UX Design', desc: 'End-to-end product design with Figma prototypes.', price: '₹35,000', image_url: '' },
    { name: 'Web Development', desc: 'Fast, SEO-optimized websites built to convert.', price: '₹50,000', image_url: '' },
  ];

  const serviceIcons = ['✦', '◈', '⬡'];
  servicesHtml = (displayProducts as Array<Record<string, unknown>>).map((p, i) => `
    <div class="service-card" data-field="PRODUCT_${i}_NAME" style="${p.image_url ? 'padding: 0; overflow: hidden;' : 'position: relative;'}">
      <img src="${s(p.image_url || '')}" alt="${s(p.name)}" style="width:100%; height:200px; object-fit:cover; border-bottom: 1px solid var(--border); ${p.image_url ? 'display:block;' : 'display:none;'}" data-field="PRODUCT_${i}_IMAGE_URL">
      <div style="${p.image_url ? 'padding:24px;' : ''} display:flex; flex-direction:column; gap:12px; height:100%">
        ${!p.image_url ? `<div class="service-icon">${serviceIcons[i % serviceIcons.length]}</div>` : ''}
        <h3 class="service-name">${s(p.name)}</h3>
        <p class="service-desc" data-field="PRODUCT_${i}_DESC">${s(p.desc)}</p>
        <div class="service-footer" style="margin-top:auto">
          <span class="service-price" data-field="PRODUCT_${i}_PRICE">${s(p.price)}</span>
          <a href="${whatsappLink}" class="service-cta" target="_blank">Enquire →</a>
        </div>
      </div>
    </div>
  `).join('');

  const review1 = s(data.REVIEW_1_TEXT || 'Working with them was transformative. Our conversions jumped 40%.');
  const review1Author = s(data.REVIEW_1_AUTHOR || 'Sarah K., CEO of Luminary');
  const review2 = s(data.REVIEW_2_TEXT || 'Delivered on time, on budget, and above expectations.');
  const review2Author = s(data.REVIEW_2_AUTHOR || 'James T., Founder of Nova Labs');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${name} — ${roleTitle}</title>
  <meta name="description" content="${subHeadline}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
  <style>
    :root {
      --accent: ${themeColor};
      --accent-glow: ${themeColor}33;
      --bg: #080810;
      --surface: rgba(255,255,255,0.04);
      --border: rgba(255,255,255,0.08);
      --text: #f0f0f8;
      --muted: rgba(240,240,248,0.5);
      --font: 'Inter', sans-serif;
    }
    *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
    html { scroll-behavior: smooth; }
    body {
      font-family: var(--font);
      background: var(--bg);
      color: var(--text);
      line-height: 1.6;
      overflow-x: hidden;
    }

    /* Animated mesh background */
    body::before {
      content: '';
      position: fixed;
      inset: 0;
      background:
        radial-gradient(ellipse 80% 50% at 20% 20%, ${themeColor}18 0%, transparent 60%),
        radial-gradient(ellipse 60% 40% at 80% 80%, ${themeColor}10 0%, transparent 60%);
      pointer-events: none;
      z-index: 0;
    }

    .container { max-width: 1100px; margin: 0 auto; padding: 0 24px; }

    /* ─── NAV ─── */
    nav {
      position: fixed; top: 0; left: 0; right: 0;
      z-index: 100;
      backdrop-filter: blur(20px) saturate(1.5);
      background: rgba(8,8,16,0.7);
      border-bottom: 1px solid var(--border);
    }
    .nav-inner {
      display: flex; align-items: center; justify-content: space-between;
      height: 68px;
    }
    .nav-logo {
      font-size: 1.1rem; font-weight: 800; letter-spacing: -0.03em;
      background: linear-gradient(135deg, #fff 40%, ${themeColor});
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    }
    .nav-links { display: flex; gap: 32px; }
    .nav-links a {
      color: var(--muted); text-decoration: none; font-size: 0.88rem;
      font-weight: 500; transition: color .2s;
    }
    .nav-links a:hover { color: var(--text); }
    .nav-cta {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 10px 22px; border-radius: 100px;
      background: var(--accent); color: #fff;
      text-decoration: none; font-size: 0.85rem; font-weight: 700;
      transition: opacity .2s, transform .2s;
    }
    .nav-cta:hover { opacity: 0.9; transform: translateY(-1px); }

    /* ─── HERO ─── */
    .hero {
      min-height: 100vh;
      display: flex; align-items: center;
      padding-top: 120px; padding-bottom: 80px;
      position: relative; z-index: 1;
    }
    .hero-grid {
      display: grid;
      grid-template-columns: 1fr auto;
      gap: 80px; align-items: center;
    }
    .hero-badge {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 6px 14px; border-radius: 100px;
      background: var(--surface); border: 1px solid var(--border);
      font-size: 0.78rem; font-weight: 600; color: var(--accent);
      margin-bottom: 28px;
    }
    .hero-badge::before {
      content: ''; width: 6px; height: 6px; border-radius: 50%;
      background: var(--accent); animation: pulse 2s infinite;
    }
    @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(1.3)} }
    .hero h1 {
      font-size: clamp(2.4rem, 5vw, 4rem);
      font-weight: 900; line-height: 1.08;
      letter-spacing: -0.04em;
    }
    .hero h1 em {
      font-style: normal;
      background: linear-gradient(135deg, ${themeColor}, #a78bfa);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    }
    .hero-sub {
      color: var(--muted); font-size: 1.05rem; max-width: 520px;
      line-height: 1.7; margin-top: 20px; margin-bottom: 40px;
    }
    .hero-actions { display: flex; gap: 16px; flex-wrap: wrap; align-items: center; }
    .btn-primary {
      display: inline-flex; align-items: center; gap: 10px;
      padding: 16px 32px; border-radius: 100px;
      background: var(--accent); color: #fff;
      text-decoration: none; font-weight: 700; font-size: 0.95rem;
      transition: all .25s; box-shadow: 0 0 32px ${themeColor}50;
    }
    .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 0 48px ${themeColor}70; }
    .btn-ghost {
      display: inline-flex; align-items: center; gap: 10px;
      padding: 16px 32px; border-radius: 100px;
      border: 1px solid var(--border); color: var(--text);
      text-decoration: none; font-weight: 600; font-size: 0.95rem;
      background: var(--surface); backdrop-filter: blur(10px);
      transition: all .25s;
    }
    .btn-ghost:hover { border-color: var(--accent); color: var(--accent); }

    /* Profile image */
    .hero-avatar {
      width: 260px; height: 340px; border-radius: 24px;
      object-fit: cover; border: 1px solid var(--border);
      position: relative;
      box-shadow: 0 0 60px ${themeColor}20;
    }
    .hero-avatar-wrap {
      position: relative; flex-shrink: 0;
    }
    .hero-avatar-wrap::before {
      content: '';
      position: absolute; inset: -2px;
      border-radius: 26px;
      background: linear-gradient(135deg, ${themeColor}50, transparent 60%);
      z-index: -1;
    }
    .hero-avatar-placeholder {
      width: 260px; height: 340px; border-radius: 24px;
      background: var(--surface); border: 1px solid var(--border);
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      gap: 12px; color: var(--muted); font-size: 0.85rem;
    }
    .hero-avatar-placeholder span { font-size: 3rem; }

    /* ─── STATS STRIP ─── */
    .stats-strip {
      position: relative; z-index: 1;
      border-top: 1px solid var(--border);
      border-bottom: 1px solid var(--border);
      padding: 40px 0;
      margin-bottom: 100px;
    }
    .stats-grid { display: flex; gap: 0; justify-content: center; }
    .stat-item {
      flex: 1; text-align: center; padding: 0 40px;
      border-right: 1px solid var(--border);
    }
    .stat-item:last-child { border-right: none; }
    .stat-val {
      font-size: 3rem; font-weight: 900;
      letter-spacing: -0.06em; color: var(--accent);
      display: block; line-height: 1;
    }
    .stat-label {
      display: block; font-size: 0.8rem; color: var(--muted);
      font-weight: 600; text-transform: uppercase; letter-spacing: .1em;
      margin-top: 8px;
    }

    /* ─── SERVICES ─── */
    .section { position: relative; z-index: 1; padding-bottom: 100px; }
    .section-label {
      display: inline-flex; align-items: center; gap: 8px;
      font-size: 0.75rem; font-weight: 700; letter-spacing: .15em;
      text-transform: uppercase; color: var(--accent); margin-bottom: 16px;
    }
    .section-label::before { content:''; width:32px; height:1px; background:var(--accent); }
    .section-heading {
      font-size: clamp(1.8rem, 3vw, 2.8rem); font-weight: 800;
      letter-spacing: -0.04em; margin-bottom: 60px;
    }

    .services-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; }
    .service-card {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: 20px; padding: 32px;
      transition: all .3s; cursor: default;
      backdrop-filter: blur(10px);
      display: flex; flex-direction: column; gap: 12px;
    }
    .service-card:hover {
      border-color: var(--accent);
      box-shadow: 0 0 32px ${themeColor}20;
      transform: translateY(-4px);
    }
    .service-icon {
      font-size: 1.5rem; color: var(--accent); margin-bottom: 4px;
      width: 48px; height: 48px; border-radius: 12px;
      background: var(--accent-glow); display: flex; align-items: center; justify-content: center;
    }
    .service-name { font-size: 1.15rem; font-weight: 700; letter-spacing: -0.02em; }
    .service-desc { color: var(--muted); font-size: 0.88rem; line-height: 1.65; flex: 1; }
    .service-footer {
      display: flex; justify-content: space-between; align-items: center;
      padding-top: 16px; border-top: 1px solid var(--border);
    }
    .service-price { font-size: 1.05rem; font-weight: 800; color: var(--accent); }
    .service-cta {
      text-decoration: none; color: var(--muted);
      font-size: 0.82rem; font-weight: 600;
      transition: color .2s;
    }
    .service-cta:hover { color: var(--accent); }

    /* ─── ABOUT ─── */
    .about-glass {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: 28px; padding: 60px;
      backdrop-filter: blur(20px);
      display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center;
    }
    .about-label { color: var(--accent); font-size: 0.75rem; font-weight: 700; letter-spacing: .15em; text-transform: uppercase; margin-bottom: 16px; }
    .about-text { color: var(--muted); line-height: 1.8; font-size: 1.05rem; }
    .about-highlight {
      font-size: 2rem; font-weight: 900; letter-spacing: -0.05em;
      background: linear-gradient(135deg, var(--text), ${themeColor});
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    }

    /* ─── REVIEWS ─── */
    .reviews-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
    .review-card {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: 20px; padding: 36px; backdrop-filter: blur(10px);
    }
    .review-stars { color: #fbbf24; margin-bottom: 20px; font-size: 1.1rem; }
    .review-text { color: var(--muted); font-size: 0.95rem; line-height: 1.75; margin-bottom: 24px; font-style: italic; }
    .review-author { font-size: 0.82rem; font-weight: 700; color: var(--text); }

    /* ─── CONTACT CTA ─── */
    .cta-section {
      position: relative; z-index: 1; padding-bottom: 100px;
    }
    .cta-card {
      background: linear-gradient(135deg, ${themeColor}20, ${themeColor}08);
      border: 1px solid ${themeColor}40;
      border-radius: 32px; padding: 80px;
      text-align: center; backdrop-filter: blur(10px);
    }
    .cta-card h2 { font-size: 2.8rem; font-weight: 900; letter-spacing: -0.05em; margin-bottom: 20px; }
    .cta-card p { color: var(--muted); font-size: 1.05rem; max-width: 480px; margin: 0 auto 40px; }

    /* ─── FOOTER ─── */
    footer {
      border-top: 1px solid var(--border);
      padding: 40px 0;
      text-align: center;
      color: var(--muted);
      font-size: 0.82rem;
      position: relative; z-index: 1;
    }

    /* ─── WhatsApp FAB ─── */
    .wa-fab {
      position: fixed; bottom: 28px; right: 28px; z-index: 999;
      width: 60px; height: 60px; border-radius: 50%;
      background: #25d366; display: flex; align-items: center; justify-content: center;
      box-shadow: 0 8px 32px #25d36650; transition: transform .2s;
      text-decoration: none;
    }
    .wa-fab:hover { transform: scale(1.1); }
    .wa-fab svg { width: 28px; height: 28px; fill: #fff; }

    /* ─── RESPONSIVE ─── */
    @media(max-width: 768px) {
      .hero-grid { grid-template-columns: 1fr; text-align: center; }
      .hero-badge { justify-content: center; }
      .hero-actions { justify-content: center; }
      .hero-avatar-wrap { display: none; }
      .stats-grid { flex-wrap: wrap; }
      .stat-item { min-width: 50%; border-right: none; padding: 20px; }
      .about-glass { grid-template-columns: 1fr; padding: 36px; gap: 32px; }
      .reviews-grid { grid-template-columns: 1fr; }
      .cta-card { padding: 48px 24px; }
      .cta-card h2 { font-size: 2rem; }
      .nav-links { display: none; }
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
      <div class="nav-logo" data-field="name">${name}.</div>
      <div class="nav-links">
        <a href="#services">Services</a>
        <a href="#about">About</a>
        <a href="#reviews">Reviews</a>
        <a href="#contact">Contact</a>
      </div>
      <a href="${whatsappLink}" class="nav-cta" target="_blank">${ctaPrimary}</a>
    </div>
  </nav>

  <!-- HERO -->
  <section class="hero">
    <div class="container">
      <div class="hero-grid">
        <div>
          <div class="hero-badge" data-field="ROLE_TITLE">${roleTitle}</div>
          <h1 data-field="HERO_HEADLINE">${heroHeadline.replace(/\\n/g, '<br><em>').replace(/<em>([^<]*)<br>/g, '<em>$1</em><br>').replace(/<em>([^<]*)$/g, '<em>$1</em>')}</h1>
          <p class="hero-sub" data-field="SUB_HEADLINE">${subHeadline}</p>
          <div class="hero-actions">
            <a href="${whatsappLink}" class="btn-primary" target="_blank" data-field="CTA_PRIMARY_TEXT">${ctaPrimary} →</a>
            <a href="#services" class="btn-ghost" data-field="CTA_SECONDARY_TEXT">${s(data.CTA_SECONDARY_TEXT || 'See My Work')}</a>
          </div>
        </div>
        <div class="hero-avatar-wrap" data-field="PROFILE_IMAGE">
          <img src="${profileImage}" alt="${name}" class="hero-avatar" style="${profileImage ? 'display:block' : 'display:none'}">
          <div class="hero-avatar-placeholder" style="${profileImage ? 'display:none' : 'display:flex'}">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- STATS STRIP -->
  <div class="stats-strip">
    <div class="container">
      <div class="stats-grid">
        <div class="stat-item">
          <span class="stat-val" data-field="STAT_1_VAL">${s(data.STAT_1_VAL || '7+')}</span>
          <span class="stat-label" data-field="STAT_1_LABEL">${s(data.STAT_1_LABEL || 'Years Experience')}</span>
        </div>
        <div class="stat-item">
          <span class="stat-val" data-field="STAT_2_VAL">${s(data.STAT_2_VAL || '120+')}</span>
          <span class="stat-label" data-field="STAT_2_LABEL">${s(data.STAT_2_LABEL || 'Clients Served')}</span>
        </div>
        <div class="stat-item">
          <span class="stat-val" data-field="STAT_3_VAL">${s(data.STAT_3_VAL || '98%')}</span>
          <span class="stat-label" data-field="STAT_3_LABEL">${s(data.STAT_3_LABEL || 'Satisfaction Rate')}</span>
        </div>
      </div>
    </div>
  </div>

  <!-- SERVICES -->
  <section id="services" class="section container">
    <div class="section-label">What I Offer</div>
    <h2 class="section-heading">Services built to<br>move the needle.</h2>
    <div class="services-grid">
      ${servicesHtml}
    </div>
  </section>

  <!-- ABOUT -->
  <section id="about" class="section container">
    <div class="about-glass">
      <div>
        <div class="about-label">About Me</div>
        <div class="about-highlight">${name}</div>
        <p class="about-text" style="margin-top:20px" data-field="ABOUT_SECTION">${aboutSection}</p>
      </div>
      <div>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px;">
          <div style="background:rgba(255,255,255,0.04); border:1px solid var(--border); border-radius:16px; padding:24px;">
            <div style="font-size:2rem; font-weight:900; color:var(--accent);">${s(data.STAT_1_VAL || '7+')}</div>
            <div style="font-size:0.8rem; color:var(--muted); margin-top:4px;">${s(data.STAT_1_LABEL || 'Years of Experience')}</div>
          </div>
          <div style="background:rgba(255,255,255,0.04); border:1px solid var(--border); border-radius:16px; padding:24px;">
            <div style="font-size:2rem; font-weight:900; color:var(--accent);">${s(data.STAT_2_VAL || '120+')}</div>
            <div style="font-size:0.8rem; color:var(--muted); margin-top:4px;">${s(data.STAT_2_LABEL || 'Clients Served')}</div>
          </div>
          <div style="background:rgba(255,255,255,0.04); border:1px solid var(--border); border-radius:16px; padding:24px; grid-column:span 2;">
            <div style="font-size:2rem; font-weight:900; color:var(--accent);">${s(data.STAT_3_VAL || '98%')}</div>
            <div style="font-size:0.8rem; color:var(--muted); margin-top:4px;">${s(data.STAT_3_LABEL || 'Satisfaction Rate')}</div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- REVIEWS -->
  <section id="reviews" class="section container">
    <div class="section-label">Testimonials</div>
    <h2 class="section-heading">What clients say.</h2>
    <div class="reviews-grid">
      <div class="review-card">
        <div class="review-stars">★★★★★</div>
        <p class="review-text" data-field="REVIEW_1_TEXT">"${review1}"</p>
        <div class="review-author" data-field="REVIEW_1_AUTHOR">— ${review1Author}</div>
      </div>
      <div class="review-card">
        <div class="review-stars">★★★★★</div>
        <p class="review-text" data-field="REVIEW_2_TEXT">"${review2}"</p>
        <div class="review-author" data-field="REVIEW_2_AUTHOR">— ${review2Author}</div>
      </div>
    </div>
  </section>

  <!-- CTA -->
  <section id="contact" class="cta-section container">
    <div class="cta-card">
      <h2>Ready to work<br>together?</h2>
      <p>Let's talk about your project. I typically respond within 2 hours.</p>
      <a href="${whatsappLink}" class="btn-primary" target="_blank" style="display:inline-flex">
        ${ctaPrimary} →
      </a>
    </div>
  </section>

  <!-- FOOTER -->
  <footer>
    <div class="container">
      <p>© 2026 ${name}. All rights reserved.</p>
    </div>
  </footer>

</body>
</html>`;
}
