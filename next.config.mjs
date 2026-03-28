/** @type {import('next').NextConfig} */
const nextConfig = {
  // Since we use Supabase (external) and not Cloudflare D1/KV bindings directly,
  // we can safely remove setupDevPlatform to avoid wrangler dependencies locally.
};

export default nextConfig;
