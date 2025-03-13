/// <reference types="astro/client-image" />

interface ImportMetaEnv {
  readonly PUBLIC_VERCEL_ANALYTICS_ID: string;
  readonly RESEND_API_KEY: string; // Add this line
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
