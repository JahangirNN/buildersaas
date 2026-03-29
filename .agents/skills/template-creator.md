---
name: Template Creator
description: Standardized skill for creating and importing SaaS-ready templates with universal editability.
---

# Template Creator Skill

This skill ensures every template (theme) imported or created for the Website Builder SaaS is 100% editable without code.

## Core Principle: Self-Documenting HTML

Every template must communicate its editable fields to the SaaS engine via `data-field` attributes. The engine uses these to generate the sidebar UI and sync real-time edits.

## Extraction Rules

### 1. Mandatory Text Tagging
ALL text content must be wrapped in an element with `data-field`.
- **Headlines**: `<h1 data-field="HERO_HEADLINE">${data.HERO_HEADLINE}</h1>`
- **Paragraphs**: `<p data-field="ABOUT_DESC">${data.ABOUT_DESC}</p>`
- **Button Isolation**: ALWAYS wrap button text in `<span data-field="CTA_TEXT">...</span>`. This prevents AI from accidentally overwriting the entire button's HTML structure (SVGs, icons) when it only wants to change text.
- **Product Indexing**: For repeating items (Products, Testimonials), use the format `PRODUCT_{i}_NAME`. This allows the editor to group them in the sidebar.
- **Image Self-Documentation**: Tag all images with `data-field="IMAGE_NAME"`. The editor uses this to auto-generate drag-and-drop upload slots.

## Sidebar UX Best Practices
- **Scroll Margin**: When implementing templates, be aware that the sidebar uses `scroll-mt-20` on custom sections. Ensure your `discoveredFields` logic (if you add new types) respects this spacing.
- **Glow/Highlight**: The editor adds a temporary focus ring and glow to the sidebar card when its corresponding element is clicked in the iframe. No additional template code is needed for this.

### 2. Universal Image Tagging
EVERY image in the template must be replaceable.
- **Image Tags**: `<img src="${data.HERO_IMAGE}" data-field="HERO_IMAGE" />`
- **Background Images**: Apply `data-field` to the container. The editor will detect this and allow replacement.
- **Convention**: Use descriptive keys like `IMAGE_GALLERY_1`, `FEATURE_ICON_3`.

### 3. Dynamic Lists (Products/Services)
For repeating sections, use indexed `data-field` names within the loop:
- `data-field="PRODUCT_${i}_NAME"`
- `data-field="PRODUCT_${i}_IMAGE"`
- `data-field="PRODUCT_${i}_PRICE"`

## TemplateData Interface Standard

Always extend the `TemplateData` interface to include key-value pairs for every `data-field` you add.

```typescript
export interface TemplateData {
  // Common Fields
  name: string;
  whatsapp_number: string;
  THEME_COLOR: string;
  
  // Custom Template Fields
  [key: string]: any; 
}
```

## AI Generation Rules
When generating content for these templates:
1. Ensure `PRODUCT_LIST` contains at least 3 items with varied, premium descriptions.
2. Use `https://picsum.photos/seed/[word]/600/600` for all images to ensure they load reliably.
3. Keep headlines punchy (under 10 words) and subheadlines descriptive.
