import { PortfolioV4Data } from './schema';

const s = (v: unknown): string => String(v || '');

export function portfolioV4Template(data: PortfolioV4Data): string {
  const themeColor = s(data.THEME_COLOR || '#22d3ee');
  const name = s(data.name || 'dev.rajan');
  const roleTitle = s(data.ROLE_TITLE || 'Full-Stack Engineer');
  const heroHeadline = s(data.HERO_HEADLINE || 'Building systems\nthat scale.');
  const subHeadline = s(data.SUB_HEADLINE || 'I build robust, high-performance systems.');
  const aboutSection = s(data.ABOUT_SECTION || '5+ years across the full stack.');
  const whatsappLink = s(data.WHATSAPP_LINK || '#');
  const githubLink = s(data.GITHUB_LINK || '#');
  const stackTagsRaw = s(data.STACK_TAGS || 'TypeScript, React, Node.js, PostgreSQL');
  const stackTags = stackTagsRaw.split(',').map(t => t.trim()).filter(Boolean);

  const products = data.PRODUCT_LIST && Array.isArray(data.PRODUCT_LIST) ? data.PRODUCT_LIST : [];
  const displayProducts = products.length > 0 ? products : [
    { name: 'BuilderSaaS', desc: 'AI-powered website builder with Cloudflare edge deployment and Supabase backend.', price: 'Open Source' },
    { name: 'FastAPI ORM', desc: 'Zero-dependency ORM for PostgreSQL with full TypeScript typing and migration support.', price: '2.4k Stars' },
    { name: 'EdgeKit', desc: 'Lightweight toolkit for building edge-native APIs with request coalescing & caching.', price: '800+ Stars' },
  ];

  const projectsHtml = (displayProducts as Array<Record<string, unknown>>).map((p, i) => `
    <div class="project-card" data-field="PRODUCT_${i}_NAME" style="${p.image_url ? 'padding: 0; overflow: hidden;' : 'position: relative;'}">
      <img src="${s(p.image_url || '')}" alt="${s(p.name)}" style="width:100%; height:160px; object-fit:cover; border-bottom: 1px solid var(--border); ${p.image_url ? 'display:block;' : 'display:none;'}" data-field="PRODUCT_${i}_IMAGE_URL">
      <div style="${p.image_url ? 'padding:24px;' : ''} display:flex; flex-direction:column; gap:12px; height:100%">
        <div class="project-header">
          <div class="project-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
            </svg>
          </div>
          <span class="project-badge" data-field="PRODUCT_${i}_PRICE">${s(p.price)}</span>
        </div>
        <h3 class="project-name">${s(p.name)}</h3>
        <p class="project-desc" data-field="PRODUCT_${i}_DESC">${s(p.desc)}</p>
        <div style="margin-top:auto">
          <a href="${githubLink}" class="project-link" target="_blank">View Project →</a>
        </div>
      </div>
    </div>
  `).join('');

  const stackBadgesHtml = stackTags.map(tag => `<span class="stack-badge">${tag}</span>`).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${name} — ${roleTitle}</title>
  <meta name="description" content="${subHeadline}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
  <style>
    :root {
      --accent: ${themeColor};
      --accent-dim: ${themeColor}22;
      --accent-border: ${themeColor}40;
      --bg: #0c0c10;
      --surface: #131318;
      --surface-2: #18181f;
      --border: rgba(255,255,255,0.07);
      --text: #e2e8f0;
      --muted: #64748b;
      --green: #4ade80;
      --mono: 'JetBrains Mono', monospace;
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

    /* Grid bg */
    body::before {
      content: '';
      position: fixed; inset: 0; z-index: 0; pointer-events: none;
      background-image:
        linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
      background-size: 40px 40px;
    }
    body::after {
      content: '';
      position: fixed; inset: 0; z-index: 0; pointer-events: none;
      background: radial-gradient(ellipse 60% 50% at 50% 0%, ${themeColor}12, transparent 70%);
    }

    .container { max-width: 1000px; margin: 0 auto; padding: 0 28px; position: relative; z-index: 1; }

    /* ─── NAV ─── */
    nav {
      position: fixed; top: 0; left: 0; right: 0; z-index: 100;
      border-bottom: 1px solid var(--border);
      backdrop-filter: blur(20px);
      background: rgba(12,12,16,0.85);
    }
    .nav-inner {
      display: flex; align-items: center; justify-content: space-between;
      height: 64px;
    }
    .nav-logo {
      font-family: var(--mono); font-size: 1rem; font-weight: 700;
      color: var(--accent); text-decoration: none;
    }
    .nav-logo::before { content: '> '; color: var(--muted); }
    .nav-links { display: flex; gap: 24px; }
    .nav-links a {
      font-family: var(--mono); font-size: 0.78rem;
      text-decoration: none; color: var(--muted);
      transition: color .2s;
    }
    .nav-links a:hover { color: var(--accent); }
    .nav-links a::before { content: './'; color: var(--border); }
    .btn-hire {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 9px 22px; border-radius: 6px;
      border: 1px solid var(--accent-border);
      background: var(--accent-dim); color: var(--accent);
      font-family: var(--mono); font-size: 0.78rem; font-weight: 700;
      text-decoration: none; transition: all .2s;
    }
    .btn-hire:hover { background: ${themeColor}35; border-color: var(--accent); }

    /* ─── HERO ─── */
    .hero {
      min-height: 100vh; display: flex; align-items: center;
      padding-top: 100px; padding-bottom: 80px;
    }
    .hero-inner { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; }

    /* Terminal window */
    .terminal {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: 12px; overflow: hidden;
      box-shadow: 0 24px 64px rgba(0,0,0,0.5);
    }
    .terminal-bar {
      background: var(--surface-2); padding: 12px 16px;
      display: flex; align-items: center; gap: 8px;
      border-bottom: 1px solid var(--border);
    }
    .dot { width: 12px; height: 12px; border-radius: 50%; }
    .dot-r { background: #ff5f56; }
    .dot-y { background: #ffbd2e; }
    .dot-g { background: #27c93f; }
    .terminal-title {
      flex: 1; text-align: center; font-family: var(--mono);
      font-size: 0.72rem; color: var(--muted);
    }
    .terminal-body { padding: 24px; font-family: var(--mono); font-size: 0.82rem; line-height: 2; }
    .t-line { display: block; }
    .t-prompt { color: var(--green); }
    .t-cmd { color: var(--text); }
    .t-comment { color: #475569; }
    .t-key { color: ${themeColor}; }
    .t-val { color: #a78bfa; }
    .t-str { color: #fb923c; }
    .t-cursor {
      display: inline-block; width: 8px; height: 1em; background: var(--accent);
      animation: blink 1.2s step-end infinite; vertical-align: bottom;
    }
    @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }

    /* Hero copy */
    .hero-copy {}
    .hero-label {
      font-family: var(--mono); font-size: 0.72rem; color: var(--accent);
      margin-bottom: 20px; display: flex; align-items: center; gap: 8px;
    }
    .hero-label::before { content:''; width:24px; height:1px; background:var(--accent); }
    .hero h1 {
      font-size: clamp(2rem, 4vw, 3.2rem); font-weight: 900;
      line-height: 1.1; letter-spacing: -0.05em; margin-bottom: 20px;
    }
    .hero h1 span { color: var(--accent); }
    .hero-sub {
      color: var(--muted); font-size: 0.95rem; line-height: 1.75; margin-bottom: 36px;
    }
    .hero-btns { display: flex; gap: 14px; flex-wrap: wrap; }
    .btn-primary {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 13px 28px; border-radius: 8px;
      background: var(--accent); color: #000;
      font-weight: 800; font-size: 0.88rem;
      text-decoration: none; transition: all .2s;
      box-shadow: 0 0 24px ${themeColor}40;
    }
    .btn-primary:hover { box-shadow: 0 0 40px ${themeColor}60; transform: translateY(-1px); }
    .btn-secondary {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 13px 28px; border-radius: 8px;
      border: 1px solid var(--border); color: var(--text);
      background: var(--surface); font-weight: 600; font-size: 0.88rem;
      text-decoration: none; transition: all .2s;
    }
    .btn-secondary:hover { border-color: var(--accent); color: var(--accent); }

    /* ─── STACK ─── */
    .stack-section { padding: 80px 0; border-top: 1px solid var(--border); }
    .section-mono {
      font-family: var(--mono); font-size: 0.72rem; color: var(--accent);
      margin-bottom: 24px; display: flex; align-items: center; gap: 12px;
    }
    .section-mono::before { content: '#'; }
    .stack-cloud { display: flex; flex-wrap: wrap; gap: 10px; }
    .stack-badge {
      display: inline-block; padding: 6px 14px;
      background: var(--surface); border: 1px solid var(--border);
      border-radius: 6px; font-family: var(--mono);
      font-size: 0.78rem; color: var(--text);
      transition: all .2s;
    }
    .stack-badge:hover { border-color: var(--accent); color: var(--accent); }

    /* ─── STATS ─── */
    .stats-row {
      display: flex; gap: 0; margin-top: 56px;
      border: 1px solid var(--border); border-radius: 12px; overflow: hidden;
    }
    .stat-card {
      flex: 1; padding: 28px 24px; text-align: center;
      border-right: 1px solid var(--border);
    }
    .stat-card:last-child { border-right: none; }
    .stat-val {
      display: block; font-size: 2.2rem; font-weight: 900;
      letter-spacing: -0.05em; color: var(--accent);
      font-family: var(--mono);
    }
    .stat-lbl { display: block; font-size: 0.75rem; color: var(--muted); margin-top: 6px; }

    /* ─── PROJECTS ─── */
    .projects-section { padding: 80px 0; border-top: 1px solid var(--border); }
    .projects-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px; margin-top: 36px; }
    .project-card {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: 12px; padding: 28px;
      transition: all .25s; display: flex; flex-direction: column; gap: 12px;
    }
    .project-card:hover { border-color: var(--accent-border); box-shadow: 0 0 24px ${themeColor}10; transform: translateY(-2px); }
    .project-header { display: flex; justify-content: space-between; align-items: center; }
    .project-icon { color: var(--accent); }
    .project-badge {
      font-family: var(--mono); font-size: 0.7rem; font-weight: 700;
      color: var(--green); background: #4ade8015;
      border: 1px solid #4ade8030; border-radius: 4px; padding: 3px 8px;
    }
    .project-name {
      font-size: 1rem; font-weight: 700; letter-spacing: -0.02em;
      font-family: var(--mono); color: var(--text);
    }
    .project-desc { color: var(--muted); font-size: 0.85rem; line-height: 1.65; flex: 1; }
    .project-link {
      font-family: var(--mono); font-size: 0.78rem; color: var(--accent);
      text-decoration: none; transition: opacity .2s;
    }
    .project-link:hover { opacity: 0.7; }

    /* ─── ABOUT ─── */
    .about-section { padding: 80px 0; border-top: 1px solid var(--border); }
    .about-card {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: 16px; padding: 48px;
      display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: start;
    }
    .about-card .about-heading {
      font-family: var(--mono); font-size: 0.75rem;
      color: var(--accent); margin-bottom: 16px;
    }
    .about-card p { color: var(--muted); line-height: 1.8; font-size: 0.92rem; }
    .about-links { display: flex; flex-direction: column; gap: 12px; }
    .about-link {
      display: flex; align-items: center; gap: 12px;
      padding: 14px 18px; border-radius: 8px;
      border: 1px solid var(--border); background: var(--surface-2);
      text-decoration: none; color: var(--text);
      font-size: 0.85rem; font-weight: 600;
      transition: all .2s;
    }
    .about-link:hover { border-color: var(--accent); color: var(--accent); }
    .about-link svg { width: 18px; height: 18px; flex-shrink: 0; }

    /* ─── CONTACT ─── */
    .contact-section { padding: 80px 0; border-top: 1px solid var(--border); }
    .contact-card {
      background: linear-gradient(135deg, ${themeColor}15, ${themeColor}05);
      border: 1px solid var(--accent-border); border-radius: 16px;
      padding: 60px; text-align: center;
    }
    .contact-card h2 { font-size: 2.2rem; font-weight: 900; letter-spacing: -0.05em; margin-bottom: 16px; }
    .contact-card p { color: var(--muted); margin-bottom: 36px; font-size: 0.95rem; }

    /* ─── FOOTER ─── */
    footer {
      border-top: 1px solid var(--border); padding: 32px 0;
      text-align: center; color: var(--muted);
      font-family: var(--mono); font-size: 0.75rem;
      position: relative; z-index: 1;
    }

    /* ─── WhatsApp FAB ─── */
    .wa-fab {
      position: fixed; bottom: 28px; right: 28px; z-index: 999;
      width: 58px; height: 58px; border-radius: 50%;
      background: #25d366; display: flex; align-items: center; justify-content: center;
      box-shadow: 0 8px 32px #25d36640; transition: transform .2s; text-decoration: none;
    }
    .wa-fab:hover { transform: scale(1.1); }
    .wa-fab svg { width: 26px; height: 26px; fill: #fff; }

    /* ─── RESPONSIVE ─── */
    @media(max-width: 768px) {
      .hero-inner { grid-template-columns: 1fr; gap: 48px; }
      .terminal { display: none; }
      .nav-links { display: none; }
      .about-card { grid-template-columns: 1fr; gap: 36px; padding: 32px; }
      .stats-row { flex-wrap: wrap; }
      .stat-card { min-width: 50%; border-right: none; border-bottom: 1px solid var(--border); }
      .stat-card:last-child { border-bottom: none; }
      .contact-card { padding: 40px 24px; }
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
        <a href="#stack">stack</a>
        <a href="#projects">projects</a>
        <a href="#about">about</a>
        <a href="#contact">contact</a>
      </div>
      <a href="${whatsappLink}" class="btn-hire" target="_blank">${s(data.CTA_PRIMARY_TEXT || 'Hire Me')}</a>
    </div>
  </nav>

  <!-- HERO -->
  <section class="hero">
    <div class="container">
      <div class="hero-inner">
        <div class="hero-copy">
          <div class="hero-label" data-field="ROLE_TITLE">${roleTitle}</div>
          <h1 data-field="HERO_HEADLINE">${heroHeadline.replace(/\\n/g, '<br><span>').replace(/<span>([^<]*)$/, '<span>$1</span>')}</h1>
          <p class="hero-sub" data-field="SUB_HEADLINE">${subHeadline}</p>
          <div class="hero-btns">
            <a href="${whatsappLink}" class="btn-primary" target="_blank" data-field="CTA_PRIMARY_TEXT">${s(data.CTA_PRIMARY_TEXT || 'Hire Me')}</a>
            <a href="${githubLink}" class="btn-secondary" target="_blank" data-field="CTA_SECONDARY_TEXT">${s(data.CTA_SECONDARY_TEXT || 'View GitHub')} →</a>
          </div>
        </div>

        <!-- Terminal Widget -->
        <div class="terminal" aria-hidden="true">
          <div class="terminal-bar">
            <div class="dot dot-r"></div>
            <div class="dot dot-y"></div>
            <div class="dot dot-g"></div>
            <div class="terminal-title">~/portfolio — bash</div>
          </div>
          <div class="terminal-body">
            <span class="t-line"><span class="t-prompt">❯ </span><span class="t-cmd">cat profile.json</span></span>
            <span class="t-line">&nbsp;</span>
            <span class="t-line"><span class="t-comment">{</span></span>
            <span class="t-line">&nbsp; <span class="t-key">"name"</span>: <span class="t-str">"${name}"</span>,</span>
            <span class="t-line">&nbsp; <span class="t-key">"role"</span>: <span class="t-str">"${roleTitle.slice(0, 30)}..."</span>,</span>
            <span class="t-line">&nbsp; <span class="t-key">"exp"</span>: <span class="t-val">"${s(data.STAT_1_VAL || '5+')} years"</span>,</span>
            <span class="t-line">&nbsp; <span class="t-key">"available"</span>: <span class="t-val">true</span>,</span>
            <span class="t-line">&nbsp; <span class="t-key">"location"</span>: <span class="t-str">"Remote 🌍"</span></span>
            <span class="t-line"><span class="t-comment">}</span></span>
            <span class="t-line">&nbsp;</span>
            <span class="t-line"><span class="t-prompt">❯ </span><span class="t-cursor"></span></span>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- STACK -->
  <section id="stack" class="stack-section container">
    <div class="section-mono">Tech Stack</div>
    <div class="stack-cloud" data-field="STACK_TAGS">
      ${stackBadgesHtml}
    </div>
    <div class="stats-row">
      <div class="stat-card">
        <span class="stat-val" data-field="STAT_1_VAL">${s(data.STAT_1_VAL || '5+')}</span>
        <span class="stat-lbl" data-field="STAT_1_LABEL">${s(data.STAT_1_LABEL || 'Years Coding')}</span>
      </div>
      <div class="stat-card">
        <span class="stat-val" data-field="STAT_2_VAL">${s(data.STAT_2_VAL || '40k+')}</span>
        <span class="stat-lbl" data-field="STAT_2_LABEL">${s(data.STAT_2_LABEL || 'GitHub Stars')}</span>
      </div>
      <div class="stat-card">
        <span class="stat-val" data-field="STAT_3_VAL">${s(data.STAT_3_VAL || '15+')}</span>
        <span class="stat-lbl" data-field="STAT_3_LABEL">${s(data.STAT_3_LABEL || 'OSS Projects')}</span>
      </div>
    </div>
  </section>

  <!-- PROJECTS -->
  <section id="projects" class="projects-section container">
    <div class="section-mono">Selected Projects</div>
    <div class="projects-grid">
      ${projectsHtml}
    </div>
  </section>

  <!-- ABOUT -->
  <section id="about" class="about-section container">
    <div class="section-mono">About</div>
    <div class="about-card">
      <div>
        <div class="about-heading">// about_me.md</div>
        <p data-field="ABOUT_SECTION">${aboutSection}</p>
      </div>
      <div class="about-links">
        <a href="${whatsappLink}" class="about-link" target="_blank">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          Message on WhatsApp
        </a>
        <a href="${githubLink}" class="about-link" target="_blank">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
          GitHub Profile
        </a>
        <a href="${s(data.LINKEDIN_LINK || '#')}" class="about-link" target="_blank">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
          LinkedIn
        </a>
      </div>
    </div>
  </section>

  <!-- CONTACT -->
  <section id="contact" class="contact-section container">
    <div class="contact-card">
      <h2>Let's build<br>something great.</h2>
      <p>Open to full-time roles, contracts, and interesting OSS collaborations.</p>
      <a href="${whatsappLink}" class="btn-primary" target="_blank">
        ${s(data.CTA_PRIMARY_TEXT || 'Hire Me')} →
      </a>
    </div>
  </section>

  <!-- FOOTER -->
  <footer>
    <div class="container">
      <p>// built with passion — ${name} © 2026</p>
    </div>
  </footer>

</body>
</html>`;
}
