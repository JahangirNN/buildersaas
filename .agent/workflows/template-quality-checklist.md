---
description: Template Quality Checklist — checkpoints every new template must pass before shipping
---

# Template Quality Checkpoint

Run this checklist before registering any new template. A template must pass ALL checks.

## 1. Structure & Registration

// turbo
- Verify the template folder exists at `src/templates/<id>/`
- Verify `schema.ts` exports a Zod schema and a named TypeScript type
- Verify `template.ts` exports a render function returning a valid HTML string
- Verify the template is registered in `src/templates/registry.ts`
- Verify it is added to the `templates` array in `src/app/templates/page.tsx`

## 2. HTML Quality

- The HTML must include `<!DOCTYPE html>`, `<html lang="en">`, `<head>`, `<body>`
- Every `<head>` must include `<meta charset="UTF-8">`, `<meta name="viewport" content="width=device-width, initial-scale=1.0">`, a `<title>`, and a `<meta name="description">`
- All CSS must be **inlined in a `<style>` block** (no external CSS file dependencies for v2+)
- Google Fonts must be loaded via `<link rel="preconnect">` + `<link href="https://fonts.googleapis.com/...">`

## 3. WhatsApp Integration

- A floating WhatsApp FAB button (`position: fixed; bottom: 28px; right: 28px`) must be present
- At least one visible primary CTA button linking to `whatsappLink`
- All `<a href="${whatsappLink}">` must have `target="_blank"`

## 4. Editor Field Wiring (`data-field` attributes)

Every editable element MUST have a `data-field="FIELD_ID"` attribute matching its schema key.
Required fields per template type:

| Field | v1 | v2 | v3 | v4 |
|---|---|---|---|---|
| `name` (logo/brand) | ✅ | ✅ | ✅ | ✅ |
| `HERO_HEADLINE` | ✅ | ✅ | ✅ | ✅ |
| `SUB_HEADLINE` | ✅ | ✅ | ✅ | ✅ |
| `ABOUT_SECTION` | ✅ | ✅ | ✅ | ✅ |
| `PRODUCT_N_NAME/DESC/PRICE` | ✅ | ✅ | ✅ | ✅ |
| `ROLE_TITLE` | — | ✅ | — | ✅ |
| `TAGLINE` | — | — | ✅ | — |
| `STACK_TAGS` | — | — | — | ✅ |
| `HERO_BG_IMAGE` | ✅ | — | ✅ | — |
| `REVIEW_1_TEXT / AUTHOR` | — | ✅ | — | — |

> [!IMPORTANT]
> **Each `data-field` ID must be GLOBALLY UNIQUE within the HTML document.** Do not reuse the same field ID on multiple elements.
> If the same value needs to appear twice (e.g. CTA text in both nav and hero), only apply `data-field` to ONE instance.

> [!IMPORTANT]
> **Product Images MUST be rendered.** If the template schema has `image_url` for products, the HTML template MUST conditionally render an `<img data-field="PRODUCT_N_IMAGE">` tag to display it. Never allow fields in the schema that are visually ignored in the UI.

## 5. Mobile Responsiveness

All breakpoints must be tested at 375px wide (iPhone SE).

- [ ] Nav collapses: `.nav-links` is hidden at `max-width: 768px`
- [ ] Hero text is readable: `font-size: clamp(...)` or explicit small-screen override
- [ ] Grid layouts collapse: all CSS Grid containers use `grid-template-columns: 1fr` at mobile
- [ ] Horizontal scroll must be zero: `body { overflow-x: hidden }`
- [ ] Buttons are finger-friendly: minimum `44px` tap target (via padding)
- [ ] WhatsApp FAB is not obstructed on mobile
- [ ] Product/project cards stack vertically on mobile
- [ ] Stat rows wrap gracefully with `flex-wrap: wrap`
- [ ] Two-column about sections collapse to single column

## 6. Visual Design Standards (Anti-Checklist)

❌ **Never** use inline `style="color: blue"` for brand colors — use CSS variables  
❌ **Never** use `Times New Roman` or browser-default serif without importing a Google Font  
❌ **Never** use purely white (`#ffffff`) or black (`#000000`) backgrounds — use slightly off-tone (`#fafaf8`, `#0c0c10`)  
❌ **Never** leave sections without spacing — minimum `padding: 80px 0` for all sections  
❌ **Never** use unscaled images — all `<img>` should have `object-fit: cover` inside a constrained container  
❌ **Never** use instructional text in image placeholders (e.g. "Upload image here") — use clean, minimalist SVG icons instead  
❌ **Never** use broken `<img src="">` tags as placeholders — use a structural `<div>` containing an `<svg>` icon, which the editor will automatically hot-swap into a real image upon upload.

✅ **Always** use CSS custom properties (`--accent`, `--text`, `--muted`, etc.)  
✅ **Always** include `transition: all .2s` or similar on interactive elements  
✅ **Always** use a `hover:` effect on cards, buttons, and links  
✅ **Always** include a loading fallback or placeholder for optional image fields  

## 7. AI Content Generation

- The template's field keys must be reflected in the AI prompt branch in `src/actions/generate.ts`
- The prompt must include at least: `HERO_HEADLINE`, `SUB_HEADLINE`, `ABOUT_SECTION`, `PRODUCT_LIST` (6 items)
- `THEME_COLOR` must be generated with an appropriate industry default

## 8. Database Compatibility

- The template `type` stored in Supabase must be either `portfolio` or `ecommerce`
- The template's internal ID (e.g. `portfolio-v3`) must be stored as `TEMPLATE_ID` inside the `content` JSON
- `saveContent.ts` and `generate.ts` must both use `.startsWith('portfolio')` / `.startsWith('ecommerce')` denormalization

## Verification Commands

```powershell
# TypeScript check — must return exit code 0
npx tsc --noEmit

# Preview the template
Start-Process "http://localhost:3000/api/template-preview?id=<template-id>"

# View it in the editor
Start-Process "http://localhost:3000/editor?template=<template-id>"

# Confirm it appears in gallery
Start-Process "http://localhost:3000/templates"
```
