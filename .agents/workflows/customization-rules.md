---
description: Rules and guidelines for template customization and asset management
---

## Objective
To ensure that all templates imported or created for the AI Website Builder SaaS are highly customizable and follow a standardized data structure, enabling users to edit logos, product images, colors, and content.

## Storage Strategy for Custom Assets
- **Allowed Assets**: Only Images (Logos, Product Images, Hero Backgrounds). **NO VIDEOS**.
- **Storage Provider**: **Supabase Storage** (Primary) or **Cloudflare R2** (Alternative). 
  - Since the application relies on Cloudflare Pages and Supabase for the data pipeline, uploaded images will be stored in a dedicated Supabase Storage bucket (e.g., `user-assets`). The public URL of the uploaded image will be saved in the database and passed into the `TemplateData`.

## Mandatory Customization Points
Every new or existing template MUST support at minimum the following customizable variables in its `TemplateData` interface and dynamic HTML rendering:

### 1. Branding & Theming
- `LOGO_URL` (string): Path or absolute URL to the user's uploaded logo. Fallback to a default or text-based brand name (`name`).
- `THEME_COLOR` (string): The primary accent color (e.g., `#10b981`). Maps to CSS variables.
- `name` (string): The business or user name.

### 2. Hero Section
- `HERO_HEADLINE` (string): Main h1 text.
- `SUB_HEADLINE` (string): Secondary text / description.
- `HERO_BG_IMAGE` (string, optional): Background image URL for the hero area.

### 3. Products / Services
- `PRODUCT_LIST` (Array):
  - `name`: Product title
  - `desc`: Short description
  - `price`: Pricing text (e.g., "₹499" or "$20")
  - `image_url`: Public URL from Supabase Storage pointing to the uploaded product image.

### 4. About & Features
- `ABOUT_SECTION` (string): The brand's story or philosophy.
- `WHY_US_FEATURES` (Array of objects, optional): Items detailing reasons to choose the brand (Icon, Title, Description).

### 5. Contact & Socials
- `WHATSAPP_LINK` (string): The exact `wa.me` link with pre-filled message.
- `CONTACT_PHONE` (string, optional): Phone number for `<a href="tel:...">`.
- `INSTAGRAM_LINK` (string, optional): Link to social profile.

## Rule for Creating / Importing Templates
When integrating a new template from `C:\Users\Administrator\WorkPlace\connect` or building a new one from scratch:
1. **Never hardcode user-specific text or images**. Always use the variables listed above.
2. Provide visually stunning, high-quality fallbacks for every variable so the template looks excellent even before the user customizes it.
3. If the HTML source has additional sections (e.g., Marquees, Testimonials), dynamically bind them to `TemplateData` or keep them as structural elements if they represent universal aesthetic features. Do NOT delete source sections.
