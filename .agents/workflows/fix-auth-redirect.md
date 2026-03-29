---
description: "Fix Google Login Redirect to Localhost"
---

This workflow helps you fix the issue where Google OAuth redirects back to `localhost:3000` after login on the deployed Cloudflare version.

### 1. Update Supabase Dashboard (Mandatory)
The most critical step is updating your Supabase Project settings. Supabase will not redirect to any URL that is not in its "Allow list".

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard).
2. Select your project: `rsabhjpgdfzbbjvkncrm`.
3. Go to **Authentication** > **URL Configuration**.
4. Update **Site URL**:
   - From: `http://localhost:3000`
   - To: `https://buildersaas.acerdesktop53.workers.dev`
5. Add to **Redirect URLs (Allow list)**:
   - `http://localhost:3000/*` (So local development still works).
   - `https://buildersaas.acerdesktop53.workers.dev/*`

### 2. Update Google Cloud Console
Your Google OAuth client needs to know about your production domain to authorize the request origin.

1. Go to [Google Cloud Console](https://console.cloud.google.com/).
2. Select your project and go to **APIs & Services** > **Credentials**.
3. Edit your OAuth 2.0 Client ID (named `AI Builder` according to your message).
4. In **Authorized JavaScript origins**, add:
   - `https://buildersaas.acerdesktop53.workers.dev`
5. Ensure **Authorized redirect URIs** still contains:
   - `https://rsabhjpgdfzbbjvkncrm.supabase.co/auth/v1/callback`

### 3. Update Code and Environment Variables
We will update the application to use a dynamic redirect URL helper.

// turbo
1. Add `NEXT_PUBLIC_SITE_URL` to your `.env.local` (for local dev):
   ```
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

2. Add `NEXT_PUBLIC_SITE_URL` to your `wrangler.jsonc` (for production):
   ```json
   "vars": {
     "NEXT_PUBLIC_SITE_URL": "https://buildersaas.acerdesktop53.workers.dev",
     ...
   }
   ```
