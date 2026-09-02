import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

// Read the env var here, in Node, rather than through src/site.ts: Vite's
// import.meta.env is not populated when this file is evaluated, which is why
// the sitemap never emitted before.
const siteUrl = process.env.PUBLIC_SITE_URL;

export default defineConfig({
  site: siteUrl,
  integrations: siteUrl ? [mdx(), sitemap()] : [mdx()],
  vite: {
    css: { modules: { localsConvention: 'camelCaseOnly' } },
  },
});
