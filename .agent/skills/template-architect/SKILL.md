---
name: Template Architect
description: Strict technical and design standards for building and auditing AI Website Builder templates.
---

# Template Architect Skill

This skill defines the mandatory technical and aesthetic standards that **must** be followed when creating, modifying, or auditing templates for the AI Website Builder.

## 1. Data-Field & Schema Wiring (CRITICAL)

To ensure the visual editor functions correctly, every template must follow these wiring rules:

- **Global Uniqueness:** Each `data-field` ID (e.g., `HERO_HEADLINE`) must appear exactly ONCE in the HTML.
- **Product Mapping:** Product/Gallery fields must follow the indexed naming convention:
  - `PRODUCT_N_NAME`
  - `PRODUCT_N_DESC`
  - `PRODUCT_N_PRICE`
  - `PRODUCT_N_IMAGE_URL` (Note: **Always** use `_URL` suffix to match the schema key).
- **The "Always-Present-IMG" Pattern:** Never use a ternary to swap between an `<img>` and a `<div>` placeholder. Instead, render BOTH inside a container and toggle `display: none/block`.
  ```html
  <div class="img-container" data-field="FIELD_ID">
    <img src="${url}" style="${url ? 'display:block' : 'display:none'}">
    <div class="placeholder" style="${url ? 'display:none' : 'display:flex'}">
      <svg>...</svg>
    </div>
  </div>
  ```
  *Why? This allows the editor's optimistic injection script to instantly update the image `src` without a full iframe reload.*

## 2. Injected JavaScript Standards

When modifying `src/lib/editorInjection.ts` or any script that is stringified and passed into the iframe:
- **NO TypeScript Syntax:** You must NOT use Type Casting (`as HTMLElement`), Type Annotations (`: string`), or Interface declarations.
- **Why?** These scripts are evaluated as plain JavaScript in the browser. TS syntax will cause a **Syntax Error**, crashing the entire editor and selection system.

## 3. Visual & Aesthetic Standards

Templates must feel "Premium" and "Modern" by default:
- **Typography:** Use Google Fonts (Inter, Outfit, Playfair Display) via `<link>` tag. No browser defaults.
- **Spacing:** Minimum `80px` vertical padding for every section.
- **Glassmorphism:** Use `backdrop-filter: blur(x)` with semi-transparent backgrounds for cards and nav bars.
- **Color System:** All colors MUST be driven by CSS Variables (`:root { --accent: #... }`). Never hardcode colors in `style="..."`.
- **Button Micro-interactions:** Every button and link must have a `hover` state with a `transition: all .2s`.

## 4. Mobile Responsiveness (375px Check)

Every template must be usable on an iPhone SE (375px width):
- **Stacking:** Grid columns MUST stack to `1fr` at `@media (max-width: 768px)`.
- **Overflow:** `body { overflow-x: hidden }` is mandatory to prevent horizontal scrolling.
- **Finger-Friendly:** CTA buttons must be at least `44px` tall.

## 5. Mandatory Features

- **WhatsApp FAB:** Every template must include the Floating Action Button for WhatsApp enquiries.
- **Structured Data:** Use semantic HTML (`<nav>`, `<main>`, `<section>`, `<footer>`).
- **Conditional Rendering:** If a field like `ABOUT_IMAGE` or `PRODUCT_N_IMAGE_URL` is optional, the template must gracefully handle its absence (via placeholders).

## Verification Workflow

Before marking a template as "Complete":
1. [ ] Check for duplicate `data-field` IDs.
2. [ ] Verify product images use the `_URL` suffix.
3. [ ] Test mobile responsiveness at 375px in the editor.
4. [ ] Verify that uploading an image reflects **instantly** without a page refresh.
5. [ ] Ensure no instructional text (e.g., "Upload Here") exists in placeholders—use SVG icons only.
