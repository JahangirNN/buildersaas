---
description: How to import or create a new template for the AI Website Builder SaaS
---

# Template Import / Creation Workflow

Every template in the builder must conform to this exact standard. Follow these steps precisely when importing a raw HTML site from `C:\Users\Administrator\WorkPlace\connect` or creating one from scratch.

---

## Step 1: Naming Convention

Template IDs must follow `[category]-v[version]` format:
- `portfolio-v1`, `restaurant-v1`, `realestate-v1`, `salon-v1`
- Increment version when creating a variant: `ecommerce-v2`

Create the folder: `buildersaas/src/templates/[template-id]/`

---

## Step 2: Create `template.ts`

The file must export a single function that returns an HTML string.

### Required Interface

export interface TemplateData {
  // Core Identity (Reserved)
  name: string
  whatsapp_number: string
  
  // Styling (Reserved)
  THEME_COLOR: string
  LOGO_URL?: string

  // Dynamic Content (Must match data-field attributes in HTML)
  // [key: string]: string | Array<any> | undefined;
  
  HERO_HEADLINE: string
  SUB_HEADLINE: string
  ABOUT_SECTION: string
  HERO_BG_IMAGE?: string
  
  // ... any other fields prefixed with the template's needs
}
```

### [CRITICAL] Inline Editing Standards

To support the visual editor, your template MUST be "Self-Documenting" using `data-field` attributes:

1. **Text Nodes**: Wrap editable text in tags with `data-field`.
   - `CORRECT`: `<h1 data-field="HERO_HEADLINE">${data.HERO_HEADLINE}</h1>`
   - `INCORRECT`: `<h1>${data.HERO_HEADLINE}</h1>` (Editor won't know where to focus)
2. **Images**: Add `data-field` to `<img>` tags.
   - `CORRECT`: `<img src="${data.HERO_IMAGE}" data-field="HERO_IMAGE" />`
3. **Buttons**: Wrap only the text in `data-field` to protect icons/styles.
   - `CORRECT`: `<button>... <span data-field="CTA_TEXT">${data.CTA_TEXT}</span></button>`
4. **Naming Convention**: 
   - Use `UPPER_SNAKE_CASE` for field IDs.
   - Prefix array items with index: `PRODUCT_0_NAME`, `PRODUCT_0_DESC`.

### Rules for the template function

1. **Mirror the original HTML exactly** — Do not simplify or remove sections from the source. Every section (hero, about, products, contact, footer, marquee, etc.) must be present.
2. **Use template literals** — All dynamic values must use `${data.FIELD_NAME}` interpolation.
3. **Default values** — Every optional field must have a fallback: `${data.CTA_PRIMARY_TEXT || 'Shop Now'}`
4. **Products must loop** — Use `.map()` to render `PRODUCT_LIST` dynamically.
5. **Images must use `picsum.photos`** — Never hardcode Unsplash URLs. Use format: `https://picsum.photos/seed/[WORD]/600/600`
6. **WhatsApp links** — Use `${data.WHATSAPP_LINK}` for all contact buttons.
7. **Button text** — Every button/CTA in the template must use a customizable variable, not hardcoded text.
8. **Include Tailwind CDN** — Add `<script src="https://cdn.tailwindcss.com"></script>` in `<head>`.

---

## Step 3: Copy Static Assets

If the source template has custom CSS, JS, or image files:

```powershell
# Copy assets to public folder
xcopy /E /I /Y "C:\Users\Administrator\WorkPlace\connect\[source-name]\assets" "buildersaas\public\templates\[template-id]"
```

Reference them in the template as: `/templates/[template-id]/filename.css`

---

## Step 4: Register in Template Engine

Add the import and case to `buildersaas/src/lib/templateEngine.ts`:

```typescript
import { myNewTemplate } from '@/templates/[template-id]/template'

// Inside the switch:
case '[template-id]':
  return myNewTemplate(data)
```

---

## Step 5: Add Demo Data to Preview API

Add a demo data block in `buildersaas/src/app/api/template-preview/route.ts`:

```typescript
'[template-id]': {
  name: 'Demo Business',
  HERO_HEADLINE: '...',
  SUB_HEADLINE: '...',
  ABOUT_SECTION: '...',
  THEME_COLOR: '#hexcode',
  WHATSAPP_LINK: 'https://wa.me/919876543210?text=Hello!',
  PRODUCT_LIST: [
    { name: '...', desc: '...', price: '₹...', image_url: 'https://picsum.photos/seed/demo1/600/600' },
  ]
}
```

---

## Step 6: Add to Template Gallery

Update `buildersaas/src/app/templates/page.tsx` — add an entry to the `templates` array:

```typescript
{
  id: '[template-id]',
  name: 'Human Readable Name',
  category: 'Category',
  description: '...',
  tags: ['Tag1', 'Tag2'],
  color: '#hexcode',
}
```

---

## Step 7: Add to Editor Dropdown

Update `buildersaas/src/app/BuilderForm.tsx` — add an `<option>` inside the type `<select>`:

```tsx
<option value="[template-id]">Human Readable Name</option>
```

---

## Step 8: Verify

1. Visit `/templates` — confirm the new template card renders with a live iframe preview
2. Click "Build With AI" — confirm the editor defaults to the correct template
3. Generate a site — confirm the live URL renders the correct template with AI content
4. Edit from dashboard — confirm settings load the right template and all fields

---

## Checklist Summary

- [ ] Folder created at `src/templates/[template-id]/`
- [ ] `template.ts` exports function matching the `TemplateData` interface
- [ ] EVERY editable text node has a `data-field` attribute
- [ ] EVERY replaceable image (`<img>`) has a `data-field` attribute
- [ ] Button text is isolated in `<span>` tags with `data-field` to protect SVGs/styles
- [ ] Registered in `templateEngine.ts` switch
- [ ] Verification: All elements highlighted when clicked in Editor
