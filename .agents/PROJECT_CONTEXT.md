# Project Context — AI Website Builder SaaS

## What This Project Is
An AI-powered Website Builder SaaS built with Next.js 15, deployed on Cloudflare Pages. Users select a pre-built template, enter their brand details, and an AI (Google Gemini) generates the content. The site is instantly deployed on the Edge. Users can then edit it via a live visual editor.

---

## Directory Structure
| Path | Purpose |
| :--- | :--- |
| `C:\Users\Administrator\WorkPlace\connect` | Source HTML templates (raw, unconverted) |
| `buildersaas/src/templates/[id]/template.ts` | Converted template logic (TS string renderer) |
| `buildersaas/src/templates/[id]/schema.ts` | Zod schema for template validation & defaults |
| `buildersaas/src/templates/registry.ts` | Central Template Registry (Factory Pattern) |
| `buildersaas/public/templates/[id]` | Static assets (CSS, JS, images) for each template |
| `buildersaas/src/app/editor/EditorContent.tsx` | Dynamic visual editor (unified state + field discovery) |
| `buildersaas/src/lib/editorInjection.ts` | Iframe script for [data-field] discovery & event sync |
| `buildersaas/src/components/Navbar.tsx` | Sticky header with Google OAuth login |
| `buildersaas/src/components/AssetUploader.tsx` | Image uploader integrated with dynamic content state |

---

## Template Naming Convention (STRICT)
All templates must use the format: `[category]-v[version]`

| Template ID | Description |
| :--- | :--- |
| `portfolio-v1` | Portfolio Noir — dark, cinematic (nithin_raphy source) |
| `ecommerce-v1` | Natural Botanics — nature-inspired e-commerce (abrra source) |

> **Future templates** must follow the same pattern: e.g. `restaurant-v1`, `realestate-v1`.
> The `type` column in the `websites` DB table stores the exact template ID (e.g. `ecommerce-v1`).

---

## Database — `websites` Table
| Column | Type | Notes |
| :--- | :--- | :--- |
| `slug` | text (PK) | URL-safe business name |
| `type` | text | Exact template ID (e.g. `ecommerce-v1`) |
| `whatsapp_number` | text | User's WhatsApp |
| `content` | jsonb | AI-generated and user-edited content fields |
| `is_paid` | boolean | Gates public display |
| `user_id` | uuid | Links to `auth.users.id` (add via SQL if missing) |

> **Required SQL** (run once in Supabase if not done):
> ```sql
> ALTER TABLE websites ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
> ```

---

```json
{
  "HERO_HEADLINE": "...",
  "SUB_HEADLINE": "...",
  "LOGO_TEXT": "...",
  "ANY_CUSTOM_FIELD": "...",
  "PRODUCT_LIST": [
    { "name": "...", "desc": "...", "price": "...", "image_url": "..." }
  ]
}
```
> **Self-Documenting Standard**: Templates must use `data-field="KEY"` on elements. The editor dynamically discovers these keys and renders sidebar controls automatically.
> **Validation Standard**: Every template must have a corresponding Zod `schema.ts`. The `renderTemplate` function automatically validates data and applies defaults before rendering.

---

## Key Implemented Features
- **Landing Page** — Premium glassmorphic design (`/`)
- **Template Gallery** — (`/templates`) shows live iframe previews of each template
- **AI Builder** — (`/editor?template=ecommerce-v1`) generates content with Gemini and saves to DB
- **Dynamic Visual Editor** — Auto-discovers template fields; unified state sync; real-time preview.
- **Auto-Scroll UX** — Clicking iframe elements scrolls the corresponding sidebar field into view.
- **Asset-to-DB Sync** — Uploaded images now correctly update the `content` JSON and persist to Supabase.
- **Universal Templates** — `portfolio-v1` and `ecommerce-v1` updated to 100% editability standard.
- **Zod-Powered Registry** — All templates are validated at runtime; automatic defaults and strict type safety ensure a 100% green build.

---

## Supabase Setup
- **Project URL**: `https://rsabhjpgdfzbbjvkncrm.supabase.co`
- **Auth Provider**: Google OAuth (must be enabled in Supabase Dashboard → Auth → Providers)
- **Storage Bucket**: `user-assets` (must be public)

---

## Roadmap / Next Steps
1. **Phase 4**: Import Roameo (`city-v1`) as a gold-standard reference for the new workflow.
2. **Phase 5**: Advanced Layout controls (ordering sections, adding/removing products).
3. **Phase 6**: Stripe Payment gating & Live "Publish" flow.

---

## CRITICAL RULE
After **every chat or major task**, update this file so future AI sessions immediately understand the current state without reading previous conversations.
